/**
 * importPartyPrograms.mjs
 *
 * Downloadt verkiezingsprogramma's als PDF, extraheert per dossier de relevante
 * passages via de Claude API, en schrijft kandidaat-standpunten naar
 * src/data/generatedCandidatePositions.json — klaar voor review in de editorial hub.
 *
 * Gebruik:
 *   node scripts/importPartyPrograms.mjs
 *   node scripts/importPartyPrograms.mjs --dossier wonen
 *   node scripts/importPartyPrograms.mjs --party VVD
 *   node scripts/importPartyPrograms.mjs --dossier wonen --party VVD
 *
 * Vereisten:
 *   npm install pdf-parse
 *   ANTHROPIC_API_KEY in je .env of omgeving
 *
 * Output:
 *   src/data/generatedCandidatePositions.json
 *   Voeg de inhoud handmatig toe aan candidatePositions.js na review.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const cacheDir = resolve(projectRoot, ".party-program-cache");
const outputPath = resolve(projectRoot, "src/data/generatedCandidatePositions.json");

// ─────────────────────────────────────────────
// CLI ARGS
// ─────────────────────────────────────────────

const args = process.argv.slice(2);
const filterDossier = args.includes("--dossier") ? args[args.indexOf("--dossier") + 1] : null;
const filterParty = args.includes("--party") ? args[args.indexOf("--party") + 1] : null;

// ─────────────────────────────────────────────
// PARTY PROGRAM REGISTRY
// Voeg hier nieuwe partijen toe als ze beschikbaar komen.
// ─────────────────────────────────────────────

const PARTY_PROGRAMS = [
    {
        party: "VVD",
        programTitle: "Ruimte geven. Grenzen stellen.",
        publishedAt: "2023-09-23",
        url: "https://www.vvd.nl/wp-content/uploads/2023/10/Verkiezingsprogramma-VVD-2023-2027.pdf"
    },
    {
        party: "D66",
        programTitle: "Nieuwe energie voor Nederland",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87786/7/D66%20Verkiezingsprogramma%202023-2027.pdf"
    },
    {
        party: "CDA",
        programTitle: "Recht doen",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87714/7/CDA%20Verkiezingsprogramma%202023-2027.pdf"
    },
    {
        party: "GroenLinks-PvdA",
        programTitle: "Samen voor een hoopvolle toekomst",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87726/7/GroenLinks-PvdA%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "PVV",
        programTitle: "Verkiezingsprogramma PVV 2023-2027",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87776/7/PVV%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "SP",
        programTitle: "Een beter Nederland voor minder geld",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87750/7/SP%20Verkiezingsprogramma%202023-2027.pdf"
    },
    {
        party: "ChristenUnie",
        programTitle: "Zonder jou klopt de samenleving niet",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87717/7/ChristenUnie%20Verkiezingsprogramma%202023-2027.pdf"
    },
    {
        party: "BBB",
        programTitle: "Uit de klei getrokken",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87710/7/BBB%20Verkiezingsprogramma%202023-2027.pdf"
    },
    {
        party: "Volt",
        programTitle: "Volt Nederland Verkiezingsprogramma 2023",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87719/7/VoltNL%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "DENK",
        programTitle: "DENK Verkiezingsprogramma 2023",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87720/7/DENK%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "PvdD",
        programTitle: "Partij voor de Dieren Verkiezingsprogramma 2023",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87739/7/PvdD%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "SGP",
        programTitle: "Doet wat recht is",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87748/7/SGP%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "FVD",
        programTitle: "FVD Verkiezingsprogramma 2023",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87723/7/FVD%20Verkiezingsprogramma%202023.pdf"
    },
    {
        party: "JA21",
        programTitle: "JA21 Verkiezingsprogramma 2023",
        publishedAt: "2023-09-23",
        url: "https://dnpprepo.ub.rug.nl/87729/7/JA21%20Verkiezingsprogramma%202023.pdf"
    }
];

// ─────────────────────────────────────────────
// DOSSIER DEFINITIES
// Omschrijving en zoektermen per dossier voor de Claude-extractieprompt.
// ─────────────────────────────────────────────

const DOSSIER_CONTEXTS = {
    wonen: {
        title: "Wonen",
        description: "Betaalbare woningen, huurregulering, nieuwbouw, woningcorporaties en de verdeling van schaarse ruimte.",
        keywords: ["wonen", "woningbouw", "huur", "huurgrens", "woningcorporatie", "bouwgrond", "betaalbaar", "koopwoning", "starter"]
    },
    immigratie: {
        title: "Immigratie",
        description: "Asielbeleid, arbeidsmigratie, integratie, opvang en de uitvoerbaarheid van grenzen.",
        keywords: ["asiel", "vluchteling", "migratie", "statushouder", "nareis", "opvang", "integratie", "vreemdelingen", "grens"]
    },
    klimaat: {
        title: "Klimaat",
        description: "CO2-reductie, energietransitie, klimaatfonds, fossiele subsidies en klimaatrechtvaardigheid.",
        keywords: ["klimaat", "CO2", "fossiel", "duurzaam", "energietransitie", "klimaatfonds", "uitstoot", "opwarming"]
    },
    zorg: {
        title: "Zorg",
        description: "Eigen risico, marktwerking, toegankelijkheid, personeelstekort en ggz.",
        keywords: ["zorg", "eigen risico", "zorgverzekering", "huisarts", "ziekenhuis", "ggz", "marktwerking", "wachttijd", "zorgpersoneel"]
    },
    onderwijs: {
        title: "Onderwijs",
        description: "Kwaliteit, lerarentekort, kansengelijkheid, basisvaardigheden en hoger onderwijs.",
        keywords: ["onderwijs", "school", "leraar", "lerarentekort", "kansengelijkheid", "mbo", "universiteit", "basisvaardigheden"]
    },
    economie: {
        title: "Economie & koopkracht",
        description: "Belasting, minimumloon, koopkracht, middeninkomens en vermogensverdeling.",
        keywords: ["koopkracht", "belasting", "minimumloon", "inflatie", "inkomen", "vermogen", "economie", "bestaanszekerheid"]
    },
    arbeid: {
        title: "Werk & sociale zekerheid",
        description: "Arbeidsmarkt, flexwerk, uitkeringen en bestaanszekerheid.",
        keywords: ["arbeidsmarkt", "flexwerk", "zzp", "uitkering", "bijstand", "bestaanszekerheid", "werkgelegenheid", "arbeidsrecht"]
    },
    veiligheid: {
        title: "Veiligheid & justitie",
        description: "Politie, strafrecht, ondermijning, rechtsstaat en criminaliteit.",
        keywords: ["veiligheid", "politie", "justitie", "strafrecht", "criminaliteit", "ondermijning", "rechtsstaat", "gevangenis"]
    },
    landbouw: {
        title: "Landbouw & natuur",
        description: "Stikstof, boeren, natuur, waterkwaliteit en platteland.",
        keywords: ["landbouw", "stikstof", "boer", "natuur", "waterkwaliteit", "mest", "biodiversiteit", "platteland"]
    },
    energie: {
        title: "Energie",
        description: "Kernenergie, netcongestie, energieprijzen, gas en isolatie.",
        keywords: ["energie", "kernenergie", "wind", "zonne-energie", "gas", "netcongestie", "energieprijs", "isolatie"]
    },
    defensie: {
        title: "Defensie",
        description: "NAVO, Oekraïne, krijgsmacht en militaire capaciteit.",
        keywords: ["defensie", "NAVO", "krijgsmacht", "militair", "Oekraïne", "veiligheid", "munitie", "F-35"]
    },
    mobiliteit: {
        title: "Mobiliteit",
        description: "Openbaar vervoer, spoor, snelwegen, luchtvaart en bereikbaarheid.",
        keywords: ["mobiliteit", "openbaar vervoer", "trein", "bus", "snelweg", "luchtvaart", "bereikbaarheid", "files"]
    },
    digitalisering: {
        title: "Digitalisering",
        description: "Privacy, AI, algoritmes, cyberveiligheid en digitale overheid.",
        keywords: ["digitalisering", "AI", "algoritme", "privacy", "data", "cyberveiligheid", "digitale overheid", "technologie"]
    },
    bestuur: {
        title: "Bestuur & democratie",
        description: "Democratie, transparantie, toeslagen, uitvoering en grondrechten.",
        keywords: ["bestuur", "democratie", "transparantie", "grondrechten", "toeslagen", "uitvoering", "rechtsstaat", "referendum"]
    },
    europa: {
        title: "Europa",
        description: "Europese Unie, soevereiniteit, interne markt en Europese samenwerking.",
        keywords: ["Europa", "EU", "Europese Unie", "soevereiniteit", "Brussel", "interne markt", "euro", "Europees"]
    }
};

// ─────────────────────────────────────────────
// HULPFUNCTIES
// ─────────────────────────────────────────────

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cacheKey(url) {
    return createHash("md5").update(url).digest("hex");
}

async function ensureCacheDir() {
    if (!existsSync(cacheDir)) {
        await mkdir(cacheDir, { recursive: true });
    }
}

async function downloadPdf(url) {
    const key = cacheKey(url);
    const cachePath = resolve(cacheDir, `${key}.pdf`);

    if (existsSync(cachePath)) {
        console.log(`  [cache] ${url}`);
        return await readFile(cachePath);
    }

    console.log(`  [download] ${url}`);
    const response = await fetch(url, {
        headers: { "User-Agent": "BlindDemocracy/1.0 (civic-research)" },
        redirect: "follow"
    });

    if (!response.ok) {
        throw new Error(`Download mislukt: ${response.status} voor ${url}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(cachePath, buffer);
    return buffer;
}

async function extractTextFromPdf(pdfBuffer) {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(pdfBuffer);
    return data.text;
}

function cleanPdfText(text) {
    return text
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}

function truncateText(text, maxChars = 80000) {
    if (text.length <= maxChars) return text;
    const half = Math.floor(maxChars / 2);
    return text.slice(0, half) + "\n\n[... tekst ingekort voor verwerking ...]\n\n" + text.slice(-half);
}

async function callClaudeApi(systemPrompt, userPrompt) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY niet gevonden in omgeving.");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 4000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API fout: ${response.status} — ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// ─────────────────────────────────────────────
// EXTRACTIE VIA CLAUDE API
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `Je bent een nauwkeurige politieke data-analist voor het platform Blind Democracy.
Je taak is om uit verkiezingsprogramma's relevante passages te extraheren per beleidsdossier.

Regels:
- Extraheer alleen wat er letterlijk staat — geen interpretaties, geen aanvullingen
- Gebruik altijd een exact citaat uit de tekst als bronquote
- Geef het paginanummer als je het kunt herleiden uit de tekst
- Geef position: "for", "against", of "mixed" ten opzichte van de huidige situatie/beleid
- Als een partij niets relevants zegt over een dossier, retourneer een lege array
- Extraheer maximaal 3 standpunten per dossier per partij — kies de meest specifieke
- Retourneer ALLEEN geldig JSON, geen uitleg, geen markdown, geen backticks`;

async function extractPositionsForDossier(programText, party, programTitle, publishedAt, programUrl, dossier, dossierContext) {
    const userPrompt = `Partij: ${party}
Programma: ${programTitle} (${publishedAt})
Dossier: ${dossierContext.title}
Dossier-omschrijving: ${dossierContext.description}
Zoekwoorden: ${dossierContext.keywords.join(", ")}

Hier is de volledige tekst van het verkiezingsprogramma:
---
${truncateText(cleanPdfText(programText))}
---

Extraheer alle relevante standpunten van ${party} over het dossier "${dossierContext.title}".

Retourneer een JSON-array met dit exacte formaat:
[
  {
    "statement": "Korte, neutrale samenvatting van het standpunt (max 120 tekens)",
    "explanation": "Uitleg van het standpunt in 2-3 zinnen",
    "how": "Hoe wil de partij dit bereiken? (1-2 zinnen)",
    "position": "for" | "against" | "mixed",
    "positionRationale": "Waarom deze richting t.o.v. het huidige beleid?",
    "pros": ["voordeel 1", "voordeel 2"],
    "cons": ["nadeel 1", "nadeel 2"],
    "quote": "Exacte zin(nen) uit het programma die dit standpunt onderbouwen",
    "page": null,
    "confidence": "high" | "medium" | "low",
    "issueTag": "korte tag voor dit specifieke issue (bijv. eigen-risico, woningbouw)"
  }
]

Als er geen relevante passages zijn, retourneer: []`;

    const raw = await callClaudeApi(SYSTEM_PROMPT, userPrompt);

    try {
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((item, index) => ({
            id: `generated-${dossier}-${slugify(party)}-${slugify(item.issueTag ?? String(index))}`,
            issueId: item.issueTag ?? `${dossier}-${index}`,
            dossierId: dossier,
            party,
            position: item.position ?? "mixed",
            statement: item.statement ?? "",
            explanation: item.explanation ?? "",
            how: item.how ?? "",
            pros: item.pros ?? [],
            cons: item.cons ?? [],
            source: {
                type: "verkiezingsprogramma",
                title: programTitle,
                url: programUrl,
                publishedAt,
                page: item.page ?? null,
                quote: item.quote ?? null
            },
            extraction: {
                method: "ai-extract",
                model: "claude-sonnet-4-6",
                extractedAt: new Date().toISOString().slice(0, 10),
                confidence: item.confidence ?? "medium",
                positionRationale: item.positionRationale ?? null
            },
            receivedForReviewAt: new Date().toISOString().slice(0, 10),
            status: "needsReview",
            reviewerNotes: `AI-extractie. Controleer: (1) klopt het citaat letterlijk? (2) klopt de richting 'Voor/Tegen'? (3) paginanummer invullen na controle in PDF.`
        }));
    } catch (err) {
        console.warn(`  [warn] JSON-parse mislukt voor ${party}/${dossier}: ${err.message}`);
        console.warn(`  Raw response: ${raw.slice(0, 200)}`);
        return [];
    }
}

// ─────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
    await ensureCacheDir();

    const parties = filterParty
        ? PARTY_PROGRAMS.filter(p => p.party === filterParty)
        : PARTY_PROGRAMS;

    const dossiers = filterDossier
        ? Object.entries(DOSSIER_CONTEXTS).filter(([id]) => id === filterDossier)
        : Object.entries(DOSSIER_CONTEXTS);

    if (parties.length === 0) {
        console.error(`Partij niet gevonden: ${filterParty}`);
        console.error(`Beschikbaar: ${PARTY_PROGRAMS.map(p => p.party).join(", ")}`);
        process.exit(1);
    }

    if (dossiers.length === 0) {
        console.error(`Dossier niet gevonden: ${filterDossier}`);
        console.error(`Beschikbaar: ${Object.keys(DOSSIER_CONTEXTS).join(", ")}`);
        process.exit(1);
    }

    console.log(`\n🗳  Blind Democracy — Party Program Import`);
    console.log(`   Partijen: ${parties.map(p => p.party).join(", ")}`);
    console.log(`   Dossiers: ${dossiers.map(([id]) => id).join(", ")}`);
    console.log(`   Output:   ${outputPath}\n`);

    const allResults = [];
    const errors = [];

    for (const program of parties) {
        console.log(`\n📄 ${program.party} — ${program.programTitle}`);

        let programText;
        try {
            const pdfBuffer = await downloadPdf(program.url);
            programText = await extractTextFromPdf(pdfBuffer);
            console.log(`  ✓ PDF geladen (${Math.round(programText.length / 1000)}k tekens)`);
        } catch (err) {
            console.error(`  ✗ PDF-fout: ${err.message}`);
            errors.push({ party: program.party, dossier: "all", error: err.message });
            continue;
        }

        for (const [dossierId, dossierContext] of dossiers) {
            console.log(`  → ${dossierContext.title}...`);

            try {
                await sleep(1000); // Rate limiting: 1 sec tussen API-calls

                const positions = await extractPositionsForDossier(
                    programText,
                    program.party,
                    program.programTitle,
                    program.publishedAt,
                    program.url,
                    dossierId,
                    dossierContext
                );

                if (positions.length === 0) {
                    console.log(`     (geen relevante passages gevonden)`);
                } else {
                    console.log(`     ✓ ${positions.length} standpunt(en) geëxtraheerd`);
                    allResults.push(...positions);
                }
            } catch (err) {
                console.error(`     ✗ Extractie mislukt: ${err.message}`);
                errors.push({ party: program.party, dossier: dossierId, error: err.message });
            }
        }
    }

    // ─── Dubbele IDs dedupliceren ───
    const seen = new Set();
    const deduplicated = allResults.filter(item => {
        if (seen.has(item.id)) {
            item.id = `${item.id}-${Math.random().toString(36).slice(2, 6)}`;
        }
        seen.add(item.id);
        return true;
    });

    // ─── Output schrijven ───
    const output = {
        generatedAt: new Date().toISOString(),
        totalPositions: deduplicated.length,
        parties: [...new Set(deduplicated.map(p => p.party))],
        dossiers: [...new Set(deduplicated.map(p => p.dossierId))],
        errors: errors.length > 0 ? errors : undefined,
        positions: deduplicated
    };

    await writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");

    // ─── Samenvatting ───
    console.log(`\n✅ Klaar!`);
    console.log(`   ${deduplicated.length} standpunten geschreven naar ${outputPath}`);

    if (errors.length > 0) {
        console.log(`\n⚠️  ${errors.length} fout(en):`);
        errors.forEach(e => console.log(`   ${e.party}/${e.dossier}: ${e.error}`));
    }

    console.log(`\nVolgende stap:`);
    console.log(`   1. Open ${outputPath} en controleer de extracties`);
    console.log(`   2. Kopieer de gewenste entries naar src/data/candidatePositions.js`);
    console.log(`   3. Review ze via de editorial hub (npm run dev → Redactie)`);
    console.log(`   4. Vul per entry het exacte paginanummer in vanuit de PDF`);
}

main().catch(err => {
    console.error("\n💥 Fatale fout:", err.message);
    process.exit(1);
});
