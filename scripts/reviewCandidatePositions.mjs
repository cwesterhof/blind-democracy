import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CANDIDATE_POSITIONS } from "../src/data/candidatePositions.js";
import { PARTY_POSITIONS } from "../src/data/partyPositions.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "src/data/reviewedPositionImports.json");

const existingIds = new Set(PARTY_POSITIONS.map((position) => position.id));
const approved = CANDIDATE_POSITIONS.filter((candidate) => candidate.status === "approved");
const rejected = CANDIDATE_POSITIONS.filter((candidate) => candidate.status === "rejected");
const pending = CANDIDATE_POSITIONS.filter((candidate) => !["approved", "rejected"].includes(candidate.status));

const promotable = approved.filter((candidate) => !existingIds.has(candidate.id));
const duplicates = approved.filter((candidate) => existingIds.has(candidate.id));

const promotedPositions = promotable.map((candidate) => ({
    id: candidate.id,
    dossierId: candidate.dossierId,
    party: candidate.party,
    statement: candidate.statement,
    explanation: candidate.explanation,
    source: candidate.source,
    confidence: candidate.source.quote && candidate.source.page ? "sourceQuoted" : "sourceMapped",
    reviewStatus: "Goedgekeurd voor live gebruik; controleer periodiek bij programma-updates",
    reviewedByHuman: true
}));

const report = {
    generatedAt: new Date().toISOString(),
    summary: {
        candidates: CANDIDATE_POSITIONS.length,
        approved: approved.length,
        promoted: promotedPositions.length,
        duplicates: duplicates.length,
        pending: pending.length,
        rejected: rejected.length
    },
    promotedPositions,
    pending: pending.map(toSummary),
    rejected: rejected.map(toSummary),
    duplicates: duplicates.map(toSummary)
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log("Position review report generated.");
console.log(`- candidates: ${report.summary.candidates}`);
console.log(`- promoted: ${report.summary.promoted}`);
console.log(`- pending: ${report.summary.pending}`);
console.log(`Saved: ${outputPath}`);

function toSummary(candidate) {
    return {
        id: candidate.id,
        dossierId: candidate.dossierId,
        party: candidate.party,
        status: candidate.status,
        reviewerNotes: candidate.reviewerNotes
    };
}
