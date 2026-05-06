import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import members from "../../src/data/members.json" with { type: "json" };
import { listDossiers } from "../../src/dataAccess/dossiers.js";
import { listImportedDossiers } from "../../src/dataAccess/kamerVotes.js";
import { listApprovedPositions } from "../../src/dataAccess/positions.js";
import { CANDIDATE_POSITIONS } from "../../src/data/candidatePositions.js";
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
const issues = buildIssues();

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

const sourceDocumentsByKey = new Map();
const extractedPassages = [];

const candidatePositions = CANDIDATE_POSITIONS.map((candidate) => {
    const sourceDocument = getOrCreateSourceDocument(candidate.source, candidate.party);
    const extractedPassage = buildExtractedPassage(candidate, sourceDocument);

    if (extractedPassage) {
        extractedPassages.push(extractedPassage);
    }

    return {
        id: candidate.id,
        dossier_id: candidate.dossierId,
        issue_id: candidate.issueId ?? null,
        party_id: slugParty(candidate.party),
        politician_id: candidate.politicianId ?? null,
        position: normalizePosition(candidate.position),
        statement: candidate.statement,
        explanation: candidate.explanation ?? null,
        how: candidate.how ?? null,
        pros: candidate.pros ?? [],
        cons: candidate.cons ?? [],
        source_document_id: sourceDocument?.id ?? null,
        source_passage_id: extractedPassage?.id ?? null,
        source_quote: candidate.source?.quote ?? null,
        confidence: candidate.extraction?.confidence ?? "medium",
        review_status: normalizeReviewStatus(candidate.status),
        extraction_method: candidate.extraction?.method ?? "manual",
        created_by: candidate.extraction?.method ?? "local-seed",
        created_at: candidate.receivedForReviewAt ?? candidate.extraction?.extractedAt ?? null
    };
});

const approvedPositions = listApprovedPositions().map((position) => {
    const sourceDocument = getOrCreateSourceDocument(position.source, position.party);
    const extractedPassage = buildExtractedPassage(position, sourceDocument);

    if (extractedPassage) {
        extractedPassages.push(extractedPassage);
    }

    return {
        id: position.id,
        candidate_position_id: position.candidatePositionId ?? null,
        dossier_id: position.dossierId,
        issue_id: position.issueId ?? null,
        party_id: slugParty(position.party),
        politician_id: position.politicianId ?? null,
        position: normalizePosition(position.position),
        statement: position.statement,
        explanation: position.explanation,
        how: position.how,
        pros: position.pros ?? [],
        cons: position.cons ?? [],
        source_document_id: sourceDocument?.id ?? null,
        source_passage_id: extractedPassage?.id ?? null,
        source_quote: position.source?.quote ?? null,
        approved_by: position.approvedBy ?? null,
        approved_at: position.approvedAt ?? null,
        version: 1,
        is_current: true
    };
});

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
    politician_id: check.politicianId ?? null,
    promise: check.promise,
    vote_title: check.vote?.title,
    verdict: check.verdict,
    severity: promiseSeverity(check),
    explanation: check.explanation,
    raw_check: {
        promiseOwnerType: check.promiseOwnerType ?? check.type ?? "party",
        promiseOwnerId: check.promiseOwnerId ?? slugParty(check.party),
        voteLevel: check.vote?.level ?? "party",
        voteActorId: check.vote?.actorId ?? slugParty(check.party),
        evidenceLevel: check.evidenceLevel ?? "needsReview",
        promiseSource: check.promiseSource ?? null,
        vote: check.vote ?? null
    },
    review_status: "approved"
}));

await mkdir(outputDir, { recursive: true });
await writeJson("parties.json", parties);
await writeJson("dossiers.json", dossiers);
await writeJson("issues.json", issues);
await writeJson("politicians.json", politicians);
await writeJson("source_documents.json", [...sourceDocumentsByKey.values()]);
await writeJson("extracted_passages.json", extractedPassages);
await writeJson("candidate_positions.json", candidatePositions);
await writeJson("approved_positions.json", approvedPositions);
await writeJson("kamer_votes.json", kamerVotes);
await writeJson("promise_checks.json", promiseChecks);

console.log(`Exported local seed snapshots to ${outputDir}`);
console.log(`- parties: ${parties.length}`);
console.log(`- dossiers: ${dossiers.length}`);
console.log(`- issues: ${issues.length}`);
console.log(`- politicians: ${politicians.length}`);
console.log(`- source_documents: ${sourceDocumentsByKey.size}`);
console.log(`- extracted_passages: ${extractedPassages.length}`);
console.log(`- candidate_positions: ${candidatePositions.length}`);
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

function buildIssues() {
    const dossierIds = new Set(listDossiers().map((dossier) => dossier.id));
    const issuesById = new Map();

    CANDIDATE_POSITIONS.forEach((candidate) => {
        if (!candidate.issueId || !dossierIds.has(candidate.dossierId)) return;

        issuesById.set(candidate.issueId, {
            id: candidate.issueId,
            dossier_id: candidate.dossierId,
            title: titleFromSlug(candidate.issueId),
            description: `Werkissue voor ${candidate.party}: ${candidate.statement}`
        });
    });

    return [...issuesById.values()].sort((a, b) =>
        a.dossier_id.localeCompare(b.dossier_id, "nl") || a.id.localeCompare(b.id, "nl")
    );
}

function titleFromSlug(slug) {
    return String(slug)
        .split("-")
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ");
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

function promiseSeverity(check) {
    if (check.verdict === "broken") return 3;
    if (check.verdict === "mixed") return 2;
    if (check.verdict === "unclear") return 1;
    return 0;
}

function getOrCreateSourceDocument(source, party) {
    if (!source?.title && !source?.url) return null;

    const sourceKey = `${slugParty(party)}:${source.type ?? "other"}:${source.title ?? ""}:${source.url ?? ""}:${source.politicianId ?? ""}`;

    if (!sourceDocumentsByKey.has(sourceKey)) {
        sourceDocumentsByKey.set(sourceKey, {
            id: `source-${slugParty(party)}-${slugText(source.title ?? source.url ?? "document")}`,
            kind: normalizeSourceKind(source.type),
            title: source.title ?? "Bron zonder titel",
            url: source.url ?? null,
            party_id: slugParty(party),
            politician_id: source.politicianId ?? null,
            published_at: source.publishedAt ?? null,
            raw_storage_path: null,
            raw_text: null,
            checksum: null,
            metadata: {
                originalType: source.type ?? null,
                page: source.page ?? null,
                importMode: "local-seed"
            }
        });
    }

    return sourceDocumentsByKey.get(sourceKey);
}

function buildExtractedPassage(candidate, sourceDocument) {
    if (!sourceDocument || !candidate.source?.quote) return null;

    return {
        id: `passage-${candidate.id}`,
        source_document_id: sourceDocument.id,
        dossier_id: candidate.dossierId,
        issue_id: candidate.issueId ?? null,
        quote: candidate.source.quote,
        page_number: normalizePage(candidate.source.page),
        start_offset: null,
        end_offset: null,
        extraction_method: candidate.extraction?.method ?? "manual",
        confidence: confidenceNumber(candidate.extraction?.confidence)
    };
}

function normalizeSourceKind(type) {
    if (type === "verkiezingsprogramma" || type === "partijprogramma" || type === "party_program") return "party_program";
    if (type === "kamerstuk") return "kamerstuk";
    if (type === "kamer_vote") return "kamer_vote";
    if (type === "public_claim") return "public_claim";
    if (type === "factcheck") return "factcheck";
    if (type === "research") return "research";
    if (type === "official_data") return "official_data";
    return "other";
}

function normalizeReviewStatus(status) {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    if (status === "needsSource") return "needs_more_source";
    if (status === "superseded") return "superseded";
    return "needs_human_review";
}

function normalizePosition(position) {
    if (["for", "against", "neutral", "mixed", "unknown"].includes(position)) return position;
    return "unknown";
}

function normalizePage(page) {
    const parsed = Number.parseInt(page, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function confidenceNumber(confidence) {
    if (typeof confidence === "number") return confidence;
    if (confidence === "high") return 0.85;
    if (confidence === "medium") return 0.6;
    if (confidence === "low" || confidence === "weak") return 0.35;
    return null;
}

function slugParty(party) {
    return String(party)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function slugText(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 72);
}

async function writeJson(filename, data) {
    await writeFile(resolve(outputDir, filename), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
