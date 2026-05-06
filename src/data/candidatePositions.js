export const CANDIDATE_STATUSES = {
    needsReview: "Review nodig",
    approved: "Goedgekeurd",
    rejected: "Afgewezen",
    needsSource: "Bron ontbreekt"
};

export const CANDIDATE_POSITIONS = [
    {
        id: "candidate-wonen-d66-betaalbaar-bouwen",
        issueId: "betaalbaar-bouwen",
        dossierId: "wonen",
        party: "D66",
        position: "for",
        statement: "Meer betaalbare woningen bouwen, met nadruk op duurzame nieuwbouw en betere benutting van bestaande ruimte.",
        explanation: "Deze kandidaatpositie staat in de reviewwachtrij en mag pas live na controle van exact citaat, pagina en formulering.",
        how: "Via een doorbouwfonds, hergebruik van bestaande gebouwen en een grotere rol voor woningcorporaties.",
        pros: [
            "Kan betaalbare woningbouw op gang houden",
            "Legt nadruk op sociale huur en woningcorporaties"
        ],
        cons: [
            "Vraagt publieke financiering en uitvoering",
            "Exacte effecten hangen af van lokale bouwcapaciteit"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Nieuwe energie voor Nederland",
            url: "https://dnpprepo.ub.rug.nl/87786/7/D66%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: 52,
            quote: "D66 wil voorkomen dat de bouw van betaalbare woningen stilvalt."
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-04",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-04",
        status: "needsReview",
        reviewerNotes: "Bronquote en pagina toegevoegd; reviewer moet nog controleren of de samenvatting niet breder is dan de passage."
    },
    {
        id: "candidate-klimaat-cda-realistisch",
        issueId: "klimaatbeleid-uitvoerbaarheid",
        dossierId: "klimaat",
        party: "CDA",
        position: "mixed",
        statement: "Klimaatbeleid moet haalbaar en betaalbaar zijn, met aandacht voor gezinnen, bedrijven en regio's.",
        explanation: "Deze kandidaatpositie staat in de reviewwachtrij en mag pas live na controle van exact citaat, pagina en formulering.",
        how: "Via groene industriepolitiek, kernenergie en klimaatbeleid dat banen en bedrijven in Nederland houdt.",
        pros: [
            "Verbindt klimaatdoelen aan werkgelegenheid en uitvoerbaarheid",
            "Kan draagvlak vergroten bij bedrijven en regio's"
        ],
        cons: [
            "Kan leiden tot langzamer tempo bij strengere klimaatmaatregelen",
            "Begrip 'realistisch' vraagt verdere politieke duiding"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Recht doen",
            url: "https://dnpprepo.ub.rug.nl/87714/7/CDA%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: 12,
            quote: "Klimaatbeleid moet ambitieus, realistisch en sociaal zijn."
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-04",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-04",
        status: "needsReview",
        reviewerNotes: "Bronquote en pagina toegevoegd; reviewer moet nog beoordelen of 'haalbaar en betaalbaar' voldoende door deze passage wordt gedragen."
    },
    {
        id: "candidate-wonen-vvd-procedures-regels",
        issueId: "bouwprocedures",
        dossierId: "wonen",
        party: "VVD",
        position: "for",
        statement: "Sneller bouwen door procedures en regels te verminderen.",
        explanation: "Deze kandidaatpositie koppelt de VVD-woninglijn aan versnelling van woningbouw door juridische en administratieve drempels te verlagen.",
        how: "Door juridische procedures te vereenvoudigen, gemeentelijke regels meer gelijk te trekken en vergunningen voor kleine bouwprojecten te vergemakkelijken.",
        pros: [
            "Kan bouwprojecten sneller uitvoerbaar maken",
            "Minder administratieve lasten voor bouwers en gemeenten"
        ],
        cons: [
            "Minder regels kan botsen met inspraak, natuur of ruimtelijke kwaliteit",
            "Snellere procedures garanderen nog geen betaalbaarheid"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Ruimte geven. Grenzen stellen.",
            url: "https://www.vvd.nl/wp-content/uploads/2023/10/Verkiezingsprogramma-VVD-2023-2027.pdf",
            publishedAt: "2023-09-23",
            page: 55,
            quote: "We zetten een mes in procedures en regels."
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Bronquote en pagina toegevoegd; reviewer moet nagaan of de concrete beleidsuitleg volledig door de omliggende passage wordt gedragen."
    },
    {
        id: "candidate-klimaat-volt-2040",
        issueId: "klimaatneutraliteit-2040",
        dossierId: "klimaat",
        party: "Volt",
        position: "for",
        statement: "Nederland en Europa moeten in 2040 klimaatneutraal zijn.",
        explanation: "Deze kandidaatpositie legt de nadruk op Europees gecoördineerd klimaatbeleid met een vroeg klimaatneutraliteitsdoel.",
        how: "Via Europese klimaatafspraken, afbouw van fossiele subsidies, schonere energie en strengere keuzes rond vervuilende sectoren.",
        pros: [
            "Duidelijk langetermijndoel voor klimaatbeleid",
            "Past bij grensoverschrijdende aanpak via de EU"
        ],
        cons: [
            "Vraagt grote en snelle aanpassingen van economie en gedrag",
            "Kosten en verdelingseffecten moeten scherp worden bewaakt"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Toekomst, nu. Een Europees verhaal van optimisme",
            url: "https://dnpprepo.ub.rug.nl/87719/7/VoltNL%20Verkiezingsprogramma%202023.pdf",
            publishedAt: "2023-09-23",
            page: 3,
            quote: "Nederland en de EU moeten klimaatneutraal zijn in 2040."
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Bronquote en pagina toegevoegd; reviewer moet de gekozen samenvatting en EU/Nederland-scope controleren."
    }
];
