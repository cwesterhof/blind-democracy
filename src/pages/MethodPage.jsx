import { RELIABILITY_DIMENSIONS } from "../data/reliability";

const SOURCES = [
    {
        title: "Tweede Kamer Open Data",
        url: "https://opendata.tweedekamer.nl/",
        description: "Officiële stemdata, Kamerzaken en fractiestemmingen. Alle stemdata wordt ongewijzigd overgenomen — geen bewerkingen, geen interpretaties."
    },
    {
        title: "Verkiezingsprogramma's TK2023",
        url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
        description: "Officiële programma's van alle partijen, gearchiveerd door het Documentatiecentrum Nederlandse Politieke Partijen (DNPP) van de Rijksuniversiteit Groningen."
    },
    {
        title: "CBS, CPB en PBL",
        url: "https://www.cbs.nl",
        description: "Statistieken en beleidsanalyses van het Centraal Bureau voor de Statistiek, het Centraal Planbureau en het Planbureau voor de Leefomgeving. Gebruikt voor bewijsclaims bij dossiers."
    }
];

const STEPS = [
    {
        title: "Extractie",
        body: "Een geautomatiseerd script haalt relevante passages op uit verkiezingsprogramma's via de Claude API van Anthropic. Het script zoekt per beleidsdossier naar relevante passages en extraheert een kandidaat-standpunt met bronquote en paginanummer."
    },
    {
        title: "Menselijke review",
        body: "Elk kandidaat-standpunt wordt beoordeeld door een menselijke redacteur. De redacteur controleert of het citaat klopt, of de samenvatting de partij juist weergeeft, en of de bronverwijzing correct is. Standpunten worden nooit automatisch goedgekeurd."
    },
    {
        title: "Bronverificatie",
        body: "Een standpunt wordt pas goedgekeurd als er een exact citaat én een paginanummer beschikbaar zijn uit het officiële partijdocument. Parafrasen zonder directe bronbasis worden afgewezen."
    },
    {
        title: "Publicatie",
        body: "Goedgekeurde standpunten zijn zichtbaar in de blind test en de dossiers. Elk standpunt toont de volledige bronketen: document, pagina, citaat en bewijsniveau."
    }
];

const LIMITATIONS = [
    "Claim-accuratesse: we hebben nog geen systematische factcheck-infrastructuur. Dit meetpunt staat open.",
    "Coalitie-context: we registreren stemafwijkingen maar kunnen niet automatisch onderscheiden of een afwijking een coalitiecompromis of een echte belofte-breuk is.",
    "Volledigheid standpunten: niet alle partijen zijn even volledig gedekt. De dekking per partij is zichtbaar in de betrouwbaarheidsscore.",
    "Historische programma's: we werken momenteel alleen met TK2023-programma's. Eerdere verkiezingsprogramma's zijn nog niet verwerkt."
];

export default function MethodPage() {
    return (
        <main className="reliability-page method-page">
            <header className="page-heading">
                <p className="eyebrow">Methode</p>
                <h1>Geen zwarte doos</h1>
                <p>
                    Blind Democracy maakt alle redactionele keuzes, databronnen en scoringsmethoden openbaar. Op deze
                    pagina leggen we precies uit hoe elk onderdeel werkt — zodat je onze conclusies kunt controleren,
                    betwisten of verbeteren.
                </p>
            </header>

            <section className="method-section">
                <h2>Hoe werkt de blind test?</h2>
                <p>
                    De blind test toont partijstandpunten zonder partijnaam, logo of kleur. Je kiest per dossier het
                    standpunt dat het meest bij je past — pas na alle keuzes wordt onthuld welke partij achter elk
                    standpunt zit.
                </p>
                <p>
                    Standpunten zijn altijd gekoppeld aan een openbare bron: een verkiezingsprogramma, een
                    debatuitspraak of een officieel partijdocument. Elk standpunt toont het bewijsniveau, de exacte
                    bronquote en een paginaverwijzing. Standpunten zonder geverifieerde bron worden nooit gepubliceerd.
                </p>
                <p>
                    De matchscore na de onthulling vergelijkt jouw keuzes met het werkelijke stemgedrag van partijen
                    in de Tweede Kamer — niet alleen met wat ze beloven, maar met wat ze doen.
                </p>
            </section>

            <section className="method-section">
                <h2>Waar komt de data vandaan?</h2>
                <div className="method-sources-grid">
                    {SOURCES.map((source) => (
                        <div className="method-source-card" key={source.title}>
                            <strong>{source.title}</strong>
                            <a href={source.url} rel="noreferrer" target="_blank">{source.url}</a>
                            <p>{source.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="method-section">
                <h2>Hoe komen standpunten tot stand?</h2>
                <ol className="method-steps">
                    {STEPS.map((step) => (
                        <li key={step.title}>
                            <div>
                                <strong>{step.title}</strong>
                                <p>{step.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="method-section">
                <h2>Hoe werkt de betrouwbaarheidsscore?</h2>
                <p>
                    De betrouwbaarheidsscore meet vier dimensies. Alleen dimensies waarvoor voldoende data beschikbaar
                    is tellen mee. Een lage score betekent dat we onvoldoende data hebben — niet dat een partij
                    onbetrouwbaar is.
                </p>
                <div className="metric-legend method-grid">
                    {RELIABILITY_DIMENSIONS.map((dimension) => (
                        <article key={dimension.id}>
                            <strong>{dimension.label}</strong>
                            <p>{dimension.description}</p>
                        </article>
                    ))}
                </div>
                <p>
                    De score is het gemiddelde van alle beschikbare meetpunten, uitgedrukt als percentage. Meetpunten
                    zonder data worden niet als nul meegeteld — ze worden expliciet als 'open meetpunt' gemarkeerd en
                    uitgesloten van de berekening. Zo suggereert de meter nooit meer zekerheid dan de data toelaat.
                </p>
            </section>

            <section className="method-section">
                <h2>Hoe werkt de leugendetector?</h2>
                <p>
                    De leugendetector vergelijkt een partijbelofte uit het verkiezingsprogramma met het werkelijke
                    stemgedrag in de Tweede Kamer.
                </p>
                <p>
                    Een 'verwachte stem' is een redactioneel oordeel: gegeven deze belofte, zou een consistente partij
                    Voor of Tegen moeten stemmen op deze Kamerzaak? Dit oordeel wordt altijd onderbouwd met een
                    bronverwijzing naar het programma én de Kamerzaak.
                </p>
                <p>
                    Belangrijk voorbehoud: afwijkend stemgedrag is niet altijd een gebroken belofte.
                    Coalitieakkoorden, compromissen en gewijzigde omstandigheden kunnen een verklaring zijn. Blind
                    Democracy registreert de afwijking — de politieke duiding is aan de lezer.
                </p>
            </section>

            <section className="method-section">
                <h2>Wat kunnen we nog niet meten?</h2>
                <p>Blind Democracy is transparant over wat we nog niet kunnen meten:</p>
                <ul className="method-limitations">
                    {LIMITATIONS.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <section className="method-section">
                <h2>Wat als er iets niet klopt?</h2>
                <p>
                    Blind Democracy maakt fouten. Dat is onvermijdelijk bij het werken met grote hoeveelheden
                    politieke data. We nemen correctieverzoeken serieus.
                </p>
                <p>
                    Meld een fout via{" "}
                    <a href="mailto:correcties@blinddemocracy.nl">correcties@blinddemocracy.nl</a>. Vermeld de partij,
                    het dossier en de specifieke claim. We streven ernaar binnen 5 werkdagen te reageren. Bevestigde
                    correcties worden gedocumenteerd.
                </p>
            </section>
        </main>
    );
}
