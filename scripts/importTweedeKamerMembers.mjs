import fs from "node:fs/promises";
import path from "node:path";

const TK_BASE = "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0";
const OUTPUT = path.resolve("src/data/members.json");

function resourceUrl(entity, id) {
    return `${TK_BASE}/${entity}(${id})/Resource`;
}

function fullName(person) {
    const first = person.Roepnaam || person.Voornamen || person.Initialen || "";
    const last = [person.Tussenvoegsel, person.Achternaam].filter(Boolean).join(" ");
    return [first, last].filter(Boolean).join(" ").trim();
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

async function fetchJson(url) {
    const response = await fetch(url, { headers: { accept: "application/json" } });

    if (!response.ok) {
        throw new Error(`Tweede Kamer API ${response.status}: ${url}`);
    }

    return response.json();
}

async function main() {
    const query = new URL(`${TK_BASE}/FractieZetelPersoon`);
    query.searchParams.set("$filter", "Verwijderd eq false and TotEnMet eq null");
    query.searchParams.set("$top", "250");
    query.searchParams.set("$expand", "Persoon,FractieZetel($expand=Fractie)");

    const data = await fetchJson(query.toString());
    const members = data.value
        .map((seatPerson) => {
            const person = seatPerson.Persoon;
            const party = seatPerson.FractieZetel?.Fractie;

            if (!person || person.Functie !== "Tweede Kamerlid" || !party?.Afkorting) return null;

            const name = fullName(person);
            const partyLabel = party.Afkorting;

            return {
                id: slugify(`${name}-${person.Id.slice(0, 8)}`),
                apiId: person.Id,
                name,
                party: partyLabel,
                partyName: party.NaamNL,
                role: person.Functie,
                photoUrl: person.ContentType ? resourceUrl("Persoon", person.Id) : null,
                partyLogoUrl: party.ContentType ? resourceUrl("Fractie", party.Id) : null,
                seatSince: seatPerson.Van,
                source: "Tweede Kamer Open Data",
                sourceUrl: `${TK_BASE}/Persoon(${person.Id})`,
                importedAt: new Date().toISOString()
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.party.localeCompare(b.party, "nl") || a.name.localeCompare(b.name, "nl"));

    await fs.writeFile(OUTPUT, `${JSON.stringify(members, null, 2)}\n`, "utf8");
    console.log(`Imported ${members.length} active Tweede Kamer members to ${OUTPUT}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
