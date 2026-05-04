export const SOURCE_REGISTRY = {
    tkOpenData: {
        id: "tk-open-data",
        name: "Tweede Kamer Open Data Portaal",
        type: "official-api",
        url: "https://opendata.tweedekamer.nl/",
        description: "Officiele OData- en SyncFeed-toegang tot parlementaire data van de Tweede Kamer."
    },
    tkODataDocs: {
        id: "tk-odata-docs",
        name: "Tweede Kamer OData API documentatie",
        type: "official-docs",
        url: "https://opendata.tweedekamer.nl/documentatie/odata-api",
        description: "Documentatie voor OData-query's, filters, selectie en relaties tussen entiteiten."
    },
    tkStemmingDocs: {
        id: "tk-stemming-docs",
        name: "Entiteit Stemming",
        type: "official-docs",
        url: "https://opendata.tweedekamer.nl/documentatie/stemming",
        description: "Definitie van stemmingen: Voor, Tegen of Niet deelgenomen, gekoppeld aan besluit, fractie en persoon."
    },
    tkZaakDocs: {
        id: "tk-zaak-docs",
        name: "Entiteit Zaak",
        type: "official-docs",
        url: "https://opendata.tweedekamer.nl/documentatie/zaak",
        description: "Parlementaire zaak, zoals motie, wetsvoorstel of ander behandeltraject."
    },
    tkDocumentDocs: {
        id: "tk-document-docs",
        name: "Entiteit Document",
        type: "official-docs",
        url: "https://opendata.tweedekamer.nl/documentatie/document",
        description: "Documenten binnen het parlementaire proces, inclusief moties, wetsvoorstellen en bijlagen."
    },
    cbs: {
        id: "cbs",
        name: "Centraal Bureau voor de Statistiek",
        type: "public-data",
        url: "https://www.cbs.nl/",
        description: "Nederlandse statistiekbron voor demografie, economie, wonen, arbeid en samenleving."
    },
    cpb: {
        id: "cpb",
        name: "Centraal Planbureau",
        type: "public-research",
        url: "https://www.cpb.nl/",
        description: "Economische analyses, doorrekeningen en beleidsramingen."
    },
    pbl: {
        id: "pbl",
        name: "Planbureau voor de Leefomgeving",
        type: "public-research",
        url: "https://www.pbl.nl/",
        description: "Onderzoek naar leefomgeving, klimaat, natuur, landbouw, ruimte en wonen."
    },
    eu: {
        id: "eu",
        name: "Europese Unie",
        type: "official-source",
        url: "https://european-union.europa.eu/",
        description: "EU-instellingen, wetgeving en beleidskaders die doorwerken in Nederlands beleid."
    }
};

export const DOSSIER_STATUSES = {
    concept: "Concept",
    sourceMapped: "Bronnen gekoppeld",
    voteLinked: "Stemdata gekoppeld",
    reviewed: "Gecontroleerd",
    live: "Live"
};
