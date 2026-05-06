import logo from "../assets/logos/dark-mode-logo.svg";

export default function Footer({ setPage }) {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <strong>Blind Democracy</strong>
                    <p>Eerlijk kiezen op basis van wat politici echt doen.</p>
                    <p className="footer-trust">
                        Onafhankelijk - Geen politieke financiering - Geen advertenties
                    </p>
                </div>

                <div className="footer-columns">
                    <div>
                        <h3>Product</h3>
                        <button onClick={() => setPage("blind")}>Blind test</button>
                        <button onClick={() => setPage("onderwerpen")}>Onderwerpen</button>
                        <button onClick={() => setPage("betrouwbaarheid")}>Betrouwbaarheid</button>
                        <button onClick={() => setPage("leugens")}>Leugendetector</button>
                    </div>

                    <div>
                        <h3>Transparantie</h3>
                        <button onClick={() => setPage("methode")}>Methode</button>
                        <button onClick={() => setPage("juridisch")}>Disclaimer & Privacy</button>
                        <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Onafhankelijkheid</button>
                        <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Hoe wij geld verdienen</button>
                    </div>

                    <div>
                        <h3>Data & Bronnen</h3>
                        <button onClick={() => setPage("onderwerpen")}>Bronnen</button>
                        <button onClick={() => setPage("methode")}>Bewijsniveau uitleg</button>
                    </div>

                    <div>
                        <h3>Support</h3>
                        <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Doneer</button>
                        <button type="button" aria-disabled="true" title="Binnenkort beschikbaar">Word lid</button>
                    </div>
                </div>

                <div className="footer-logo">
                    <img src={logo} alt="Blind Democracy" />
                </div>
            </div>

            <div className="footer-bottom">
                <small>(c) {new Date().getFullYear()} Blind Democracy</small>
                <small>Gebouwd voor transparantie en eerlijkheid</small>
                <button className="footer-legal-link" onClick={() => setPage("juridisch")}>
                    Disclaimer & Privacy
                </button>
            </div>
        </footer>
    );
}