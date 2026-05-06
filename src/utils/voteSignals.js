export function getDisplayVoteSummary(zaak) {
    const besluitSummary = (zaak.besluiten ?? []).find((besluit) => besluit.voteSummary?.totalVotes > 0)?.voteSummary;

    return dedupeVoteSummary(besluitSummary ?? zaak.voteSummary);
}

export function dedupeVoteSummary(voteSummary) {
    if (!voteSummary?.parties?.length) return voteSummary;

    const partiesByName = new Map();

    voteSummary.parties.forEach((item) => {
        if (!item.party || partiesByName.has(item.party)) return;
        partiesByName.set(item.party, item);
    });

    const parties = [...partiesByName.values()];
    const byVote = parties.reduce((acc, item) => {
        acc[item.vote] = (acc[item.vote] ?? 0) + (item.seats || 1);
        return acc;
    }, {});

    return {
        ...voteSummary,
        totalVotes: parties.length,
        totalSeats: Object.values(byVote).reduce((sum, seats) => sum + seats, 0),
        byVote,
        parties
    };
}

export function getPartiesByVote(voteSummary, vote) {
    return voteSummary.parties
        .filter((item) => item.vote === vote)
        .map((item) => item.party)
        .sort((a, b) => a.localeCompare(b, "nl"));
}

export function getVoteStats(zaak) {
    const voteSummary = getDisplayVoteSummary(zaak);

    if (!voteSummary?.totalVotes) return null;

    const forSeats = voteSummary.byVote?.Voor ?? 0;
    const againstSeats = voteSummary.byVote?.Tegen ?? 0;

    return {
        accepted: forSeats > againstSeats,
        forSeats,
        againstSeats,
        totalVotes: voteSummary.totalSeats,
        forParties: getPartiesByVote(voteSummary, "Voor"),
        againstParties: getPartiesByVote(voteSummary, "Tegen")
    };
}

export function getPartyDossierVoteSignal(party, importedDossier) {
    if (!importedDossier?.zaken?.length) {
        return {
            label: "Geen dossierdata",
            detail: "Voor dit dossier is nog geen Kamerdata gekoppeld.",
            tone: "unknown"
        };
    }

    const votes = importedDossier.zaken
        .map((zaak) => getDisplayVoteSummary(zaak)?.parties?.find((item) => item.party === party)?.vote)
        .filter(Boolean);

    if (votes.length === 0) {
        return {
            label: "Geen fractiestem gevonden",
            detail: `${party} komt in de gekoppelde stemmingen niet voor.`,
            tone: "unknown"
        };
    }

    const forCount = votes.filter((vote) => vote === "Voor").length;
    const againstCount = votes.filter((vote) => vote === "Tegen").length;
    const otherCount = votes.length - forCount - againstCount;
    const direction = forCount === againstCount
        ? "gemengd"
        : forCount > againstCount ? "meestal voor" : "meestal tegen";

    return {
        label: `${votes.length} stemmingen · ${direction}`,
        detail: `${forCount} voor · ${againstCount} tegen${otherCount ? ` · ${otherCount} anders` : ""}`,
        tone: forCount === againstCount ? "mixed" : forCount > againstCount ? "support" : "oppose"
    };
}

export function getPromiseVoteSignal(position, importedDossier) {
    const links = position.voteLinks ?? [];

    if (links.length === 0) {
        return {
            label: "Nog niet gekoppeld",
            detail: "Dit standpunt heeft nog geen expliciete Kamerstemming als toets.",
            tone: "unknown"
        };
    }

    const evaluated = links.map((link) => {
        const zaak = importedDossier?.zaken?.find((item) => item.number === link.zaakNumber || item.id === link.zaakId);
        const partyVote = getDisplayVoteSummary(zaak)?.parties?.find((item) => item.party === position.party)?.vote;

        return {
            ...link,
            zaak,
            partyVote,
            matches: partyVote === link.expectedVote
        };
    });

    const withVotes = evaluated.filter((item) => item.partyVote);

    if (withVotes.length === 0) {
        return {
            label: "Stem nog niet gevonden",
            detail: `Wel gekoppeld aan ${links.length} Kamerzaak${links.length === 1 ? "" : "en"}, maar geen fractiestem gevonden.`,
            tone: "unknown"
        };
    }

    const matches = withVotes.filter((item) => item.matches).length;
    const score = Math.round((matches / withVotes.length) * 100);
    const weakLinks = withVotes.filter((item) => item.confidence === "weak").length;
    const first = withVotes[0];
    const label = score === 100
        ? "Komt overeen"
        : score === 0 ? "Wijkt af" : "Gemengd beeld";
    const tone = score === 100 ? "kept" : score === 0 ? "broken" : "mixed";

    return {
        label,
        detail: `${matches}/${withVotes.length} gekoppelde stemmingen matchen · verwacht ${first.expectedVote}, stemde ${first.partyVote}${weakLinks ? " · zwakke koppeling" : ""}`,
        tone
    };
}
