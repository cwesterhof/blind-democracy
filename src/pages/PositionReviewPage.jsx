import { useEffect, useMemo, useState } from "react";
import members from "../data/members.json";
import { CANDIDATE_POSITIONS, CANDIDATE_STATUSES } from "../data/candidatePositions";
import { mapDossiersById } from "../dataAccess/dossiers";
import {
    daysSince,
    extractionConfidenceLabel,
    extractionMethodLabel,
    extractionSummaryLabel,
    formatDate,
    formatDaysSince,
    getSourcePageUrl,
    positionDirectionLabel
} from "../utils/formatting";

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

const REVIEW_STATUS_GROUPS = [
    { id: "needsReview", label: "Review nodig" },
    { id: "needsSource", label: "Meer bron nodig" },
    { id: "approved", label: "Goedgekeurd" },
    { id: "rejected", label: "Afgewezen" }
];

const REVIEW_QUEUE_STORAGE_KEY = "blind-democracy.review-queue.v1";

function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export default function PositionReviewPage() {
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
                    <button onClick={() => downloadJson(reviewReport, "blind-democracy-review-report.json")} type="button">
                        Exporteer reviewrapport
                    </button>
                    <button onClick={() => downloadJson(promotedPositions, "blind-democracy-approved-positions.json")} type="button">
                        Exporteer approved positions
                    </button>
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
                        <span>Richting t.o.v. huidige situatie</span>
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
                                <small style={{ color: "var(--muted)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                    Voor = partij steunt dit beleid. Tegen = partij wil dit afschaffen of verminderen.
                                </small>
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
