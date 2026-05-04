import { useMemo, useState } from "react";
import { ISSUES } from "../data/issues";

const ANSWER_OPTIONS = ["for", "neutral", "against"];

export default function Matcher({ members }) {
    const [answers, setAnswers] = useState({});
    const [revealed, setRevealed] = useState(false);

    function setAnswer(issueId, value) {
        setAnswers((prev) => ({
            ...prev,
            [issueId]: value
        }));
        setRevealed(false);
    }

    const answeredCount = Object.keys(answers).length;
    const profilesWithPositions = members.filter((member) => member.positions).length;

    const results = useMemo(() => {
        return members
            .map((member) => {
                const comparisons = compare(member, answers);
                const known = comparisons.filter((comparison) => comparison.result !== "unknown");
                const matches = known.filter((comparison) => comparison.result === "match").length;

                return {
                    ...member,
                    comparisons,
                    knownCount: known.length,
                    match: known.length === 0 ? null : Math.round((matches / known.length) * 100)
                };
            })
            .filter((member) => member.knownCount > 0)
            .sort((a, b) => b.match - a.match || b.knownCount - a.knownCount)
            .slice(0, 5);
    }, [answers, members]);

    const topMatch = results[0];

    return (
        <section className="matcher-panel">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Matcher</p>
                    <h2>Match jezelf</h2>
                </div>
                <span className="status-badge incomplete">
                    {profilesWithPositions}/{members.length} profielen compleet
                </span>
            </div>

            <div className="issue-grid">
                {ISSUES.map((issue) => (
                    <div className="issue-card" key={issue.id}>
                        <h3>{issue.title}</h3>
                        <p>{issue.description}</p>

                        <div className="answer-group">
                            {ANSWER_OPTIONS.map((value) => (
                                <button
                                    className={answers[issue.id] === value ? "answer-button active" : "answer-button"}
                                    key={value}
                                    onClick={() => setAnswer(issue.id, value)}
                                    type="button"
                                >
                                    {label(value)}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="reveal-cta">
                <button
                    className="primary-action"
                    disabled={answeredCount === 0}
                    onClick={() => setRevealed(true)}
                    type="button"
                >
                    Onthul mijn match
                </button>
                <p>
                    Gebaseerd op {answeredCount} van {ISSUES.length} antwoorden.
                </p>
            </div>

            {revealed && topMatch && (
                <div className="reveal-block">
                    <p className="eyebrow">Je koos dit</p>
                    <h2>{topMatch.party}</h2>
                    <p>
                        Niet omdat je de partij koos. Maar omdat je het eens was met het beleid.
                    </p>
                </div>
            )}

            {!revealed && answeredCount > 0 && (
                <p className="empty-state">Je antwoorden zijn opgeslagen. Onthul je match wanneer je klaar bent.</p>
            )}

            {revealed && (
                <>
                    <div className="results-heading">
                        <h3>Top matches</h3>
                        <p>Gebaseerd op {answeredCount} van {ISSUES.length} antwoorden.</p>
                    </div>

                    {results.length === 0 && (
                        <p className="empty-state">
                            Er zijn nog geen ingevoerde standpunten die met je antwoorden vergeleken kunnen worden.
                        </p>
                    )}

                    <div className="match-list">
                        {results.map((member, index) => (
                            <article className={index === 0 ? "match-card selected-match" : "match-card"} key={member.id}>
                                <div className="match-topline">
                                    <div>
                                        <strong>{member.name}</strong>
                                        <small>{member.party} · {member.knownCount} vergelijkbare standpunten</small>
                                    </div>
                                    <span>{member.match}%</span>
                                </div>

                                <div className="score-track" aria-hidden="true">
                                    <div className="score-fill" style={{ width: `${member.match}%`, background: scoreColor(member.match) }} />
                                </div>

                                <div className="comparison-list">
                                    {member.comparisons.map((comparison) => (
                                        <div className={`comparison-row ${comparison.result}`} key={comparison.issue.id}>
                                            <span>{comparison.issue.title}</span>
                                            <strong>{resultLabel(comparison.result)}</strong>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

function compare(member, answers) {
    return ISSUES.map((issue) => {
        const user = answers[issue.id];
        const politician = member.positions?.[issue.id];

        if (!user || !politician) {
            return { issue, result: "unknown" };
        }

        return { issue, result: user === politician ? "match" : "mismatch" };
    });
}

function label(value) {
    if (value === "for") return "Voor";
    if (value === "against") return "Tegen";
    return "Neutraal";
}

function resultLabel(result) {
    if (result === "match") return "Match";
    if (result === "mismatch") return "Verschil";
    return "Onbekend";
}

function scoreColor(score) {
    if (score > 70) return "#2f7d5c";
    if (score > 40) return "#bd7a22";
    return "#b94a48";
}