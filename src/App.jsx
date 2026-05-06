import { useEffect, useMemo, useState } from "react";
import { EVIDENCE_LEVELS, countDossiers, getDefaultDossier, listDossiers, mapDossiersById } from "./dataAccess/dossiers.js";
import { DOSSIER_STATUSES, SOURCE_REGISTRY, mapSourcesById } from "./dataAccess/sources.js";
import { mapImportedDossiersById } from "./dataAccess/kamerVotes.js";
import { RELIABILITY_DIMENSIONS, buildMemberReliability, buildPartyReliability } from "./data/reliability.js";
import { POSITION_CONFIDENCE, listApprovedPositions, listApprovedPositionsForDossier } from "./dataAccess/positions.js";
import { CANDIDATE_POSITIONS, CANDIDATE_STATUSES } from "./data/candidatePositions.js";
import {
    PROMISE_CHECKS,
    PROMISE_EVIDENCE_LEVELS,
    PROMISE_OWNER_TYPES,
    PROMISE_VERDICTS,
    PROMISE_VOTE_LEVELS
} from "./data/promiseChecks";
import members from "./data/members.json";
import Footer from "./components/Footer";
import navLogo from "/favicon.svg";
import HeroSlider from "./components/HeroSlider";
import "./App.css";

const DATA_TABS = [
    { id: "stemgedrag", label: "Stemgedrag" },
    { id: "bewijs", label: "Bewijsniveau" },
    { id: "impact", label: "Impact" },
    { id: "bronnen", label: "Bronnen" }
];

function BlindTestPage({ partyReliability = [], setPage }) {
    const [activeDossierId, setActiveDossierId] = useState(getDefaultDossier().id);
    const [answers, setAnswers] = useState({});
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [priorityWeights, setPriorityWeights] = useState({});
    const [resultsRevealed, setResultsRevealed] = useState(false);
    const [activeDataTab, setActiveDataTab] = useState(DATA_TABS[0].id);
    const [expandedPositionId, setExpandedPositionId] = useState(null);

    const sourcesById = useMemo(() => mapSourcesById(), []);
    const importedByDossier = useMemo(() => mapImportedDossiersById(), []);

    const activeDossier = useMemo(
        () => listDossiers().find((dossier) => dossier.id === activeDossierId) ?? getDefaultDossier(),
        [activeDossierId]
    );
    const activePositions = useMemo(() => getBlindPositionsForDossier(activeDossier), [activeDossier]);

    const selectedPositionId = answers[activeDossier.id] ?? null;
    const selectedPosition = activePositions.find((position) => position.id === selectedPositionId);
    const revealed = resultsRevealed;
    const completedCount = listDossiers().filter((dossier) => answers[dossier.id]).length;
    const allChosen = completedCount === countDossiers();
    const results = calculateResults(answers, resultsRevealed, priorityWeights);
    const votingMatches = calculateVotingMatches(answers, resultsRevealed, importedByDossier, partyReliability, priorityWeights);
    const revealOutcome = getRevealOutcome(results, votingMatches);
    const chosenPositions = getChosenPositions(answers, resultsRevealed);
    const remainingCount = countDossiers() - completedCount;

    function chooseDossier(dossierId) {
        setActiveDossierId(dossierId);
        setActiveDataTab(DATA_TABS[0].id);
        setExpandedPositionId(null);
    }

    function choosePosition(positionId) {
        const nextAnswers = {
            ...answers,
            [activeDossier.id]: positionId
        };

        setAnswers(() => nextAnswers);
        setResultsRevealed(false);
        setActiveDataTab(DATA_TABS[0].id);

        if (Object.keys(nextAnswers).length === countDossiers()) {
            setShowPriorityModal(true);
        }
    }

    function togglePositionInfo(positionId) {
        setExpandedPositionId((current) => (current === positionId ? null : positionId));
    }

    function togglePriority(dossierId) {
        setPriorityWeights((current) => {
            const next = { ...current };

            if (next[dossierId]) {
                delete next[dossierId];
            } else {
                next[dossierId] = 2;
            }

            return next;
        });
    }

    function revealResults() {
        if (allChosen) {
            setShowPriorityModal(true);
        }
    }

    function applyPriorities() {
        setShowPriorityModal(false);
        setResultsRevealed(true);
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
        const currentIndex = listDossiers().findIndex((dossier) => dossier.id === activeDossier.id);
        const next = listDossiers()[currentIndex + 1] ?? getDefaultDossier();
        chooseDossier(next.id);
    }

    return (
        <>
            <div className={showPriorityModal ? "app-content blurred" : "app-content"}>
                <HeroSlider setPage={setPage} />

                <main className="product-shell test-shell">
                <section className="mobile-test-controls" aria-label="Voortgang blind test">
                    <div className="mobile-progress-card">
                        <div>
                            <strong>{completedCount}/{countDossiers()} gekozen</strong>
                            <small>Partijen blijven verborgen tot je onthult.</small>
                        </div>
                        <div className="progress-track" aria-hidden="true">
                            <div style={{ width: `${(completedCount / countDossiers()) * 100}%` }} />
                        </div>
                    </div>

                    <label className="mobile-dossier-select">
                        <span>Dossier</span>
                        <select value={activeDossier.id} onChange={(event) => chooseDossier(event.target.value)}>
                            {listDossiers().map((dossier, index) => (
                                <option key={dossier.id} value={dossier.id}>
                                    {index + 1}. {dossier.title}{answers[dossier.id] ? " - gekozen" : ""}
                                </option>
                            ))}
                        </select>
                    </label>
                </section>

                <aside className="dossier-nav progress-sidebar" aria-label="Voortgang blind test">
                    <div className="nav-heading">
                        <span>01</span>
                        <h2>Blind test</h2>
                    </div>

                    <div className="progress-card">
                        <strong>{completedCount}/{countDossiers()} gekozen</strong>
                        <div className="progress-track" aria-hidden="true">
                            <div style={{ width: `${(completedCount / countDossiers()) * 100}%` }} />
                        </div>
                        <small>Partijen blijven verborgen tot je onthult.</small>
                    </div>

                    <div className="dossier-list flow-list">
                        {listDossiers().map((dossier, index) => {
                            const answered = Boolean(answers[dossier.id]);

                            return (
                                <div
                                    className={dossierNavClass(activeDossier.id === dossier.id, answered)}
                                    key={dossier.id}
                                >
                                    <button
                                        className="dossier-main-button"
                                        onClick={() => chooseDossier(dossier.id)}
                                        type="button"
                                    >
                                        <span className="flow-index">{index + 1}</span>
                                        <span>
                                            <strong>{dossier.title}</strong>
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
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
                            <article
                                className={`${cardClass(position.id, selectedPositionId, revealed)} ${expandedPositionId === position.id ? "info-open" : ""}`}
                                key={position.id}
                            >
                                <button
                                    className="blind-card-choice"
                                    onClick={() => choosePosition(position.id)}
                                    type="button"
                                >
                                    <span className="anonymous-label">Standpunt {index + 1}</span>
                                    <strong className="position-statement">{position.statement}</strong>
                                </button>

                                <div className="blind-card-footer">
                                    <button
                                        className="position-info-toggle"
                                        onClick={() => togglePositionInfo(position.id)}
                                        type="button"
                                    >
                                        {expandedPositionId === position.id ? "Minder info" : "Meer info"}
                                    </button>
                                    {revealed && <span className="blind-source-hint">{position.party}</span>}
                                </div>

                                {expandedPositionId === position.id && (
                                    <div className="position-info-panel">
                                        <div>
                                            <h4>Uitleg</h4>
                                            <p>{position.explanation}</p>
                                        </div>
                                        <div>
                                            <h4>Hoe werkt dit?</h4>
                                            <p>{position.how}</p>
                                        </div>
                                        <div className="pros-cons-grid">
                                            <div>
                                                <h4>Voordelen</h4>
                                                <ul className="pros-list">
                                                    {position.pros.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4>Nadelen</h4>
                                                <ul className="cons-list">
                                                    {position.cons.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                        </div>
                    )}

                    {resultsRevealed && (
                        <RevealPanel
                            allChosen={allChosen}
                            outcome={revealOutcome}
                            position={selectedPosition}
                            resultsRevealed={resultsRevealed}
                        />
                    )}

                    {!resultsRevealed && (
                        <>
                            <div className="action-row reveal-actions">
                                <button
                                    className="primary-action reveal-action"
                                    disabled={!allChosen}
                                    onClick={revealResults}
                                    type="button"
                                >
                                    {allChosen ? "Onthul resultaten" : `Nog ${remainingCount} te kiezen`}
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

                            <RevealPanel
                                allChosen={allChosen}
                                outcome={revealOutcome}
                                position={selectedPosition}
                                resultsRevealed={resultsRevealed}
                            />
                        </>
                    )}

                    {resultsRevealed && (
                        <ResultMatrix
                            importedByDossier={importedByDossier}
                            partyReliability={partyReliability}
                            positions={chosenPositions}
                        />
                    )}

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
            </div>

            {showPriorityModal && (
                <PriorityModal
                    onApply={applyPriorities}
                    priorityWeights={priorityWeights}
                    togglePriority={togglePriority}
                />
            )}
        </>
    );
}



function PriorityModal({ onApply, priorityWeights, togglePriority }) {
    return (
        <div className="priority-modal" role="dialog" aria-modal="true" aria-labelledby="priority-title">
            <section className="priority-card">
                <div className="priority-heading">
                    <p className="eyebrow">Prioriteiten</p>
                    <h2 id="priority-title">Wat vind je extra belangrijk?</h2>
                    <p>Niet alles weegt even zwaar. Kies wat voor jou zwaarder mee moet tellen.</p>
                </div>

                <div className="priority-list">
                    {listDossiers().map((dossier) => (
                        <label className="priority-option" key={dossier.id}>
                            <input
                                checked={Boolean(priorityWeights[dossier.id])}
                                onChange={() => togglePriority(dossier.id)}
                                type="checkbox"
                            />
                            <span>{dossier.title}</span>
                        </label>
                    ))}
                </div>

                <button className="primary-action priority-submit" onClick={onApply} type="button">
                    Ga naar resultaten
                </button>
            </section>
        </div>
    );
}

function Scoreboard({ results }) {
    if (results.length === 0) return null;

    return (
        <section className="score-card">
            <h3>Partijen achter je keuzes</h3>
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

function RevealPanel({ allChosen, outcome, position, resultsRevealed }) {
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
            <div className="policy-reveal-block">
                <p className="eyebrow">Jouw keuzes</p>
                <span>Je koos standpunten uit verschillende partijen.</span>
            </div>
            <div className="vote-reveal-block">
                <div className="reveal-copy">
                    <p className="eyebrow">Beste match op stemgedrag</p>
                    <strong>{outcome.title}</strong>
                </div>
                {outcome.match ? (
                    <div className="reveal-match-block">
                        <MatchGauge score={outcome.match.score} />
                        <div className="match-explainer">
                            <span>Deze partij stemt het vaakst zoals jij koos.</span>
                            <small>
                                {outcome.match.voteScore}% stemoverlap · {outcome.match.reliabilityScore}% betrouwbaarheid · {outcome.match.comparisons} stemvergelijkingen
                            </small>
                        </div>
                    </div>
                ) : (
                    <span>{outcome.description}</span>
                )}
            </div>
            {outcome.alternatives?.length > 0 && (
                <div className="reveal-alternatives">
                    <p className="eyebrow">Top 3 alternatieven</p>
                    <div>
                        {outcome.alternatives.map((alternative) => (
                            <article key={alternative.party}>
                                <strong>{alternative.party}</strong>
                                <span>{alternative.score}%</span>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function MatchGauge({ score }) {
    return (
        <div className="match-gauge" style={{ "--match-score": `${score}%` }} aria-label={`Match ${score}%`}>
            <strong>{score}%</strong>
            <small>match</small>
        </div>
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
                        <span>Jij koos:</span>
                        <h4>{position.party}</h4>
                        <small>{dossier.title}</small>
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

function ResultMatrix({ importedByDossier, partyReliability, positions }) {
    if (positions.length === 0) return null;

    const reliabilityByParty = Object.fromEntries(partyReliability.map((item) => [item.party, item]));

    return (
        <section className="result-matrix-panel">
            <div className="result-matrix-heading">
                <div>
                    <p className="eyebrow">Matrix</p>
                    <h3>Waar kwam je keuze vandaan?</h3>
                </div>
                <span>Programma + stemgedrag</span>
            </div>

            <div className="result-matrix" role="table" aria-label="Resultaatmatrix per dossier">
                <div className="result-matrix-row header" role="row">
                    <span role="columnheader">Dossier</span>
                            <span role="columnheader">Jij koos</span>
                            <span role="columnheader">Partij</span>
                            <span role="columnheader">Belofte vs stem</span>
                            <span role="columnheader">Werkelijk stemgedrag</span>
                            <span role="columnheader">Betrouwbaarheid</span>
                        </div>

                {positions.map(({ dossier, position }) => {
                    const voteSignal = getPartyDossierVoteSignal(position.party, importedByDossier[dossier.id]);
                    const promiseSignal = getPromiseVoteSignal(position, importedByDossier[dossier.id]);
                    const reliability = reliabilityByParty[position.party];

                    return (
                        <div className="result-matrix-row" key={position.id} role="row">
                            <span className="matrix-dossier" data-label="Dossier" role="cell">{dossier.title}</span>
                            <strong data-label="Jij koos" role="cell">{position.statement}</strong>
                            <span className="matrix-party" data-label="Partij" role="cell">{position.party}</span>
                            <span className={`matrix-promise ${promiseSignal.tone}`} data-label="Belofte vs stem" role="cell">
                                <b>{promiseSignal.label}</b>
                                <small>{promiseSignal.detail}</small>
                            </span>
                            <span className={`matrix-vote ${voteSignal.tone}`} data-label="Werkelijk stemgedrag" role="cell">
                                <b>{voteSignal.label}</b>
                                <small>{voteSignal.detail}</small>
                            </span>
                            <span className="matrix-reliability" data-label="Betrouwbaarheid" role="cell">
                                <b>{reliability ? `${reliability.score}%` : "Nog onbekend"}</b>
                                <small>{reliability?.scoreLabel ?? "Nog geen meetpunten"}</small>
                            </span>
                        </div>
                    );
                })}
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
                    <KamerZaakItem key={zaak.id} zaak={zaak} />
                ))}
            </div>
        </section>
    );
}

function KamerZaakItem({ zaak }) {
    const voteStats = getVoteStats(zaak);
    const status = voteStats ? (voteStats.accepted ? "AANGENOMEN" : "VERWORPEN") : "Geen stemdata";
    const statusClass = voteStats ? (voteStats.accepted ? "accepted" : "rejected") : "no-data";

    return (
        <details className={`${voteStats ? "kamer-item has-votes" : "kamer-item"} zaak-type-${slugifyType(zaak.type)}`}>
            <summary className="kamer-summary">
                <span className={`kamer-rail ${statusClass}`} aria-hidden="true" />
                <span className="kamer-summary-copy">
                    <span className="kamer-type">{zaak.number ? `${zaak.number} · ${zaak.type}` : zaak.type}</span>
                    <strong>{shortTitle(zaak.title)}</strong>
                    <span className={`kamer-vote-line ${statusClass}`}>
                        {voteStats ? status : "Geen fractiestemming gevonden"}
                    </span>
                </span>
                <span className="kamer-summary-action">
                    <span className="closed-label">Open</span>
                    <span className="open-label">Sluit</span>
                </span>
                <small>Klik voor stemdetails</small>
            </summary>

            <div className="kamer-detail-body">
                <div className="kamer-detail-layout">
                    <VotePartyBreakdown zaak={zaak} />

                    <div className="kamer-detail-meta">
                        <dl className="zaak-meta-grid">
                            <div>
                                <dt>Volledige titel</dt>
                                <dd>{zaak.title}</dd>
                            </div>
                            <div>
                                <dt>Zaaknummer</dt>
                                <dd>{zaak.number ?? "Onbekend"}</dd>
                            </div>
                            <div>
                                <dt>Parlementair jaar</dt>
                                <dd>{zaak.parliamentaryYear ?? "Onbekend"}</dd>
                            </div>
                            <div>
                                <dt>Match termen</dt>
                                <dd>{zaak.matchedTerms?.join(", ") ?? zaak.matchedTerm ?? "Geen matchterm"}</dd>
                            </div>
                        </dl>

                        <a className="kamer-source-button" href={zaak.sourceUrl} rel="noreferrer" target="_blank">
                            Bekijk volledige Kamerzaak ?
                        </a>
                    </div>
                </div>
            </div>
        </details>
    );
}

function VotePartyBreakdown({ zaak }) {
    const voteStats = getVoteStats(zaak);

    if (!voteStats) {
        return <p className="no-votes">Geen fractiestemming gevonden in deze zaak.</p>;
    }

    return (
        <div className="vote-detail-panel">
            <div className={voteStats.accepted ? "vote-outcome accepted" : "vote-outcome rejected"}>
                <span>{voteStats.accepted ? "Aangenomen" : "Verworpen"}</span>
                <strong>{voteStats.forSeats} voor · {voteStats.againstSeats} tegen</strong>
                <small>{voteStats.totalVotes} zetels geteld</small>
            </div>
            <div className="vote-columns">
                <VotePartyColumn label="Voor" parties={voteStats.forParties} tone="for" />
                <VotePartyColumn label="Tegen" parties={voteStats.againstParties} tone="against" />
            </div>
        </div>
    );
}

function VotePartyColumn({ label, parties, tone }) {
    return (
        <div className={`vote-party-column ${tone}`}>
            <h4>{label}</h4>
            {parties.length > 0 ? (
                <div className="party-vote-list">
                    {parties.map((party) => (
                        <span className={`party-vote ${tone}`} key={party}>
                            <span className="dot" aria-hidden="true" />
                            {party}
                        </span>
                    ))}
                </div>
            ) : (
                <p>Geen partijen gevonden.</p>
            )}
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

function dossierNavClass(active, answered) {
    const classes = ["dossier-button"];

    if (active) classes.push("active");
    if (answered) classes.push("answered");

    return classes.join(" ");
}

function formatDate(dateValue) {
    return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(dateValue));
}

function formatDaysSince(dateValue) {
    if (!dateValue) return "Nog onbekend";

    const daysOpen = daysSince(dateValue);

    return `${daysOpen} ${daysOpen === 1 ? "dag" : "dagen"}`;
}

function daysSince(dateValue) {
    if (!dateValue) return null;

    const startDate = new Date(dateValue);
    const today = new Date();
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.max(0, Math.floor((currentDay - startDay) / 86400000));
}

function getSourcePageUrl(source) {
    if (!source?.url || !source?.page) return source?.url ?? "#";

    return `${source.url}#page=${source.page}`;
}

function extractionMethodLabel(method) {
    const labels = {
        "manual-seed": "Handmatig ingevoerd",
        manual: "Handmatig ingevoerd",
        ai: "Automatisch voorgesteld",
        "ai-extraction": "Automatisch voorgesteld",
        import: "Geimporteerd uit brondata",
        "local-seed": "Voorbeelddata"
    };

    return labels[method] ?? "Herkomst onbekend";
}

function extractionConfidenceLabel(confidence) {
    const labels = {
        high: "Hoge zekerheid",
        medium: "Middelmatige zekerheid",
        low: "Lage zekerheid",
        weak: "Zwakke koppeling"
    };

    return labels[confidence] ?? "Zekerheid onbekend";
}

function extractionSummaryLabel(extraction) {
    return `${extractionMethodLabel(extraction?.method)} · ${extractionConfidenceLabel(extraction?.confidence)}`;
}

function positionDirectionLabel(position) {
    const labels = {
        for: "Voor",
        against: "Tegen",
        neutral: "Neutraal",
        mixed: "Gemengd",
        unknown: "Richting nog onbekend"
    };

    return labels[position] ?? "Richting nog onbekend";
}

function getChosenPositions(answers, resultsRevealed) {
    if (!resultsRevealed) return [];

    return listDossiers().map((dossier) => {
        const positions = getBlindPositionsForDossier(dossier);

        return {
            dossier,
            position: positions.find((position) => position.id === answers[dossier.id])
        };
    }).filter((item) => item.position);
}
function calculateResults(answers, resultsRevealed, importance = {}) {
    const counts = listDossiers().reduce((acc, dossier) => {
        if (!resultsRevealed) return acc;

        const position = getBlindPositionsForDossier(dossier).find((item) => item.id === answers[dossier.id]);

        if (position) {
            acc[position.party] = (acc[position.party] ?? 0) + getDossierWeight(dossier.id, importance);
        }

        return acc;
    }, {});

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (total === 0) return [];

    return Object.entries(counts)
        .map(([party, count]) => ({
            party,
            count: Number(count.toFixed(1)),
            percentage: Math.round((count / total) * 100)
        }))
        .sort((a, b) => b.count - a.count || a.party.localeCompare(b.party, "nl"));
}

function getBlindPositionsForDossier(dossier) {
    const sourcedPositions = listApprovedPositionsForDossier(dossier.id);

    if (sourcedPositions.length > 0) {
        return sourcedPositions.map((position) => normalizeBlindPosition(position, dossier.id));
    }

    return (dossier.positions ?? []).map((position) => normalizeBlindPosition(position, dossier.id));
}

function normalizeBlindPosition(position, dossierId) {
    return {
        id: position.id,
        party: position.party,
        statement: position.statement ?? position.stance,
        explanation: position.explanation ?? position.rationale,
        how: position.how ?? "De precieze uitvoering moet nog redactioneel worden uitgewerkt.",
        pros: position.pros ?? ["Maakt de beleidsrichting duidelijker voor kiezers"],
        cons: position.cons ?? ["Uitvoering, kosten en neveneffecten moeten nog beter worden getoetst"],
        voteLinks: position.voteLinks ?? [],
        confidence: position.confidence ?? "editorialDraft",
        reviewedByHuman: position.reviewedByHuman ?? false,
        reviewStatus: position.reviewStatus ?? "Redactioneel dossierstandpunt; bron nog controleren",
        source: position.source ?? {
            type: "dossier",
            title: "Dossierstandpunt in review",
            url: SOURCE_REGISTRY.tkOpenData.url,
            quote: null
        },
        dossierId: position.dossierId ?? dossierId
    };
}

function getRevealOutcome(results, votingMatches) {
    const bestMatch = votingMatches[0];

    if (bestMatch) {
        return {
            title: bestMatch.party,
            description: "Niet op basis van partijprogramma's. Deze partij past het best bij jouw keuzes als je kijkt naar werkelijk stemgedrag in de Tweede Kamer, meegewogen met betrouwbaarheid.",
            match: bestMatch,
            alternatives: votingMatches.slice(1, 4)
        };
    }

    if (results.length === 0) {
        return {
            title: "Nog geen resultaat",
            description: "Kies eerst per dossier een standpunt. Daarna onthullen we pas welke partijen erachter zaten."
        };
    }

    const highestCount = results[0].count;
    const winners = results.filter((result) => result.count === highestCount);

    if (winners.length === 1) {
        return {
            title: winners[0].party,
            description: "Niet omdat je de partij koos. Maar omdat je het eens was met het beleid."
        };
    }

    return {
        title: "Verdeeld resultaat",
        description: `Je keuzes zijn verdeeld over: ${formatPartyList(winners.map((result) => result.party))}.`
    };
}

function calculateVotingMatches(answers, resultsRevealed, importedByDossier, partyReliability, importance = {}) {
    if (!resultsRevealed) return [];

    const reliabilityByParty = Object.fromEntries(partyReliability.map((item) => [item.party, item]));
    const partyStats = new Map();

    listDossiers().forEach((dossier) => {
        const selectedPositionId = answers[dossier.id];
        if (!selectedPositionId) return;

        const selectedPosition = getBlindPositionsForDossier(dossier).find((position) => position.id === selectedPositionId);
        const selectedParty = selectedPosition?.party;
        const importedDossier = importedByDossier[dossier.id];
        const dossierWeight = getDossierWeight(dossier.id, importance);

        if (!selectedParty || !importedDossier) return;

        importedDossier.zaken.forEach((zaak) => {
            const voteSummary = getDisplayVoteSummary(zaak);
            if (!voteSummary?.parties?.length) return;

            const selectedPartyVote = voteSummary.parties.find((item) => item.party === selectedParty)?.vote;
            if (!selectedPartyVote) return;

            voteSummary.parties.forEach((item) => {
                if (!item.party || !item.vote) return;

                const current = partyStats.get(item.party) ?? { party: item.party, matches: 0, comparisons: 0 };
                current.comparisons += dossierWeight;
                if (item.vote === selectedPartyVote) current.matches += dossierWeight;
                partyStats.set(item.party, current);
            });
        });
    });

    return [...partyStats.values()]
        .filter((item) => item.comparisons > 0)
        .map((item) => {
            const voteScore = Math.round((item.matches / item.comparisons) * 100);
            const reliabilityScore = reliabilityByParty[item.party]?.score ?? 0;

            return {
                ...item,
                voteScore,
                reliabilityScore,
                score: Math.round((voteScore * 0.85) + (reliabilityScore * 0.15))
            };
        })
        .sort((a, b) =>
            b.score - a.score ||
            b.voteScore - a.voteScore ||
            b.reliabilityScore - a.reliabilityScore ||
            b.comparisons - a.comparisons ||
            a.party.localeCompare(b.party, "nl")
        );
}

function getDossierWeight(dossierId, importance = {}) {
    return importance[dossierId] ?? 1;
}

function getPartyDossierVoteSignal(party, importedDossier) {
    if (!importedDossier?.zaken?.length) {
        return {
            label: "Geen dossierdata",
            detail: "Voor dit dossier is nog geen Kamerdata gekoppeld.",
            tone: "unknown"
        };
    }

    const votes = importedDossier.zaken
        .map((zaak) => getDisplayVoteSummary(zaak)?.parties?.find((item) => item.party === party)?.vote)
        .filter(Boolean);

    if (votes.length === 0) {
        return {
            label: "Geen fractiestem gevonden",
            detail: `${party} komt in de gekoppelde stemmingen niet voor.`,
            tone: "unknown"
        };
    }

    const forCount = votes.filter((vote) => vote === "Voor").length;
    const againstCount = votes.filter((vote) => vote === "Tegen").length;
    const otherCount = votes.length - forCount - againstCount;
    const direction = forCount === againstCount
        ? "gemengd"
        : forCount > againstCount ? "meestal voor" : "meestal tegen";

    return {
        label: `${votes.length} stemmingen · ${direction}`,
        detail: `${forCount} voor · ${againstCount} tegen${otherCount ? ` · ${otherCount} anders` : ""}`,
        tone: forCount === againstCount ? "mixed" : forCount > againstCount ? "support" : "oppose"
    };
}

function getPromiseVoteSignal(position, importedDossier) {
    const links = position.voteLinks ?? [];

    if (links.length === 0) {
        return {
            label: "Nog niet gekoppeld",
            detail: "Dit standpunt heeft nog geen expliciete Kamerstemming als toets.",
            tone: "unknown"
        };
    }

    const evaluated = links.map((link) => {
        const zaak = importedDossier?.zaken?.find((item) => item.number === link.zaakNumber || item.id === link.zaakId);
        const partyVote = getDisplayVoteSummary(zaak)?.parties?.find((item) => item.party === position.party)?.vote;

        return {
            ...link,
            zaak,
            partyVote,
            matches: partyVote === link.expectedVote
        };
    });

    const withVotes = evaluated.filter((item) => item.partyVote);

    if (withVotes.length === 0) {
        return {
            label: "Stem nog niet gevonden",
            detail: `Wel gekoppeld aan ${links.length} Kamerzaak${links.length === 1 ? "" : "en"}, maar geen fractiestem gevonden.`,
            tone: "unknown"
        };
    }

    const matches = withVotes.filter((item) => item.matches).length;
    const score = Math.round((matches / withVotes.length) * 100);
    const weakLinks = withVotes.filter((item) => item.confidence === "weak").length;
    const first = withVotes[0];
    const label = score === 100
        ? "Komt overeen"
        : score === 0 ? "Wijkt af" : "Gemengd beeld";
    const tone = score === 100 ? "kept" : score === 0 ? "broken" : "mixed";

    return {
        label,
        detail: `${matches}/${withVotes.length} gekoppelde stemmingen matchen · verwacht ${first.expectedVote}, stemde ${first.partyVote}${weakLinks ? " · zwakke koppeling" : ""}`,
        tone
    };
}

function formatPartyList(parties) {
    if (parties.length <= 1) return parties[0] ?? "";
    if (parties.length === 2) return parties.join(" en ");

    return `${parties.slice(0, -1).join(", ")} en ${parties.at(-1)}`;
}

function getDisplayVoteSummary(zaak) {
    const besluitSummary = (zaak.besluiten ?? []).find((besluit) => besluit.voteSummary?.totalVotes > 0)?.voteSummary;

    return dedupeVoteSummary(besluitSummary ?? zaak.voteSummary);
}

function dedupeVoteSummary(voteSummary) {
    if (!voteSummary?.parties?.length) return voteSummary;

    const partiesByName = new Map();

    voteSummary.parties.forEach((item) => {
        if (!item.party || partiesByName.has(item.party)) return;
        partiesByName.set(item.party, item);
    });

    const parties = [...partiesByName.values()];
    const byVote = parties.reduce((acc, item) => {
        acc[item.vote] = (acc[item.vote] ?? 0) + (item.seats || 1);
        return acc;
    }, {});

    return {
        ...voteSummary,
        totalVotes: parties.length,
        totalSeats: Object.values(byVote).reduce((sum, seats) => sum + seats, 0),
        byVote,
        parties
    };
}

function getPartiesByVote(voteSummary, vote) {
    return voteSummary.parties
        .filter((item) => item.vote === vote)
        .map((item) => item.party)
        .sort((a, b) => a.localeCompare(b, "nl"));
}

function getVoteStats(zaak) {
    const voteSummary = getDisplayVoteSummary(zaak);

    if (!voteSummary?.totalVotes) return null;

    const forSeats = voteSummary.byVote?.Voor ?? 0;
    const againstSeats = voteSummary.byVote?.Tegen ?? 0;

    return {
        accepted: forSeats > againstSeats,
        forSeats,
        againstSeats,
        totalVotes: voteSummary.totalSeats,
        forParties: getPartiesByVote(voteSummary, "Voor"),
        againstParties: getPartiesByVote(voteSummary, "Tegen")
    };
}

function shortTitle(title, max = 95) {
    if (!title) return "";
    return title.length > max ? `${title.slice(0, max)}...` : title;
}

function slugifyType(type) {
    const slug = String(type)
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("/", "-");

    if (slug.includes("wetgeving")) return "wetgeving";
    if (slug.includes("motie")) return "motie";
    if (slug.includes("amendement")) return "amendement";
    if (slug.includes("begroting")) return "begroting";
    if (slug.includes("brief")) return "brief";

    return "overig";
}

const PAGES = [
    { id: "blind", label: "Blind test" },
    { id: "onderwerpen", label: "Onderwerpen" },
    { id: "betrouwbaarheid", label: "Betrouwbaarheid" },
    { id: "leugens", label: "Leugendetector" },
    { id: "redactie", label: "Redactie", adminOnly: true },
    { id: "methode", label: "Methode" }
];

const DEFAULT_PAGE = "blind";

function normalizePageId(pageId) {
    return PAGES.some((page) => page.id === pageId) ? pageId : DEFAULT_PAGE;
}

function pageFromLocation() {
    return normalizePageId(window.location.hash.replace("#", "") || DEFAULT_PAGE);
}

const PROMISE_REVIEW_STATUSES = {
    approved: "Betrouwbaar",
    review: "Review nodig",
    missing: "Stem ontbreekt",
    uncoded: "Belofte ontbreekt"
};

const REVIEW_AGE_FILTERS = [
    { id: "all", label: "Alle looptijden" },
    { id: "today", label: "Vandaag ontvangen" },
    { id: "oneToThree", label: "1-3 dagen open" },
    { id: "fourToSeven", label: "4-7 dagen open" },
    { id: "older", label: "Langer dan 7 dagen" }
];

function reviewAgeMatches(candidate, ageFilter) {
    const daysOpen = daysSince(candidate.receivedForReviewAt);

    if (daysOpen === null) return ageFilter === "unknown";
    if (ageFilter === "today") return daysOpen === 0;
    if (ageFilter === "oneToThree") return daysOpen >= 1 && daysOpen <= 3;
    if (ageFilter === "fourToSeven") return daysOpen >= 4 && daysOpen <= 7;
    if (ageFilter === "older") return daysOpen > 7;

    return true;
}

function promiseOwnerLabel(item) {
    if (item.promiseOwnerType === "person") {
        return item.politician ?? item.promiseOwnerId ?? "Kamerlid";
    }

    return item.party;
}

function promiseEvidenceNote(item) {
    if (item.promiseOwnerType === "person" && item.vote?.level === "party") {
        return "Persoonlijke belofte, maar alleen fractiestem vastgesteld.";
    }

    if (item.promiseOwnerType === "person" && item.vote?.level === "person") {
        return "Persoonlijke belofte vergeleken met persoonlijke stem.";
    }

    return "Partijbelofte vergeleken met fractiestem.";
}

const REVIEW_STATUS_GROUPS = [
    { id: "needsReview", label: "Review nodig" },
    { id: "needsSource", label: "Meer bron nodig" },
    { id: "approved", label: "Goedgekeurd" },
    { id: "rejected", label: "Afgewezen" }
];

const REVIEW_QUEUE_STORAGE_KEY = "blind-democracy.review-queue.v1";
const ADMIN_MODE_STORAGE_KEY = "blind-democracy.admin-mode.v1";

const PARTY_VISUALS = {
    "BBB": { color: "#72bf44" },
    "CDA": { color: "#2b8f41" },
    "ChristenUnie": { color: "#00a7e1" },
    "D66": { color: "#00ae41" },
    "DENK": { color: "#00a6a6" },
    "FVD": { color: "#8b1e3f" },
    "GroenLinks-PvdA": { color: "#d71920" },
    "JA21": { color: "#1f4e79" },
    "PVV": { color: "#1e9bd7" },
    "SP": { color: "#e30613" },
    "Volt": { color: "#582c83" },
    "VVD": { color: "#f58220" }
};

function buildPromiseVoteStatementItems() {
    const importedByDossier = mapImportedDossiersById();
    const dossierById = mapDossiersById();
    const linkedStatements = new Map();

    listApprovedPositions().forEach((position) => {
        (position.voteLinks ?? []).forEach((link) => {
            const key = `${position.dossierId}:${link.zaakNumber ?? link.zaakId}`;
            if (!linkedStatements.has(key)) {
                linkedStatements.set(key, {
                    dossierId: position.dossierId,
                    dossierTitle: dossierById[position.dossierId]?.title ?? position.dossierId,
                    zaakNumber: link.zaakNumber ?? link.zaakId
                });
            }
        });
    });

    return [...linkedStatements.values()].map((statement) => {
        const importedDossier = importedByDossier[statement.dossierId];
        const zaak = importedDossier?.zaken?.find((item) => item.number === statement.zaakNumber || item.id === statement.zaakNumber);
        const voteSummary = getDisplayVoteSummary(zaak);
        const positions = listApprovedPositionsForDossier(statement.dossierId);
        const rows = positions.map((position) => {
            const link = (position.voteLinks ?? []).find((item) =>
                item.zaakNumber === statement.zaakNumber || item.zaakId === statement.zaakNumber
            );
            const partyVote = voteSummary?.parties?.find((item) => item.party === position.party)?.vote ?? null;
            const expectedVote = link?.expectedVote ?? null;
            const matches = expectedVote && partyVote ? expectedVote === partyVote : false;
            const status = !expectedVote
                ? "uncoded"
                : !partyVote ? "missing" : link.status ?? (link.confidence === "weak" ? "review" : "approved");

            return {
                party: position.party,
                promise: position.statement,
                expectedVote,
                partyVote,
                matches,
                status,
                rationale: link?.rationale ?? "Nog geen redactionele koppeling voor deze partij."
            };
        }).sort((a, b) => a.party.localeCompare(b.party, "nl"));

        const codedRows = rows.filter((row) => row.expectedVote);
        const matchedRows = codedRows.filter((row) => row.matches);

        return {
            ...statement,
            zaakTitle: shortTitle(zaak?.title ?? "Kamerzaak niet gevonden", 150),
            rows,
            codedCount: codedRows.length,
            matchedCount: matchedRows.length
        };
    }).sort((a, b) => a.dossierTitle.localeCompare(b.dossierTitle, "nl") || a.zaakNumber.localeCompare(b.zaakNumber, "nl"));
}

function App() {
    const [page, setActivePage] = useState(pageFromLocation);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [adminMode, setAdminMode] = useState(readStoredAdminMode);
    const partyReliability = useMemo(() => buildPartyReliability(), []);
    const memberReliability = useMemo(() => buildMemberReliability(), []);
    const visiblePages = PAGES.filter((item) => !item.adminOnly || adminMode);

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
        window.localStorage.setItem(ADMIN_MODE_STORAGE_KEY, adminMode ? "true" : "false");
    }, [adminMode]);

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
                            {item.label}
                        </button>
                    ))}
                </div>

                {mobileNavOpen && (
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
                )}
            </nav>

            {page === "blind" && <BlindTestPage setPage={setPage} partyReliability={partyReliability} />}
            {page === "onderwerpen" && <TopicsPage />}
            {page === "betrouwbaarheid" && <ReliabilityHub memberReliability={memberReliability} partyReliability={partyReliability} />}
            {page === "leugens" && <LieDetectorPage />}
            {page === "redactie" && (adminMode
                ? <EditorialHub onDisableAdmin={() => setAdminMode(false)} />
                : <AdminAccessPage onEnableAdmin={() => setAdminMode(true)} />
            )}
            {page === "methode" && <MethodPage />}

            <Footer setPage={setPage} />
        </>
    );
}

function TopicsPage() {
    const [selectedDossierId, setSelectedDossierId] = useState(getDefaultDossier().id);
    const [activeTab, setActiveTab] = useState("standpunten");
    const sourcesById = useMemo(() => mapSourcesById(), []);
    const importedByDossier = useMemo(() => mapImportedDossiersById(), []);
    const selectedDossier = listDossiers().find((dossier) => dossier.id === selectedDossierId) ?? getDefaultDossier();
    const positions = getBlindPositionsForDossier(selectedDossier);
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
                    {listDossiers().map((dossier) => {
                        const dossierPositions = getBlindPositionsForDossier(dossier);
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

function ReliabilityHub({ memberReliability, partyReliability }) {
    const [activeTab, setActiveTab] = useState("partijen");

    return (
        <>
            <section className="hub-tabs" aria-label="Betrouwbaarheid weergave">
                <button className={activeTab === "partijen" ? "active" : ""} onClick={() => setActiveTab("partijen")} type="button">
                    Partijen
                </button>
                <button className={activeTab === "kamerleden" ? "active" : ""} onClick={() => setActiveTab("kamerleden")} type="button">
                    Kamerleden
                </button>
            </section>
            {activeTab === "partijen" && <ReliabilityPage items={partyReliability} title="Betrouwbaarheid per partij" type="party" />}
            {activeTab === "kamerleden" && <ReliabilityPage items={memberReliability} title="Wat weten we over dit Kamerlid?" type="member" />}
        </>
    );
}

function ReliabilityPage({ items, title, type }) {
    const isMemberPage = type === "member";

    return (
        <main className={isMemberPage ? "reliability-page member-knowledge-page" : "reliability-page"}>
            <header className="page-heading">
                <p className="eyebrow">{isMemberPage ? "Kamerleden" : "Betrouwbaarheidsmeter"}</p>
                <h1>{title}</h1>
                <p>{isMemberPage ? "We laten zien wat we al kunnen controleren — en wat nog niet." : "Scores tonen alleen wat nu meetbaar is. Ontbrekende onderdelen blijven zichtbaar als open meetpunt, zodat de meter niet meer zekerheid suggereert dan de data toelaat."}</p>
            </header>

            {!isMemberPage && (
                <section className="metric-legend">
                    {RELIABILITY_DIMENSIONS.map((dimension) => (
                        <article key={dimension.id}>
                            <strong>{dimension.label}</strong>
                            <p>{dimension.description}</p>
                        </article>
                    ))}
                </section>
            )}

            <section className="reliability-grid">
                {items.map((item) => (
                    <ReliabilityCard item={item} key={item.id ?? item.party} type={type} />
                ))}
            </section>
        </main>
    );
}

function ReliabilityCard({ item, type }) {
    if (type === "member") {
        return <MemberKnowledgeCard item={item} />;
    }

    return (
        <article className="reliability-card">
            <div className="reliability-topline">
                <div className="identity-line">
                    <PartyAvatar logoUrl={item.logoUrl} party={item.party} size="large" />
                    <div>
                        <p className="eyebrow">{type === "party" ? "Partij" : item.party}</p>
                        <h2>{type === "party" ? item.party : item.name}</h2>
                        {type === "party" && <small>{item.memberCount} Kamerleden uit Tweede Kamer Open Data</small>}
                    </div>
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

function PartyAvatar({ logoUrl, party, size = "medium" }) {
    const visual = PARTY_VISUALS[party] ?? {};
    const imageUrl = logoUrl ?? visual.logoUrl;

    return (
        <span
            className={`round-avatar party-avatar ${size}`}
            style={{ "--avatar-color": visual.color ?? "#18251f" }}
            title={party}
        >
            {imageUrl ? <img alt={`${party} logo`} src={imageUrl} /> : <span>{partyInitials(party)}</span>}
        </span>
    );
}

function PersonAvatar({ person }) {
    return (
        <span className="round-avatar person-avatar" title={person.name}>
            {person.photoUrl ? <img alt={`Foto van ${person.name}`} src={person.photoUrl} /> : <span>{personInitials(person.name)}</span>}
        </span>
    );
}

function partyInitials(party) {
    if (!party) return "?";
    if (party === "GroenLinks-PvdA") return "GL";
    if (party === "ChristenUnie") return "CU";

    return party
        .split(/[\s-]+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
}

function personInitials(name) {
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts.at(-1)[0] : "";

    return `${first}${last}`.toUpperCase();
}

function MemberKnowledgeCard({ item }) {
    const checklist = buildMemberChecklist(item);

    return (
        <article className="member-knowledge-card">
            <div className="member-knowledge-topline">
                <div className="identity-line member-line">
                    <PersonAvatar person={item} />
                    <div>
                        <p className="eyebrow party-with-logo">
                            <PartyAvatar logoUrl={item.partyLogoUrl} party={item.party} size="small" />
                            {item.party}
                        </p>
                        <h2>{item.name}</h2>
                    </div>
                </div>
                <span>{knowledgeLabel(checklist)}</span>
            </div>

            <div className="knowledge-dots" aria-label={knowledgeLabel(checklist)}>
                {checklist.map((entry) => (
                    <span className={entry.available ? "filled" : ""} key={entry.id} />
                ))}
            </div>

            <div className="member-checklist">
                <h3>Wat weten we:</h3>
                {checklist.map((entry) => (
                    <div className={entry.available ? "known" : "unknown"} key={entry.id}>
                        <span aria-hidden="true">{entry.available ? "✓" : "✗"}</span>
                        <p>{entry.text}</p>
                    </div>
                ))}
            </div>
        </article>
    );
}

function buildMemberChecklist(item) {
    const dimensions = item.dimensions;

    return [
        {
            id: "voteCoverage",
            available: dimensions.voteCoverage.score !== null,
            text: dimensions.voteCoverage.score === null
                ? "We weten nog niet hoe deze partij stemt"
                : "We weten hoe deze partij meestal stemt"
        },
        {
            id: "positionTraceability",
            available: dimensions.positionTraceability.score !== null && dimensions.positionTraceability.score >= 100,
            text: dimensions.positionTraceability.score >= 100
                ? "De belangrijkste standpunten zijn bekend"
                : "We kennen nog niet alle belangrijke standpunten"
        },
        {
            id: "promiseVoteMatch",
            available: dimensions.promiseVoteMatch.score !== null,
            text: dimensions.promiseVoteMatch.score === null
                ? "We weten nog niet of beloftes worden nagekomen"
                : "We kunnen zien of beloftes worden nagekomen"
        },
        {
            id: "claimAccuracy",
            available: dimensions.claimAccuracy.score !== null,
            text: dimensions.claimAccuracy.score === null
                ? "We weten nog niet of uitspraken kloppen"
                : "We kunnen uitspraken controleren"
        }
    ];
}

function knowledgeLabel(checklist) {
    const known = checklist.filter((entry) => entry.available).length;

    if (known >= 3) return "Goed controleerbaar";
    if (known >= 2) return "Gedeeltelijk controleerbaar";
    return "Nauwelijks controleerbaar";
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
    const [statusFilter, setStatusFilter] = useState("all");
    const [partyFilter, setPartyFilter] = useState("all");
    const [dossierFilter, setDossierFilter] = useState("all");
    const [ageFilter, setAgeFilter] = useState("all");
    const [reviewState, setReviewState] = useState(readStoredReviewQueue);
    const dossierById = mapDossiersById();
    const memberById = useMemo(() => new Map(members.map((member) => [member.id, member])), []);
    const membersByParty = useMemo(() => {
        const grouped = new Map();

        members.forEach((member) => {
            if (!grouped.has(member.party)) grouped.set(member.party, []);
            grouped.get(member.party).push(member);
        });

        grouped.forEach((partyMembers) => {
            partyMembers.sort((a, b) => a.name.localeCompare(b.name, "nl"));
        });

        return grouped;
    }, []);
    const reviewItems = CANDIDATE_POSITIONS.map((candidate) => applyCandidateReviewEdits({
        candidate,
        edits: reviewState.edits[candidate.id],
        effectiveStatus: reviewState.decisions[candidate.id] ?? candidate.status,
        effectiveNotes: reviewState.notes[candidate.id] ?? candidate.reviewerNotes
    }));
    const partyOptions = [...new Set(reviewItems.map((candidate) => candidate.party))].sort((a, b) => a.localeCompare(b, "nl"));
    const dossierOptions = [...new Set(reviewItems.map((candidate) => candidate.dossierId))]
        .map((dossierId) => dossierById[dossierId] ?? { id: dossierId, title: dossierId })
        .sort((a, b) => a.title.localeCompare(b.title, "nl"));
    const filteredItems = reviewItems.filter((candidate) => {
        const matchesStatus = statusFilter === "all" || candidate.effectiveStatus === statusFilter;
        const matchesParty = partyFilter === "all" || candidate.party === partyFilter;
        const matchesDossier = dossierFilter === "all" || candidate.dossierId === dossierFilter;
        const matchesAge = ageFilter === "all" || reviewAgeMatches(candidate, ageFilter);

        return matchesStatus && matchesParty && matchesDossier && matchesAge;
    });
    const groupedReviewItems = REVIEW_STATUS_GROUPS.map((group) => ({
        ...group,
        items: filteredItems.filter((candidate) => candidate.effectiveStatus === group.id)
    }));
    const summary = reviewItems.reduce((acc, candidate) => {
        acc[candidate.effectiveStatus] = (acc[candidate.effectiveStatus] ?? 0) + 1;
        return acc;
    }, {});
    const reviewReport = buildLocalReviewReport(reviewItems, summary, reviewState.history ?? []);
    const promotedPositions = buildApprovedPositionsFromReview(reviewItems);
    const reviewReportUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reviewReport, null, 2))}`;
    const approvedPositionsUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(promotedPositions, null, 2))}`;

    useEffect(() => {
        window.localStorage.setItem(REVIEW_QUEUE_STORAGE_KEY, JSON.stringify(reviewState));
    }, [reviewState]);

    function setCandidateStatus(candidateId, nextStatus) {
        const candidate = reviewItems.find((item) => item.id === candidateId);
        const hasRequiredSource = Boolean(candidate?.source?.quote) && Boolean(candidate?.source?.page);
        const effectiveNextStatus = nextStatus === "approved" && !hasRequiredSource ? "needsSource" : nextStatus;
        const sourceNote = "Goedkeuren kan pas als bronquote en pagina zijn ingevuld.";

        setReviewState((current) => {
            const previousStatus = current.decisions[candidateId] ?? candidate?.status ?? "needsReview";
            const nextNotes = effectiveNextStatus === "needsSource" && nextStatus === "approved"
                ? {
                    ...current.notes,
                    [candidateId]: current.notes[candidateId]?.includes(sourceNote)
                        ? current.notes[candidateId]
                        : `${current.notes[candidateId] ?? candidate?.effectiveNotes ?? ""}\n${sourceNote}`.trim()
                }
                : current.notes;

            return {
                ...current,
                decisions: {
                    ...current.decisions,
                    [candidateId]: effectiveNextStatus
                },
                notes: nextNotes,
                history: appendReviewHistory(current, {
                    action: "status_changed",
                    candidateId,
                    field: "status",
                    from: previousStatus,
                    to: effectiveNextStatus,
                    note: nextStatus === "approved" && effectiveNextStatus === "needsSource" ? sourceNote : ""
                })
            };
        });
    }

    function updateCandidateField(candidateId, field, value) {
        setReviewState((current) => {
            const previousValue = current.edits[candidateId]?.[field] ?? getCandidateOriginalField(candidateId, field);

            return {
                ...current,
                edits: {
                    ...current.edits,
                    [candidateId]: {
                        ...current.edits[candidateId],
                        [field]: value
                    }
                },
                history: appendReviewHistory(current, {
                    action: "field_edited",
                    candidateId,
                    field,
                    from: previousValue ?? "",
                    to: value ?? ""
                })
            };
        });
    }

    function updateCandidateNote(candidateId, note) {
        setReviewState((current) => ({
            ...current,
            notes: {
                ...current.notes,
                [candidateId]: note
            },
            history: appendReviewHistory(current, {
                action: "note_updated",
                candidateId,
                field: "reviewerNotes",
                from: current.notes[candidateId] ?? getCandidateOriginalField(candidateId, "reviewerNotes") ?? "",
                to: note
            })
        }));
    }

    function clearCandidateHistory(candidateId) {
        setReviewState((current) => ({
            ...current,
            history: (current.history ?? []).filter((entry) => entry.candidateId !== candidateId)
        }));
    }

    function getCandidateOriginalField(candidateId, field) {
        const candidate = CANDIDATE_POSITIONS.find((item) => item.id === candidateId);
        if (!candidate) return "";

        if (field === "source.quote") return candidate.source?.quote ?? "";
        if (field === "source.page") return candidate.source?.page ?? "";
        if (field === "reviewerNotes") return candidate.reviewerNotes ?? "";
        if (field === "politicianId") return candidate.politicianId ?? "";

        return candidate[field] ?? "";
    }

    function resetLocalReview() {
        setReviewState({ decisions: {}, edits: {}, history: [], notes: {} });
    }

    return (
        <main className="reliability-page review-page">
            <header className="page-heading review-page-heading">
                <div>
                    <p className="eyebrow">Standpunten-review</p>
                    <h1>Review queue</h1>
                    <p>
                        Kandidaten komen uit programma-extractie of handmatige invoer. De review gebeurt hier eerst
                        lokaal: niets wordt live gezet totdat een standpunt expliciet is goedgekeurd.
                    </p>
                </div>
                <div className="review-export-actions" aria-label="Review exportacties">
                    <a download="blind-democracy-review-report.json" href={reviewReportUrl}>
                        Exporteer reviewrapport
                    </a>
                    <a download="blind-democracy-approved-positions.json" href={approvedPositionsUrl}>
                        Exporteer approved positions
                    </a>
                    <button onClick={resetLocalReview} type="button">
                        Reset lokale review
                    </button>
                </div>
            </header>

            <section className="review-summary">
                <article>
                    <strong>{reviewItems.length}</strong>
                    <span>Kandidaten</span>
                </article>
                <article>
                    <strong>{summary.approved ?? 0}</strong>
                    <span>Goedgekeurd</span>
                </article>
                <article>
                    <strong>{summary.needsReview ?? 0}</strong>
                    <span>In review</span>
                </article>
                <article>
                    <strong>{(summary.rejected ?? 0) + (summary.needsSource ?? 0)}</strong>
                    <span>Geblokkeerd</span>
                </article>
            </section>

            <section className="review-filter-panel" aria-label="Filter kandidaatstandpunten">
                <label>
                    <span>Status</span>
                    <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                        <option value="all">Alle statussen</option>
                        {REVIEW_STATUS_GROUPS.map((status) => (
                            <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Partij</span>
                    <select onChange={(event) => setPartyFilter(event.target.value)} value={partyFilter}>
                        <option value="all">Alle partijen</option>
                        {partyOptions.map((party) => (
                            <option key={party} value={party}>{party}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Dossier</span>
                    <select onChange={(event) => setDossierFilter(event.target.value)} value={dossierFilter}>
                        <option value="all">Alle dossiers</option>
                        {dossierOptions.map((dossier) => (
                            <option key={dossier.id} value={dossier.id}>{dossier.title}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Looptijd</span>
                    <select onChange={(event) => setAgeFilter(event.target.value)} value={ageFilter}>
                        {REVIEW_AGE_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                        ))}
                    </select>
                </label>
                <button
                    className="review-filter-reset"
                    onClick={() => {
                        setStatusFilter("all");
                        setPartyFilter("all");
                        setDossierFilter("all");
                        setAgeFilter("all");
                    }}
                    type="button"
                >
                    Filters wissen
                </button>
            </section>

            <section className="review-status-board">
                {groupedReviewItems.map((group) => (
                    <section className={`review-status-column status-${group.id}`} key={group.id}>
                        <header className="review-status-heading">
                            <div>
                                <h2>{group.label}</h2>
                                <span>{group.items.length} items</span>
                            </div>
                        </header>

                        <div className="review-status-list">
                            {group.items.length > 0 ? group.items.map((candidate) => (
                                <CandidateReviewCard
                                    candidate={candidate}
                                    dossier={dossierById[candidate.dossierId]}
                                    history={(reviewState.history ?? []).filter((entry) => entry.candidateId === candidate.id)}
                                    key={candidate.id}
                                    member={memberById.get(candidate.politicianId)}
                                    onClearHistory={clearCandidateHistory}
                                    onFieldChange={updateCandidateField}
                                    onNoteChange={updateCandidateNote}
                                    onStatusChange={setCandidateStatus}
                                    partyMembers={membersByParty.get(candidate.party) ?? []}
                                />
                            )) : (
                                <p className="review-empty-state">Geen items in deze status.</p>
                            )}
                        </div>
                    </section>
                ))}
            </section>
        </main>
    );
}

function CandidateReviewCard({ candidate, dossier, history, member, onClearHistory, onFieldChange, onNoteChange, onStatusChange, partyMembers }) {
    const hasQuote = Boolean(candidate.source?.quote);
    const hasPage = Boolean(candidate.source?.page);
    const sourceReady = hasQuote && hasPage;
    const publicationDate = candidate.source?.publishedAt ? formatDate(candidate.source.publishedAt) : "Nog onbekend";
    const receivedDate = candidate.receivedForReviewAt ? formatDate(candidate.receivedForReviewAt) : "Nog onbekend";
    const reviewStatus = CANDIDATE_STATUSES[candidate.effectiveStatus] ?? candidate.effectiveStatus;
    const attributionLabel = member ? `${member.name} (${member.party})` : "Partijbron / nog geen Kamerlid gekoppeld";

    return (
        <details className={`candidate-card review-candidate status-${candidate.effectiveStatus}`}>
            <summary className="review-item-summary">
                <span className="review-party-name">{candidate.party}</span>
                <span className="review-summary-copy">
                    <strong>{candidate.statement}</strong>
                    <small>{dossier?.title ?? candidate.dossierId}{candidate.issueId ? ` / ${candidate.issueId}` : ""}</small>
                </span>
            </summary>

            <div className="review-item-detail">
            <div className="candidate-topline">
                <div>
                    <p className="eyebrow">{dossier?.title ?? candidate.dossierId}{candidate.issueId ? ` / ${candidate.issueId}` : ""}</p>
                    <h2>{candidate.party}</h2>
                </div>
                <span>{CANDIDATE_STATUSES[candidate.effectiveStatus] ?? candidate.effectiveStatus}</span>
            </div>

            <div className="review-compact-meta" aria-label="Review metadata">
                <span>{positionDirectionLabel(candidate.position)}</span>
                <span>{extractionMethodLabel(candidate.extraction.method)}</span>
                <span>{extractionConfidenceLabel(candidate.extraction.confidence)}</span>
                <span>{sourceReady ? "Bron compleet" : "Bron incompleet"}</span>
            </div>

            <div className="review-card-body">
            <div className="review-proposal">
                <p className="eyebrow">AI / import voorstel</p>
                <label className="review-edit-field">
                    <span>Standpunt</span>
                    <textarea
                        onChange={(event) => onFieldChange(candidate.id, "statement", event.target.value)}
                        rows="2"
                        value={candidate.statement}
                    />
                </label>
                <label className="review-edit-field">
                    <span>Uitleg</span>
                    <textarea
                        onChange={(event) => onFieldChange(candidate.id, "explanation", event.target.value)}
                        rows="2"
                        value={candidate.explanation}
                    />
                </label>
                <div className="review-edit-row">
                    <label className="review-edit-field">
                        <span>Richting</span>
                        <select
                            onChange={(event) => onFieldChange(candidate.id, "position", event.target.value)}
                            value={candidate.position ?? "unknown"}
                        >
                            <option value="unknown">Nog onbekend</option>
                            <option value="for">Voor</option>
                            <option value="against">Tegen</option>
                            <option value="neutral">Neutraal</option>
                            <option value="mixed">Gemengd</option>
                        </select>
                    </label>
                    <label className="review-edit-field">
                        <span>Pagina</span>
                        <input
                            onChange={(event) => onFieldChange(candidate.id, "source.page", event.target.value)}
                            placeholder="Bijv. 42"
                            type="text"
                            value={candidate.source?.page ?? ""}
                        />
                    </label>
                </div>
                <label className="review-edit-field">
                    <span>Hoe wil de partij dit doen?</span>
                    <textarea
                        onChange={(event) => onFieldChange(candidate.id, "how", event.target.value)}
                        rows="2"
                        value={candidate.how ?? ""}
                    />
                </label>
                <label className="review-edit-field">
                    <span>Bronquote</span>
                    <textarea
                        onChange={(event) => onFieldChange(candidate.id, "source.quote", event.target.value)}
                        placeholder="Plak hier de exacte passage uit de bron"
                        rows="3"
                        value={candidate.source?.quote ?? ""}
                    />
                </label>
                <label className="review-edit-field">
                    <span>Gezegd/bevestigd door</span>
                    <select
                        onChange={(event) => onFieldChange(candidate.id, "politicianId", event.target.value)}
                        value={candidate.politicianId ?? ""}
                    >
                        <option value="">Partijbron / geen Kamerlid gekoppeld</option>
                        {partyMembers.map((partyMember) => (
                            <option key={partyMember.id} value={partyMember.id}>
                                {partyMember.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <aside className="review-metadata-panel" aria-label="Bron en reviewcontext">
                <section className="review-metadata-section review-metadata-primary">
                    <h3>Bron & validiteit</h3>
                    <dl>
                        <div>
                            <dt>Bron</dt>
                            <dd><a href={candidate.source.url} rel="noreferrer" target="_blank">{candidate.source.title}</a></dd>
                        </div>
                        <div>
                            <dt>Pagina</dt>
                            <dd>
                                {candidate.source.page ?? "Nog onbekend"}
                                {candidate.source.page && (
                                    <a className="review-page-link" href={getSourcePageUrl(candidate.source)} rel="noreferrer" target="_blank">
                                        Open pagina
                                    </a>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt>Bronquote aanwezig</dt>
                            <dd>{hasQuote ? "Ja" : "Nee"}</dd>
                        </div>
                        <div>
                            <dt>Gezegd/bevestigd door</dt>
                            <dd>{attributionLabel}</dd>
                        </div>
                        <div>
                            <dt>Herkomst voorstel</dt>
                            <dd>{extractionSummaryLabel(candidate.extraction)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="review-metadata-section review-metadata-secondary">
                    <h3>Review context</h3>
                    <dl>
                        <div>
                            <dt>Ontvangen review</dt>
                            <dd>{receivedDate}</dd>
                        </div>
                        <div>
                            <dt>Open sinds</dt>
                            <dd>{formatDaysSince(candidate.receivedForReviewAt)}</dd>
                        </div>
                        <div>
                            <dt>Publicatie datum</dt>
                            <dd>{publicationDate}</dd>
                        </div>
                        <div>
                            <dt>Review status</dt>
                            <dd>{reviewStatus}</dd>
                        </div>
                    </dl>
                </section>
            </aside>

            {!sourceReady && (
                <p className="review-warning">
                    Vul bronquote en pagina in voordat dit standpunt goedgekeurd kan worden.
                </p>
            )}

            <label className="review-note-field">
                <span>Reviewer-notitie</span>
                <textarea
                    onChange={(event) => onNoteChange(candidate.id, event.target.value)}
                    rows="3"
                    value={candidate.effectiveNotes}
                />
            </label>
            </div>

            <details className="review-history">
                <summary>Reviewlog · {history.length}</summary>
                {history.length > 0 ? (
                    <div className="review-history-list">
                        {history.slice().reverse().map((entry) => (
                            <div key={entry.id}>
                                <strong>{reviewActionLabel(entry.action)}</strong>
                                <span>{formatDate(entry.createdAt)} · {entry.field}</span>
                                <p>{shortLogValue(entry.from)} → {shortLogValue(entry.to)}</p>
                                {entry.note && <small>{entry.note}</small>}
                            </div>
                        ))}
                        <button onClick={() => onClearHistory(candidate.id)} type="button">
                            Wis log voor dit item
                        </button>
                    </div>
                ) : (
                    <p>Nog geen lokale reviewacties.</p>
                )}
            </details>

            <div className="review-actions" aria-label={`Review acties voor ${candidate.party}`}>
                <button className="approve" onClick={() => onStatusChange(candidate.id, "approved")} type="button">
                    Goedkeuren
                </button>
                <button onClick={() => onStatusChange(candidate.id, "needsSource")} type="button">
                    Meer bron nodig
                </button>
                <button className="reject" onClick={() => onStatusChange(candidate.id, "rejected")} type="button">
                    Afwijzen
                </button>
                <button onClick={() => onStatusChange(candidate.id, "needsReview")} type="button">
                    Terug naar review
                </button>
            </div>
            </div>
        </details>
    );
}

function readStoredReviewQueue() {
    try {
        const stored = window.localStorage.getItem(REVIEW_QUEUE_STORAGE_KEY);
        if (!stored) return { decisions: {}, edits: {}, history: [], notes: {} };

        const parsed = JSON.parse(stored);
        return {
            decisions: parsed.decisions ?? {},
            edits: parsed.edits ?? {},
            history: parsed.history ?? [],
            notes: parsed.notes ?? {}
        };
    } catch {
        return { decisions: {}, edits: {}, history: [], notes: {} };
    }
}

function readStoredAdminMode() {
    try {
        return window.localStorage.getItem(ADMIN_MODE_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

function appendReviewHistory(current, entry) {
    const previous = current.history ?? [];
    const last = previous.at(-1);

    if (
        last &&
        last.candidateId === entry.candidateId &&
        last.action === entry.action &&
        last.field === entry.field &&
        last.to === entry.to
    ) {
        return previous;
    }

    return [
        ...previous,
        {
            id: `${entry.candidateId}-${entry.action}-${entry.field}-${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...entry
        }
    ];
}

function reviewActionLabel(action) {
    if (action === "status_changed") return "Status gewijzigd";
    if (action === "field_edited") return "Veld aangepast";
    if (action === "note_updated") return "Notitie bijgewerkt";
    return action;
}

function shortLogValue(value) {
    const text = String(value ?? "leeg").trim() || "leeg";
    return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

function applyCandidateReviewEdits({ candidate, edits = {}, effectiveStatus, effectiveNotes }) {
    const source = { ...candidate.source };
    const next = {
        ...candidate,
        effectiveStatus,
        effectiveNotes,
        position: candidate.position ?? "unknown",
        how: candidate.how ?? "",
        source
    };

    Object.entries(edits).forEach(([field, value]) => {
        if (field === "source.quote") {
            next.source.quote = value || null;
            return;
        }

        if (field === "source.page") {
            next.source.page = value || null;
            return;
        }

        next[field] = value;
    });

    return next;
}

function buildLocalReviewReport(reviewItems, summary, history = []) {
    return {
        generatedAt: new Date().toISOString(),
        mode: "local-browser-review",
        summary: {
            candidates: reviewItems.length,
            approved: summary.approved ?? 0,
            needsReview: summary.needsReview ?? 0,
            needsSource: summary.needsSource ?? 0,
            rejected: summary.rejected ?? 0
        },
        reviewLogs: history,
        candidates: reviewItems.map((candidate) => ({
            id: candidate.id,
            dossierId: candidate.dossierId,
            party: candidate.party,
            politicianId: candidate.politicianId ?? null,
            status: candidate.effectiveStatus,
            position: candidate.position ?? "unknown",
            statement: candidate.statement,
            explanation: candidate.explanation,
            how: candidate.how ?? null,
            reviewerNotes: candidate.effectiveNotes,
            source: {
                title: candidate.source?.title,
                url: candidate.source?.url,
                page: candidate.source?.page ?? null,
                quote: candidate.source?.quote ?? null,
                politicianId: candidate.politicianId ?? null
            },
            reviewLogs: history.filter((entry) => entry.candidateId === candidate.id)
        }))
    };
}

function buildApprovedPositionsFromReview(reviewItems) {
    const approved = reviewItems.filter((candidate) => candidate.effectiveStatus === "approved");

    return {
        generatedAt: new Date().toISOString(),
        mode: "local-browser-promotion",
        target: "approved_positions",
        count: approved.length,
        approvedPositions: approved.map((candidate) => ({
            id: candidate.id.replace(/^candidate-/, "approved-"),
            candidatePositionId: candidate.id,
            dossierId: candidate.dossierId,
            issueId: candidate.issueId ?? null,
            party: candidate.party,
            politicianId: candidate.politicianId ?? null,
            position: candidate.position ?? "unknown",
            statement: candidate.statement,
            explanation: candidate.explanation,
            how: candidate.how ?? null,
            pros: candidate.pros ?? [],
            cons: candidate.cons ?? [],
            source: {
                type: candidate.source?.type ?? null,
                title: candidate.source?.title ?? null,
                url: candidate.source?.url ?? null,
                page: candidate.source?.page ?? null,
                quote: candidate.source?.quote ?? null,
                politicianId: candidate.politicianId ?? null
            },
            confidence: candidate.source?.quote && candidate.source?.page ? "sourceQuoted" : "sourceMapped",
            reviewStatus: "Goedgekeurd in lokale review queue; klaar voor approved_positions-import.",
            reviewedByHuman: true,
            reviewerNotes: candidate.effectiveNotes,
            approvedAt: new Date().toISOString(),
            approvedBy: "local-reviewer"
        }))
    };
}

function PromiseVoteReviewPage({ embedded = false }) {
    const [selectedDossierId, setSelectedDossierId] = useState("all");
    const statementItems = useMemo(() => buildPromiseVoteStatementItems(), []);
    const filteredItems = selectedDossierId === "all"
        ? statementItems
        : statementItems.filter((item) => item.dossierId === selectedDossierId);
    const rows = statementItems.flatMap((item) => item.rows);
    const summary = rows.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <main className={embedded ? "embedded-review-page" : "reliability-page review-page"}>
            {!embedded && (
                <header className="page-heading">
                    <p className="eyebrow">Stemreview</p>
                    <h1>Stellingen: belofte vs daadwerkelijke stem</h1>
                    <p>
                        Kies een dossier en bekijk per Kamerstelling welke partijen een belofte/verwachte stem hebben en
                        hoe ze daadwerkelijk stemden.
                    </p>
                </header>
            )}

            <section className="review-summary">
                <article>
                    <strong>{statementItems.length}</strong>
                    <span>Stellingen</span>
                </article>
                <article>
                    <strong>{summary.approved ?? 0}</strong>
                    <span>Gecodeerd</span>
                </article>
                <article>
                    <strong>{summary.review ?? 0}</strong>
                    <span>Review nodig</span>
                </article>
                <article>
                    <strong>{summary.uncoded ?? 0}</strong>
                    <span>Belofte ontbreekt</span>
                </article>
            </section>

            <div className="dossier-filter" aria-label="Filter op dossier">
                <button
                    className={selectedDossierId === "all" ? "active" : ""}
                    onClick={() => setSelectedDossierId("all")}
                    type="button"
                >
                    Alle dossiers
                </button>
                {listDossiers().filter((dossier) => statementItems.some((item) => item.dossierId === dossier.id)).map((dossier) => (
                    <button
                        className={selectedDossierId === dossier.id ? "active" : ""}
                        key={dossier.id}
                        onClick={() => setSelectedDossierId(dossier.id)}
                        type="button"
                    >
                        {dossier.title}
                    </button>
                ))}
            </div>

            <section className="promise-statement-list">
                {filteredItems.map((item) => (
                    <article className="promise-statement-card" key={`${item.dossierId}-${item.zaakNumber}`}>
                        <div className="promise-statement-heading">
                            <div>
                                <p className="eyebrow">{item.dossierTitle}</p>
                                <h2>{item.zaakTitle}</h2>
                                <small>{item.zaakNumber}</small>
                            </div>
                            <span>{item.matchedCount}/{item.codedCount || item.rows.length} match</span>
                        </div>

                        <div className="promise-party-table">
                            <div className="promise-party-row header">
                                <span>Partij</span>
                                <span>Belofte/positie</span>
                                <span>Verwacht</span>
                                <span>Werkelijk</span>
                                <span>Status</span>
                            </div>
                            {item.rows.map((row) => (
                                <div className={`promise-party-row status-${row.status}`} key={`${item.zaakNumber}-${row.party}`}>
                                    <strong>{row.party}</strong>
                                    <span>{row.promise}</span>
                                    <span>{row.expectedVote ?? "Nog te coderen"}</span>
                                    <span>{row.partyVote ?? "Niet gevonden"}</span>
                                    <span>{PROMISE_REVIEW_STATUSES[row.status]}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

function AdminAccessPage({ onEnableAdmin }) {
    return (
        <main className="reliability-page admin-access-page">
            <section className="admin-access-card">
                <p className="eyebrow">Admin / moderatie</p>
                <h1>Redactie is afgeschermd</h1>
                <p>
                    In productie komt deze omgeving achter Supabase Auth en rolrechten. Deze lokale knop is alleen
                    bedoeld om de admin-workflow tijdens ontwikkeling te bekijken.
                </p>
                <button className="primary-action" onClick={onEnableAdmin} type="button">
                    Lokale adminmodus activeren
                </button>
            </section>
        </main>
    );
}

function EditorialHub({ onDisableAdmin }) {
    const [activeTab, setActiveTab] = useState("standpunten");

    return (
        <>
            <section className="hub-tabs" aria-label="Redactie onderdelen">
                <button className={activeTab === "standpunten" ? "active" : ""} onClick={() => setActiveTab("standpunten")} type="button">
                    Standpunten
                </button>
                <button className={activeTab === "stemreview" ? "active" : ""} onClick={() => setActiveTab("stemreview")} type="button">
                    Stemkoppelingen
                </button>
                <button className="admin-exit-button" onClick={onDisableAdmin} type="button">
                    Adminmodus uit
                </button>
            </section>
            {activeTab === "standpunten" && <PositionReviewPage />}
            {activeTab === "stemreview" && <PromiseVoteReviewPage />}
        </>
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
    const [activeTab, setActiveTab] = useState("partij");
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
                    Welke partijen en politici stemmen anders dan ze beloofden?
                </p>
            </header>

            <section className="hub-tabs inline-tabs" aria-label="Leugendetector weergave">
                <button className={activeTab === "partij" ? "active" : ""} onClick={() => setActiveTab("partij")} type="button">
                    Per partij
                </button>
                <button className={activeTab === "stelling" ? "active" : ""} onClick={() => setActiveTab("stelling")} type="button">
                    Per stelling
                </button>
            </section>

            {activeTab === "partij" && (
                <section className="candidate-grid">
                    {sortedChecks.map((item) => (
                        <article className={`candidate-card promise-card verdict-${item.verdict}`} key={item.id}>
                            <div className="candidate-topline">
                                <div>
                                    <p className="eyebrow">{item.dossierId}</p>
                                    <h2>{promiseOwnerLabel(item)}</h2>
                                </div>
                                <span className={`verdict-badge verdict-${item.verdict}`}>
                                    {verdictIcon(item.verdict)} {PROMISE_VERDICTS[item.verdict]}
                                </span>
                            </div>

                            <dl className="promise-context-grid">
                                <div>
                                    <dt>Belofte-eigenaar</dt>
                                    <dd>{PROMISE_OWNER_TYPES[item.promiseOwnerType] ?? item.promiseOwnerType}</dd>
                                </div>
                                <div>
                                    <dt>Stemniveau</dt>
                                    <dd>{PROMISE_VOTE_LEVELS[item.vote?.level] ?? item.vote?.level ?? "Onbekend"}</dd>
                                </div>
                                <div>
                                    <dt>Bewijssterkte</dt>
                                    <dd>{PROMISE_EVIDENCE_LEVELS[item.evidenceLevel] ?? item.evidenceLevel ?? "Review nodig"}</dd>
                                </div>
                            </dl>

                            <strong>Belofte</strong>
                            <p>{item.promise}</p>

                            <strong>Stemming</strong>
                            <p>
                                {item.vote.title} ? {voteLabel(item.vote.voted)}
                            </p>

                            <p>{item.explanation}</p>
                            <p className="promise-evidence-note">{promiseEvidenceNote(item)}</p>

                            <div className="promise-source-row">
                                <a href={item.promiseSource.url} rel="noreferrer" target="_blank">
                                    Beloftebron
                                </a>
                                <a href={item.vote.sourceUrl} rel="noreferrer" target="_blank">
                                    Stembron
                                </a>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {activeTab === "stelling" && <PromiseVoteReviewPage embedded />}
        </main>
    );
}

function verdictIcon(verdict) {
    if (verdict === "broken") return "✗";  // ✗
    if (verdict === "kept") return "✓";    // ✓
    if (verdict === "mixed") return "~";   // ~
    return "•";                            // •
}

function voteLabel(vote) {
    if (vote === "for") return "Voor";
    if (vote === "against") return "Tegen";
    return vote;
}

export default App;
