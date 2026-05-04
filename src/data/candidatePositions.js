export const CANDIDATE_STATUSES = {
    needsReview: "Review nodig",
    approved: "Goedgekeurd",
    rejected: "Afgewezen",
    needsSource: "Bron ontbreekt"
};

export const CANDIDATE_POSITIONS = [
    {
        id: "candidate-wonen-d66-betaalbaar-bouwen",
        dossierId: "wonen",
        party: "D66",
        statement: "Meer betaalbare woningen bouwen, met nadruk op duurzame nieuwbouw en betere benutting van bestaande ruimte.",
        explanation: "Deze kandidaatpositie is bedoeld als voorbeeld van hoe een geextraheerd programma-standpunt in review komt voordat het live gaat.",
        source: {
            type: "verkiezingsprogramma",
            title: "Nieuwe energie voor Nederland",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-04",
            confidence: "medium"
        },
        status: "needsReview",
        reviewerNotes: "Exact citaat en pagina uit verkiezingsprogramma toevoegen voordat dit live mag."
    },
    {
        id: "candidate-klimaat-cda-realistisch",
        dossierId: "klimaat",
        party: "CDA",
        statement: "Klimaatbeleid moet haalbaar en betaalbaar zijn, met aandacht voor gezinnen, bedrijven en regio's.",
        explanation: "Voorbeeldkandidaat voor een klimaatpositie die nog niet als gecontroleerde bronpositie mag worden gebruikt.",
        source: {
            type: "verkiezingsprogramma",
            title: "Recht doen",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-04",
            confidence: "medium"
        },
        status: "needsReview",
        reviewerNotes: "Controleer of deze formulering de partijpositie niet te sterk samenvat."
    }
];
