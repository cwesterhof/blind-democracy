import { useState, useEffect } from "react";
import { fetchMembers } from "../api/membersApi";
import { ISSUES } from "../data/issues";
import Matcher from "../components/Matcher";

const issueById = Object.fromEntries(ISSUES.map((issue) => [issue.id, issue]));

export default function Politicians() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [partyFilter, setPartyFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchMembers().then((data) => {
            setMembers(data);
            setSelected(data.find((member) => member.positions) ?? data[0] ?? null);
            setLoading(false);
        });
    }, []);

    const parties = ["all", ...new Set(members.map((member) => member.party).sort())];
    const completedProfiles = members.filter((member) => member.positions).length;

    const partyCounts = members.reduce((acc, member) => {
        acc[member.party] = (acc[member.party] || 0) + 1;
        return acc;
    }, {});

    const filtered = members.filter((member) => {
        const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase());
        const matchesParty = partyFilter === "all" || member.party === partyFilter;
        return matchesSearch && matchesParty;
    });

    if (loading) {
        return <main className="loading-state">Laden...</main>;
    }

    return (
        <main className="app-shell">
            <section className="directory-panel" aria-label="Politici zoeken">
                <div className="panel-heading">
                    <div>
                        <h2>Politici</h2>
                        <p>{members.length} profielen, {completedProfiles} met standpunten</p>
                    </div>
                    <span className="data-pill">Dataset</span>
                </div>

                <label className="search-field">
                    <span>Zoek op naam</span>
                    <input
                        type="search"
                        placeholder="Bijvoorbeeld Wilders of Dassen"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>

                <div className="filter-group" aria-label="Filter op partij">
                    {parties.map((party) => (
                        <button
                            className={partyFilter === party ? "chip chip-active" : "chip"}
                            key={party}
                            onClick={() => setPartyFilter(party)}
                            type="button"
                        >
                            {party === "all" ? `Alle (${members.length})` : `${party} (${partyCounts[party]})`}
                        </button>
                    ))}
                </div>

                <div className="list-meta">Zichtbaar: {filtered.length}</div>

                <div className="member-list">
                    {filtered.map((member) => (
                        <button
                            className={selected?.id === member.id ? "member-row member-row-selected" : "member-row"}
                            key={member.id}
                            onClick={() => setSelected(member)}
                            type="button"
                        >
                            <span>
                                <strong>{member.name}</strong>
                                <small>{member.party}</small>
                            </span>
                            {!member.positions && <em>Geen data</em>}
                        </button>
                    ))}

                    {filtered.length === 0 && <p className="empty-state">Geen resultaten gevonden.</p>}
                </div>
            </section>

            <section className="detail-panel" aria-label="Politicus en matcher">
                {selected ? <PoliticianDetail member={selected} /> : <p className="empty-state">Selecteer een politicus.</p>}
                <Matcher members={members} />
            </section>
        </main>
    );
}

function PoliticianDetail({ member }) {
    const positions = member.positions ? Object.entries(member.positions) : [];

    return (
        <article className="detail-card">
            <div className="detail-title">
                <div>
                    <p className="eyebrow">{member.party}</p>
                    <h2>{member.name}</h2>
                </div>
                <span className={positions.length ? "status-badge complete" : "status-badge incomplete"}>
                    {positions.length ? `${positions.length} standpunten` : "Nog geen standpunten"}
                </span>
            </div>

            <div className="position-list">
                {positions.length > 0 ? (
                    positions.map(([issueId, value]) => (
                        <div className="position-row" key={issueId}>
                            <span>{issueById[issueId]?.title ?? issueId}</span>
                            <strong>{labelPosition(value)}</strong>
                        </div>
                    ))
                ) : (
                    <p className="empty-state">Voor dit profiel zijn nog geen standpunten ingevoerd.</p>
                )}
            </div>
        </article>
    );
}

function labelPosition(value) {
    if (value === "for") return "Voor";
    if (value === "against") return "Tegen";
    return "Neutraal";
}
