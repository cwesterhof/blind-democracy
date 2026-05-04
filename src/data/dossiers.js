import { SOURCE_REGISTRY } from "./sources.js";

export const DOSSIERS = [
    {
        id: "wonen",
        title: "Wonen",
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; beleidsclaims via CBS, CPB en PBL; partijposities voorlopig redactioneel gecodeerd uit verkiezingsprogramma en Kamerstukken.",
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkODataDocs.id, SOURCE_REGISTRY.cbs.id, SOURCE_REGISTRY.cpb.id, SOURCE_REGISTRY.pbl.id],
        summary: "Betaalbare woningen, huurregels, nieuwbouw en de verdeling van schaarse ruimte.",
        context: "Nederland heeft een groot woningtekort. De politieke vraag is niet alleen hoeveel er gebouwd moet worden, maar ook voor wie, waar en met welke rol voor markt, overheid en corporaties.",
        positions: [
            {
                id: "wonen-a",
                party: "GroenLinks-PvdA",
                stance: "Meer regie door de overheid: fors bouwen, huren sterker reguleren en woningcorporaties meer ruimte geven.",
                rationale: "De woningmarkt levert volgens deze lijn te weinig betaalbare huizen op zolang winst en schaarste leidend zijn. Publieke regie moet starters, huurders en lagere inkomens beschermen."
            },
            {
                id: "wonen-b",
                party: "VVD",
                stance: "Sneller bouwen door regels te schrappen, procedures te versnellen en particuliere investeerders ruimte te geven.",
                rationale: "De kern van het probleem is volgens deze positie een tekort aan aanbod. Minder vertraging en meer investeringszekerheid moeten de bouwproductie verhogen."
            },
            {
                id: "wonen-c",
                party: "CDA",
                stance: "Meer bouwen buiten de grote steden, met voorrang voor lokale starters en gezinnen.",
                rationale: "Deze benadering ziet wonen ook als gemeenschapsvraagstuk: dorpen en regio's moeten leefbaar blijven, niet alleen de Randstad."
            }
        ],
        evidence: [
            {
                level: "Consensus",
                claim: "Nederland heeft een structureel woningtekort.",
                sourceIds: [SOURCE_REGISTRY.cbs.id, SOURCE_REGISTRY.pbl.id],
                reviewStatus: "Bronnen koppelen aan concrete dataset"
            },
            {
                level: "High Confidence",
                claim: "Langdurige bezwaar- en vergunningsprocedures vertragen een deel van de woningbouw.",
                sourceIds: [SOURCE_REGISTRY.pbl.id],
                reviewStatus: "Onderbouwen met rapport en Kamerstuk"
            },
            {
                level: "Contested",
                claim: "Huurregulering vergroot op lange termijn altijd het betaalbare aanbod.",
                sourceIds: [SOURCE_REGISTRY.cpb.id],
                reviewStatus: "Controverse expliciet onderbouwen"
            }
        ],
        votes: [
            {
                title: "Wet betaalbare huur",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id],
                tkQueryStatus: "Te koppelen aan Zaak/Besluit/Stemming",
                promise: "Betaalbare huren beschermen",
                vote: "Voor",
                gap: "Klein"
            },
            {
                title: "Versnelling tijdelijke woningbouw",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id],
                tkQueryStatus: "Te koppelen aan moties en amendementen",
                promise: "Meer woningen bouwen",
                vote: "Voor",
                gap: "Klein"
            }
        ],
        impact: {
            winners: "Starters, sociale huurders en woningzoekenden profiteren vooral van meer betaalbaar aanbod.",
            losers: "Verhuurders, beleggers en gemeenten met weinig bouwruimte kunnen hogere druk voelen.",
            eu: "EU-staatssteunregels en natuurregels kunnen invloed hebben op woningbouw en corporaties."
        }
    },
    {
        id: "immigratie",
        title: "Immigratie",
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; juridische context via verdragen en EU-asielrecht; beleidsposities voorlopig redactioneel gecodeerd.",
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.tkZaakDocs.id, SOURCE_REGISTRY.eu.id, SOURCE_REGISTRY.cbs.id],
        summary: "Asiel, arbeidsmigratie, integratie en de uitvoerbaarheid van grenzen en opvang.",
        context: "Het immigratiedebat mengt morele, juridische en praktische vragen. De kern is vaak: wie mag blijven, wie beslist dat, en hoeveel druk kan opvang en integratie dragen?",
        positions: [
            {
                id: "immigratie-a",
                party: "PVV",
                stance: "Asielinstroom zo ver mogelijk beperken en nationale grenzen veel strenger controleren.",
                rationale: "Deze positie legt de nadruk op druk op woningen, zorg, veiligheid en culturele samenhang. Nationale controle gaat boven Europese verdeling."
            },
            {
                id: "immigratie-b",
                party: "D66",
                stance: "Snellere procedures, betere Europese verdeling en meer legale routes voor migratie.",
                rationale: "Volgens deze lijn werkt strengheid alleen als het systeem juridisch houdbaar en uitvoerbaar blijft. Europa moet meer gezamenlijk dragen."
            },
            {
                id: "immigratie-c",
                party: "BBB",
                stance: "Kleinschaliger opvang, meer grip op arbeidsmigratie en minder druk op dorpen en regio's.",
                rationale: "Deze benadering richt zich op lokale draagkracht: opvang en migratiebeleid moeten passen bij voorzieningen, woningen en gemeenschappen."
            }
        ],
        evidence: [
            {
                level: "Consensus",
                claim: "Nederland is gebonden aan internationale vluchtelingenverdragen en Europees asielrecht.",
                sourceIds: [SOURCE_REGISTRY.eu.id],
                reviewStatus: "Juridische bron exact koppelen"
            },
            {
                level: "High Confidence",
                claim: "Lange procedures vergroten onzekerheid voor asielzoekers en druk op opvanglocaties.",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.cbs.id],
                reviewStatus: "Aanvullen met uitvoeringsdata"
            },
            {
                level: "Emerging",
                claim: "Regionale opvangmodellen kunnen draagvlak vergroten als gemeenten vroeg zeggenschap krijgen.",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id],
                reviewStatus: "Voorlopig beleidsargument"
            }
        ],
        votes: [
            {
                title: "Spreidingswet",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id],
                tkQueryStatus: "Te koppelen aan wet en stemmingen",
                promise: "Eerlijkere verdeling van opvang",
                vote: "Verdeeld",
                gap: "Middel"
            },
            {
                title: "Aanscherping nareisregels",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id],
                tkQueryStatus: "Te koppelen aan moties/Kamerbrieven",
                promise: "Grip op instroom",
                vote: "Voor/Tegen per partij",
                gap: "Groot"
            }
        ],
        impact: {
            winners: "Gemeenten met duidelijke afspraken, statushouders met snellere procedures en werkgevers met legale routes kunnen profiteren.",
            losers: "Gemeenten zonder opvangcapaciteit, mensen in lange procedures en sectoren afhankelijk van goedkope arbeid voelen spanning.",
            eu: "Asielverdeling, buitengrensbeleid en Dublin-afspraken liggen grotendeels op EU-niveau."
        }
    },
    {
        id: "klimaat",
        title: "Klimaat",
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; beleidsclaims via PBL, CPB, CBS en EU-klimaatkaders; partijposities voorlopig redactioneel gecodeerd.",
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.pbl.id, SOURCE_REGISTRY.cpb.id, SOURCE_REGISTRY.eu.id],
        summary: "CO2-reductie, energieprijzen, industrie, landbouw en wie de rekening betaalt.",
        context: "Klimaatbeleid gaat niet alleen over doelen, maar ook over tempo, betaalbaarheid en verdeling. Veel maatregelen raken huishoudens, boeren en industrie verschillend.",
        positions: [
            {
                id: "klimaat-a",
                party: "Volt",
                stance: "Versnellen met Europees klimaatbeleid, groene industrie en gezamenlijke energie-infrastructuur.",
                rationale: "Deze positie ziet klimaat als grensoverschrijdend probleem. Europese schaal moet kosten verlagen en afhankelijkheid van fossiele energie verminderen."
            },
            {
                id: "klimaat-b",
                party: "SP",
                stance: "Klimaatbeleid alleen versnellen als lage en middeninkomens worden beschermd tegen hogere lasten.",
                rationale: "De nadruk ligt op rechtvaardigheid: verduurzaming mag niet voelen als rekening voor mensen die weinig keuze hebben."
            },
            {
                id: "klimaat-c",
                party: "FVD",
                stance: "Stoppen met kostbaar nationaal klimaatbeleid en prioriteit geven aan energiezekerheid en koopkracht.",
                rationale: "Deze lijn betwijfelt of Nederlandse maatregelen genoeg effect hebben om de kosten te rechtvaardigen."
            }
        ],
        evidence: [
            {
                level: "Consensus",
                claim: "Menselijke uitstoot van broeikasgassen warmt de aarde op.",
                sourceIds: [SOURCE_REGISTRY.pbl.id, SOURCE_REGISTRY.eu.id],
                reviewStatus: "Consensusbron exact koppelen"
            },
            {
                level: "High Confidence",
                claim: "Snelle elektrificatie vraagt forse investeringen in het stroomnet.",
                sourceIds: [SOURCE_REGISTRY.pbl.id],
                reviewStatus: "Aanvullen met netcapaciteitsbron"
            },
            {
                level: "Contested",
                claim: "Nationale subsidies zijn de meest efficiente manier om CO2-uitstoot te verminderen.",
                sourceIds: [SOURCE_REGISTRY.cpb.id, SOURCE_REGISTRY.pbl.id],
                reviewStatus: "Controverse expliciet onderbouwen"
            }
        ],
        votes: [
            {
                title: "Klimaatfonds",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id],
                tkQueryStatus: "Te koppelen aan begroting/wet",
                promise: "Investeren in verduurzaming",
                vote: "Voor",
                gap: "Klein"
            },
            {
                title: "Afbouw fossiele subsidies",
                sourceIds: [SOURCE_REGISTRY.tkOpenData.id],
                tkQueryStatus: "Te koppelen aan moties en amendementen",
                promise: "Vervuiler betaalt",
                vote: "Verdeeld",
                gap: "Middel"
            }
        ],
        impact: {
            winners: "Huishoudens met isolatie, groene industrie en energie-onafhankelijke regio's kunnen winnen.",
            losers: "Fossiele sectoren, energie-intensieve bedrijven en huishoudens zonder investeringsruimte lopen risico.",
            eu: "ETS, Fit for 55 en energie-infrastructuur zijn sterk verbonden met EU-besluiten."
        }
    },
    {
        id: "zorg",
        title: "Zorg",
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        summary: "Kosten, toegankelijkheid, personeelstekort en rol van de markt.",
        context: "De zorg staat onder druk door stijgende kosten, personeelstekort en lange wachttijden. De politieke vraag is hoeveel solidariteit, marktwerking en overheidsregie nodig zijn.",
        positions: [
            {
                id: "zorg-a",
                party: "SP",
                stance: "Afschaffen van het eigen risico en minder marktwerking in de zorg.",
                rationale: "Deze positie ziet zorg als publieke basisvoorziening. Kosten mogen mensen niet tegenhouden om hulp te zoeken."
            },
            {
                id: "zorg-b",
                party: "VVD",
                stance: "De zorg betaalbaar houden met meer efficiëntie, innovatie en ruimte voor aanbieders.",
                rationale: "Deze lijn richt zich op beheersing van kosten en betere organisatie zonder het stelsel volledig om te gooien."
            },
            {
                id: "zorg-c",
                party: "D66",
                stance: "Meer investeren in preventie, mentale gezondheid en samenwerking tussen zorgpartijen.",
                rationale: "Volgens deze benadering voorkom je druk op de zorg door eerder in te grijpen en domeinen beter te verbinden."
            }
        ],
        evidence: [
            {
                level: "High Confidence",
                claim: "Personeelstekort is een structureel knelpunt in de Nederlandse zorg.",
                sourceIds: [SOURCE_REGISTRY.cbs.id],
                reviewStatus: "Bronnen nog exact koppelen"
            }
        ],
        votes: [],
        impact: {
            winners: "Patiënten met hoge zorgkosten, zorgmedewerkers en mensen op wachtlijsten kunnen profiteren van betere toegankelijkheid.",
            losers: "Premiebetalers en overheid kunnen hogere collectieve kosten krijgen bij brede uitbreiding van vergoedingen.",
            eu: "EU-regels spelen vooral indirect via arbeidsmarkt, geneesmiddelen en aanbesteding."
        }
    },
    {
        id: "onderwijs",
        title: "Onderwijs",
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        summary: "Kwaliteit, lerarentekort, basisvaardigheden en kansengelijkheid.",
        context: "Onderwijs bepaalt kansen, maar kampt met personeelstekort, dalende basisvaardigheden en verschillen tussen leerlingen en regio's.",
        positions: [
            {
                id: "onderwijs-a",
                party: "GroenLinks-PvdA",
                stance: "Meer investeren in leraren, kleinere klassen en kansengelijkheid.",
                rationale: "Deze positie ziet ongelijkheid als kernprobleem. Extra geld moet vooral naar leerlingen en scholen die het het hardst nodig hebben."
            },
            {
                id: "onderwijs-b",
                party: "VVD",
                stance: "Focus op basisvaardigheden, prestaties en duidelijke meetbare onderwijskwaliteit.",
                rationale: "Volgens deze lijn moet onderwijs vooral beter sturen op taal, rekenen en aantoonbare resultaten."
            },
            {
                id: "onderwijs-c",
                party: "CDA",
                stance: "Meer ruimte voor scholen, brede vorming en onderwijs dat past bij gemeenschap en regio.",
                rationale: "Deze benadering legt nadruk op vertrouwen in scholen, ouders en lokale gemeenschappen."
            }
        ],
        evidence: [
            {
                level: "High Confidence",
                claim: "Nederland heeft aanhoudende zorgen over basisvaardigheden zoals lezen en rekenen.",
                sourceIds: [SOURCE_REGISTRY.cbs.id],
                reviewStatus: "Bronnen nog exact koppelen"
            }
        ],
        votes: [],
        impact: {
            winners: "Leerlingen, leraren en scholen met veel achterstanden kunnen profiteren van gerichte investeringen.",
            losers: "Scholen kunnen extra verantwoordingsdruk ervaren bij sterke nadruk op prestaties en metingen.",
            eu: "Onderwijs is grotendeels nationaal beleid, met beperkte EU-invloed via arbeidsmarkt, diploma-erkenning en onderzoeksprogramma's."
        }
    }
];

export const EVIDENCE_LEVELS = {
    Consensus: "Breed gedragen in wetenschap en beleidsonderzoek.",
    "High Confidence": "Sterk onderbouwd, met beperkte onzekerheid.",
    Contested: "Deskundigen verschillen wezenlijk van mening.",
    Emerging: "Veelbelovend, maar bewijsbasis is nog in ontwikkeling.",
    Speculative: "Mogelijk, maar nog zwak of indirect onderbouwd."
};