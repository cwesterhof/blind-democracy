import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const inputPath = process.argv[2];
const outputPath = resolve("src/data/approvedPositionImports.js");

if (!inputPath) {
    console.log("Usage: npm run positions:promote -- path/to/blind-democracy-approved-positions.json");
    console.log("No file provided; nothing changed.");
    process.exit(0);
}

const promotion = JSON.parse(await readFile(resolve(inputPath), "utf8"));

if (promotion.target !== "approved_positions" || !Array.isArray(promotion.approvedPositions)) {
    throw new Error("Invalid promotion file. Expected target=approved_positions and approvedPositions[].");
}

const positions = promotion.approvedPositions.map(normalizeApprovedPosition);
const report = {
    generatedAt: new Date().toISOString(),
    source: inputPath,
    summary: {
        positions: positions.length
    },
    positions
};

await writeFile(
    outputPath,
    `export const APPROVED_POSITION_IMPORTS = ${JSON.stringify(report, null, 4)};\n`,
    "utf8"
);

console.log(`Promoted ${positions.length} approved positions.`);
console.log(`Saved: ${outputPath}`);

function normalizeApprovedPosition(position) {
    return {
        id: position.id,
        candidatePositionId: position.candidatePositionId ?? null,
        dossierId: position.dossierId,
        issueId: position.issueId ?? null,
        party: position.party,
        politicianId: position.politicianId ?? null,
        position: position.position ?? "unknown",
        statement: position.statement,
        explanation: position.explanation ?? "",
        how: position.how ?? "De precieze uitvoering moet nog redactioneel worden uitgewerkt.",
        pros: position.pros ?? [],
        cons: position.cons ?? [],
        source: {
            type: position.source?.type ?? "review-import",
            title: position.source?.title ?? "Goedgekeurde review-import",
            url: position.source?.url ?? "",
            page: position.source?.page ?? null,
            quote: position.source?.quote ?? null,
            politicianId: position.source?.politicianId ?? position.politicianId ?? null
        },
        confidence: position.confidence ?? "sourceMapped",
        reviewStatus: position.reviewStatus ?? "Goedgekeurd via lokale review-import.",
        reviewedByHuman: true,
        reviewerNotes: position.reviewerNotes ?? "",
        approvedAt: position.approvedAt ?? new Date().toISOString(),
        approvedBy: position.approvedBy ?? "local-reviewer"
    };
}
