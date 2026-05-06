import { listApprovedPositionsForDossier } from "../dataAccess/positions";
import { SOURCE_REGISTRY } from "../dataAccess/sources";

export function getBlindPositionsForDossier(dossier) {
    const sourcedPositions = listApprovedPositionsForDossier(dossier.id);

    if (sourcedPositions.length > 0) {
        return sourcedPositions.map((position) => normalizeBlindPosition(position, dossier.id));
    }

    return (dossier.positions ?? []).map((position) => normalizeBlindPosition(position, dossier.id));
}

function normalizeBlindPosition(position, dossierId) {
    return {
        id: position.id,
        party: position.party,
        statement: position.statement ?? position.stance,
        explanation: position.explanation ?? position.rationale,
        how: position.how ?? "De precieze uitvoering moet nog redactioneel worden uitgewerkt.",
        pros: position.pros ?? ["Maakt de beleidsrichting duidelijker voor kiezers"],
        cons: position.cons ?? ["Uitvoering, kosten en neveneffecten moeten nog beter worden getoetst"],
        voteLinks: position.voteLinks ?? [],
        confidence: position.confidence ?? "editorialDraft",
        reviewedByHuman: position.reviewedByHuman ?? false,
        reviewStatus: position.reviewStatus ?? "Redactioneel dossierstandpunt; bron nog controleren",
        source: position.source ?? {
            type: "dossier",
            title: "Dossierstandpunt in review",
            url: SOURCE_REGISTRY.tkOpenData.url,
            quote: null
        },
        dossierId: position.dossierId ?? dossierId
    };
}
