import logo from "../assets/logos/main-logo.svg";

export default function Footer({ setPage }) {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <strong>Blind Democracy</strong>
                    <p>Eerlijk kiezen op basis van wat politici écht doen.</p>
                    <p className="footer-trust">
                        Onafhankelijk • Geen politieke financiering • Geen advertenties
                    </p>
                </div>

                <div className="footer-columns">
                    <div>
                        <h3>Product</h3>
                        <button onClick={() => setPage("blind")}>Blind test</button>
                        <button onClick={() => setPage("onderwerpen")}>Onderwerpen</button>
                        <button onClick={() => setPage("partijen")}>Partijen</button>
                        <button onClick={() => setPage("kamerleden")}>Kamerleden</button>
                    </div>

                    <div>
                        <h3>Transparantie</h3>
                        <button onClick={() => setPage("methode")}>Methode</button>
                        <button type="button">Onafhankelijkheid</button>
                        <button type="button">Hoe wij geld verdienen</button>
                    </div>

                    <div>
                        <h3>Data & Bronnen</h3>
                        <button type="button">Bronnen</button>
                        <button type="button">Bewijsniveau uitleg</button>
                    </div>

                    <div>
                        <h3>Support</h3>
                        <button type="button">Doneer</button>
                        <button type="button">Word lid</button>
                    </div>
                </div>

                <div className="footer-logo">
                    <img src={logo} alt="Blind Democracy" />
                </div>
            </div>

            <div className="footer-bottom">
                <small>© {new Date().getFullYear()} Blind Democracy</small>
                <small>Gebouwd voor transparantie en eerlijkheid</small>
            </div>
        </footer>
    );
}