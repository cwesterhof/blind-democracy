import { APPROVED_POSITIONS, POSITION_CONFIDENCE } from "../data/approvedPositions.js";

export { POSITION_CONFIDENCE };

export function listApprovedPositions() {
    return APPROVED_POSITIONS;
}

export function listApprovedPositionsForDossier(dossierId) {
    return APPROVED_POSITIONS.filter((position) => position.dossierId === dossierId);
}

export function listApprovedPositionsByParty(party) {
    return APPROVED_POSITIONS.filter((position) => position.party === party);
}

export function listVoteLinkedApprovedPositions() {
    return APPROVED_POSITIONS.filter((position) => position.voteLinks?.length > 0);
}
