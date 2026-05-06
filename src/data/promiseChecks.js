export const PROMISE_VERDICTS = {
    kept: "Belofte gehouden",
    broken: "Belofte gebroken",
    mixed: "Gemengd beeld",
    unclear: "Nog onduidelijk"
};

export const PROMISE_OWNER_TYPES = {
    party: "Partijbelofte",
    person: "Persoonlijke belofte"
};

export const PROMISE_VOTE_LEVELS = {
    party: "Fractiestem",
    person: "Persoonlijke stem"
};

export const PROMISE_EVIDENCE_LEVELS = {
    direct: "Direct bewijs",
    inferredFromPartyVote: "Afgeleid uit fractiestem",
    needsReview: "Review nodig"
};

export const PROMISE_CHECKS = [
    {
        id: "fvd-klimaat-klimaatfonds-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "fvd",
        party: "FVD",
        politician: null,
        politicianId: null,
        dossierId: "klimaat",
        promise: "Stoppen met duur nationaal klimaatbeleid.",
        promiseSource: {
            title: "Verkiezingsprogramma FVD 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Vaststelling begrotingsstaat Klimaatfonds 2026",
            level: "party",
            actorId: "fvd",
            voted: "against",
            date: "2026-05-04",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(c519746c-8d25-4f43-9230-0f957581f9a3)"
        },
        evidenceLevel: "direct",
        verdict: "kept",
        explanation:
            "Tegenstemmen bij de begrotingsstaat van het Klimaatfonds past bij de belofte om nationaal klimaatbeleid en klimaatuitgaven af te remmen."
    },
    {
        id: "vvd-wonen-huurcommissie-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "vvd",
        party: "VVD",
        politician: null,
        politicianId: null,
        dossierId: "wonen",
        promise: "Meer woningen bouwen en procedures op de woningmarkt beter laten werken.",
        promiseSource: {
            title: "Verkiezingsprogramma VVD 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Wet toekomstbestendige huurcommissie",
            level: "party",
            actorId: "vvd",
            voted: "for",
            date: "2026-04-21",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(56cc4a04-48c0-42b2-9fb1-a4911a71faa6)"
        },
        evidenceLevel: "direct",
        verdict: "kept",
        explanation:
            "Voorstemmen bij de Wet toekomstbestendige huurcommissie sluit aan bij de belofte om procedures rond huur en woningmarkt werkbaarder te maken."
    },
    {
        id: "d66-immigratie-tweestatusstelsel-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "d66",
        party: "D66",
        politician: null,
        politicianId: null,
        dossierId: "immigratie",
        promise: "Snellere procedures, betere Europese samenwerking en een juridisch houdbaar migratiestelsel.",
        promiseSource: {
            title: "Verkiezingsprogramma D66 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Wet invoering tweestatusstelsel",
            level: "party",
            actorId: "d66",
            voted: "against",
            date: "2026-04-21",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(5ac89466-e75a-489d-a74e-217222177483)"
        },
        evidenceLevel: "direct",
        verdict: "mixed",
        explanation:
            "Tegenstemmen bij aanscherping van nareis en invoering van een tweestatusstelsel past deels bij een juridisch terughoudender migratielijn, maar de koppeling met Europese verdeling blijft inhoudelijk breder dan deze ene stemming."
    },
    {
        id: "pvv-immigratie-tweestatusstelsel-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "pvv",
        party: "PVV",
        politician: null,
        politicianId: null,
        dossierId: "immigratie",
        promise: "Asielinstroom beperken en nareisregels aanscherpen.",
        promiseSource: {
            title: "Verkiezingsprogramma PVV 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Wet invoering tweestatusstelsel",
            level: "party",
            actorId: "pvv",
            voted: "for",
            date: "2026-04-21",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(5ac89466-e75a-489d-a74e-217222177483)"
        },
        evidenceLevel: "direct",
        verdict: "kept",
        explanation:
            "Voorstemmen bij een tweestatusstelsel en strengere nareisvoorwaarden sluit aan bij de belofte om asielbeleid verder aan te scherpen."
    },
    {
        id: "glpvda-wonen-huurcommissie-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "groenlinks-pvda",
        party: "GroenLinks-PvdA",
        politician: null,
        politicianId: null,
        dossierId: "wonen",
        promise: "Huurders sterker beschermen en publieke regie op betaalbaar wonen vergroten.",
        promiseSource: {
            title: "Verkiezingsprogramma GroenLinks-PvdA 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Wet toekomstbestendige huurcommissie",
            level: "party",
            actorId: "groenlinks-pvda",
            voted: "for",
            date: "2026-04-21",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(56cc4a04-48c0-42b2-9fb1-a4911a71faa6)"
        },
        evidenceLevel: "direct",
        verdict: "kept",
        explanation:
            "Voorstemmen bij versterking en toekomstbestendigheid van huurcommissieprocedures sluit aan bij een lijn waarin huurdersbescherming centraal staat."
    },
    {
        id: "bbb-klimaat-klimaatfonds-2026",
        type: "party",
        promiseOwnerType: "party",
        promiseOwnerId: "bbb",
        party: "BBB",
        politician: null,
        politicianId: null,
        dossierId: "klimaat",
        promise: "Klimaatbeleid moet betaalbaar blijven en rekening houden met landbouw, regio en uitvoerbaarheid.",
        promiseSource: {
            title: "Verkiezingsprogramma BBB 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023"
        },
        vote: {
            title: "Vaststelling begrotingsstaat Klimaatfonds 2026",
            level: "party",
            actorId: "bbb",
            voted: "against",
            date: "2026-05-04",
            sourceUrl: "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Zaak(c519746c-8d25-4f43-9230-0f957581f9a3)"
        },
        evidenceLevel: "direct",
        verdict: "kept",
        explanation:
            "Tegenstemmen bij de begrotingsstaat van het Klimaatfonds past bij een lijn die klimaatuitgaven kritisch weegt op betaalbaarheid en uitvoerbaarheid."
    }
];
