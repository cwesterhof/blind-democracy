import { useTranslation } from "react-i18next";
import { EVIDENCE_LEVELS } from "../dataAccess/dossiers";
import { DOSSIER_STATUSES } from "../dataAccess/sources";
import { POSITION_CONFIDENCE } from "../dataAccess/positions";
import { formatDate, shortTitle, slugifyType } from "../utils/formatting";
import { getVoteStats } from "../utils/voteSignals";

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
    const { t } = useTranslation();
    const voteStats = getVoteStats(zaak);
    const status = voteStats ? (voteStats.accepted ? t("votes.accepted") : t("votes.rejected")) : t("votes.noData");
    const statusClass = voteStats ? (voteStats.accepted ? "accepted" : "rejected") : "no-data";

    return (
        <details className={`${voteStats ? "kamer-item has-votes" : "kamer-item"} zaak-type-${slugifyType(zaak.type)}`}>
            <summary className="kamer-summary">
                <span className={`kamer-rail ${statusClass}`} aria-hidden="true" />
                <span className="kamer-summary-copy">
                    <span className="kamer-type">{zaak.number ? `${zaak.number} · ${zaak.type}` : zaak.type}</span>
                    <strong>{shortTitle(zaak.title)}</strong>
                    <span className={`kamer-vote-line ${statusClass}`}>
                        {voteStats ? status : t("votes.noVoteFound")}
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
                            {t("votes.viewCase")}
                        </a>
                    </div>
                </div>
            </div>
        </details>
    );
}

function VotePartyBreakdown({ zaak }) {
    const { t } = useTranslation();
    const voteStats = getVoteStats(zaak);

    if (!voteStats) {
        return <p className="no-votes">{t("votes.noVoteFound")}.</p>;
    }

    return (
        <div className="vote-detail-panel">
            <div className={voteStats.accepted ? "vote-outcome accepted" : "vote-outcome rejected"}>
                <span>{voteStats.accepted ? t("votes.passed") : t("votes.failed")}</span>
                <strong>{voteStats.forSeats} {t("votes.for").toLowerCase()} · {voteStats.againstSeats} {t("votes.against").toLowerCase()}</strong>
                <small>{voteStats.totalVotes} zetels geteld</small>
            </div>
            <div className="vote-columns">
                <VotePartyColumn label={t("votes.for")} parties={voteStats.forParties} tone="for" />
                <VotePartyColumn label={t("votes.against")} parties={voteStats.againstParties} tone="against" />
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

export {
    DossierSources,
    EvidenceData,
    ImpactData,
    ImportedKamerData
};
