import importedTweedeKamer from "../data/importedTweedeKamer.json" with { type: "json" };

let _importedById = null;

export function listImportedDossiers() {
    return importedTweedeKamer.dossiers;
}

export function mapImportedDossiersById() {
    if (!_importedById) {
        _importedById = Object.fromEntries(
            importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier])
        );
    }
    return _importedById;
}

export function getImportedDossierById(dossierId) {
    return mapImportedDossiersById()[dossierId] ?? null;
}

export function listImportedVoteCases() {
    return importedTweedeKamer.dossiers.flatMap((dossier) =>
        dossier.zaken
            .filter((zaak) => zaak.voteSummary?.totalVotes > 0)
            .map((zaak) => ({
                ...zaak,
                dossierId: dossier.dossierId,
                dossierTitle: dossier.title
            }))
    );
}
