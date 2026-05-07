import { useTranslation } from "react-i18next";
import logo from "../assets/logos/dark-mode-logo.svg";

export default function Footer({ setPage }) {
    const { t } = useTranslation();

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <strong>Blind Democracy</strong>
                    <p>{t("footer.tagline")}</p>
                    <p className="footer-trust">{t("footer.independent")}</p>
                </div>

                <div className="footer-columns">
                    <div>
                        <h3>{t("footer.product")}</h3>
                        <button onClick={() => setPage("blind")}>{t("nav.blind")}</button>
                        <button onClick={() => setPage("onderwerpen")}>{t("nav.onderwerpen")}</button>
                        <button onClick={() => setPage("betrouwbaarheid")}>{t("nav.betrouwbaarheid")}</button>
                        <button onClick={() => setPage("leugens")}>{t("nav.leugens")}</button>
                    </div>

                    <div>
                        <h3>{t("footer.transparency")}</h3>
                        <button onClick={() => setPage("methode")}>{t("nav.methode")}</button>
                        <button onClick={() => setPage("juridisch")}>{t("footer.legal")}</button>
                        <button type="button" aria-disabled="true" title={t("footer.soon")}>{t("footer.independence")}</button>
                        <button type="button" aria-disabled="true" title={t("footer.soon")}>{t("footer.revenue")}</button>
                    </div>

                    <div>
                        <h3>{t("footer.data")}</h3>
                        <button onClick={() => setPage("onderwerpen")}>{t("footer.sources")}</button>
                        <button onClick={() => setPage("methode")}>{t("footer.evidenceExplained")}</button>
                    </div>

                    <div>
                        <h3>{t("footer.support")}</h3>
                        <button type="button" aria-disabled="true" title={t("footer.soon")}>{t("footer.donate")}</button>
                        <button type="button" aria-disabled="true" title={t("footer.soon")}>{t("footer.member")}</button>
                    </div>
                </div>

                <div className="footer-logo">
                    <img src={logo} alt="Blind Democracy" />
                </div>
            </div>

            <div className="footer-bottom">
                <small>(c) {new Date().getFullYear()} Blind Democracy</small>
                <small>{t("footer.built")}</small>
                <button className="footer-legal-link" onClick={() => setPage("juridisch")}>
                    {t("footer.legal")}
                </button>
            </div>
        </footer>
    );
}