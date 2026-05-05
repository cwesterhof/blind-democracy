import { DOSSIER_STATUSES, SOURCE_REGISTRY } from "../data/sources.js";

export { DOSSIER_STATUSES, SOURCE_REGISTRY };

export function listSources() {
    return Object.values(SOURCE_REGISTRY);
}

export function mapSourcesById() {
    return Object.fromEntries(listSources().map((source) => [source.id, source]));
}
