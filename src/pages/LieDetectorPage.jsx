import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PROMISE_CHECKS } from "../data/promiseChecks";
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
                        <PromiseCard key={item.id} item={item} t={t} />
                    ))}
                </section>
            )}

            {activeTab === "stelling" && <PromiseVoteReviewPage embedded />}
        </main>
    );
}

function PromiseCard({ item, t }) {
    const expectedVote = item.expectedVote ?? "unclear";

    return (
        <article className={`promise-card verdict-${item.verdict}`}>
            <div className="promise-card-header">
                <div>
                    <p className="eyebrow">{item.dossierId}</p>
                    <h2>{promiseOwnerLabel(item)}</h2>
                </div>
                <span className={`verdict-badge verdict-${item.verdict}`}>
                    {verdictIcon(item.verdict)} {verdictLabel(item.verdict, t)}
                </span>
            </div>

            <div className="promise-comparison">
                <div className="promise-vote-box expected">
                    <span>{t("liedetector.expectedVote")}</span>
                    <strong className={`vote-value-${expectedVote}`}>
                        {voteValueLabel(expectedVote, t)}
                    </strong>
                </div>
                <div className={`promise-match-indicator verdict-${item.verdict}`} aria-hidden="true">
                    {verdictIcon(item.verdict)}
                </div>
                <div className="promise-vote-box actual">
                    <span>{t("liedetector.actualVote")}</span>
                    <strong className={`vote-value-${item.vote.voted}`}>
                        {voteValueLabel(item.vote.voted, t)}
                    </strong>
                </div>
            </div>

            <div className="promise-detail-sections">
                <div className="promise-section">
                    <span className="promise-section-label">{t("liedetector.promise")}</span>
                    <p>{item.promise}</p>
                </div>
                <div className="promise-section">
                    <span className="promise-section-label">{t("liedetector.vote")}</span>
                    <p>{item.vote.title} — {voteLabel(item.vote.voted, t)}</p>
                </div>
            </div>

            <p className="promise-explanation">{item.explanation}</p>
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
    );
}

function verdictIcon(verdict) {
    if (verdict === "broken") return "✕";
    if (verdict === "kept") return "✓";
    if (verdict === "mixed") return "~";
    return "•";
}

function verdictLabel(verdict, t) {
    if (verdict === "kept") return t("liedetector.verdictKept");
    if (verdict === "broken") return t("liedetector.verdictBroken");
    if (verdict === "mixed") return t("liedetector.verdictMixed");
    if (verdict === "unclear") return t("liedetector.verdictUnclear");
    return verdict;
}

function voteValueLabel(vote, t) {
    if (vote === "for") return t("votes.for").toUpperCase();
    if (vote === "against") return t("votes.against").toUpperCase();
    if (vote === "abstain") return t("votes.abstain").toUpperCase();
    return t("votes.unclear").toUpperCase();
}

function voteLabel(vote, t) {
    if (vote === "for") return t("votes.for");
    if (vote === "against") return t("votes.against");
    return vote;
}
