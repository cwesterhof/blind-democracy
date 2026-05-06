import { useMemo, useState } from "react";
import { listDossiers, mapDossiersById } from "../dataAccess/dossiers";
import { mapImportedDossiersById } from "../dataAccess/kamerVotes";
import { listApprovedPositions, listApprovedPositionsForDossier } from "../dataAccess/positions";
import { shortTitle } from "../utils/formatting";
import { getDisplayVoteSummary } from "../utils/voteSignals";

const PROMISE_REVIEW_STATUSES = {
    approved: "Betrouwbaar",
    review: "Review nodig",
    missing: "Stem ontbreekt",
    uncoded: "Belofte ontbreekt"
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

export default function PromiseVoteReviewPage({ embedded = false }) {
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
