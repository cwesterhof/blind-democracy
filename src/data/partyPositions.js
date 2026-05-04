export const POSITION_CONFIDENCE = {
    sourceQuoted: "Broncitaat gekoppeld",
    sourceMapped: "Bron gekoppeld, citaat nog controleren",
    editorialDraft: "Redactioneel concept",
    needsReview: "Review nodig"
};

export const PARTY_POSITIONS = [
    {
        id: "wonen-glpvda-regie",
        dossierId: "wonen",
        party: "GroenLinks-PvdA",
        statement: "Meer regie door de overheid: fors bouwen, huren sterker reguleren en woningcorporaties meer ruimte geven.",
        explanation: "De woningmarkt levert volgens deze lijn te weinig betaalbare huizen op zolang winst en schaarste leidend zijn. Publieke regie moet starters, huurders en lagere inkomens beschermen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Samen voor een hoopvolle toekomst",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "wonen-vvd-bouwen",
        dossierId: "wonen",
        party: "VVD",
        statement: "Sneller bouwen door regels te schrappen, procedures te versnellen en particuliere investeerders ruimte te geven.",
        explanation: "De kern van het probleem is volgens deze positie een tekort aan aanbod. Minder vertraging en meer investeringszekerheid moeten de bouwproductie verhogen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Ruimte geven. Grenzen stellen",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "wonen-cda-regio",
        dossierId: "wonen",
        party: "CDA",
        statement: "Meer bouwen buiten de grote steden, met voorrang voor lokale starters en gezinnen.",
        explanation: "Deze benadering ziet wonen ook als gemeenschapsvraagstuk: dorpen en regio's moeten leefbaar blijven, niet alleen de Randstad.",
        source: {
            type: "verkiezingsprogramma",
            title: "Recht doen",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "immigratie-pvv-beperken",
        dossierId: "immigratie",
        party: "PVV",
        statement: "Asielinstroom zo ver mogelijk beperken en nationale grenzen veel strenger controleren.",
        explanation: "Deze positie legt de nadruk op druk op woningen, zorg, veiligheid en culturele samenhang. Nationale controle gaat boven Europese verdeling.",
        source: {
            type: "verkiezingsprogramma",
            title: "Nederland weer op 1",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "immigratie-d66-europa",
        dossierId: "immigratie",
        party: "D66",
        statement: "Snellere procedures, betere Europese verdeling en meer legale routes voor migratie.",
        explanation: "Volgens deze lijn werkt strengheid alleen als het systeem juridisch houdbaar en uitvoerbaar blijft. Europa moet meer gezamenlijk dragen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Nieuwe energie voor Nederland",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "immigratie-bbb-lokaal",
        dossierId: "immigratie",
        party: "BBB",
        statement: "Kleinschaliger opvang, meer grip op arbeidsmigratie en minder druk op dorpen en regio's.",
        explanation: "Deze benadering richt zich op lokale draagkracht: opvang en migratiebeleid moeten passen bij voorzieningen, woningen en gemeenschappen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Van vertrouwenscrisis naar noaberstaat",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "klimaat-volt-europa",
        dossierId: "klimaat",
        party: "Volt",
        statement: "Versnellen met Europees klimaatbeleid, groene industrie en gezamenlijke energie-infrastructuur.",
        explanation: "Deze positie ziet klimaat als grensoverschrijdend probleem. Europese schaal moet kosten verlagen en afhankelijkheid van fossiele energie verminderen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Toekomst, nu.",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "klimaat-sp-rechtvaardig",
        dossierId: "klimaat",
        party: "SP",
        statement: "Klimaatbeleid alleen versnellen als lage en middeninkomens worden beschermd tegen hogere lasten.",
        explanation: "De nadruk ligt op rechtvaardigheid: verduurzaming mag niet voelen als rekening voor mensen die weinig keuze hebben.",
        source: {
            type: "verkiezingsprogramma",
            title: "Nu de mensen",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    },
    {
        id: "klimaat-fvd-stoppen",
        dossierId: "klimaat",
        party: "FVD",
        statement: "Stoppen met kostbaar nationaal klimaatbeleid en prioriteit geven aan energiezekerheid en koopkracht.",
        explanation: "Deze lijn betwijfelt of Nederlandse maatregelen genoeg effect hebben om de kosten te rechtvaardigen.",
        source: {
            type: "verkiezingsprogramma",
            title: "Het programma van hoop, optimisme en herstel 2023-2027",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        confidence: "sourceMapped",
        reviewStatus: "Bronprogramma bekend; exacte passage en pagina nog coderen",
        reviewedByHuman: false
    }
];

export function getPositionsForDossier(dossierId) {
    return PARTY_POSITIONS.filter((position) => position.dossierId === dossierId);
}
