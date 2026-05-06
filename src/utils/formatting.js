export function formatDate(dateValue) {
    return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(dateValue));
}

export function formatDaysSince(dateValue) {
    if (!dateValue) return "Nog onbekend";

    const daysOpen = daysSince(dateValue);

    return `${daysOpen} ${daysOpen === 1 ? "dag" : "dagen"}`;
}

export function daysSince(dateValue) {
    if (!dateValue) return null;

    const startDate = new Date(dateValue);
    const today = new Date();
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.max(0, Math.floor((currentDay - startDay) / 86400000));
}

export function getSourcePageUrl(source) {
    if (!source?.url || !source?.page) return source?.url ?? "#";

    return `${source.url}#page=${source.page}`;
}

export function extractionMethodLabel(method) {
    const labels = {
        "manual-seed": "Handmatig ingevoerd",
        manual: "Handmatig ingevoerd",
        ai: "Automatisch voorgesteld",
        "ai-extraction": "Automatisch voorgesteld",
        import: "Geimporteerd uit brondata",
        "local-seed": "Voorbeelddata"
    };

    return labels[method] ?? "Herkomst onbekend";
}

export function extractionConfidenceLabel(confidence) {
    const labels = {
        high: "Hoge zekerheid",
        medium: "Middelmatige zekerheid",
        low: "Lage zekerheid",
        weak: "Zwakke koppeling"
    };

    return labels[confidence] ?? "Zekerheid onbekend";
}

export function extractionSummaryLabel(extraction) {
    return `${extractionMethodLabel(extraction?.method)} · ${extractionConfidenceLabel(extraction?.confidence)}`;
}

export function positionDirectionLabel(position) {
    const labels = {
        for: "Voor",
        against: "Tegen",
        neutral: "Neutraal",
        mixed: "Gemengd",
        unknown: "Richting nog onbekend"
    };

    return labels[position] ?? "Richting nog onbekend";
}

export function formatPartyList(parties) {
    if (parties.length <= 1) return parties[0] ?? "";
    if (parties.length === 2) return parties.join(" en ");

    return `${parties.slice(0, -1).join(", ")} en ${parties.at(-1)}`;
}

export function shortTitle(title, max = 95) {
    if (!title) return "";
    return title.length > max ? `${title.slice(0, max)}...` : title;
}

export function slugifyType(type) {
    const slug = String(type)
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("/", "-");

    if (slug.includes("wetgeving")) return "wetgeving";
    if (slug.includes("motie")) return "motie";
    if (slug.includes("amendement")) return "amendement";
    if (slug.includes("begroting")) return "begroting";
    if (slug.includes("brief")) return "brief";

    return "overig";
}

export function partyInitials(party) {
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

export function personInitials(name) {
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts.at(-1)[0] : "";

    return `${first}${last}`.toUpperCase();
}
