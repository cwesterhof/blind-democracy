import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    PROMISE_CHECKS,
    PROMISE_EVIDENCE_LEVELS,
    PROMISE_OWNER_TYPES,
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
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("partij");
    const sortedChecks = [...PROMISE_CHECKS].sort((a, b) => {
        const order = { broken: 1, mixed: 2, unclear: 3, kept: 4 };
        return order[a.verdict] - order[b.verdict];
    });

    return (
        <main className="reliability-page">
            <header className="page-heading">
                <p className="eyebrow">De Leugendetector</p>
                <h1>{t("liedetector.title")}</h1>
                <p>{t("liedetector.intro")}</p>
            </header>

            <section className="hub-tabs inline-tabs" aria-label="Leugendetector weergave">
                <button className={activeTab === "partij" ? "active" : ""} onClick={() => setActiveTab("partij")} type="button">
                    {t("liedetector.byParty")}
                </button>
                <button className={activeTab === "stelling" ? "active" : ""} onClick={() => setActiveTab("stelling")} type="button">
                    {t("liedetector.byStatement")}
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
                                    {verdictIcon(item.verdict)} {verdictLabel(item.verdict, t)}
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

                            <strong>{t("liedetector.promise")}</strong>
                            <p>{item.promise}</p>

                            <strong>{t("liedetector.vote")}</strong>
                            <p>{item.vote.title} — {voteLabel(item.vote.voted, t)}</p>

                            <p>{item.explanation}</p>
                            <p className="promise-evidence-note">{promiseEvidenceNote(item)}</p>

                            <div className="promise-source-row">
                                <a href={item.promiseSource.url} rel="noreferrer" target="_blank">
                                    {t("liedetector.promiseSource")}
                                </a>
                                <a href={item.vote.sourceUrl} rel="noreferrer" target="_blank">
                                    {t("liedetector.voteSource")}
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
    if (verdict === "broken") return "✗";
    if (verdict === "kept") return "✓";
    if (verdict === "mixed") return "~";
    return "•";
}

function verdictLabel(verdict, t) {
    if (verdict === "kept") return t("liedetector.verdictKept");
    if (verdict === "broken") return t("liedetector.verdictBroken");
    if (verdict === "mixed") return t("liedetector.verdictMixed");
    return verdict;
}

function voteLabel(vote, t) {
    if (vote === "for") return t("votes.for");
    if (vote === "against") return t("votes.against");
    return vote;
}
