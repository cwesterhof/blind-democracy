import { useEffect, useMemo, useState } from "react";
import { DOSSIERS, EVIDENCE_LEVELS } from "./data/dossiers";
import { DOSSIER_STATUSES, SOURCE_REGISTRY } from "./data/sources";
import importedTweedeKamer from "./data/importedTweedeKamer.json";
import { RELIABILITY_DIMENSIONS, buildMemberReliability, buildPartyReliability } from "./data/reliability.js";
import { PARTY_POSITIONS, POSITION_CONFIDENCE, getPositionsForDossier } from "./data/partyPositions.js";
import { CANDIDATE_POSITIONS, CANDIDATE_STATUSES } from "./data/candidatePositions.js";
import reviewedPositionImports from "./data/reviewedPositionImports.json";
import { PROMISE_CHECKS, PROMISE_VERDICTS } from "./data/promiseChecks";
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
    const [activeDossierId, setActiveDossierId] = useState(DOSSIERS[0].id);
    const [answers, setAnswers] = useState({});
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [priorityWeights, setPriorityWeights] = useState({});
    const [resultsRevealed, setResultsRevealed] = useState(false);
    const [activeDataTab, setActiveDataTab] = useState(DATA_TABS[0].id);
    const [expandedPositionId, setExpandedPositionId] = useState(null);

    const sourcesById = Object.fromEntries(Object.values(SOURCE_REGISTRY).map((source) => [source.id, source]));
    const importedByDossier = Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));

    const activeDossier = useMemo(
        () => DOSSIERS.find((dossier) => dossier.id === activeDossierId) ?? DOSSIERS[0],
        [activeDossierId]
    );
    const activePositions = useMemo(() => getBlindPositionsForDossier(activeDossier), [activeDossier]);

    const selectedPositionId = answers[activeDossier.id] ?? null;
    const selectedPosition = activePositions.find((position) => position.id === selectedPositionId);
    const revealed = resultsRevealed;
    const completedCount = DOSSIERS.filter((dossier) => answers[dossier.id]).length;
    const allChosen = completedCount === DOSSIERS.length;
    const results = calculateResults(answers, resultsRevealed, priorityWeights);
    const votingMatches = calculateVotingMatches(answers, resultsRevealed, importedByDossier, partyReliability, priorityWeights);
    const revealOutcome = getRevealOutcome(results, votingMatches);
    const chosenPositions = getChosenPositions(answers, resultsRevealed);
    const remainingCount = DOSSIERS.length - completedCount;

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

        if (Object.keys(nextAnswers).length === DOSSIERS.length) {
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
        const currentIndex = DOSSIERS.findIndex((dossier) => dossier.id === activeDossier.id);
        const next = DOSSIERS[currentIndex + 1] ?? DOSSIERS[0];
        chooseDossier(next.id);
    }

    return (
        <>
            <div className={showPriorityModal ? "app-content blurred" : "app-content"}>
                <HeroSlider setPage={setPage} />

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
                        {DOSSIERS.map((dossier, index) => {
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
                    {DOSSIERS.map((dossier) => (
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

function getChosenPositions(answers, resultsRevealed) {
    if (!resultsRevealed) return [];

    return DOSSIERS.map((dossier) => {
        const positions = getBlindPositionsForDossier(dossier);

        return {
            dossier,
            position: positions.find((position) => position.id === answers[dossier.id])
        };
    }).filter((item) => item.position);
}
function calculateResults(answers, resultsRevealed, importance = {}) {
    const counts = DOSSIERS.reduce((acc, dossier) => {
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
    const sourcedPositions = getPositionsForDossier(dossier.id);

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

    DOSSIERS.forEach((dossier) => {
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
    { id: "redactie", label: "Redactie" },
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
    const importedByDossier = Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));
    const dossierById = Object.fromEntries(DOSSIERS.map((dossier) => [dossier.id, dossier]));
    const linkedStatements = new Map();

    PARTY_POSITIONS.forEach((position) => {
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
        const positions = PARTY_POSITIONS.filter((position) => position.dossierId === statement.dossierId);
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
    const partyReliability = useMemo(() => buildPartyReliability(), []);
    const memberReliability = useMemo(() => buildMemberReliability(), []);

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

            {page === "blind" && <BlindTestPage setPage={setPage} partyReliability={partyReliability} />}
            {page === "onderwerpen" && <TopicsPage />}
            {page === "betrouwbaarheid" && <ReliabilityHub memberReliability={memberReliability} partyReliability={partyReliability} />}
            {page === "leugens" && <LieDetectorPage />}
            {page === "redactie" && <EditorialHub />}
            {page === "methode" && <MethodPage />}

            <Footer setPage={setPage} />
        </>
    );
}

function TopicsPage() {
    const [selectedDossierId, setSelectedDossierId] = useState(DOSSIERS[0].id);
    const [activeTab, setActiveTab] = useState("standpunten");
    const sourcesById = Object.fromEntries(Object.values(SOURCE_REGISTRY).map((source) => [source.id, source]));
    const importedByDossier = Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));
    const selectedDossier = DOSSIERS.find((dossier) => dossier.id === selectedDossierId) ?? DOSSIERS[0];
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
                    {DOSSIERS.map((dossier) => {
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
                        <span aria-hidden="true">{entry.available ? "?" : "?"}</span>
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

function PromiseVoteReviewPage({ embedded = false }) {
    const [selectedDossierId, setSelectedDossierId] = useState("all");
    const statementItems = buildPromiseVoteStatementItems();
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
                {DOSSIERS.filter((dossier) => statementItems.some((item) => item.dossierId === dossier.id)).map((dossier) => (
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

function EditorialHub() {
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
                                {item.vote.title} ? {voteLabel(item.vote.voted)}
                            </p>

                            <p>{item.explanation}</p>

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
    if (verdict === "broken") return "?";
    if (verdict === "kept") return "?";
    if (verdict === "mixed") return "?";
    return "•";
}

function voteLabel(vote) {
    if (vote === "for") return "Voor";
    if (vote === "against") return "Tegen";
    return vote;
}

export default App;

