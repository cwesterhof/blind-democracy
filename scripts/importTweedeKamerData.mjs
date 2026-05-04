import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DOSSIERS } from "../src/data/dossiers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "src/data/importedTweedeKamer.json");
const baseUrl = "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0";
const maxZakenPerDossier = 12;

const dossierSearchTerms = {
    wonen: ["wonen", "woning", "huur", "woningbouw", "huurcommissie", "volkshuisvesting", "betaalbare huur"],
    immigratie: ["spreidingswet", "statushouders", "nareis", "migratie", "vreemdelingen", "asiel", "opvang"],
    klimaat: ["fossiele", "klimaatfonds", "CO2", "duurzaam", "klimaat", "energie", "emissie"],
    zorg: ["zorg", "eigen risico", "personeelstekort", "ziekenhuis", "huisarts", "ggz", "zorgverzekering"],
    onderwijs: ["onderwijs", "lerarentekort", "basisvaardigheden", "kansengelijkheid", "school", "mbo", "hoger onderwijs"],
    economie: ["koopkracht", "inflatie", "belasting", "economie", "begroting", "middeninkomens", "ondernemers"],
    arbeid: ["arbeidsmarkt", "minimumloon", "flexwerk", "uitkering", "sociale zekerheid", "arbeidsmigratie", "bestaanszekerheid"],
    veiligheid: ["veiligheid", "politie", "justitie", "ondermijning", "criminaliteit", "rechtsstaat", "strafrecht"],
    landbouw: ["landbouw", "stikstof", "natuur", "boeren", "waterkwaliteit", "mest", "platteland"],
    energie: ["energie", "kernenergie", "netcongestie", "elektriciteit", "gas", "isolatie", "energieprijzen"],
    defensie: ["defensie", "NAVO", "Oekraïne", "krijgsmacht", "militaire", "veiligheid", "munitie"],
    mobiliteit: ["mobiliteit", "openbaar vervoer", "spoor", "wegen", "luchtvaart", "bereikbaarheid", "files"],
    digitalisering: ["digitalisering", "privacy", "AI", "algoritme", "cyberveiligheid", "digitale overheid", "data"],
    bestuur: ["bestuur", "democratie", "rechtsstaat", "transparantie", "toeslagen", "uitvoering", "grondrechten"],
    europa: ["Europa", "Europese Unie", "EU", "soevereiniteit", "Brussel", "interne markt", "Europese samenwerking"]
};

const importedAt = new Date().toISOString();
const dossiers = [];

for (const dossier of DOSSIERS) {
    const terms = dossierSearchTerms[dossier.id] ?? [dossier.title.toLowerCase()];
    const seen = new Map();

    for (const term of terms) {
        const results = await fetchZaken(term);

        for (const item of results) {
            const normalized = normalizeZaak(item, term);
            const existing = seen.get(normalized.id);

            if (existing) {
                existing.matchedTerms = [...new Set([...existing.matchedTerms, term])];
                existing.relevanceScore += scoreTermMatch(normalized, term);
            } else {
                seen.set(normalized.id, {
                    ...normalized,
                    matchedTerms: [term],
                    relevanceScore: scoreTermMatch(normalized, term)
                });
            }
        }
    }

    const enrichedZaken = [];

    for (const zaak of [...seen.values()]) {
        enrichedZaken.push(await enrichZaakWithVotes(zaak));
    }

    const rankedZaken = enrichedZaken
        .map((zaak) => ({
            ...zaak,
            relevanceScore: zaak.relevanceScore + (zaak.voteSummary.totalVotes > 0 ? 500 : 0)
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.changedAt ?? b.startedAt) - new Date(a.changedAt ?? a.startedAt))
        .slice(0, maxZakenPerDossier);

    dossiers.push({
        dossierId: dossier.id,
        title: dossier.title,
        importedAt,
        searchTerms: terms,
        source: {
            name: "Tweede Kamer Open Data OData API",
            url: `${baseUrl}/Zaak`
        },
        zaken: rankedZaken
    });
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ importedAt, dossiers }, null, 2)}\n`, "utf8");

console.log(`Imported Tweede Kamer data for ${dossiers.length} dossiers.`);
for (const dossier of dossiers) {
    const voteable = dossier.zaken.filter((zaak) => zaak.voteSummary.totalVotes > 0).length;
    console.log(`- ${dossier.title}: ${dossier.zaken.length} zaken, ${voteable} met stemmingen`);
}
console.log(`Saved: ${outputPath}`);

async function fetchZaken(term) {
    const url = new URL(`${baseUrl}/Zaak`);
    const escapedTerm = escapeODataString(term);
    url.searchParams.set(
        "$filter",
        `Verwijderd eq false and (contains(Titel, '${escapedTerm}') or contains(Onderwerp, '${escapedTerm}') or contains(Nummer, '${escapedTerm}'))`
    );
    url.searchParams.set("$orderby", "GewijzigdOp desc");
    url.searchParams.set("$top", "18");
    url.searchParams.set("$select", "Id,Nummer,Soort,Titel,Onderwerp,GestartOp,GewijzigdOp,Vergaderjaar,Status");

    const response = await fetch(url);

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Tweede Kamer API failed for "${term}": ${response.status} ${response.statusText}\n${body}`);
    }

    const data = await response.json();
    return data.value ?? [];
}

async function enrichZaakWithVotes(zaak) {
    const url = new URL(`${baseUrl}/Zaak(${zaak.id})`);
    url.searchParams.set(
        "$expand",
        "Besluit($filter=Verwijderd eq false;$select=Id,BesluitSoort,BesluitTekst,Status,StemmingsSoort,GewijzigdOp;$expand=Stemming($filter=Verwijderd eq false;$select=Id,Soort,ActorFractie,ActorNaam,FractieGrootte))"
    );

    const response = await fetch(url);

    if (!response.ok) {
        return {
            ...zaak,
            besluiten: [],
            voteSummary: { totalVotes: 0, totalSeats: 0, byVote: {}, parties: [] },
            enrichmentError: `${response.status} ${response.statusText}`
        };
    }

    const data = await response.json();
    const besluiten = (data.Besluit ?? []).map(normalizeBesluit);

    return {
        ...zaak,
        besluiten,
        voteSummary: summarizeVotes(besluiten)
    };
}

function normalizeZaak(item, matchedTerm) {
    return {
        id: item.Id,
        number: item.Nummer,
        type: item.Soort,
        title: item.Titel?.trim() || item.Onderwerp?.trim() || "Zonder titel",
        subject: item.Onderwerp?.trim() ?? null,
        parliamentaryYear: item.Vergaderjaar,
        status: item.Status,
        startedAt: item.GestartOp,
        changedAt: item.GewijzigdOp,
        matchedTerm,
        sourceUrl: buildSourceUrl(item.Id)
    };
}

function normalizeBesluit(item) {
    const votes = (item.Stemming ?? [])
        .filter((vote) => vote.ActorFractie || vote.ActorNaam)
        .map((vote) => ({
            id: vote.Id,
            party: vote.ActorFractie || vote.ActorNaam,
            vote: vote.Soort,
            seats: vote.FractieGrootte ?? 0
        }))
        .sort((a, b) => a.party.localeCompare(b.party, "nl"));

    return {
        id: item.Id,
        type: item.BesluitSoort,
        text: item.BesluitTekst,
        status: item.Status,
        votingType: item.StemmingsSoort,
        changedAt: item.GewijzigdOp,
        votes,
        voteSummary: summarizeVotes([{ votes }])
    };
}

function summarizeVotes(besluiten) {
    const allVotes = besluiten.flatMap((besluit) => besluit.votes ?? []);
    const byVote = allVotes.reduce((acc, item) => {
        acc[item.vote] = (acc[item.vote] ?? 0) + (item.seats || 1);
        return acc;
    }, {});

    return {
        totalVotes: allVotes.length,
        totalSeats: Object.values(byVote).reduce((sum, seats) => sum + seats, 0),
        byVote,
        parties: allVotes.map((item) => ({
            party: item.party,
            vote: item.vote,
            seats: item.seats
        }))
    };
}

function scoreTermMatch(zaak, term) {
    const normalizedTerm = term.toLowerCase();
    const title = zaak.title.toLowerCase();
    const subject = (zaak.subject ?? "").toLowerCase();
    const typeScore = zaak.type === "Wetgeving" ? 40 : zaak.type === "Motie" ? 25 : 5;
    const titleScore = title.includes(normalizedTerm) ? 40 : 0;
    const subjectScore = subject.includes(normalizedTerm) ? 20 : 0;
    const recencyScore = new Date(zaak.changedAt ?? zaak.startedAt).getFullYear() >= 2024 ? 20 : 0;

    return typeScore + titleScore + subjectScore + recencyScore;
}

function buildSourceUrl(id) {
    return `${baseUrl}/Zaak(${id})`;
}

function escapeODataString(value) {
    return value.replaceAll("'", "''");
}
