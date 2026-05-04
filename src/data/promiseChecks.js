export const PROMISE_VERDICTS = {
    kept: "Belofte gehouden",
    broken: "Belofte gebroken",
    mixed: "Gemengd beeld",
    unclear: "Nog onduidelijk"
};

export const PROMISE_CHECKS = [
    {
        id: "test-gebroken-belofte-zorg",
        type: "party",
        party: "TESTPARTIJ",
        politician: null,
        dossierId: "zorg",
        promise: "Wij beloven het eigen risico volledig af te schaffen.",
        promiseSource: {
            title: "Test verkiezingsprogramma",
            url: "#"
        },
        vote: {
            title: "Voorstel afschaffen eigen risico",
            voted: "against",
            date: "2024-06-12",
            sourceUrl: "#"
        },
        verdict: "broken",
        explanation:
            "Deze testpartij beloofde het eigen risico af te schaffen, maar stemde tegen een voorstel dat precies dat doel ondersteunt."
    },
    {
        id: "vvd-wonen-betaalbare-huur",
        type: "party",
        party: "VVD",
        politician: null,
        dossierId: "wonen",
        promise: "Meer woningen bouwen en de woningmarkt beter laten werken.",
        promiseSource: {
            title: "Verkiezingsprogramma VVD",
            url: "#"
        },
        vote: {
            title: "Wet betaalbare huur",
            voted: "against",
            date: "2024-04-25",
            sourceUrl: "#"
        },
        verdict: "mixed",
        explanation:
            "De VVD zet sterk in op meer bouw en marktwerking. Tegenstemmen bij huurregulering is daarom niet automatisch een gebroken belofte, maar het schuurt wel met betaalbaarheid voor huurders."
    },
    {
        id: "sp-zorg-eigen-risico",
        type: "party",
        party: "SP",
        politician: null,
        dossierId: "zorg",
        promise: "Het eigen risico moet worden afgeschaft.",
        promiseSource: {
            title: "Verkiezingsprogramma SP",
            url: "#"
        },
        vote: {
            title: "Voorstel verlaging eigen risico",
            voted: "for",
            date: "2024-06-12",
            sourceUrl: "#"
        },
        verdict: "kept",
        explanation:
            "De stem sluit aan bij de belofte om zorgkosten voor patiënten direct te verlagen."
    },
    {
        id: "fvd-klimaat-klimaatfonds",
        type: "party",
        party: "FVD",
        politician: null,
        dossierId: "klimaat",
        promise: "Stoppen met duur nationaal klimaatbeleid.",
        promiseSource: {
            title: "Verkiezingsprogramma FVD",
            url: "#"
        },
        vote: {
            title: "Klimaatfonds",
            voted: "against",
            date: "2023-12-19",
            sourceUrl: "#"
        },
        verdict: "kept",
        explanation:
            "Tegenstemmen bij extra klimaatuitgaven past bij de belofte om nationaal klimaatbeleid af te remmen."
    },
    {
        id: "d66-immigratie-eu-verdeling",
        type: "party",
        party: "D66",
        politician: null,
        dossierId: "immigratie",
        promise: "Meer Europese samenwerking en eerlijkere verdeling van asielopvang.",
        promiseSource: {
            title: "Verkiezingsprogramma D66",
            url: "#"
        },
        vote: {
            title: "Spreidingswet",
            voted: "for",
            date: "2024-01-23",
            sourceUrl: "#"
        },
        verdict: "kept",
        explanation:
            "Voorstemmen bij verdeling van opvang sluit aan bij de belofte om opvang eerlijker te organiseren."
    },
    {
        id: "pvv-immigratie-spreidingswet",
        type: "party",
        party: "PVV",
        politician: null,
        dossierId: "immigratie",
        promise: "Asielinstroom beperken en verplichte opvang tegengaan.",
        promiseSource: {
            title: "Verkiezingsprogramma PVV",
            url: "#"
        },
        vote: {
            title: "Spreidingswet",
            voted: "against",
            date: "2024-01-23",
            sourceUrl: "#"
        },
        verdict: "kept",
        explanation:
            "Tegenstemmen bij verplichte verdeling van opvang past bij de belofte om asielbeleid strenger te maken."
    }
];