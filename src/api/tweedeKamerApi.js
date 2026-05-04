const TK_ODATA_BASE_URL = "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0";

export const TK_ENTITIES = {
    document: "Document",
    zaak: "Zaak",
    besluit: "Besluit",
    stemming: "Stemming",
    fractie: "Fractie",
    persoon: "Persoon"
};

export function buildTweedeKamerQuery(entity, params = {}) {
    const url = new URL(`${TK_ODATA_BASE_URL}/${entity}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
}

export function buildRecentMotionsQuery({ searchTerm, top = 25 } = {}) {
    const filters = ["Verwijderd eq false", "Soort eq 'Motie'"];

    if (searchTerm) {
        filters.push(`contains(Titel, '${escapeODataString(searchTerm)}')`);
    }

    return buildTweedeKamerQuery(TK_ENTITIES.zaak, {
        $filter: filters.join(" and "),
        $orderby: "GewijzigdOp desc",
        $top: top,
        $expand: "ZaakActor($filter=Relatie eq 'Indiener')"
    });
}

export function buildVotesForDecisionQuery(besluitId) {
    return buildTweedeKamerQuery(TK_ENTITIES.stemming, {
        $filter: `Verwijderd eq false and Besluit_Id eq ${besluitId}`,
        $expand: "Fractie,Persoon"
    });
}

function escapeODataString(value) {
    return value.replaceAll("'", "''");
}
