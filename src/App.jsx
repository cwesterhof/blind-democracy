import { useMemo, useState } from "react";
import { DOSSIERS, EVIDENCE_LEVELS } from "./data/dossiers";
import { DOSSIER_STATUSES, SOURCE_REGISTRY } from "./data/sources";
import importedTweedeKamer from "./data/importedTweedeKamer.json";
import { RELIABILITY_DIMENSIONS, buildMemberReliability, buildPartyReliability } from "./data/reliability.js";
import { POSITION_CONFIDENCE, PARTY_POSITIONS, getPositionsForDossier } from "./data/partyPositions.js";
import { CANDIDATE_POSITIONS, CANDIDATE_STATUSES } from "./data/candidatePositions.js";
import reviewedPositionImports from "./data/reviewedPositionImports.json";
import { PROMISE_CHECKS, PROMISE_VERDICTS } from "./data/promiseChecks";
import "./App.css";

const DATA_TABS = [
    { id: "stemgedrag", label: "Stemgedrag" },
    { id: "bewijs", label: "Bewijsniveau" },
    { id: "impact", label: "Impact" },
    { id: "bronnen", label: "Bronnen" }
];

function BlindTestPage() {
    const [activeDossierId, setActiveDossierId] = useState(DOSSIERS[0].id);
    const [answers, setAnswers] = useState({});
    const [resultsRevealed, setResultsRevealed] = useState(false);
    const [activeDataTab, setActiveDataTab] = useState(DATA_TABS[0].id);

    const sourcesById = Object.fromEntries(Object.values(SOURCE_REGISTRY).map((source) => [source.id, source]));
    const importedByDossier = Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));

    const activeDossier = useMemo(
        () => DOSSIERS.find((dossier) => dossier.id === activeDossierId) ?? DOSSIERS[0],
        [activeDossierId]
    );
    const activePositions = useMemo(() => getPositionsForDossier(activeDossier.id), [activeDossier.id]);

    const selectedPositionId = answers[activeDossier.id] ?? null;
    const selectedPosition = activePositions.find((position) => position.id === selectedPositionId);
    const revealed = resultsRevealed;
    const completedCount = DOSSIERS.filter((dossier) => answers[dossier.id]).length;
    const allChosen = completedCount === DOSSIERS.length;
    const results = calculateResults(answers, resultsRevealed);
    const chosenPositions = getChosenPositions(answers, resultsRevealed);
    const remainingCount = DOSSIERS.length - completedCount;

    function chooseDossier(dossierId) {
        setActiveDossierId(dossierId);
        setActiveDataTab(DATA_TABS[0].id);
    }

    function choosePosition(positionId) {
        setAnswers((current) => ({
            ...current,
            [activeDossier.id]: positionId
        }));
        setResultsRevealed(false);
        setActiveDataTab(DATA_TABS[0].id);
    }

    function revealResults() {
        if (allChosen) {
            setResultsRevealed(true);
        }
    }

    function resetActiveChoice() {
        setAnswers((current) => {
            const next = { ...current };
            delete next[activeDossier.id];
            return next;
        });
        setResultsRevealed(false);
        setActiveDataTab(DATA_TABS[0].id);
    }

    function goToNextDossier() {
        const currentIndex = DOSSIERS.findIndex((dossier) => dossier.id === activeDossier.id);
        const next = DOSSIERS[currentIndex + 1] ?? DOSSIERS[0];
        chooseDossier(next.id);
    }

    return (
        <>
            <header className="hero-band compact-hero">
                <div className="hero-content">
                    <p className="eyebrow">Blind Democracy</p>
                    <h1>Kies eerst het beleid. Zie daarna pas de partij.</h1>
                </div>
            </header>

            <main className="product-shell test-shell">
                <aside className="dossier-nav progress-sidebar" aria-label="Voortgang blind test">
                    <div className="nav-heading">
                        <span>01</span>
                        <h2>Blind test</h2>
                    </div>

                    <div className="progress-card">
                        <strong>{completedCount}/{DOSSIERS.length} gekozen</strong>
                        <div className="progress-track" aria-hidden="true">
                            <div style={{ width: `${(completedCount / DOSSIERS.length) * 100}%` }} />
                        </div>
                        <small>Partijen blijven verborgen tot je onthult.</small>
                    </div>

                    <div className="dossier-list flow-list">
                        {DOSSIERS.map((dossier, index) => (
                            <button
                                className={activeDossier.id === dossier.id ? "dossier-button active" : "dossier-button"}
                                key={dossier.id}
                                onClick={() => chooseDossier(dossier.id)}
                                type="button"
                            >
                                <span className="flow-index">{index + 1}</span>
                                <span>
                                    <strong>{dossier.title}</strong>
                                    <small>{statusLabel(dossier.id, answers, resultsRevealed)}</small>
                                </span>
                            </button>
                        ))}
                    </div>

                    {resultsRevealed && <Scoreboard results={results} />}
                </aside>

                <section className="match-workspace focus-workspace">
                    {!resultsRevealed && (
                        <div className="workspace-header blind-header">
                            <div>
                                <p className="eyebrow">Blind kiezen</p>
                                <h2>{activeDossier.title}</h2>
                                <p>{activeDossier.context}</p>
                            </div>
                            <div className="step-pill">
                                Partijen verborgen
                            </div>
                        </div>
                    )}

                    {!resultsRevealed && (
                        <div className={selectedPositionId ? "position-grid has-selection" : "position-grid"}>
                        {activePositions.map((position, index) => (
                            <button
                                className={cardClass(position.id, selectedPositionId, revealed)}
                                key={position.id}
                                onClick={() => choosePosition(position.id)}
                                type="button"
                            >
                                <span className="anonymous-label">Standpunt {index + 1}</span>
                                <strong className="position-statement">{position.statement}</strong>
                                <p>{position.explanation}</p>
                                <span className="blind-source-hint">{revealed ? position.party : POSITION_CONFIDENCE[position.confidence]}</span>
                            </button>
                        ))}
                        </div>
                    )}

                    <div className="action-row reveal-actions">
                        <button
                            className="primary-action reveal-action"
                            disabled={!allChosen || resultsRevealed}
                            onClick={revealResults}
                            type="button"
                        >
                            {resultsRevealed ? "Resultaten onthuld" : allChosen ? "Onthul resultaten" : `Nog ${remainingCount} te kiezen`}
                        </button>
                        <button
                            className="secondary-action"
                            disabled={!selectedPositionId}
                            onClick={resetActiveChoice}
                            type="button"
                        >
                            Opnieuw kiezen
                        </button>
                        {!allChosen && (
                            <button className="secondary-action" onClick={goToNextDossier} type="button">
                                Volgende dossier
                            </button>
                        )}
                    </div>

                    <RevealPanel allChosen={allChosen} position={selectedPosition} resultsRevealed={resultsRevealed} />

                    {resultsRevealed && <ChosenPositionsSummary positions={chosenPositions} />}

                    {resultsRevealed && (
                        <DataTabs
                            activeTab={activeDataTab}
                            dossier={activeDossier}
                            selectedPosition={selectedPosition}
                            importedDossier={importedByDossier[activeDossier.id]}
                            setActiveTab={setActiveDataTab}
                            sourcesById={sourcesById}
                        />
                    )}
                </section>
            </main>
        </>
    );
}

function Scoreboard({ results }) {
    if (results.length === 0) return null;

    return (
        <section className="score-card">
            <h3>Richting na reveal</h3>
            <div className="score-list">
                {results.map((result) => (
                    <div className="score-row" key={result.party}>
                        <div>
                            <strong>{result.party}</strong>
                            <small>{result.count} keuze{result.count > 1 ? "s" : ""}</small>
                        </div>
                        <span>{result.percentage}%</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

function RevealPanel({ allChosen, position, resultsRevealed }) {
    if (!position) {
        return (
            <section className="reveal-panel quiet slim-reveal">
                <h3>Kies het standpunt dat het meest bij je past.</h3>
                <p>Geen partijnaam, geen kleur, geen gezicht. Alleen inhoud.</p>
            </section>
        );
    }

    if (!resultsRevealed) {
        return (
            <section className="reveal-panel waiting slim-reveal">
                <h3>Keuze opgeslagen</h3>
                <p>{allChosen ? "Alle keuzes zijn vastgelegd. Je kunt nu de resultaten onthullen." : "Je keuze is opgeslagen. Ga door zonder partij-informatie."}</p>
            </section>
        );
    }

    return (
        <section className="reveal-summary">
            <div>
                <p className="eyebrow">Je koos blind</p>
                <strong>{position.party}</strong>
            </div>
            <span>{position.explanation}</span>
        </section>
    );
}

function ChosenPositionsSummary({ positions }) {
    if (positions.length === 0) return null;

    return (
        <section className="chosen-summary">
            <div className="chosen-summary-heading">
                <div>
                    <p className="eyebrow">Resultaat</p>
                    <h3>Jouw gekozen dossierstandpunten</h3>
                </div>
                <span>{positions.length} gekozen</span>
            </div>

            <div className="chosen-position-grid">
                {positions.map(({ dossier, position }) => (
                    <article className="chosen-position-card" key={position.id}>
                        <span>{dossier.title}</span>
                        <h4>{position.party}</h4>
                        <strong>{position.statement}</strong>
                        <p>{position.explanation}</p>
                        <div className="source-status-row">
                            <em>{POSITION_CONFIDENCE[position.confidence] ?? position.confidence}</em>
                            <small>{position.reviewedByHuman ? "Menselijk gereviewd" : "Review open"}</small>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
function DataTabs({ activeTab, dossier, importedDossier, selectedPosition, setActiveTab, sourcesById }) {
    return (
        <section className="data-tabs-panel">
            <div className="tab-list" role="tablist" aria-label="Dossierdata">
                {DATA_TABS.map((tab) => (
                    <button
                        className={activeTab === tab.id ? "tab-button active" : "tab-button"}
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === "stemgedrag" && <ImportedKamerData importedDossier={importedDossier} />}
                {activeTab === "bewijs" && <EvidenceData dossier={dossier} sourcesById={sourcesById} />}
                {activeTab === "impact" && <ImpactData dossier={dossier} />}
                {activeTab === "bronnen" && <DossierSources dossier={dossier} selectedPosition={selectedPosition} sourcesById={sourcesById} />}
            </div>
        </section>
    );
}

function EvidenceData({ dossier, sourcesById }) {
    return (
        <section className="info-panel evidence-panel tab-inner-panel">
            <div className="panel-title">
                <span>02</span>
                <h3>Bewijsniveau</h3>
            </div>
            <div className="evidence-list">
                {dossier.evidence.map((item) => (
                    <article className="evidence-item" key={`${item.level}-${item.claim}`}>
                        <strong>{item.level}</strong>
                        <p>{item.claim}</p>
                        <small>{EVIDENCE_LEVELS[item.level]}</small>
                        <SourceChips sourceIds={item.sourceIds} sourcesById={sourcesById} />
                        <em>{item.reviewStatus}</em>
                    </article>
                ))}
            </div>
        </section>
    );
}

function ImpactData({ dossier }) {
    return (
        <section className="info-panel impact-panel tab-inner-panel">
            <div className="panel-title">
                <span>04</span>
                <h3>Impact</h3>
            </div>
            <dl className="impact-list">
                <div>
                    <dt>Wie wint</dt>
                    <dd>{dossier.impact.winners}</dd>
                </div>
                <div>
                    <dt>Wie verliest</dt>
                    <dd>{dossier.impact.losers}</dd>
                </div>
                <div>
                    <dt>EU-koppeling</dt>
                    <dd>{dossier.impact.eu}</dd>
                </div>
            </dl>
        </section>
    );
}

function ImportedKamerData({ importedDossier }) {
    if (!importedDossier) return null;

    const voteableCount = importedDossier.zaken.filter((zaak) => zaak.voteSummary.totalVotes > 0).length;

    return (
        <section className="kamer-panel tab-inner-panel">
            <div className="kamer-heading">
                <div>
                    <p className="eyebrow">Tweede Kamer Open Data</p>
                    <h3>Gevonden Kamerzaken</h3>
                    <p>
                        Automatisch opgehaald op {formatDate(importedDossier.importedAt)} met trefwoorden: {importedDossier.searchTerms.join(", ")}.
                    </p>
                </div>
                <span>{voteableCount}/{importedDossier.zaken.length} met stemdata</span>
            </div>

            <div className="kamer-list">
                {importedDossier.zaken.slice(0, 6).map((zaak) => (
                    <article className={zaak.voteSummary.totalVotes > 0 ? "kamer-item has-votes" : "kamer-item"} key={zaak.id}>
                        <a href={zaak.sourceUrl} rel="noreferrer" target="_blank">
                            <span>{zaak.type}</span>
                            <strong>{zaak.title}</strong>
                            <small>{zaak.number} · {zaak.parliamentaryYear} · match: {zaak.matchedTerms?.join(", ") ?? zaak.matchedTerm}</small>
                        </a>
                        <VoteSummary zaak={zaak} />
                    </article>
                ))}
            </div>
        </section>
    );
}

function VoteSummary({ zaak }) {
    if (!zaak.voteSummary?.totalVotes) {
        return <p className="no-votes">Geen fractiestemming gevonden in deze zaak.</p>;
    }

    const visibleParties = zaak.voteSummary.parties.slice(0, 8);

    return (
        <div className="vote-summary">
            <div className="vote-totals">
                {Object.entries(zaak.voteSummary.byVote).map(([vote, seats]) => (
                    <span className={vote === "Voor" ? "vote-for" : "vote-against"} key={vote}>
                        {vote}: {seats} zetels
                    </span>
                ))}
            </div>
            <div className="party-votes">
                {visibleParties.map((item) => (
                    <span className={item.vote === "Voor" ? "vote-for" : "vote-against"} key={`${item.party}-${item.vote}`}>
                        {item.party}: {item.vote}
                    </span>
                ))}
            </div>
        </div>
    );
}

function DossierSources({ dossier, selectedPosition, sourcesById }) {
    const sources = dossier.sourceIds.map((sourceId) => sourcesById[sourceId]).filter(Boolean);

    return (
        <section className="source-panel tab-inner-panel">
            <div className="source-summary">
                <div>
                    <p className="eyebrow">Datastatus</p>
                    <h3>{DOSSIER_STATUSES[dossier.status] ?? dossier.status}</h3>
                    <p>{dossier.sourceStrategy}</p>
                </div>
                <span>Laatst bijgewerkt: {formatDate(dossier.lastUpdated)}</span>
            </div>

            {selectedPosition && <PositionSource position={selectedPosition} />}

            <div className="source-list">
                {sources.map((source) => (
                    <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                        <strong>{source.name}</strong>
                        <small>{source.type}</small>
                    </a>
                ))}
            </div>
        </section>
    );
}

function PositionSource({ position }) {
    return (
        <article className="position-source-card">
            <div>
                <p className="eyebrow">Gekozen standpunt</p>
                <h3>{position.party}</h3>
                <p>{position.statement}</p>
            </div>
            <dl>
                <div>
                    <dt>Bron</dt>
                    <dd><a href={position.source.url} rel="noreferrer" target="_blank">{position.source.title}</a></dd>
                </div>
                <div>
                    <dt>Confidence</dt>
                    <dd>{POSITION_CONFIDENCE[position.confidence] ?? position.confidence}</dd>
                </div>
                <div>
                    <dt>Reviewstatus</dt>
                    <dd>{position.reviewStatus}</dd>
                </div>
                <div>
                    <dt>Citaat</dt>
                    <dd>{position.source.quote ?? "Nog geen exact citaat gekoppeld"}</dd>
                </div>
            </dl>
        </article>
    );
}
function SourceChips({ sourceIds = [], sourcesById }) {
    return (
        <div className="source-chips">
            {sourceIds.map((sourceId) => {
                const source = sourcesById[sourceId];
                if (!source) return null;
                return <span key={sourceId}>{source.name}</span>;
            })}
        </div>
    );
}

function cardClass(positionId, selectedPositionId, revealed) {
    const classes = ["blind-card"];

    if (selectedPositionId === positionId) classes.push("selected");
    if (selectedPositionId && selectedPositionId !== positionId) classes.push("dimmed");
    if (revealed) classes.push("revealed-card");

    return classes.join(" ");
}

function statusLabel(dossierId, answers, resultsRevealed) {
    if (resultsRevealed && answers[dossierId]) return "Onthuld";
    if (answers[dossierId]) return "Gekozen";
    return "Nog open";
}

function formatDate(dateValue) {
    return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(dateValue));
}

function getChosenPositions(answers, resultsRevealed) {
    if (!resultsRevealed) return [];

    return DOSSIERS.map((dossier) => ({
        dossier,
        position: PARTY_POSITIONS.find((position) => position.id === answers[dossier.id])
    })).filter((item) => item.position);
}
function calculateResults(answers, resultsRevealed) {
    const counts = DOSSIERS.reduce((acc, dossier) => {
        if (!resultsRevealed) return acc;

        const position = PARTY_POSITIONS.find((item) => item.id === answers[dossier.id]);

        if (position) {
            acc[position.party] = (acc[position.party] ?? 0) + 1;
        }

        return acc;
    }, {});

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (total === 0) return [];

    return Object.entries(counts)
        .map(([party, count]) => ({
            party,
            count,
            percentage: Math.round((count / total) * 100)
        }))
        .sort((a, b) => b.count - a.count || a.party.localeCompare(b.party, "nl"));
}







const PAGES = [
    { id: "blind", label: "Blind test" },
    { id: "onderwerpen", label: "Onderwerpen" },
    { id: "partijen", label: "Partijen" },
    { id: "kamerleden", label: "Kamerleden" },
    { id: "leugens", label: "Leugendetector" },
    { id: "review", label: "Review" },
    { id: "methode", label: "Methode" }
];

function App() {
    const [page, setPage] = useState("blind");
    const partyReliability = useMemo(() => buildPartyReliability(), []);
    const memberReliability = useMemo(() => buildMemberReliability(), []);

    return (
        <>
            <nav className="platform-nav" aria-label="Blind Democracy pagina's">
                <button className="brand-mark" onClick={() => setPage("blind")} type="button">
                    <img alt="Blind Democracy" src="/logo.png" />
                    <span>
                        <strong>Blind Democracy</strong>
                        <small>Truth. Transparency. Trust.</small>
                    </span>
                </button>
                <div>
                    {PAGES.map((item) => (
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
            </nav>

            {page === "blind" && <BlindTestPage />}
            {page === "onderwerpen" && <TopicsPage />}
            {page === "partijen" && <ReliabilityPage items={partyReliability} title="Betrouwbaarheid per partij" type="party" />}
            {page === "kamerleden" && <ReliabilityPage items={memberReliability} title="Betrouwbaarheid per Kamerlid" type="member" />}
            {page === "leugens" && <LieDetectorPage />}
            {page === "review" && <PositionReviewPage />}
            {page === "methode" && <MethodPage />}
        </>
    );
}

function TopicsPage() {
    const [selectedDossierId, setSelectedDossierId] = useState(DOSSIERS[0].id);
    const [activeTab, setActiveTab] = useState("standpunten");
    const sourcesById = Object.fromEntries(Object.values(SOURCE_REGISTRY).map((source) => [source.id, source]));
    const importedByDossier = Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));
    const selectedDossier = DOSSIERS.find((dossier) => dossier.id === selectedDossierId) ?? DOSSIERS[0];
    const positions = getPositionsForDossier(selectedDossier.id);
    const importedDossier = importedByDossier[selectedDossier.id];
    const voteableCount = importedDossier?.zaken.filter((zaak) => zaak.voteSummary.totalVotes > 0).length ?? 0;

    function selectDossier(dossierId) {
        setSelectedDossierId(dossierId);
        setActiveTab("standpunten");
    }

    return (
        <main className="topics-page">
            <header className="page-heading topics-heading">
                <p className="eyebrow">Onderwerpen</p>
                <h1>Open een dossier en bekijk de onderliggende data.</h1>
                <p>
                    Elk onderwerp brengt partijstandpunten, Tweede Kamer-stemdata, bewijsclaims, impact en bronnen bij elkaar.
                </p>
            </header>

            <section className="topics-layout">
                <aside className="topic-card-list" aria-label="Onderwerpen">
                    {DOSSIERS.map((dossier) => {
                        const dossierPositions = getPositionsForDossier(dossier.id);
                        const imported = importedByDossier[dossier.id];
                        const votes = imported?.zaken.filter((zaak) => zaak.voteSummary.totalVotes > 0).length ?? 0;

                        return (
                            <button
                                className={selectedDossier.id === dossier.id ? "topic-card active" : "topic-card"}
                                key={dossier.id}
                                onClick={() => selectDossier(dossier.id)}
                                type="button"
                            >
                                <strong>{dossier.title}</strong>
                                <p>{dossier.summary}</p>
                                <span>{dossierPositions.length} standpunten · {votes} stemzaken</span>
                            </button>
                        );
                    })}
                </aside>

                <section className="topic-detail">
                    <div className="topic-detail-header">
                        <div>
                            <p className="eyebrow">Dossier</p>
                            <h2>{selectedDossier.title}</h2>
                            <p>{selectedDossier.context}</p>
                        </div>
                        <div className="topic-stats">
                            <span>{positions.length} standpunten</span>
                            <span>{voteableCount} stemzaken</span>
                            <span>{selectedDossier.evidence.length} claims</span>
                        </div>
                    </div>

                    <div className="tab-list topic-tabs" role="tablist" aria-label="Dossierdetails">
                        {[
                            ["standpunten", "Standpunten"],
                            ["stemgedrag", "Stemgedrag"],
                            ["bewijs", "Bewijsniveau"],
                            ["impact", "Impact"],
                            ["bronnen", "Bronnen"]
                        ].map(([id, label]) => (
                            <button
                                className={activeTab === id ? "tab-button active" : "tab-button"}
                                key={id}
                                onClick={() => setActiveTab(id)}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "standpunten" && <TopicPositions positions={positions} />}
                    {activeTab === "stemgedrag" && <ImportedKamerData importedDossier={importedDossier} />}
                    {activeTab === "bewijs" && <EvidenceData dossier={selectedDossier} sourcesById={sourcesById} />}
                    {activeTab === "impact" && <ImpactData dossier={selectedDossier} />}
                    {activeTab === "bronnen" && <DossierSources dossier={selectedDossier} sourcesById={sourcesById} />}
                </section>
            </section>
        </main>
    );
}

function TopicPositions({ positions }) {
    return (
        <section className="topic-positions-grid">
            {positions.map((position) => (
                <article className="topic-position-card" key={position.id}>
                    <div className="topic-position-topline">
                        <div>
                            <p className="eyebrow">{position.party}</p>
                            <h3>{position.statement}</h3>
                        </div>
                        <span>{POSITION_CONFIDENCE[position.confidence] ?? position.confidence}</span>
                    </div>
                    <p>{position.explanation}</p>
                    <dl>
                        <div>
                            <dt>Bron</dt>
                            <dd><a href={position.source.url} rel="noreferrer" target="_blank">{position.source.title}</a></dd>
                        </div>
                        <div>
                            <dt>Review</dt>
                            <dd>{position.reviewStatus}</dd>
                        </div>
                    </dl>
                </article>
            ))}
        </section>
    );
}
function ReliabilityPage({ items, title, type }) {
    return (
        <main className="reliability-page">
            <header className="page-heading">
                <p className="eyebrow">Betrouwbaarheidsmeter</p>
                <h1>{title}</h1>
                <p>
                    Scores tonen alleen wat nu meetbaar is. Ontbrekende onderdelen blijven zichtbaar als open meetpunt,
                    zodat de meter niet meer zekerheid suggereert dan de data toelaat.
                </p>
            </header>

            <section className="metric-legend">
                {RELIABILITY_DIMENSIONS.map((dimension) => (
                    <article key={dimension.id}>
                        <strong>{dimension.label}</strong>
                        <p>{dimension.description}</p>
                    </article>
                ))}
            </section>

            <section className="reliability-grid">
                {items.map((item) => (
                    <ReliabilityCard item={item} key={item.id ?? item.party} type={type} />
                ))}
            </section>
        </main>
    );
}

function ReliabilityCard({ item, type }) {
    return (
        <article className="reliability-card">
            <div className="reliability-topline">
                <div>
                    <p className="eyebrow">{type === "party" ? "Partij" : item.party}</p>
                    <h2>{type === "party" ? item.party : item.name}</h2>
                    {type === "party" && <small>{item.memberCount} Kamerleden in lokale dataset</small>}
                </div>
                <ReliabilityGauge score={item.score} label={item.scoreLabel} />
            </div>

            <div className="dimension-list">
                {RELIABILITY_DIMENSIONS.map((definition) => {
                    const dimension = item.dimensions[definition.id];

                    return (
                        <div className="dimension-row" key={definition.id}>
                            <div>
                                <strong>{definition.label}</strong>
                                <small>{dimension.note}</small>
                            </div>
                            {dimension.score === null ? <span className="missing-score">Open</span> : <span>{dimension.score}%</span>}
                        </div>
                    );
                })}
            </div>
        </article>
    );
}

function ReliabilityGauge({ score, label }) {
    return (
        <div className="reliability-gauge" style={{ "--score": `${score}%` }}>
            <strong>{score}%</strong>
            <small>{label}</small>
        </div>
    );
}

function PositionReviewPage() {
    return (
        <main className="reliability-page review-page">
            <header className="page-heading">
                <p className="eyebrow">Standpunten-review</p>
                <h1>Kandidaatstandpunten</h1>
                <p>
                    Kandidaten komen uit programma-extractie of handmatige invoer. Alleen items met status
                    goedgekeurd mogen naar de live blind test.
                </p>
            </header>

            <section className="review-summary">
                <article>
                    <strong>{reviewedPositionImports.summary.candidates}</strong>
                    <span>Kandidaten</span>
                </article>
                <article>
                    <strong>{reviewedPositionImports.summary.promoted}</strong>
                    <span>Live gezet</span>
                </article>
                <article>
                    <strong>{reviewedPositionImports.summary.pending}</strong>
                    <span>In review</span>
                </article>
                <article>
                    <strong>{reviewedPositionImports.summary.rejected}</strong>
                    <span>Afgewezen</span>
                </article>
            </section>

            <section className="candidate-grid">
                {CANDIDATE_POSITIONS.map((candidate) => (
                    <article className="candidate-card" key={candidate.id}>
                        <div className="candidate-topline">
                            <div>
                                <p className="eyebrow">{candidate.dossierId}</p>
                                <h2>{candidate.party}</h2>
                            </div>
                            <span>{CANDIDATE_STATUSES[candidate.status] ?? candidate.status}</span>
                        </div>
                        <strong>{candidate.statement}</strong>
                        <p>{candidate.explanation}</p>
                        <dl>
                            <div>
                                <dt>Bron</dt>
                                <dd><a href={candidate.source.url} rel="noreferrer" target="_blank">{candidate.source.title}</a></dd>
                            </div>
                            <div>
                                <dt>Extractie</dt>
                                <dd>{candidate.extraction.method} · confidence {candidate.extraction.confidence}</dd>
                            </div>
                            <div>
                                <dt>Reviewer-notitie</dt>
                                <dd>{candidate.reviewerNotes}</dd>
                            </div>
                        </dl>
                    </article>
                ))}
            </section>
        </main>
    );
}
function MethodPage() {
    return (
        <main className="reliability-page method-page">
            <header className="page-heading">
                <p className="eyebrow">Methode</p>
                <h1>Geen zwarte doos</h1>
                <p>
                    De meter bestaat uit vier lagen: stemgedrag, standpunt-herkomst, belofte versus stem en claim-accuratesse.
                    Alleen stemgedrag en deels standpunt-herkomst zijn nu aangesloten. De rest blijft expliciet open.
                </p>
            </header>

            <section className="metric-legend method-grid">
                {RELIABILITY_DIMENSIONS.map((dimension) => (
                    <article key={dimension.id}>
                        <strong>{dimension.label}</strong>
                        <p>{dimension.description}</p>
                    </article>
                ))}
            </section>
        </main>
    );
}

function LieDetectorPage() {
    const sortedChecks = [...PROMISE_CHECKS].sort((a, b) => {
        const order = {
            broken: 1,
            mixed: 2,
            unclear: 3,
            kept: 4
        };

        return order[a.verdict] - order[b.verdict];
    });

    return (
        <main className="reliability-page">
            <header className="page-heading">
                <p className="eyebrow">De Leugendetector</p>
                <h1>Belofte vs stemgedrag</h1>
                <p>
                    Welke partijen zeggen A, maar stemmen B? De zwaarste tegenstrijdigheden staan bovenaan.
                </p>
            </header>

            <section className="candidate-grid">
                {sortedChecks.map((item) => (
                    <article className={`candidate-card promise-card verdict-${item.verdict}`} key={item.id}>
                        <div className="candidate-topline">
                            <div>
                                <p className="eyebrow">{item.dossierId}</p>
                                <h2>{item.party}</h2>
                            </div>
                            <span className={`verdict-badge verdict-${item.verdict}`}>
                                {verdictIcon(item.verdict)} {PROMISE_VERDICTS[item.verdict]}
                            </span>
                        </div>

                        <strong>Belofte</strong>
                        <p>{item.promise}</p>

                        <strong>Stemming</strong>
                        <p>
                            {item.vote.title} → {voteLabel(item.vote.voted)}
                        </p>

                        <p>{item.explanation}</p>
                    </article>
                ))}
            </section>
        </main>
    );
}

function verdictIcon(verdict) {
    if (verdict === "broken") return "✖";
    if (verdict === "kept") return "✔";
    if (verdict === "mixed") return "⚠";
    return "•";
}

function voteLabel(vote) {
    if (vote === "for") return "Voor";
    if (vote === "against") return "Tegen";
    return vote;
}

export default App;







