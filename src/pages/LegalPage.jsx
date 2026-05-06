export default function LegalPage() {
    return (
        <main className="reliability-page legal-page">
            <header className="page-heading">
                <p className="eyebrow">Juridisch</p>
                <h1>Disclaimer, privacy en methode</h1>
                <p>
                    Blind Democracy is een onafhankelijk burgerinitiatief dat openbare politieke data
                    toegankelijk maakt. Lees hieronder hoe we werken, wat we wel en niet kunnen garanderen,
                    en hoe we omgaan met uw gegevens.
                </p>
            </header>

            <section className="legal-section">
                <h2>Disclaimer en aansprakelijkheid</h2>
                <p>
                    Blind Democracy streeft naar nauwkeurigheid en zorgvuldigheid, maar kan de volledigheid
                    of juistheid van de gepresenteerde informatie niet garanderen. Alle stemdata is afkomstig
                    van het officiële Tweede Kamer Open Data portaal en wordt ongewijzigd verwerkt.
                    Partijstandpunten zijn redactioneel gecodeerd op basis van openbare verkiezingsprogramma's
                    en worden altijd voorzien van een bronvermelding, bewijsniveau en reviewstatus.
                </p>
                <p>
                    Blind Democracy is niet aansprakelijk voor directe of indirecte schade die voortvloeit
                    uit het gebruik van dit platform, onjuistheden in de gepresenteerde data, of beslissingen
                    die gebruikers nemen op basis van informatie op dit platform. De scores en matches op
                    dit platform zijn indicatief en uitsluitend bedoeld als hulpmiddel voor informatievoorziening,
                    niet als politiek advies.
                </p>
                <p>
                    Politieke situaties, stemgedrag en partijstandpunten kunnen wijzigen. Alle data is
                    voorzien van een datum van laatste update. Blind Democracy is niet verantwoordelijk
                    voor ontwikkelingen die plaatsvinden na de vermelde updatedatum.
                </p>
            </section>

            <section className="legal-section">
                <h2>Onafhankelijkheid en financiering</h2>
                <p>
                    Blind Democracy is politiek onafhankelijk. Het platform ontvangt geen financiering van
                    politieke partijen, overheden, lobbyorganisaties of commerciële adverteerders. Er worden
                    geen advertenties getoond en er vindt geen gesponsorde plaatsing van inhoud plaats.
                    De redactionele keuzes worden uitsluitend gemaakt op basis van de eigen methodologie,
                    die volledig openbaar is beschreven op de{" "}
                    <a href="#methode">Methodepagina</a>.
                </p>
            </section>

            <section className="legal-section">
                <h2>Databronnen</h2>
                <p>De informatie op dit platform is uitsluitend afkomstig van openbare bronnen:</p>
                <ul className="legal-list">
                    <li>
                        <strong>Tweede Kamer Open Data Portaal</strong> —{" "}
                        <a href="https://opendata.tweedekamer.nl/" rel="noreferrer" target="_blank">
                            opendata.tweedekamer.nl
                        </a>{" "}
                        — Officiële stemdata, Kamerzaken, besluiten en fractiestemmingen.
                    </li>
                    <li>
                        <strong>Verkiezingsprogramma's</strong> — Officiële programma's van politieke
                        partijen, gepubliceerd voor de Tweede Kamerverkiezingen. Elk gecodeerd standpunt
                        bevat een directe verwijzing naar de bron, pagina en citaat.
                    </li>
                    <li>
                        <strong>Centraal Bureau voor de Statistiek (CBS)</strong> —{" "}
                        <a href="https://www.cbs.nl/" rel="noreferrer" target="_blank">
                            cbs.nl
                        </a>{" "}
                        — Statistieken over demografie, wonen, arbeid en samenleving.
                    </li>
                    <li>
                        <strong>Centraal Planbureau (CPB)</strong> —{" "}
                        <a href="https://www.cpb.nl/" rel="noreferrer" target="_blank">
                            cpb.nl
                        </a>{" "}
                        — Economische analyses en beleidsramingen.
                    </li>
                    <li>
                        <strong>Planbureau voor de Leefomgeving (PBL)</strong> —{" "}
                        <a href="https://www.pbl.nl/" rel="noreferrer" target="_blank">
                            pbl.nl
                        </a>{" "}
                        — Onderzoek naar klimaat, natuur, landbouw en wonen.
                    </li>
                </ul>
                <p>
                    Het gebruik van parlementaire open data is toegestaan op basis van de open data
                    licentievoorwaarden van de Tweede Kamer der Staten-Generaal.
                </p>
            </section>

            <section className="legal-section">
                <h2>Redactionele werkwijze en bewijsniveaus</h2>
                <p>
                    Elk partijstandpunt op Blind Democracy doorloopt een redactioneel reviewproces voordat
                    het gepubliceerd wordt. Een standpunt wordt alleen goedgekeurd als er een directe
                    bronverwijzing beschikbaar is, inclusief paginaverwijzing en exact citaat waar mogelijk.
                    De redactionele status van elk standpunt is zichtbaar in de interface.
                </p>
                <p>Beleidsclaims worden voorzien van een van de volgende bewijsniveaus:</p>
                <ul className="legal-list">
                    <li><strong>Consensus</strong> — Breed gedragen wetenschappelijke of institutionele consensus.</li>
                    <li><strong>High Confidence</strong> — Sterk onderbouwd door meerdere onafhankelijke bronnen.</li>
                    <li><strong>Emerging</strong> — Toenemend bewijs, maar nog geen volledige consensus.</li>
                    <li><strong>Contested</strong> — Wetenschappelijk of politiek omstreden; meerdere perspectieven bestaan.</li>
                </ul>
                <p>
                    Betrouwbaarheidsscores zijn uitsluitend gebaseerd op meetbare, openbare data. Dimensies
                    waarvoor nog onvoldoende data beschikbaar is, worden expliciet als "Open meetpunt"
                    weergegeven en tellen niet mee in de score. Een lage score betekent dat we onvoldoende
                    data hebben om een oordeel te geven — niet dat een partij onbetrouwbaar is.
                </p>
            </section>

            <section className="legal-section">
                <h2>Privacy en gegevensverwerking</h2>
                <p>
                    Blind Democracy verzamelt geen persoonsgegevens. Er is geen registratie, geen login
                    en geen gebruikersprofiel vereist of mogelijk.
                </p>
                <p>
                    Er worden geen tracking cookies of analytische cookies geplaatst. De enige lokale
                    opslag die dit platform gebruikt is functionele browseropslag (localStorage) voor
                    uw antwoorden in de blind test en eventuele redactionele sessiedata. Deze gegevens
                    verlaten nooit uw apparaat en worden niet gedeeld met derden.
                </p>
                <p>
                    Dit platform voldoet aan de Algemene Verordening Gegevensbescherming (AVG / GDPR)
                    doordat er geen persoonsgegevens worden verwerkt.
                </p>
            </section>

            <section className="legal-section">
                <h2>Correctiebeleid</h2>
                <p>
                    Blind Democracy hecht grote waarde aan feitelijke nauwkeurigheid. Als u een fout
                    constateert in een partijstandpunt, stemkoppeling, bewijsclaim of score, kunt u
                    dit melden via{" "}
                    <a href="mailto:correcties@blinddemocracy.nl">correcties@blinddemocracy.nl</a>.
                </p>
                <p>
                    Gemelde fouten worden zo snel mogelijk beoordeeld. Bij bevestigde onjuistheden
                    wordt de data gecorrigeerd en de wijziging gedocumenteerd. Politieke partijen,
                    journalisten en onderzoekers kunnen contact opnemen voor vragen over de methodologie
                    of specifieke datapunten.
                </p>
            </section>

            <section className="legal-section">
                <h2>Intellectueel eigendom</h2>
                <p>
                    De redactionele teksten, analyses, methodologie en vormgeving van Blind Democracy
                    zijn eigendom van Blind Democracy en vallen onder het auteursrecht. Geciteerde
                    passages uit verkiezingsprogramma's en parlementaire documenten vallen onder de
                    auteursrechten van de respectievelijke rechthebbenden en worden uitsluitend geciteerd
                    ter verantwoording en controleerbaarheid.
                </p>
            </section>

            <section className="legal-section">
                <h2>Contact en beheerder</h2>
                <p>
                    Blind Democracy wordt beheerd als onafhankelijk burgerinitiatief. Voor vragen,
                    correcties of samenwerking kunt u contact opnemen via{" "}
                    <a href="mailto:info@blinddemocracy.nl">info@blinddemocracy.nl</a>.
                </p>
                <p className="legal-updated">
                    Laatste update: mei 2026
                </p>
            </section>
        </main>
    );
}
