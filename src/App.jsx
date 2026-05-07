import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Footer from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LanguageSwitcher from "./components/LanguageSwitcher";

import BlindTestPage from "./pages/BlindTestPage";
import EditorialHub from "./pages/EditorialHub";
import EditorialLoginPage from "./pages/EditorialLoginPage";
import LegalPage from "./pages/LegalPage";
import LieDetectorPage from "./pages/LieDetectorPage";
import MethodPage from "./pages/MethodPage";
import ReliabilityHub from "./pages/ReliabilityHub";
import TopicsPage from "./pages/TopicsPage";

import { buildMemberReliability, buildPartyReliability } from "./data/reliability.js";

import navLogo from "/favicon.svg";
import "./App.css";

const PAGES = [
    { id: "blind", label: "Blind test" },
    { id: "onderwerpen", label: "Onderwerpen" },
    { id: "betrouwbaarheid", label: "Betrouwbaarheid" },
    { id: "leugens", label: "Leugendetector" },
    { id: "redactie", label: "Redactie", adminOnly: true },
    { id: "methode", label: "Methode" },
    { id: "juridisch", label: "Juridisch", hidden: true }
];

const DEFAULT_PAGE = "blind";

function normalizePageId(pageId) {
    return PAGES.some((page) => page.id === pageId) ? pageId : DEFAULT_PAGE;
}

function pageFromLocation() {
    return normalizePageId(window.location.hash.replace("#", "") || DEFAULT_PAGE);
}

function App() {
    const { t, i18n } = useTranslation();
    const [page, setActivePage] = useState(pageFromLocation);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [editorialUnlocked, setEditorialUnlocked] = useState(() => {
        try {
            return sessionStorage.getItem("blind-democracy.editorial-session") !== null;
        } catch {
            return false;
        }
    });

    const partyReliability = useMemo(() => buildPartyReliability(), []);
    const memberReliability = useMemo(() => buildMemberReliability(), []);

    const visiblePages = PAGES.filter((item) => {
        if (item.hidden) return false;
        if (item.adminOnly) return import.meta.env.DEV;
        return true;
    });

    useEffect(() => {
        function syncPageFromHash() {
            setActivePage(pageFromLocation());
        }

        window.addEventListener("hashchange", syncPageFromHash);
        window.addEventListener("popstate", syncPageFromHash);

        return () => {
            window.removeEventListener("hashchange", syncPageFromHash);
            window.removeEventListener("popstate", syncPageFromHash);
        };
    }, []);

    useEffect(() => {
        document.documentElement.lang = i18n.language === "en" ? "en" : "nl";
    }, [i18n.language]);

    useEffect(() => {
        const pageTitles = {
            blind: t("nav.blind"),
            onderwerpen: t("nav.onderwerpen"),
            betrouwbaarheid: t("nav.betrouwbaarheid"),
            leugens: t("nav.leugens"),
            methode: t("nav.methode"),
            juridisch: t("nav.juridisch"),
        };
        const pageTitle = pageTitles[page] ?? t("nav.blind");
        document.title = `${pageTitle} — Blind Democracy`;
    }, [page, i18n.language, t]);

    function setPage(nextPage) {
        const normalizedPage = normalizePageId(nextPage);
        setActivePage(normalizedPage);
        setMobileNavOpen(false);

        const nextHash = `#${normalizedPage}`;
        if (window.location.hash !== nextHash) {
            window.history.pushState(null, "", nextHash);
        }
    }

    return (
        <>
            <nav className="platform-nav" aria-label="Blind Democracy pagina's">
                <button className="brand-mark" onClick={() => setPage("blind")} type="button">
                    <img className="brand-icon" alt="Blind Democracy" src={navLogo} />

                    <div className="brand-text">
                        <strong>
                            Blind <span>Democracy</span>
                        </strong>
                        <small>{t("brand.tagline")}</small>
                    </div>
                </button>

                <button
                    aria-controls="primary-navigation"
                    aria-expanded={mobileNavOpen}
                    aria-label={mobileNavOpen ? "Sluit menu" : "Open menu"}
                    className="mobile-menu-toggle"
                    onClick={() => setMobileNavOpen((current) => !current)}
                    type="button"
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>

                <div className="desktop-nav" id="primary-navigation">
                    {visiblePages.map((item) => (
                        <button
                            className={page === item.id ? "platform-tab active" : "platform-tab"}
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            type="button"
                        >
                            {t(`nav.${item.id}`)}
                        </button>
                    ))}
                    <LanguageSwitcher />
                </div>

                {mobileNavOpen && (
                    <>
                        <div className="mobile-menu-overlay" onClick={() => setMobileNavOpen(false)} />

                        <div className="mobile-menu-panel">
                            <div className="mobile-menu-links">
                                {visiblePages.map((item) => (
                                    <button
                                        className={page === item.id ? "mobile-menu-item active" : "mobile-menu-item"}
                                        key={item.id}
                                        onClick={() => {
                                            setPage(item.id);
                                            setMobileNavOpen(false);
                                        }}
                                        type="button"
                                        aria-label={`Ga naar ${t(`nav.${item.id}`)}`}
                                    >
                                        {t(`nav.${item.id}`)}
                                    </button>
                                ))}
                            </div>

                            <div className="mobile-menu-language">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {page === "blind" && (
                <ErrorBoundary key="blind">
                    <BlindTestPage setPage={setPage} partyReliability={partyReliability} mobileNavOpen={mobileNavOpen} />
                </ErrorBoundary>
            )}

            {page === "onderwerpen" && (
                <ErrorBoundary key="onderwerpen">
                    <TopicsPage />
                </ErrorBoundary>
            )}

            {page === "betrouwbaarheid" && (
                <ErrorBoundary key="betrouwbaarheid">
                    <ReliabilityHub memberReliability={memberReliability} partyReliability={partyReliability} />
                </ErrorBoundary>
            )}

            {page === "leugens" && (
                <ErrorBoundary key="leugens">
                    <LieDetectorPage />
                </ErrorBoundary>
            )}

            {page === "redactie" && (
                import.meta.env.DEV || editorialUnlocked
                    ? <ErrorBoundary key="redactie"><EditorialHub /></ErrorBoundary>
                    : <EditorialLoginPage onUnlock={() => setEditorialUnlocked(true)} />
            )}

            {page === "methode" && (
                <ErrorBoundary key="methode">
                    <MethodPage />
                </ErrorBoundary>
            )}

            {page === "juridisch" && (
                <ErrorBoundary key="juridisch">
                    <LegalPage />
                </ErrorBoundary>
            )}

            <Footer setPage={setPage} />
        </>
    );
}

export default App;