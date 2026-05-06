import { useMemo, useState } from "react";
import { countDossiers, getDefaultDossier, listDossiers } from "../dataAccess/dossiers";
import { mapImportedDossiersById } from "../dataAccess/kamerVotes";
import { POSITION_CONFIDENCE } from "../dataAccess/positions";
import { mapSourcesById } from "../dataAccess/sources";
import HeroSlider from "../components/HeroSlider";
import { DossierSources, EvidenceData, ImpactData, ImportedKamerData } from "../components/DossierData";
import { cardClass, dossierNavClass } from "../utils/classNames";
import { getBlindPositionsForDossier } from "../utils/blindPositions";
import { formatPartyList } from "../utils/formatting";
import {
    getDisplayVoteSummary,
    getPartyDossierVoteSignal,
    getPromiseVoteSignal
} from "../utils/voteSignals";

const DATA_TABS = [
    { id: "stemgedrag", label: "Stemgedrag" },
    { id: "bewijs", label: "Bewijsniveau" },
    { id: "impact", label: "Impact" },
    { id: "bronnen", label: "Bronnen" }
];

export default function BlindTestPage({ partyReliability = [], setPage, mobileNavOpen }) {
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
        const dossiers = listDossiers();
        const currentIndex = dossiers.findIndex((dossier) => dossier.id === activeDossier.id);
        const next = dossiers[currentIndex + 1] ?? getDefaultDossier();
        chooseDossier(next.id);
    }

    return (
        <>
            <div className={showPriorityModal ? "app-content blurred" : "app-content"}>
                <HeroSlider setPage={setPage} paused={mobileNavOpen} />

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

