import { DOSSIERS } from "./dossiers.js";
import importedTweedeKamer from "./importedTweedeKamer.json";
import members from "./members.json";
import { PARTY_POSITIONS } from "./partyPositions.js";

const partiesFromVotes = new Set();
const voteCases = importedTweedeKamer.dossiers.flatMap((dossier) =>
    dossier.zaken.filter((zaak) => zaak.voteSummary?.totalVotes > 0)
);

voteCases.forEach((zaak) => {
    zaak.voteSummary.parties.forEach((item) => partiesFromVotes.add(item.party));
});

const partiesFromPositions = new Set(PARTY_POSITIONS.map((position) => position.party));

const partiesFromMembers = new Set(members.map((member) => member.party));

export const RELIABILITY_DIMENSIONS = [
    {
        id: "voteCoverage",
        label: "Stemgedrag",
        description: "Hoeveel officiele fractiestemmingen zijn aan deze partij gekoppeld?"
    },
    {
        id: "positionTraceability",
        label: "Standpunt-herkomst",
        description: "Hoeveel standpunten zijn gekoppeld aan een partijpositie in de dossiers?"
    },
    {
        id: "promiseVoteMatch",
        label: "Belofte vs stem",
        description: "Vergelijking tussen verkiezingsprogramma en werkelijk stemgedrag."
    },
    {
        id: "claimAccuracy",
        label: "Claim-accuratesse",
        description: "Factcheck-score van publieke claims."
    }
];

export function buildPartyReliability() {
    const parties = [...new Set([...partiesFromVotes, ...partiesFromPositions, ...partiesFromMembers])].sort((a, b) =>
        a.localeCompare(b, "nl")
    );
    const maxVoteAppearances = Math.max(1, voteCases.length);

    return parties.map((party) => {
        const voteAppearances = voteCases.filter((zaak) =>
            zaak.voteSummary.parties.some((item) => item.party === party)
        ).length;
        const partyPositions = PARTY_POSITIONS.filter((position) => position.party === party);
        const codedPositions = new Set(partyPositions.map((position) => position.dossierId)).size;
        const reviewedPositions = partyPositions.filter((position) => position.reviewedByHuman).length;
        const memberCount = members.filter((member) => member.party === party).length;

        const dimensions = {
            voteCoverage: scoreDimension(
                Math.round((voteAppearances / maxVoteAppearances) * 100),
                `${voteAppearances}/${maxVoteAppearances} zaken met fractiestem`,
                "official"
            ),
            positionTraceability: scoreDimension(
                Math.round((codedPositions / DOSSIERS.length) * 100),
                `${codedPositions}/${DOSSIERS.length} dossiers met bronstructuur; ${reviewedPositions} menselijk gereviewd`,
                reviewedPositions > 0 ? "reviewed-source" : "source-mapped"
            ),
            promiseVoteMatch: missingDimension("Nog geen verkiezingsprogramma-koppeling"),
            claimAccuracy: missingDimension("Nog geen factcheck-desk data")
        };

        return {
            party,
            memberCount,
            score: averageKnownScore(dimensions),
            scoreLabel: knownScoreLabel(dimensions),
            dimensions
        };
    });
}

export function buildMemberReliability() {
    const partyReliability = Object.fromEntries(buildPartyReliability().map((party) => [party.party, party]));

    return members.map((member) => {
        const profilePositions = member.positions ? Object.keys(member.positions).length : 0;
        const partyScore = partyReliability[member.party]?.dimensions.voteCoverage.score ?? null;
        const dimensions = {
            voteCoverage: partyScore === null
                ? missingDimension("Partijstemmen nog niet gekoppeld")
                : scoreDimension(partyScore, `Gebaseerd op fractiestemmen van ${member.party}`, "official-party"),
            positionTraceability: scoreDimension(
                Math.round((profilePositions / 3) * 100),
                `${profilePositions}/3 profielstandpunten aanwezig`,
                "local-profile"
            ),
            promiseVoteMatch: missingDimension("Persoonlijke belofte-vs-stem analyse ontbreekt"),
            claimAccuracy: missingDimension("Nog geen geverifieerde claims")
        };

        return {
            id: member.id,
            name: member.name,
            party: member.party,
            score: averageKnownScore(dimensions),
            scoreLabel: knownScoreLabel(dimensions),
            dimensions
        };
    }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "nl"));
}

function scoreDimension(score, note, sourceType) {
    return {
        score,
        note,
        sourceType,
        status: "available"
    };
}

function missingDimension(note) {
    return {
        score: null,
        note,
        sourceType: "missing",
        status: "missing"
    };
}

function averageKnownScore(dimensions) {
    const scores = Object.values(dimensions)
        .map((dimension) => dimension.score)
        .filter((score) => typeof score === "number");

    if (scores.length === 0) return 0;

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function knownScoreLabel(dimensions) {
    const known = Object.values(dimensions).filter((dimension) => typeof dimension.score === "number").length;
    return `${known}/${Object.keys(dimensions).length} meetpunten`;
}

