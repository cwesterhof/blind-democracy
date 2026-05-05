import { PARTY_POSITIONS, POSITION_CONFIDENCE } from "./partyPositions.js";
import { APPROVED_POSITION_IMPORTS } from "./approvedPositionImports.js";

export { POSITION_CONFIDENCE };

const LEGACY_APPROVED_POSITIONS = PARTY_POSITIONS.map((position) => ({
    ...position,
    publicationStatus: "approved_seed",
    approvedAt: null,
    approvedBy: "legacy-local-data",
    approvalNote: "Overgenomen uit de bestaande publieke positie-dataset. Nieuwe imports moeten via candidate_positions en review."
}));

const IMPORTED_APPROVED_POSITIONS = (APPROVED_POSITION_IMPORTS.positions ?? []).map((position) => ({
    ...position,
    publicationStatus: "approved_import",
    reviewStatus: position.reviewStatus ?? "Goedgekeurd via lokale review-import.",
    reviewedByHuman: true
}));

export const APPROVED_POSITIONS = dedupeApprovedPositions([
    ...LEGACY_APPROVED_POSITIONS,
    ...IMPORTED_APPROVED_POSITIONS
]);

export function getApprovedPositionsForDossier(dossierId) {
    return APPROVED_POSITIONS.filter((position) => position.dossierId === dossierId);
}

function dedupeApprovedPositions(positions) {
    const byId = new Map();

    positions.forEach((position) => {
        byId.set(position.id, position);
    });

    return [...byId.values()];
}
