import { SOURCE_REGISTRY } from "./sources.js";

const DEFAULT_SOURCE_IDS = [
    SOURCE_REGISTRY.tkOpenData.id,
    SOURCE_REGISTRY.tkStemmingDocs.id,
    SOURCE_REGISTRY.tkZaakDocs.id,
    SOURCE_REGISTRY.cbs.id,
    SOURCE_REGISTRY.cpb.id
];

function createDossier({ id, title, summary, context, positions, evidenceClaim, impact, sourceIds = DEFAULT_SOURCE_IDS }) {
    return {
        id,
        title,
        status: "sourceMapped",
        lastUpdated: "2026-05-04",
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; beleidsclaims via publieke databronnen; partijposities voorlopig redactioneel gecodeerd en nog te reviewen op exacte bronpassages.",
        sourceIds,
        summary,
        context,
        positions,
        evidence: [
            {
                level: "High Confidence",
                claim: evidenceClaim,
                sourceIds,
                reviewStatus: "Bronnen nog exact koppelen aan dossierclaim"
            }
        ],
        votes: [],
        impact
    };
}

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
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; beleidsclaims via CBS, CPB en zorgbronnen; partijposities voorlopig redactioneel gecodeerd.",
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.cbs.id, SOURCE_REGISTRY.cpb.id],
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
        sourceStrategy: "Officiele stemdata via Tweede Kamer OData; beleidsclaims via CBS, CPB en onderwijsbronnen; partijposities voorlopig redactioneel gecodeerd.",
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.cbs.id, SOURCE_REGISTRY.cpb.id],
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
    },
    createDossier({
        id: "economie",
        title: "Economie & koopkracht",
        summary: "Inflatie, belastingen, middeninkomens, bedrijven en verdeling van welvaart.",
        context: "Economisch beleid draait om de vraag wie lasten draagt en wie ruimte krijgt: huishoudens, ondernemers, overheid of toekomstige generaties.",
        positions: [
            {
                id: "economie-a",
                party: "VVD",
                stance: "Lasten laag houden, ondernemerschap stimuleren en overheidsuitgaven scherp prioriteren.",
                rationale: "Deze lijn ziet economische groei en investeringsruimte voor bedrijven als basis voor banen en koopkracht."
            },
            {
                id: "economie-b",
                party: "GroenLinks-PvdA",
                stance: "Sterkere herverdeling via belastingen en gerichte steun voor lage en middeninkomens.",
                rationale: "Deze positie legt de nadruk op bestaanszekerheid en het eerlijker verdelen van vermogen, winst en lasten."
            },
            {
                id: "economie-c",
                party: "NSC",
                stance: "Begrotingsdiscipline combineren met gerichte koopkrachtsteun en beter bestuur van publieke uitgaven.",
                rationale: "Deze benadering wil voorkomen dat structurele uitgaven worden betaald met tijdelijke dekking of onduidelijke keuzes."
            }
        ],
        evidenceClaim: "Koopkracht wordt sterk beinvloed door inflatie, loonontwikkeling, belastingen en gerichte inkomensmaatregelen.",
        impact: {
            winners: "Huishoudens met lage en middeninkomens, ondernemers of spaarders kunnen afhankelijk van de gekozen route winnen.",
            losers: "Hogere inkomens, bedrijven, toekomstige belastingbetalers of publieke voorzieningen kunnen de rekening voelen.",
            eu: "EU-begrotingsregels, interne markt en staatssteunregels begrenzen een deel van het economisch beleid."
        }
    }),
    createDossier({
        id: "arbeid",
        title: "Werk & sociale zekerheid",
        summary: "Minimumloon, flexwerk, uitkeringen, arbeidsmigratie en bestaanszekerheid.",
        context: "De arbeidsmarkt is krap, maar zekerheid is ongelijk verdeeld. De politieke vraag is hoeveel bescherming, verplichting en loonruimte nodig zijn.",
        positions: [
            {
                id: "arbeid-a",
                party: "SP",
                stance: "Minimumloon en uitkeringen omhoog, flexwerk beperken en werknemers meer zekerheid geven.",
                rationale: "Deze lijn ziet bestaanszekerheid als voorwaarde voor vrijheid en gezond werk."
            },
            {
                id: "arbeid-b",
                party: "VVD",
                stance: "Werken meer laten lonen, werkgevers ruimte geven en activering boven langdurige afhankelijkheid zetten.",
                rationale: "Deze positie wil arbeidsparticipatie vergroten en voorkomen dat regels werkgevers afremmen."
            },
            {
                id: "arbeid-c",
                party: "CDA",
                stance: "Vaste contracten aantrekkelijker maken en gezinnen, mantelzorgers en vakmensen beter ondersteunen.",
                rationale: "Deze benadering zoekt balans tussen economische dynamiek en sociale samenhang."
            }
        ],
        evidenceClaim: "Nederland heeft tegelijk arbeidsmarktkrapte en groepen met onzekere inkomens of afstand tot werk.",
        impact: {
            winners: "Werknemers, flexwerkers en mensen met lage inkomens kunnen winnen bij meer zekerheid.",
            losers: "Werkgevers en sectoren met lage marges kunnen hogere kosten of minder flexibiliteit ervaren.",
            eu: "EU-arbeidsrecht, vrij verkeer en arbeidsmigratie werken door in nationale keuzes."
        }
    }),
    createDossier({
        id: "veiligheid",
        title: "Veiligheid & rechtsstaat",
        summary: "Politie, justitie, georganiseerde misdaad, privacy en rechtsbescherming.",
        context: "Veiligheidsbeleid gaat over bescherming tegen criminaliteit, maar ook over de grenzen van staatsmacht en burgerrechten.",
        positions: [
            {
                id: "veiligheid-a",
                party: "PVV",
                stance: "Harder straffen, meer politie op straat en strengere aanpak van overlast en geweld.",
                rationale: "Deze lijn legt de nadruk op directe bescherming en zichtbare handhaving."
            },
            {
                id: "veiligheid-b",
                party: "D66",
                stance: "Investeren in opsporing en preventie, maar burgerrechten en rechtsbescherming stevig bewaken.",
                rationale: "Deze positie ziet veiligheid en rechtsstaat als voorwaarden die elkaar moeten versterken."
            },
            {
                id: "veiligheid-c",
                party: "VVD",
                stance: "Georganiseerde misdaad harder aanpakken met extra bevoegdheden, capaciteit en internationale samenwerking.",
                rationale: "Deze benadering richt zich op ondermijning, drugscriminaliteit en daadkrachtige handhaving."
            }
        ],
        evidenceClaim: "Opsporing, rechtspraak en gevangeniswezen kampen met capaciteitsdruk en toenemende complexiteit.",
        impact: {
            winners: "Slachtoffers, buurten met overlast en politie/justitie kunnen profiteren van meer capaciteit.",
            losers: "Burgers kunnen privacy- of rechtsbeschermingsrisico's lopen bij ruimere bevoegdheden.",
            eu: "Grensoverschrijdende misdaad, datadeling en mensenrechtenkaders zijn sterk Europees verbonden."
        }
    }),
    createDossier({
        id: "landbouw",
        title: "Landbouw, natuur & stikstof",
        summary: "Boeren, natuurherstel, stikstofruimte, voedselproductie en landgebruik.",
        context: "Landbouwbeleid raakt boereninkomens, natuurkwaliteit, woningbouw, economie en vertrouwen in de overheid tegelijk.",
        positions: [
            {
                id: "landbouw-a",
                party: "BBB",
                stance: "Boeren meer zekerheid geven, minder gedwongen krimp en stikstofbeleid praktischer maken.",
                rationale: "Deze lijn ziet voedselproductie en leefbaarheid van het platteland als zwaarwegende publieke belangen."
            },
            {
                id: "landbouw-b",
                party: "GroenLinks-PvdA",
                stance: "Sneller natuur herstellen, veestapel verkleinen en boeren helpen omschakelen naar duurzame landbouw.",
                rationale: "Deze positie legt de nadruk op ecologische grenzen en langetermijnkwaliteit van bodem, water en natuur."
            },
            {
                id: "landbouw-c",
                party: "CDA",
                stance: "Gebiedsgericht beleid met perspectief voor familiebedrijven en duidelijke langjarige afspraken.",
                rationale: "Deze benadering zoekt draagvlak door regio's, boeren en overheid samen keuzes te laten maken."
            }
        ],
        evidenceClaim: "Stikstof, waterkwaliteit en natuurdoelen beperken de ruimte voor landbouw, bouw en infrastructuur.",
        impact: {
            winners: "Boeren met duidelijk perspectief, natuurgebieden of bouwprojecten kunnen afhankelijk van de route winnen.",
            losers: "Intensieve veehouderij, natuurkwaliteit of woningbouw kunnen verliezen als keuzes worden uitgesteld.",
            eu: "Habitatrichtlijn, Kaderrichtlijn Water en landbouwsubsidies maken dit sterk Europees verweven."
        }
    }),
    createDossier({
        id: "energie",
        title: "Energie",
        summary: "Betaalbaarheid, energiezekerheid, netcongestie, kernenergie en verduurzaming.",
        context: "Energiebeleid raakt iedere rekening en elk bedrijf. De kernvraag is hoe Nederland schoon, betaalbaar en betrouwbaar energie organiseert.",
        positions: [
            {
                id: "energie-a",
                party: "VVD",
                stance: "Inzetten op kernenergie, infrastructuur en leveringszekerheid met realistisch tempo.",
                rationale: "Deze lijn ziet betrouwbare energie als randvoorwaarde voor industrie, huishoudens en klimaatbeleid."
            },
            {
                id: "energie-b",
                party: "GroenLinks-PvdA",
                stance: "Versnellen met isolatie, hernieuwbare energie en publieke regie op betaalbare energie.",
                rationale: "Deze positie wil fossiele afhankelijkheid verminderen en huishoudens beschermen tegen prijsschokken."
            },
            {
                id: "energie-c",
                party: "FVD",
                stance: "Stoppen met dure energietransitie en prioriteit geven aan lage prijzen en fossiele leveringszekerheid.",
                rationale: "Deze benadering betwijfelt of de kosten en dwang van de transitie opwegen tegen de opbrengsten."
            }
        ],
        evidenceClaim: "Netcongestie en energieprijzen hebben grote invloed op verduurzaming, bedrijven en huishoudens.",
        impact: {
            winners: "Huishoudens met isolatie, energie-intensieve bedrijven of groene industrie kunnen winnen afhankelijk van keuzes.",
            losers: "Fossiele sectoren, huurders zonder isolatie of regio's met netcongestie kunnen achterblijven.",
            eu: "Europese energiemarkt, ETS en infrastructuurafspraken bepalen veel nationale ruimte."
        }
    }),
    createDossier({
        id: "defensie",
        title: "Defensie & internationale veiligheid",
        summary: "NAVO, Oekraïne, krijgsmacht, Europese samenwerking en defensie-uitgaven.",
        context: "Defensie staat hoger op de agenda door oorlog in Europa en geopolitieke spanning. De vraag is hoeveel Nederland wil betalen voor veiligheid.",
        positions: [
            {
                id: "defensie-a",
                party: "VVD",
                stance: "Defensie-uitgaven verhogen en de krijgsmacht sneller versterken binnen NAVO-verband.",
                rationale: "Deze lijn ziet afschrikking en bondgenootschappelijke betrouwbaarheid als kern van veiligheid."
            },
            {
                id: "defensie-b",
                party: "SP",
                stance: "Terughoudender met militaire escalatie en meer nadruk op diplomatie en vredespolitiek.",
                rationale: "Deze positie waarschuwt dat hogere defensie-uitgaven publieke middelen verdringen en conflicten kunnen verdiepen."
            },
            {
                id: "defensie-c",
                party: "Volt",
                stance: "Meer Europese defensiesamenwerking en gezamenlijke inkoop, naast steun aan Oekraïne.",
                rationale: "Deze benadering ziet veiligheid als Europees schaalvraagstuk dat nationale versnippering moet overstijgen."
            }
        ],
        evidenceClaim: "Nederland heeft zich binnen NAVO-verband verbonden aan hogere defensie-inspanningen en capaciteit.",
        impact: {
            winners: "Krijgsmacht, defensie-industrie en bondgenoten kunnen profiteren van hogere investeringen.",
            losers: "Andere publieke uitgaven kunnen onder druk komen bij structureel hogere defensiebudgetten.",
            eu: "NAVO, EU-defensiesamenwerking en steun aan Oekraïne zijn direct verbonden."
        }
    }),
    createDossier({
        id: "mobiliteit",
        title: "Mobiliteit & infrastructuur",
        summary: "OV, wegen, files, bereikbaarheid, luchtvaart en regionale verbindingen.",
        context: "Mobiliteit bepaalt toegang tot werk, onderwijs en voorzieningen. Politiek draait het om de verdeling tussen auto, OV, fiets, regio en klimaat.",
        positions: [
            {
                id: "mobiliteit-a",
                party: "VVD",
                stance: "Investeren in wegen, doorstroming en bereikbaarheid voor automobilisten en ondernemers.",
                rationale: "Deze lijn ziet bereikbaarheid en economische doorstroming als primaire doelen."
            },
            {
                id: "mobiliteit-b",
                party: "GroenLinks-PvdA",
                stance: "Meer investeren in betaalbaar OV, fiets en minder vervuilende mobiliteit.",
                rationale: "Deze positie wil mobiliteit toegankelijker maken en uitstoot verminderen."
            },
            {
                id: "mobiliteit-c",
                party: "CDA",
                stance: "Regionale bereikbaarheid versterken met betrouwbaar OV, wegenonderhoud en voorzieningen dichtbij.",
                rationale: "Deze benadering kijkt naar mobiliteit als voorwaarde voor leefbare dorpen en regio's."
            }
        ],
        evidenceClaim: "Bereikbaarheid verschilt sterk per regio en vervoersvorm, en investeringen hebben lange doorlooptijden.",
        impact: {
            winners: "Forenzen, regio's en ondernemers kunnen profiteren van betere verbindingen.",
            losers: "Omwonenden, natuur of klimaatafspraken kunnen onder druk staan bij uitbreiding van infrastructuur.",
            eu: "Luchtvaart, spoor, emissienormen en TEN-T-netwerken hebben Europese kaders."
        }
    }),
    createDossier({
        id: "digitalisering",
        title: "Digitalisering & privacy",
        summary: "AI, platformmacht, cyberveiligheid, privacy en digitale overheid.",
        context: "Digitale systemen bepalen steeds vaker toegang tot werk, overheid en informatie. De vraag is wie controle houdt: burger, overheid of markt.",
        positions: [
            {
                id: "digitalisering-a",
                party: "D66",
                stance: "Digitale rechten, privacy en transparante algoritmes stevig wettelijk beschermen.",
                rationale: "Deze lijn ziet grondrechten als uitgangspunt voor technologiebeleid."
            },
            {
                id: "digitalisering-b",
                party: "VVD",
                stance: "Innovatie en cyberveiligheid versterken, met ruimte voor bedrijven en gerichte overheidsregie.",
                rationale: "Deze positie wil concurrentiekracht en veiligheid combineren zonder innovatie onnodig te remmen."
            },
            {
                id: "digitalisering-c",
                party: "NSC",
                stance: "Digitale overheid menselijker maken, fouten herstelbaar maken en algoritmes controleerbaar houden.",
                rationale: "Deze benadering legt nadruk op bescherming tegen systeemfalen en ondoorzichtige besluitvorming."
            }
        ],
        evidenceClaim: "Digitale besluitvorming en datagebruik vragen om toezicht, transparantie en cyberweerbaarheid.",
        impact: {
            winners: "Burgers, bedrijven en publieke diensten kunnen winnen bij veilige en duidelijke digitale systemen.",
            losers: "Privacy, autonomie of kleine organisaties kunnen onder druk komen bij snelle digitalisering.",
            eu: "AI Act, AVG en digitale-marktwetgeving maken dit sterk Europees gereguleerd."
        },
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.tkZaakDocs.id, SOURCE_REGISTRY.eu.id, SOURCE_REGISTRY.cbs.id]
    }),
    createDossier({
        id: "bestuur",
        title: "Bestuur & democratie",
        summary: "Vertrouwen, transparantie, uitvoeringsorganisaties, grondrechten en democratische controle.",
        context: "Veel politieke conflicten gaan uiteindelijk over vertrouwen: kan de overheid leveren, luisteren en fouten herstellen?",
        positions: [
            {
                id: "bestuur-a",
                party: "NSC",
                stance: "Bestuur hervormen met meer dualisme, betere rechtsbescherming en minder macht bij achterkamertjes.",
                rationale: "Deze lijn ziet institutionele controle en herstel van vertrouwen als hoofdopgave."
            },
            {
                id: "bestuur-b",
                party: "D66",
                stance: "Democratie vernieuwen met meer transparantie, burgerparticipatie en bescherming van grondrechten.",
                rationale: "Deze positie wil democratische inspraak en liberale rechtsstaat versterken."
            },
            {
                id: "bestuur-c",
                party: "PVV",
                stance: "Meer directe invloed voor kiezers en minder macht voor bestuurlijke elites en instituties.",
                rationale: "Deze benadering legt nadruk op volkswil en wantrouwen tegenover gevestigde bestuurlijke macht."
            }
        ],
        evidenceClaim: "Vertrouwen in overheid hangt sterk samen met uitvoering, transparantie en ervaren rechtvaardigheid.",
        impact: {
            winners: "Burgers die vastlopen in systemen, parlementaire controle en uitvoeringsorganisaties kunnen winnen.",
            losers: "Snelle besluitvorming of bestuurlijke flexibiliteit kan afnemen bij meer waarborgen en controles.",
            eu: "Rechtsstaatnormen, mensenrechten en Europese besluitvorming raken nationale democratie."
        }
    }),
    createDossier({
        id: "europa",
        title: "Europa & soevereiniteit",
        summary: "EU-samenwerking, nationale zeggenschap, interne markt, migratie en veiligheid.",
        context: "Veel beleid wordt deels in Brussel gemaakt. De politieke vraag is wanneer Europese schaal helpt en wanneer nationale autonomie zwaarder weegt.",
        positions: [
            {
                id: "europa-a",
                party: "Volt",
                stance: "Meer Europese samenwerking en waar nodig gezamenlijke Europese besluitvorming.",
                rationale: "Deze lijn ziet klimaat, defensie, migratie en economie als grensoverschrijdende problemen."
            },
            {
                id: "europa-b",
                party: "PVV",
                stance: "Nationale soevereiniteit terughalen en EU-invloed op migratie, geld en regels beperken.",
                rationale: "Deze positie ziet Europese integratie als verlies van democratische controle."
            },
            {
                id: "europa-c",
                party: "CDA",
                stance: "Pragmatisch samenwerken in Europa waar nodig, maar nationale gemeenschappen beschermen.",
                rationale: "Deze benadering zoekt Europese samenwerking zonder alle zeggenschap te centraliseren."
            }
        ],
        evidenceClaim: "EU-regels werken direct door in nationale keuzes over markt, migratie, klimaat, landbouw en veiligheid.",
        impact: {
            winners: "Exporteurs, grensoverschrijdende sectoren en gezamenlijke veiligheidsprojecten kunnen winnen bij samenwerking.",
            losers: "Nationale beleidsvrijheid en groepen die last hebben van EU-regels kunnen druk ervaren.",
            eu: "Dit dossier gaat direct over EU-verdragen, instellingen en bevoegdheidsverdeling."
        },
        sourceIds: [SOURCE_REGISTRY.tkOpenData.id, SOURCE_REGISTRY.tkStemmingDocs.id, SOURCE_REGISTRY.tkZaakDocs.id, SOURCE_REGISTRY.eu.id]
    })
];

export const EVIDENCE_LEVELS = {
    Consensus: "Breed gedragen in wetenschap en beleidsonderzoek.",
    "High Confidence": "Sterk onderbouwd, met beperkte onzekerheid.",
    Contested: "Deskundigen verschillen wezenlijk van mening.",
    Emerging: "Veelbelovend, maar bewijsbasis is nog in ontwikkeling.",
    Speculative: "Mogelijk, maar nog zwak of indirect onderbouwd."
};
