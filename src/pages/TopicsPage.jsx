import { useMemo, useState } from "react";
import { getDefaultDossier, listDossiers } from "../dataAccess/dossiers";
import { mapImportedDossiersById } from "../dataAccess/kamerVotes";
import { POSITION_CONFIDENCE } from "../dataAccess/positions";
import { mapSourcesById } from "../dataAccess/sources";
import { DossierSources, EvidenceData, ImpactData, ImportedKamerData } from "../components/DossierData";
import { getBlindPositionsForDossier } from "../utils/blindPositions";

export default function TopicsPage() {
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
