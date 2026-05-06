import { useState } from "react";
import { RELIABILITY_DIMENSIONS } from "../data/reliability";

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

export default function ReliabilityHub({ memberReliability, partyReliability }) {
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
                        <span aria-hidden="true">{entry.available ? "✓" : "✗"}</span>
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
            available: (dimensions.positionTraceability.score ?? 0) >= 100,
            text: (dimensions.positionTraceability.score ?? 0) >= 100
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

