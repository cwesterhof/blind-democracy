import { useState } from "react";
import {
    PROMISE_CHECKS,
    PROMISE_EVIDENCE_LEVELS,
    PROMISE_OWNER_TYPES,
    PROMISE_VERDICTS,
    PROMISE_VOTE_LEVELS
} from "../data/promiseChecks";
import PromiseVoteReviewPage from "./PromiseVoteReviewPage";

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

export default function LieDetectorPage() {
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
                                {item.vote.title} — {voteLabel(item.vote.voted)}
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
