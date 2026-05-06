import { DOSSIERS, EVIDENCE_LEVELS } from "../data/dossiers.js";

export { EVIDENCE_LEVELS };

export function listDossiers() {
    return DOSSIERS;
}

export function getDefaultDossier() {
    if (DOSSIERS.length === 0) throw new Error("No dossiers configured — check src/data/dossiers.js");
    return DOSSIERS[0];
}

export function getDossierById(dossierId) {
    return DOSSIERS.find((dossier) => dossier.id === dossierId) ?? getDefaultDossier();
}

export function countDossiers() {
    return DOSSIERS.length;
}

export function mapDossiersById() {
    return Object.fromEntries(DOSSIERS.map((dossier) => [dossier.id, dossier]));
}
