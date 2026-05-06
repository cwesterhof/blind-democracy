# Legal Page Implementation

Complete instructions for Claude Code. Implement all steps in order.

---

## Step 1 — Create `src/pages/LegalPage.jsx`

Create a new file `src/pages/LegalPage.jsx` with the following exact content:

```jsx
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
```

---

## Step 2 — Add CSS to `src/App.css`

Append the following CSS to the end of `src/App.css`:

```css
.legal-page .page-heading {
    margin-bottom: 2.5rem;
}

.legal-section {
    max-width: 740px;
    margin-bottom: 2.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--line);
}

.legal-section:last-child {
    border-bottom: none;
}

.legal-section h2 {
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 600;
    color: var(--trust);
    margin-bottom: 1rem;
}

.legal-section p {
    color: var(--text);
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 0.85rem;
}

.legal-section p:last-child {
    margin-bottom: 0;
}

.legal-section a {
    color: var(--trust);
    text-decoration: underline;
}

.legal-section a:hover {
    color: var(--accent);
}

.legal-list {
    margin: 0.75rem 0 0.85rem 1.25rem;
    padding: 0;
}

.legal-list li {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text);
    margin-bottom: 0.5rem;
}

.legal-list li strong {
    color: var(--trust);
}

.legal-updated {
    font-size: 13px;
    color: var(--muted);
    margin-top: 1rem;
}
```

---

## Step 3 — Register the page in `src/App.jsx`

### 3a — Add import at the top of `App.jsx`

Add this import with the other page/component imports:

```js
import LegalPage from "./pages/LegalPage";
```

### 3b — Add to the PAGES array

Find the `PAGES` array in `App.jsx`:

```js
const PAGES = [
    { id: "blind", label: "Blind test" },
    { id: "onderwerpen", label: "Onderwerpen" },
    { id: "betrouwbaarheid", label: "Betrouwbaarheid" },
    { id: "leugens", label: "Leugendetector" },
    { id: "redactie", label: "Redactie", adminOnly: true },
    { id: "methode", label: "Methode" }
];
```

Add the legal page entry — it should NOT appear in the main nav, so add `navOnly: false` or simply add it outside the nav. The cleanest approach: add it to PAGES with a `hidden: true` flag:

```js
const PAGES = [
    { id: "blind", label: "Blind test" },
    { id: "onderwerpen", label: "Onderwerpen" },
    { id: "betrouwbaarheid", label: "Betrouwbaarheid" },
    { id: "leugens", label: "Leugendetector" },
    { id: "redactie", label: "Redactie", adminOnly: true },
    { id: "methode", label: "Methode" },
    { id: "juridisch", label: "Juridisch", hidden: true }
];
```

### 3c — Update visiblePages filter to exclude hidden pages from nav

Find:

```js
const visiblePages = PAGES.filter((item) => !item.adminOnly || import.meta.env.DEV);
```

Replace with:

```js
const visiblePages = PAGES.filter((item) => !item.adminOnly && !item.hidden || item.adminOnly && import.meta.env.DEV);
```

### 3d — Add the page render

Find the block where pages are rendered (the series of `{page === "..." && ...}` lines) and add:

```jsx
{page === "juridisch" && <ErrorBoundary key="juridisch"><LegalPage /></ErrorBoundary>}
```

---

## Step 4 — Add link in `src/components/Footer.jsx`

Find the Transparantie column in `Footer.jsx`:

```jsx
<div>
    <h3>Transparantie</h3>
    <button onClick={() => setPage("methode")}>Methode</button>
    <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Onafhankelijkheid</button>
    <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Hoe wij geld verdienen</button>
</div>
```

Replace with:

```jsx
<div>
    <h3>Transparantie</h3>
    <button onClick={() => setPage("methode")}>Methode</button>
    <button onClick={() => setPage("juridisch")}>Disclaimer & Privacy</button>
    <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Onafhankelijkheid</button>
    <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Hoe wij geld verdienen</button>
</div>
```

Also add a link in the footer bottom bar. Find:

```jsx
<div className="footer-bottom">
    <small>(c) {new Date().getFullYear()} Blind Democracy</small>
    <small>Gebouwd voor transparantie en eerlijkheid</small>
</div>
```

Replace with:

```jsx
<div className="footer-bottom">
    <small>(c) {new Date().getFullYear()} Blind Democracy</small>
    <small>Gebouwd voor transparantie en eerlijkheid</small>
    <button className="footer-legal-link" onClick={() => setPage("juridisch")}>
        Disclaimer & Privacy
    </button>
</div>
```

And add this CSS to the end of `src/App.css`:

```css
.footer-legal-link {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
}

.footer-legal-link:hover {
    color: var(--accent);
}
```

---

## Step 5 — Before handing to Claude Code

Update two placeholder values in `LegalPage.jsx` to match your actual details:

1. Replace `correcties@blinddemocracy.nl` with your real corrections email
2. Replace `info@blinddemocracy.nl` with your real contact email

If you don't have a domain email yet, use a Gmail or temporary address — just make sure it's monitored.

---

## Verification checklist after implementation

- [ ] `/juridisch` route renders the legal page
- [ ] Footer "Disclaimer & Privacy" button navigates to it
- [ ] Footer bottom bar link works
- [ ] Legal page does not appear in the top navigation
- [ ] Page renders cleanly on mobile
- [ ] Both email links open a mail client
- [ ] Error boundary wraps the page correctly
