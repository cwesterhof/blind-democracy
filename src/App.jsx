import { useEffect, useMemo, useState } from "react";
import { buildMemberReliability, buildPartyReliability } from "./data/reliability.js";
import Footer from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LegalPage from "./pages/LegalPage";
import BlindTestPage from "./pages/BlindTestPage";
import LieDetectorPage from "./pages/LieDetectorPage";
import TopicsPage from "./pages/TopicsPage";
import AdminAccessPage from "./pages/AdminAccessPage";
import MethodPage from "./pages/MethodPage";
import EditorialHub from "./pages/EditorialHub";
import ReliabilityHub from "./pages/ReliabilityHub";
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
    const [page, setActivePage] = useState(pageFromLocation);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const partyReliability = useMemo(() => buildPartyReliability(), []);
    const memberReliability = useMemo(() => buildMemberReliability(), []);
    const visiblePages = PAGES.filter((item) => !item.adminOnly && !item.hidden || item.adminOnly && import.meta.env.DEV);

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
                        <strong>Blind <span>Democracy</span></strong>
                        <small>Eerlijk kiezen op basis van wat politici echt doen</small>
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
                    {mobileNavOpen
                        ? <span aria-hidden="true" style={{ fontSize: "20px" }}>?</span>
                        : <>
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                          </>
                    }
                </button>

                <div className="desktop-nav" id="primary-navigation">
                    {visiblePages.map((item) => (
                        <button
                            className={page === item.id ? "platform-tab active" : "platform-tab"}
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            type="button"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {mobileNavOpen && (
                    <>
                    <div className="mobile-menu-overlay" onClick={() => setMobileNavOpen(false)} />
                    <div className="mobile-menu-panel">
                        {visiblePages.map((item) => (
                            <button
                                className={page === item.id ? "platform-tab active" : "platform-tab"}
                                key={item.id}
                                onClick={() => setPage(item.id)}
                                type="button"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    </>
                )}
            </nav>

            {page === "blind" && <ErrorBoundary key="blind"><BlindTestPage setPage={setPage} partyReliability={partyReliability} mobileNavOpen={mobileNavOpen} /></ErrorBoundary>}
            {page === "onderwerpen" && <ErrorBoundary key="onderwerpen"><TopicsPage /></ErrorBoundary>}
            {page === "betrouwbaarheid" && <ErrorBoundary key="betrouwbaarheid"><ReliabilityHub memberReliability={memberReliability} partyReliability={partyReliability} /></ErrorBoundary>}
            {page === "leugens" && <ErrorBoundary key="leugens"><LieDetectorPage /></ErrorBoundary>}
            {page === "redactie" && (
                <ErrorBoundary key="redactie">
                    {import.meta.env.DEV ? <EditorialHub /> : <AdminAccessPage />}
                </ErrorBoundary>
            )}
            {page === "methode" && <ErrorBoundary key="methode"><MethodPage /></ErrorBoundary>}
            {page === "juridisch" && <ErrorBoundary key="juridisch"><LegalPage /></ErrorBoundary>}

            <Footer setPage={setPage} />
        </>
    );
}


export default App;
