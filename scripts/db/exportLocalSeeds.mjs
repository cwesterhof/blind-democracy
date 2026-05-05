import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import members from "../../src/data/members.json" with { type: "json" };
import { listDossiers } from "../../src/dataAccess/dossiers.js";
import { listImportedDossiers } from "../../src/dataAccess/kamerVotes.js";
import { listApprovedPositions } from "../../src/dataAccess/positions.js";
import { PROMISE_CHECKS } from "../../src/data/promiseChecks.js";

const outputDir = resolve("supabase/seed");

const parties = buildParties();
const dossiers = listDossiers().map((dossier) => ({
    id: dossier.id,
    title: dossier.title,
    summary: dossier.summary,
    context: dossier.context,
    status: dossier.status ?? "sourceMapped"
}));

const politicians = members.map((member) => ({
    id: member.id,
    party_id: slugParty(member.party),
    external_id: member.apiId,
    name: member.name,
    role: member.role,
    photo_url: member.photoUrl,
    source_url: member.sourceUrl,
    seat_since: member.seatSince?.slice(0, 10) ?? null
}));

const approvedPositions = listApprovedPositions().map((position) => ({
    id: position.id,
    dossier_id: position.dossierId,
    party_id: slugParty(position.party),
    politician_id: null,
    position: "unknown",
    statement: position.statement,
    explanation: position.explanation,
    how: position.how,
    pros: position.pros ?? [],
    cons: position.cons ?? [],
    source_quote: position.source?.quote ?? null,
    confidence: position.confidence ?? "medium",
    reviewed_by: position.approvedBy,
    reviewed_at: position.approvedAt,
    version: 1,
    is_current: true
}));

const kamerVotes = listImportedDossiers().flatMap((dossier) =>
    dossier.zaken.flatMap((zaak) => {
        const voteSummary = getDisplayVoteSummary(zaak);
        if (!voteSummary?.parties?.length) return [];

        return voteSummary.parties.map((partyVote) => ({
            external_zaak_id: zaak.id,
            external_besluit_id: getDisplayBesluitId(zaak),
            dossier_id: dossier.dossierId,
            zaak_number: zaak.number,
            parliamentary_year: zaak.parliamentaryYear,
            zaak_type: zaak.type,
            title: zaak.title,
            source_url: zaak.sourceUrl,
            party_id: slugParty(partyVote.party),
            vote: normalizeVote(partyVote.vote),
            seats: partyVote.seats ?? null,
            raw_vote: partyVote
        }));
    })
);

const promiseChecks = PROMISE_CHECKS.map((check) => ({
    id: check.id,
    dossier_id: check.dossierId,
    party_id: slugParty(check.party),
    politician_id: null,
    promise: check.promise,
    vote_title: check.vote?.title,
    verdict: check.verdict,
    severity: 1,
    explanation: check.explanation,
    review_status: "approved"
}));

await mkdir(outputDir, { recursive: true });
await writeJson("parties.json", parties);
await writeJson("dossiers.json", dossiers);
await writeJson("politicians.json", politicians);
await writeJson("approved_positions.json", approvedPositions);
await writeJson("kamer_votes.json", kamerVotes);
await writeJson("promise_checks.json", promiseChecks);

console.log(`Exported local seed snapshots to ${outputDir}`);
console.log(`- parties: ${parties.length}`);
console.log(`- dossiers: ${dossiers.length}`);
console.log(`- politicians: ${politicians.length}`);
console.log(`- approved_positions: ${approvedPositions.length}`);
console.log(`- kamer_votes: ${kamerVotes.length}`);
console.log(`- promise_checks: ${promiseChecks.length}`);

function buildParties() {
    const partyMap = new Map();

    members.forEach((member) => {
        const id = slugParty(member.party);
        if (!partyMap.has(id)) {
            partyMap.set(id, {
                id,
                name: member.partyName || member.party,
                short_name: member.party,
                logo_url: member.partyLogoUrl ?? null,
                color: null
            });
        }
    });

    listApprovedPositions().forEach((position) => {
        const id = slugParty(position.party);
        if (!partyMap.has(id)) {
            partyMap.set(id, {
                id,
                name: position.party,
                short_name: position.party,
                logo_url: null,
                color: null
            });
        }
    });

    return [...partyMap.values()].sort((a, b) => a.short_name.localeCompare(b.short_name, "nl"));
}

function getDisplayVoteSummary(zaak) {
    const besluitSummary = (zaak.besluiten ?? []).find((besluit) => besluit.voteSummary?.totalVotes > 0)?.voteSummary;
    return dedupeVoteSummary(besluitSummary ?? zaak.voteSummary);
}

function getDisplayBesluitId(zaak) {
    return (zaak.besluiten ?? []).find((besluit) => besluit.voteSummary?.totalVotes > 0)?.id ?? null;
}

function dedupeVoteSummary(voteSummary) {
    if (!voteSummary?.parties?.length) return voteSummary;

    const partiesByName = new Map();

    voteSummary.parties.forEach((item) => {
        if (!item.party || partiesByName.has(item.party)) return;
        partiesByName.set(item.party, item);
    });

    return {
        ...voteSummary,
        parties: [...partiesByName.values()]
    };
}

function normalizeVote(vote) {
    if (vote === "Voor") return "for";
    if (vote === "Tegen") return "against";
    if (vote === "Niet deelgenomen") return "absent";
    return "unknown";
}

function slugParty(party) {
    return String(party)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

async function writeJson(filename, data) {
    await writeFile(resolve(outputDir, filename), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
