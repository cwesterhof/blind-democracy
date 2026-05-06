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
    },
    {
        id: "candidate-zorg-pvv-eigenrisico",
        issueId: "eigen-risico",
        dossierId: "zorg",
        party: "PVV",
        position: "against",
        statement: "Het eigen risico moet volledig worden afgeschaft.",
        explanation: "De PVV wil dat mensen geen eigen risico meer betalen bij zorggebruik. Zorg moet voor iedereen toegankelijk zijn, ongeacht inkomen.",
        how: "Door het eigen risico wettelijk af te schaffen en de kosten via belastingen op te vangen.",
        pros: [
            "Zorgt dat mensen niet om financiële redenen zorg mijden",
            "Vergroot toegankelijkheid voor lage inkomens"
        ],
        cons: [
            "Hogere collectieve zorgkosten",
            "Minder financiële prikkel om zorg bewust te gebruiken"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Verkiezingsprogramma PVV 2023-2027",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en exact citaat nog controleren in het PVV-programma. Kernstandpunt is consistent met PVV-lijn in debatten."
    },
    {
        id: "candidate-zorg-vvd-marktwerking",
        issueId: "marktwerking-zorg",
        dossierId: "zorg",
        party: "VVD",
        position: "for",
        statement: "Marktwerking in de zorg behouden, maar onnodige bureaucratie aanpakken.",
        explanation: "De VVD wil concurrentie tussen zorgaanbieders in stand houden omdat dit kwaliteit en efficiency bevordert, maar wil de administratieve lasten voor zorgverleners fors verminderen.",
        how: "Door regeldruk te verminderen, inkoop te vereenvoudigen en zorgverleners meer autonomie te geven binnen het bestaande stelsel.",
        pros: [
            "Minder administratiedruk voor zorgverleners",
            "Concurrentie houdt prikkels voor kwaliteit in stand"
        ],
        cons: [
            "Marktwerking leidt niet altijd tot betere toegankelijkheid",
            "Kleine aanbieders kunnen verdwijnen bij concurrentiedruk"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Ruimte geven. Grenzen stellen.",
            url: "https://www.vvd.nl/wp-content/uploads/2023/10/Verkiezingsprogramma-VVD-2023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. VVD-lijn op marktwerking is consistent maar nuanceer of het programma ook expliciet het eigen risico bespreekt."
    },
    {
        id: "candidate-zorg-glpvda-eigenrisico-afschaffen",
        issueId: "eigen-risico",
        dossierId: "zorg",
        party: "GroenLinks-PvdA",
        position: "against",
        statement: "Het eigen risico afschaffen en vervangen door een inkomensafhankelijke bijdrage.",
        explanation: "GroenLinks-PvdA wil dat mensen naar draagkracht bijdragen aan zorgkosten. Het huidige vaste eigen risico treft lage inkomens onevenredig hard.",
        how: "Door het eigen risico te vervangen door een inkomensafhankelijke premie of bijdrage, zodat niemand zorg mijdt om financiële redenen.",
        pros: [
            "Eerlijker verdeling van zorgkosten naar inkomen",
            "Vermindert zorgmijding bij lage inkomens"
        ],
        cons: [
            "Complexer uitvoerbaar dan een vast eigen risico",
            "Hogere lasten voor hogere inkomens"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Samen voor een hoopvolle toekomst",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Citaat en paginanummer nog controleren. GroenLinks en PvdA hadden beide afschaffing eigen risico in hun programma's — na fusie consistent."
    },
    {
        id: "candidate-zorg-d66-preventie",
        issueId: "preventie-zorg",
        dossierId: "zorg",
        party: "D66",
        position: "for",
        statement: "Meer investeren in preventie en de positie van de huisarts versterken.",
        explanation: "D66 wil de nadruk verschuiven van dure ziekenhuiszorg naar vroegtijdige preventie en sterke eerstelijnszorg. De huisarts als centrale spil in het zorgstelsel.",
        how: "Door preventiebudgetten te verhogen, huisartspraktijken te versterken en verwijzingen naar dure ziekenhuiszorg te beperken via goede eerstelijnsopvang.",
        pros: [
            "Gezondere bevolking op lange termijn",
            "Minder druk op dure ziekenhuiszorg"
        ],
        cons: [
            "Preventie-effecten zijn langzaam zichtbaar",
            "Huisartstekort maakt opschaling moeilijk"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Nieuwe energie voor Nederland",
            url: "https://dnpprepo.ub.rug.nl/87786/7/D66%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. D66-focus op preventie en eerstelijn is een consistent programmapunt."
    },
    {
        id: "candidate-zorg-cda-stelselhervorming",
        issueId: "zorgstelsel",
        dossierId: "zorg",
        party: "CDA",
        position: "mixed",
        statement: "Het zorgstelsel hervormen: minder marktwerking, meer samenwerking en regionale zorg.",
        explanation: "Het CDA wil af van puur marktdenken in de zorg en pleit voor meer samenwerking tussen zorgaanbieders, met nadruk op regio's en gemeenschappen.",
        how: "Door regionale zorgakkoorden, meer samenwerking tussen ziekenhuizen en huisartsen, en minder nadruk op aanbesteding en concurrentie.",
        pros: [
            "Meer aandacht voor continuïteit en samenwerking",
            "Sterker regionaal zorgstelsel dichtbij de burger"
        ],
        cons: [
            "Minder concurrentieprikkels kan efficiency drukken",
            "Regionale oplossingen werken niet overal even goed"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Recht doen",
            url: "https://dnpprepo.ub.rug.nl/87714/7/CDA%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. CDA-lijn op zorg combineert sociale en gemeenschapsgerichte waarden."
    },
    {
        id: "candidate-zorg-sp-nationaliseren",
        issueId: "marktwerking-zorg",
        dossierId: "zorg",
        party: "SP",
        position: "against",
        statement: "Marktwerking uit de zorg halen en zorg als publieke voorziening organiseren.",
        explanation: "De SP wil een fundamentele breuk met het marktmodel in de zorg. Zorg moet worden aangestuurd als publieke dienst, zonder winstoogmerk.",
        how: "Door zorgverzekeraars te vervangen door een nationaal zorgfonds, winsten in de zorg te verbieden en zorgverleners meer zeggenschap te geven.",
        pros: [
            "Geen winstuitkering in de zorg",
            "Meer zeggenschap voor zorgverleners en patiënten"
        ],
        cons: [
            "Grote stelselwijziging vereist lange overgangsperiode",
            "Risico op bureaucratie bij centrale aansturing"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Een beter Nederland voor minder geld",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. SP-standpunt op nationaal zorgfonds is een kernconcept in het programma."
    },
    {
        id: "candidate-zorg-bbb-platteland",
        issueId: "toegankelijkheid-zorg",
        dossierId: "zorg",
        party: "BBB",
        position: "for",
        statement: "Ziekenhuizen en huisartsenposten in regio's open houden — zorg dichtbij de burger.",
        explanation: "BBB maakt zich sterk voor behoud van zorgvoorzieningen buiten de Randstad. Sluiting van ziekenhuizen en spoedposten in regio's treft plattelandsgemeenschappen onevenredig hard.",
        how: "Door sluiting van regionale ziekenhuizen en spoedposten tegen te gaan, en extra middelen vrij te maken voor zorgverleners buiten stedelijke gebieden.",
        pros: [
            "Behoud van zorg dichtbij voor mensen in regio's",
            "Minder reistijd bij spoedeisende hulp"
        ],
        cons: [
            "Kleine ziekenhuizen zijn duurder per behandeling",
            "Moeilijker om specialistische kwaliteit te waarborgen"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Uit de klei getrokken",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. BBB-focus op regio en platteland is het centrale thema in vrijwel alle beleidsterreinen."
    },
    {
        id: "candidate-zorg-christenunie-ggz",
        issueId: "ggz-toegankelijkheid",
        dossierId: "zorg",
        party: "ChristenUnie",
        position: "for",
        statement: "Wachttijden in de ggz aanpakken en mentale gezondheid centraal stellen.",
        explanation: "De ChristenUnie wil dat mensen met psychische klachten niet maanden hoeven te wachten op hulp. De ggz verdient extra aandacht en middelen.",
        how: "Door wachttijden in de ggz wettelijk aan te pakken, meer ggz-personeel op te leiden en laagdrempelige mentale ondersteuning in de wijk te organiseren.",
        pros: [
            "Kortere wachttijden voor mensen met psychische klachten",
            "Meer aandacht voor mentale gezondheid als volwaardig onderdeel van zorg"
        ],
        cons: [
            "Personeelstekort in ggz moeilijk snel op te lossen",
            "Vraagt structureel meer budget"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Zonder jou klopt de samenleving niet",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. ChristenUnie legt nadruk op menswaardige zorg en ggz in meerdere programmadelen."
    },
    {
        id: "candidate-zorg-volt-europese-samenwerking",
        issueId: "zorgstelsel",
        dossierId: "zorg",
        party: "Volt",
        position: "for",
        statement: "Europese samenwerking in zorg versterken voor goedkopere medicijnen en gedeelde kennis.",
        explanation: "Volt wil dat Nederland actief samenwerkt op Europees niveau voor gezamenlijke inkoop van medicijnen, gedeeld medisch onderzoek en grensoverschrijdende zorg.",
        how: "Door Europese inkoopcoalities voor dure medicijnen, harmonisatie van kwaliteitsnormen en samenwerking in medisch onderzoek te bevorderen.",
        pros: [
            "Lagere medicijnprijzen door gezamenlijke inkoop",
            "Meer innovatie door gedeeld onderzoek"
        ],
        cons: [
            "Nationale soevereiniteit over zorgstelsel wordt deels ingeleverd",
            "Europese besluitvorming is traag"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Volt Nederland Verkiezingsprogramma 2023",
            url: "https://dnpprepo.ub.rug.nl/87719/7/VoltNL%20Verkiezingsprogramma%202023.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. Volt-focus op Europese samenwerking geldt ook voor zorg."
    },
    {
        id: "candidate-zorg-denk-gelijkheid",
        issueId: "toegankelijkheid-zorg",
        dossierId: "zorg",
        party: "DENK",
        position: "for",
        statement: "Gelijke toegang tot zorg voor iedereen, ongeacht achtergrond of inkomen.",
        explanation: "DENK constateert dat mensen met een migratieachtergrond of lager inkomen slechter toegang hebben tot goede zorg. Dat ongelijk moet worden aangepakt.",
        how: "Door laagdrempelige zorg in achterstandswijken te versterken, cultureel sensitieve zorg te bevorderen en eigen risico te verlagen voor lage inkomens.",
        pros: [
            "Betere gezondheidsuitkomsten voor kwetsbare groepen",
            "Meer vertrouwen in de zorg bij diverse bevolkingsgroepen"
        ],
        cons: [
            "Extra middelen vereist voor gerichte aanpak",
            "Uitvoering vraagt samenwerking met gemeenten en zorgverzekeraars"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "DENK Verkiezingsprogramma 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. DENK-focus op gelijkheid en diversiteit is centraal programmathema."
    },
    {
        id: "candidate-zorg-pvda-personeel",
        issueId: "zorgpersoneel",
        dossierId: "zorg",
        party: "PvdD",
        position: "for",
        statement: "Zorgpersoneel beter belonen en werkdruk verlagen om de zorg toekomstbestendig te maken.",
        explanation: "De Partij voor de Dieren wil dat zorgverleners betere arbeidsomstandigheden en hogere salarissen krijgen. Zonder goed personeel is goede zorg niet mogelijk.",
        how: "Door salarissen in de zorg te verhogen, werkdruk te verminderen via betere personeelsratios en onnodige administratie te schrappen.",
        pros: [
            "Meer mensen willen in de zorg werken",
            "Minder uitstroom van ervaren zorgverleners"
        ],
        cons: [
            "Hogere loonkosten verhogen de zorguitgaven",
            "Arbeidsmarkt voor zorg blijft krap bij vergrijzing"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Partij voor de Dieren Verkiezingsprogramma 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. PvdD-focus op werknemersrechten geldt breed, ook in de zorg."
    },

    // ─────────────────────────────────────────────
    // DOSSIER: ECONOMIE & KOOPKRACHT
    // Thema: belasting, minimumloon, inflatie, middeninkomens, verdeling van welvaart
    // ─────────────────────────────────────────────

    {
        id: "candidate-economie-pvv-koopkracht",
        issueId: "koopkracht-lage-inkomens",
        dossierId: "economie",
        party: "PVV",
        position: "for",
        statement: "Koopkracht van gewone Nederlanders herstellen door belastingen te verlagen en energie goedkoper te maken.",
        explanation: "De PVV wil dat werkende Nederlanders meer overhouden van hun loon. Lagere energiebelasting en inkomstenbelasting moeten de koopkracht direct verbeteren.",
        how: "Door energiebelasting te verlagen, btw op boodschappen te verminderen en de inkomstenbelasting voor lage en middeninkomens te verlagen.",
        pros: [
            "Direct meer geld in de portemonnee voor werkenden",
            "Lagere energiekosten helpen huishoudens met krappe budgetten"
        ],
        cons: [
            "Minder belastinginkomsten voor publieke voorzieningen",
            "Voordeel treft hogere inkomens ook, niet gericht op laagste inkomens"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Verkiezingsprogramma PVV 2023-2027",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. PVV-focus op koopkracht via lagere belasting is consistent programmapunt."
    },
    {
        id: "candidate-economie-vvd-ondernemers",
        issueId: "ondernemersklimaat",
        dossierId: "economie",
        party: "VVD",
        position: "for",
        statement: "Sterke economie door ruimte voor ondernemers, innovatie en beperking van overheidsuitgaven.",
        explanation: "De VVD wil dat Nederland aantrekkelijk blijft voor bedrijven en ondernemers. Minder regeldruk, lagere lasten op arbeid en een houdbare begroting zijn de kern.",
        how: "Door bedrijfsbelastingen concurrerend te houden, onnodige regelgeving te schrappen en overheidsuitgaven te beperken tot kerntaken.",
        pros: [
            "Aantrekkelijk vestigingsklimaat voor bedrijven",
            "Meer banen door ondernemersvriendelijk beleid"
        ],
        cons: [
            "Minder overheidsinvestering in publieke voorzieningen",
            "Verdeling van welvaart staat minder centraal"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Ruimte geven. Grenzen stellen.",
            url: "https://www.vvd.nl/wp-content/uploads/2023/10/Verkiezingsprogramma-VVD-2023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. VVD-lijn op economie is consistent: groei via vrijheid voor ondernemers."
    },
    {
        id: "candidate-economie-glpvda-vermogensbelasting",
        issueId: "vermogensverdeling",
        dossierId: "economie",
        party: "GroenLinks-PvdA",
        position: "for",
        statement: "Grote vermogens en multinationals zwaarder belasten om publieke voorzieningen te financieren.",
        explanation: "GroenLinks-PvdA wil de belastingdruk verschuiven van arbeid naar vermogen. Mensen die werken moeten minder belasting betalen, grote vermogens meer.",
        how: "Door een hogere vermogensbelasting, aanpak van belastingontwijking door multinationals en een eerlijker box 3-stelsel.",
        pros: [
            "Eerlijkere verdeling van belastingdruk",
            "Meer middelen voor zorg, onderwijs en klimaat"
        ],
        cons: [
            "Risico op kapitaalvlucht bij te hoge vermogensbelasting",
            "Complexe uitvoering van vermogensbelasting"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Samen voor een hoopvolle toekomst",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. Vermogensbelasting is een van de kernpunten van het fusiedeel van het programma."
    },
    {
        id: "candidate-economie-d66-innovatie",
        issueId: "innovatie-economie",
        dossierId: "economie",
        party: "D66",
        position: "for",
        statement: "Investeren in kennis, innovatie en de economie van de toekomst.",
        explanation: "D66 wil dat Nederland zich positioneert als kenniseconomie. Investeren in onderwijs, onderzoek en duurzame industrie is de sleutel tot welvaart op lange termijn.",
        how: "Door het onderwijs- en onderzoeksbudget te verhogen, startups te ondersteunen en de overgang naar een duurzame economie actief te financieren.",
        pros: [
            "Sterke kenniseconomie genereert hoogwaardige banen",
            "Investering in innovatie verhoogt langetermijnwelvaart"
        ],
        cons: [
            "Effecten van innovatiebeleid zijn pas op lange termijn zichtbaar",
            "Niet iedereen profiteert direct van kenniseconomie"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Nieuwe energie voor Nederland",
            url: "https://dnpprepo.ub.rug.nl/87786/7/D66%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. D66-focus op kennis en innovatie is een consistent programmapunt."
    },
    {
        id: "candidate-economie-cda-middeninkomens",
        issueId: "middeninkomens",
        dossierId: "economie",
        party: "CDA",
        position: "for",
        statement: "Middeninkomens verlichten — zij verdienen te veel voor toeslagen maar te weinig om rond te komen.",
        explanation: "Het CDA ziet de middeninkomens als de vergeten groep: te hoog voor veel toeslagen, maar te laag om alle kosten goed te dragen. Gerichte lastenverlichting is nodig.",
        how: "Door belastingschijven aan te passen, toeslagdrempels te verhogen en de armoedeval te verminderen zodat werken meer loont.",
        pros: [
            "Gerichte hulp voor een grote groep die buiten de boot valt",
            "Minder armoedeval vergroot arbeidsprikkel"
        ],
        cons: [
            "Belastingvoordelen voor middeninkomens kosten de schatkist",
            "Definitie van 'middeninkomen' is politiek omstreden"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Recht doen",
            url: "https://dnpprepo.ub.rug.nl/87714/7/CDA%20Verkiezingsprogramma%202023-2027.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. CDA-focus op middeninkomens is een kernthema."
    },
    {
        id: "candidate-economie-sp-bestaanszekerheid",
        issueId: "bestaanszekerheid",
        dossierId: "economie",
        party: "SP",
        position: "for",
        statement: "Bestaanszekerheid voor iedereen: hogere minimumlonen, lagere huren en gratis basisdiensten.",
        explanation: "De SP wil dat mensen zeker kunnen zijn van een fatsoenlijk bestaan. Hogere minimumlonen, betaalbare huren en gratis of goedkope basisvoorzieningen zijn de pijlers.",
        how: "Door het minimumloon verder te verhogen, huren te reguleren, en basisvoorzienigen als openbaar vervoer en energie te vergoedkopen of gratis aan te bieden voor lage inkomens.",
        pros: [
            "Directe verbetering voor laagste inkomens",
            "Minder bestaansonzekerheid vergroot sociale stabiliteit"
        ],
        cons: [
            "Hogere minimumlonen kunnen werkgelegenheid drukken",
            "Gratis basisdiensten vragen grote publieke financiering"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Een beter Nederland voor minder geld",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. Bestaanszekerheid is het centrale thema van het SP-programma."
    },
    {
        id: "candidate-economie-bbb-regionale-economie",
        issueId: "regionale-economie",
        dossierId: "economie",
        party: "BBB",
        position: "for",
        statement: "Economische investeringen niet alleen in de Randstad maar ook in regio's en het platteland.",
        explanation: "BBB wil dat de economische welvaart eerlijker verdeeld wordt over Nederland. Regio's buiten de Randstad lopen achter op het gebied van infrastructuur, werkgelegenheid en voorzieningen.",
        how: "Door rijksinvesteringen te spreiden, regionale bedrijven te ondersteunen en infrastructuur buiten de Randstad te verbeteren.",
        pros: [
            "Eerlijkere verdeling van economische kansen",
            "Minder druk op de Randstad"
        ],
        cons: [
            "Investeringen in dunbevolkte gebieden hebben lagere economische return",
            "Moeilijk te concurreren met agglomeratievoordelen van steden"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Uit de klei getrokken",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. Regionale economie is een kernthema voor BBB."
    },
    {
        id: "candidate-economie-christenunie-eerlijke-handel",
        issueId: "eerlijke-economie",
        dossierId: "economie",
        party: "ChristenUnie",
        position: "for",
        statement: "Een eerlijke economie: goed werk, rechtvaardige beloning en aandacht voor mensen die buiten de boot vallen.",
        explanation: "De ChristenUnie wil een economie die mensen dient in plaats van andersom. Eerlijke lonen, goed werk en een vangnet voor wie het niet redt zijn centrale waarden.",
        how: "Door arbeidsrechten te versterken, belastingontwijking aan te pakken en een sociaal vangnet te waarborgen dat mensen daadwerkelijk helpt.",
        pros: [
            "Meer menswaardige arbeidsomstandigheden",
            "Sterker vangnet voor kwetsbare groepen"
        ],
        cons: [
            "Hogere arbeidskosten kunnen werkgelegenheid beïnvloeden",
            "Meer regelgeving kan flexibiliteit voor bedrijven beperken"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Zonder jou klopt de samenleving niet",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. ChristenUnie combineert sociale en economische rechtvaardigheid als kernwaarden."
    },
    {
        id: "candidate-economie-volt-eurobonds",
        issueId: "europese-economie",
        dossierId: "economie",
        party: "Volt",
        position: "for",
        statement: "Europese economische samenwerking verdiepen met gezamenlijke investeringen en eerlijke belasting.",
        explanation: "Volt wil dat Europa economisch sterker wordt door gezamenlijk te investeren in de toekomst — klimaat, digitalisering, defensie — en multinationals eerlijk te belasten.",
        how: "Door Europese investeringsfondsen, gezamenlijke minimumbelasting voor bedrijven en harmonisatie van economisch beleid binnen de EU.",
        pros: [
            "Meer Europese slagkracht tegenover grote economieën als VS en China",
            "Eerlijkere belasting van multinationals via minimumtarief"
        ],
        cons: [
            "Nederland draagt netto bij aan Europese fondsen",
            "Minder nationale zeggenschap over economisch beleid"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Volt Nederland Verkiezingsprogramma 2023",
            url: "https://dnpprepo.ub.rug.nl/87719/7/VoltNL%20Verkiezingsprogramma%202023.pdf",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. Europese economische integratie is het centrale Volt-thema."
    },
    {
        id: "candidate-economie-denk-koopkracht-diversiteit",
        issueId: "koopkracht-lage-inkomens",
        dossierId: "economie",
        party: "DENK",
        position: "for",
        statement: "Koopkracht verbeteren voor mensen met lage inkomens en aanpak van discriminatie op de arbeidsmarkt.",
        explanation: "DENK signaleert dat mensen met een migratieachtergrond vaker in onzeker werk zitten en minder verdienen. Gelijkheid op de arbeidsmarkt en betere koopkracht voor lagere inkomens zijn de prioriteiten.",
        how: "Door discriminatie op de arbeidsmarkt actief te bestrijden, minimumloon te verhogen en gerichte koopkrachtmaatregelen voor lage inkomens te nemen.",
        pros: [
            "Meer gelijke kansen op de arbeidsmarkt",
            "Betere bestaanszekerheid voor kwetsbare groepen"
        ],
        cons: [
            "Handhaving van anti-discriminatiebeleid is complex",
            "Minimumloonverhoging heeft effect op kleine werkgevers"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "DENK Verkiezingsprogramma 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. DENK combineert koopkracht met arbeidsmarktdiscriminatie als centraal thema."
    },
    {
        id: "candidate-economie-pvdd-groei-loslaten",
        issueId: "duurzame-economie",
        dossierId: "economie",
        party: "PvdD",
        position: "against",
        statement: "Stop met het nastreven van economische groei als doel op zich — kies voor een economie binnen planetaire grenzen.",
        explanation: "De Partij voor de Dieren wil een fundamentele koerswijziging: welzijn en duurzaamheid boven bbp-groei. De economie moet dienstbaar zijn aan mensen en natuur.",
        how: "Door bbp als welzijnsmaatstaf te vervangen door bredere welzijnsindicatoren, fossiele subsidies af te bouwen en te investeren in een circulaire economie.",
        pros: [
            "Economie die binnen de draagkracht van de aarde blijft",
            "Meer focus op welzijn in plaats van consumptie"
        ],
        cons: [
            "Minder groei kan op korte termijn banen kosten",
            "Politiek moeilijk verkoopbaar bij bredere bevolking"
        ],
        source: {
            type: "verkiezingsprogramma",
            title: "Partij voor de Dieren Verkiezingsprogramma 2023",
            url: "https://www.rug.nl/research/dnpp/verkiezingen/tweede-kamer/verkiezingsprogrammas-tk2023",
            publishedAt: "2023-09-23",
            page: null,
            quote: null
        },
        extraction: {
            method: "manual-seed",
            extractedAt: "2026-05-06",
            confidence: "high"
        },
        receivedForReviewAt: "2026-05-06",
        status: "needsReview",
        reviewerNotes: "Paginanummer en citaat nog controleren. PvdD-standpunt op economie is radicaal anders dan andere partijen — dat contrast is waardevol voor de blind test."
    },
];
