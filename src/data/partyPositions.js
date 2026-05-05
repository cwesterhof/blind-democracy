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
        statement: "Meer overheidregie bij bouwen, huren en woningcorporaties.",
        explanation: "De woningmarkt levert volgens deze lijn te weinig betaalbare huizen op zolang winst en schaarste leidend zijn. Publieke regie moet starters, huurders en lagere inkomens beschermen.",
        how: "Via nationale bouwregie, meer sociale huur, sterkere huurregels en ruimere mogelijkheden voor woningcorporaties.",
        pros: [
            "Meer betaalbare woningen voor starters en huurders",
            "Minder afhankelijkheid van marktpartijen",
            "Duidelijkere publieke verantwoordelijkheid"
        ],
        cons: [
            "Hogere kosten en risico's voor de overheid",
            "Projecten kunnen trager worden door extra publieke sturing",
            "Minder ruimte voor particuliere investeerders"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z07515",
                expectedVote: "Voor",
                rationale: "Meer huurregulering en publieke bescherming passen bij dit standpunt.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Sneller bouwen door minder regels en meer ruimte voor investeerders.",
        explanation: "De kern van het probleem is volgens deze positie een tekort aan aanbod. Minder vertraging en meer investeringszekerheid moeten de bouwproductie verhogen.",
        how: "Door vergunningen te versnellen, bouwregels te beperken, bezwaarprocedures korter te maken en private bouwinvesteringen aantrekkelijker te houden.",
        pros: [
            "Kan bouwprojecten sneller van de grond krijgen",
            "Meer investeringsbereidheid bij ontwikkelaars",
            "Focus op vergroting van het woningaanbod"
        ],
        cons: [
            "Betaalbaarheid is niet automatisch gegarandeerd",
            "Minder regels kan botsen met natuur, leefbaarheid of kwaliteit",
            "Huurdersbescherming kan zwakker worden"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z07515",
                expectedVote: "Tegen",
                rationale: "Een stem tegen extra regulering past bij meer ruimte voor markt en investeerders.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Meer woningen in regio's, met voorrang voor lokale starters.",
        explanation: "Deze benadering ziet wonen ook als gemeenschapsvraagstuk: dorpen en regio's moeten leefbaar blijven, niet alleen de Randstad.",
        how: "Door regionale woningbouwafspraken, lokale voorrangsregels en meer bouwruimte rond dorpen en middelgrote gemeenten.",
        pros: [
            "Helpt starters in hun eigen regio blijven",
            "Versterkt leefbaarheid buiten de Randstad",
            "Spreidt druk op de woningmarkt"
        ],
        cons: [
            "Kan extra druk zetten op landschap en infrastructuur",
            "Lokale voorrang kan botsen met gelijke toegang",
            "Minder effectief waar banen vooral in steden zitten"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z07517",
                expectedVote: "Voor",
                rationale: "Deze huur- en woningmarktstemming is breed gekoppeld aan betaalbare woonruimte.",
                confidence: "weak"
            }
        ],
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
        statement: "Asielinstroom sterk beperken en grenzen strenger controleren.",
        explanation: "Deze positie legt de nadruk op druk op woningen, zorg, veiligheid en culturele samenhang. Nationale controle gaat boven Europese verdeling.",
        how: "Door strengere toelating, beperking van asielopvang, scherpere grenscontrole en minder ruimte voor Europese herverdeling.",
        pros: [
            "Kan ervaren druk op opvang en voorzieningen verlagen",
            "Geeft kiezers een duidelijk gevoel van nationale controle",
            "Maakt migratiebeleid politiek eenvoudiger uitlegbaar"
        ],
        cons: [
            "Juridisch moeilijk uitvoerbaar binnen EU- en vluchtelingenrecht",
            "Kan leiden tot menselijk schrijnende situaties",
            "Lost arbeidsmigratie en integratieproblemen niet vanzelf op"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z05135",
                expectedVote: "Tegen",
                rationale: "Een stem tegen ruimere integratiekoers past bij restrictiever migratiebeleid.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Snellere procedures, Europese verdeling en legale migratieroutes.",
        explanation: "Volgens deze lijn werkt strengheid alleen als het systeem juridisch houdbaar en uitvoerbaar blijft. Europa moet meer gezamenlijk dragen.",
        how: "Door betere IND-capaciteit, Europese spreidingsafspraken, terugkeer bij afwijzing en gecontroleerde legale migratieroutes.",
        pros: [
            "Kan wachttijden en onzekerheid verminderen",
            "Past beter binnen internationale rechtsregels",
            "Verdeelt verantwoordelijkheid breder over Europa"
        ],
        cons: [
            "Europese afspraken komen vaak traag tot stand",
            "Legale routes kunnen politiek voelen als aanzuigende werking",
            "Uitvoering vraagt veel capaciteit en samenwerking"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z05135",
                expectedVote: "Voor",
                rationale: "Een stem voor integratiebeleid past bij uitvoerbare procedures en meedoen na toelating.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Kleinschalige opvang en meer grip op migratiedruk in regio's.",
        explanation: "Deze benadering richt zich op lokale draagkracht: opvang en migratiebeleid moeten passen bij voorzieningen, woningen en gemeenschappen.",
        how: "Door opvang meer te spreiden, gemeenten meer zeggenschap te geven en arbeidsmigratie sterker te koppelen aan huisvesting en lokale capaciteit.",
        pros: [
            "Houdt meer rekening met lokale draagkracht",
            "Maakt overlast en voorzieningenproblemen zichtbaarder bestuurbaar",
            "Verbindt migratie aan huisvesting en werk"
        ],
        cons: [
            "Kleinschalige opvang kan duurder en lastiger te organiseren zijn",
            "Lokale zeggenschap kan landelijke spreiding blokkeren",
            "Beperkt asielinstroom zelf maar gedeeltelijk"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z04721",
                expectedVote: "Tegen",
                rationale: "Deze koppeling raakt lokale draagkracht, maar is nog inhoudelijk zwak gekoppeld.",
                confidence: "weak"
            }
        ],
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
        statement: "Klimaat versnellen via Europa, groene industrie en energie-infra.",
        explanation: "Deze positie ziet klimaat als grensoverschrijdend probleem. Europese schaal moet kosten verlagen en afhankelijkheid van fossiele energie verminderen.",
        how: "Door Europese investeringen in stroomnetten, waterstof, industriebeleid, CO2-beprijzing en gezamenlijke inkoop of planning.",
        pros: [
            "Pakt klimaat en energiezekerheid op passende schaal aan",
            "Kan kosten delen tussen landen",
            "Versterkt groene industrie en innovatie"
        ],
        cons: [
            "Nederland krijgt minder directe nationale controle",
            "Europese besluitvorming kan langzaam zijn",
            "Kosten en baten kunnen ongelijk verdeeld uitpakken"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z05774",
                expectedVote: "Voor",
                rationale: "Een stem voor Klimaatfondsmiddelen past bij versnelling van klimaat- en energie-investeringen.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Klimaatbeleid versnellen zonder lage inkomens extra te belasten.",
        explanation: "De nadruk ligt op rechtvaardigheid: verduurzaming mag niet voelen als rekening voor mensen die weinig keuze hebben.",
        how: "Door subsidies en isolatie eerst te richten op lage en middeninkomens, publieke energievoorziening te versterken en grote vervuilers zwaarder te belasten.",
        pros: [
            "Vergroot draagvlak voor klimaatbeleid",
            "Beschermt huishoudens met weinig financiële ruimte",
            "Legt meer kosten bij grote uitstoters"
        ],
        cons: [
            "Kan de transitie vertragen als betaalbaarheid steeds voorwaardelijk is",
            "Vraagt veel publieke middelen en uitvoering",
            "Hogere lasten voor bedrijven kunnen worden doorberekend"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z05774",
                expectedVote: "Voor",
                rationale: "Een stem voor Klimaatfondsmiddelen past bij publieke financiering van rechtvaardige verduurzaming.",
                confidence: "editorialDraft"
            }
        ],
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
        statement: "Minder nationaal klimaatbeleid, meer focus op energiezekerheid.",
        explanation: "Deze lijn betwijfelt of Nederlandse maatregelen genoeg effect hebben om de kosten te rechtvaardigen.",
        how: "Door nationale klimaatmaatregelen af te bouwen, minder subsidies en verplichtingen op te leggen en fossiele of nucleaire energiezekerheid prioriteit te geven.",
        pros: [
            "Kan op korte termijn kosten voor burgers en bedrijven beperken",
            "Legt nadruk op betrouwbare energievoorziening",
            "Voorkomt dat Nederland alleen dure maatregelen neemt"
        ],
        cons: [
            "Vergroot risico op achterblijven bij Europese klimaatdoelen",
            "Kan toekomstige schade en aanpassingskosten verhogen",
            "Minder stimulans voor duurzame innovatie"
        ],
        voteLinks: [
            {
                zaakNumber: "2026Z05774",
                expectedVote: "Tegen",
                rationale: "Een stem tegen extra Klimaatfondsuitgaven past bij minder nationaal klimaatbeleid.",
                confidence: "editorialDraft"
            }
        ],
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
