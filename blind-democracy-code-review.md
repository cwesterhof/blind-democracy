# Blind Democracy — Deep Code Review

**Project:** `blind-democracy` · React 19 + Vite + Cloudflare Workers  
**Reviewed:** May 2026  
**Scope:** All source files in `src/`, `scripts/`, `supabase/`, config files

---

## How to read this document

Issues are grouped by **priority tier**, not file. Each item includes the exact problem, where it lives, and a concrete fix you can paste into Codex. Items marked `[CODEX PROMPT]` are ready to hand to Codex as-is.

---

## Priority 1 — Fix before any real traffic

### 1.1 Admin gate is bypassable by anyone

**File:** `src/App.jsx` — `readStoredAdminMode`, `ADMIN_MODE_STORAGE_KEY`

**Problem:** The entire editorial hub is protected only by a `localStorage` boolean. Any visitor can open DevTools and run:

```js
localStorage.setItem("blind-democracy.admin-mode.v1", "true")
```

Then refresh — full access. The `AdminAccessPage` even has a "Lokale adminmodus activeren" button that bypasses it in one click. The `PositionReviewPage` and `PromiseVoteReviewPage` pages, including approve/reject controls and JSON export, are fully exposed.

**Fix:** Until Supabase Auth is live, wrap the editorial hub in an env-variable gate so it only renders in development builds. Add this to `vite.config.js`:

```js
// vite.config.js
export default defineConfig({
  plugins: [react(), cloudflare()],
  define: {
    __DEV_EDITORIAL__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
```

Then in `App.jsx`, replace the `adminMode` localStorage check:

```jsx
// Replace readStoredAdminMode() and the adminMode state entirely:
const adminEnabled = typeof __DEV_EDITORIAL__ !== 'undefined' && __DEV_EDITORIAL__;

// In the render:
{page === "redactie" && adminEnabled
  ? <EditorialHub onDisableAdmin={() => {}} />
  : page === "redactie"
    ? <AdminAccessPage onEnableAdmin={() => {}} />  // No-op in prod
    : null
}

// Also hide the nav item in production:
const visiblePages = PAGES.filter(p => !p.adminOnly || adminEnabled);
```

**Codex prompt:**
> In `App.jsx`, remove the `adminMode` state, `readStoredAdminMode`, `ADMIN_MODE_STORAGE_KEY`, and the `useEffect` that writes to localStorage. Replace the admin gate with a check against a Vite `import.meta.env.DEV` boolean. The editorial hub should only be accessible when `import.meta.env.DEV` is true. The "Lokale adminmodus activeren" button should be removed or disabled in production. Update `vite.config.js` if needed.

---

### 1.2 `App.jsx` is 2,791 lines — split it now before it becomes unmaintainable

**File:** `src/App.jsx`

**Problem:** Every page component, every sub-component, every helper function, and all business logic lives in one file. This makes navigation, diffs, and Codex prompts unreliable — Codex will frequently hit context limits or lose track of what function is in scope.

**Recommended file structure:**

```
src/
  pages/
    BlindTestPage.jsx      (~400 lines — the core test UX)
    TopicsPage.jsx         (~120 lines)
    ReliabilityHub.jsx     (~50 lines — just the tab switcher)
    ReliabilityPage.jsx    (~80 lines — the grid renderer)
    LieDetectorPage.jsx    (~100 lines)
    EditorialHub.jsx       (~40 lines — tab switcher)
    PositionReviewPage.jsx (~500 lines — the review queue)
    PromiseVoteReviewPage.jsx (~120 lines)
    MethodPage.jsx         (~30 lines)
    AdminAccessPage.jsx    (~20 lines)
  components/
    Scoreboard.jsx
    RevealPanel.jsx
    MatchGauge.jsx
    ResultMatrix.jsx
    DataTabs.jsx
    KamerZaakItem.jsx
    VotePartyBreakdown.jsx
    ChosenPositionsSummary.jsx
    ReliabilityCard.jsx
    ReliabilityGauge.jsx
    PartyAvatar.jsx
    PersonAvatar.jsx
    MemberKnowledgeCard.jsx
    CandidateReviewCard.jsx
    PriorityModal.jsx
  hooks/
    useVotingMatches.js
    useReviewQueue.js
  utils/
    formatting.js          (formatDate, formatDaysSince, daysSince, etc.)
    voteSignals.js         (getPartyDossierVoteSignal, getPromiseVoteSignal, etc.)
    classNames.js          (cardClass, dossierNavClass)
    reviewHelpers.js       (applyCandidateReviewEdits, buildLocalReviewReport, etc.)
```

**Codex prompt (run once per section):**
> Extract the `BlindTestPage` function and all functions/components it directly uses from `App.jsx` into a new file `src/pages/BlindTestPage.jsx`. Add the necessary imports at the top. Export `BlindTestPage` as the default export. In `App.jsx`, replace the inline definition with `import BlindTestPage from './pages/BlindTestPage'`. Do not change any logic — this is a pure file split.

Run a separate prompt for each page. Always verify the app still works after each extraction.

---

## Priority 2 — Performance issues

### 2.1 `mapSourcesById()` and `mapImportedDossiersById()` called on every render

**File:** `src/App.jsx` — `BlindTestPage` component body (lines ~40–41)

**Problem:**

```jsx
function BlindTestPage({ partyReliability = [], setPage }) {
    // These run on EVERY render:
    const sourcesById = mapSourcesById();
    const importedByDossier = mapImportedDossiersById();
```

`mapSourcesById()` builds an object from `SOURCE_REGISTRY` on every render. `mapImportedDossiersById()` iterates over the entire `importedTweedeKamer.json` — which contains hundreds of zaken across 15 dossiers — on every render. Since `BlindTestPage` re-renders on every keystroke, modal open/close, and tab switch, this is wasteful.

**Fix:**

```jsx
function BlindTestPage({ partyReliability = [], setPage }) {
    const sourcesById = useMemo(() => mapSourcesById(), []);
    const importedByDossier = useMemo(() => mapImportedDossiersById(), []);
    // rest of component...
```

Same fix applies to `TopicsPage`:

```jsx
function TopicsPage() {
    const sourcesById = useMemo(() => mapSourcesById(), []);
    const importedByDossier = useMemo(() => mapImportedDossiersById(), []);
```

**Codex prompt:**
> In `App.jsx`, find every call to `mapSourcesById()` and `mapImportedDossiersById()` that appears directly in a component function body (not inside `useMemo`). Wrap each one in `useMemo(() => ..., [])`. Make sure the `useMemo` import is already present at the top of the file.

---

### 2.2 `buildPromiseVoteStatementItems()` runs on every render of `PromiseVoteReviewPage`

**File:** `src/App.jsx` — `PromiseVoteReviewPage` component

**Problem:**

```jsx
function PromiseVoteReviewPage({ embedded = false }) {
    const statementItems = buildPromiseVoteStatementItems();  // <-- runs every render
```

`buildPromiseVoteStatementItems()` joins approved positions, imported Kamer data, and vote summaries across all dossiers. It's the most expensive computation in the app. It should run once.

**Fix:**

```jsx
function PromiseVoteReviewPage({ embedded = false }) {
    const statementItems = useMemo(() => buildPromiseVoteStatementItems(), []);
```

Or, since the inputs never change at runtime, move the call outside the component:

```jsx
// Outside the component (module level):
const STATEMENT_ITEMS = buildPromiseVoteStatementItems();

function PromiseVoteReviewPage({ embedded = false }) {
    const [selectedDossierId, setSelectedDossierId] = useState("all");
    const statementItems = STATEMENT_ITEMS;
    // ...
```

---

### 2.3 `reliability.js` runs expensive computation at module load time

**File:** `src/data/reliability.js` — lines 6–22

**Problem:**

```js
// These run the moment the module is imported — before any component mounts:
const partiesFromVotes = new Set();
const voteCases = listImportedVoteCases();  // iterates entire importedTweedeKamer.json

voteCases.forEach((zaak) => {
    zaak.voteSummary.parties.forEach((item) => partiesFromVotes.add(item.party));
});

const partiesFromPositions = new Set(listApprovedPositions().map(...));
const partiesFromMembers = new Set(members.map(...));
const partyMetaByParty = members.reduce(...);
```

This runs at import time, blocking the initial JS parse. Worse, if `importedTweedeKamer.json` grows, this silently gets slower with no visibility.

**Fix:** Lazy-initialize inside the exported functions, using a module-level cache:

```js
let _cache = null;

function getReliabilityCache() {
    if (_cache) return _cache;

    const voteCases = listImportedVoteCases();
    const partiesFromVotes = new Set();
    voteCases.forEach((zaak) => {
        zaak.voteSummary.parties.forEach((item) => partiesFromVotes.add(item.party));
    });

    _cache = {
        voteCases,
        partiesFromVotes,
        partiesFromPositions: new Set(listApprovedPositions().map((p) => p.party)),
        partiesFromMembers: new Set(members.map((m) => m.party)),
        partyMetaByParty: members.reduce((acc, m) => {
            if (!acc[m.party]) acc[m.party] = { partyName: m.partyName, logoUrl: m.partyLogoUrl };
            return acc;
        }, {})
    };
    return _cache;
}

export function buildPartyReliability() {
    const { voteCases, partiesFromVotes, partiesFromPositions, partiesFromMembers, partyMetaByParty } = getReliabilityCache();
    // rest of function unchanged...
```

---

### 2.4 Data URI exports rebuilt every render in `PositionReviewPage`

**File:** `src/App.jsx` — `PositionReviewPage` component

**Problem:**

```jsx
const reviewReportUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reviewReport, null, 2))}`;
const approvedPositionsUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(promotedPositions, null, 2))}`;
```

These serialize the entire review state into encoded URI strings on every render. When `reviewState` is large, this can noticeably freeze the UI.

**Fix:** Convert to click handlers using `Blob` + `URL.createObjectURL`:

```jsx
function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// In the JSX, replace the <a> tags:
<button onClick={() => downloadJson(reviewReport, "blind-democracy-review-report.json")} type="button">
    Exporteer reviewrapport
</button>
<button onClick={() => downloadJson(promotedPositions, "blind-democracy-approved-positions.json")} type="button">
    Exporteer approved positions
</button>
```

---

## Priority 3 — Bugs and correctness issues

### 3.1 Verdict icons are broken characters

**File:** `src/App.jsx` — `verdictIcon()` function

**Problem:**

```js
function verdictIcon(verdict) {
    if (verdict === "broken") return "?";
    if (verdict === "kept") return "?";
    if (verdict === "mixed") return "?";
    return "•";
}
```

The emoji got corrupted (likely a Windows encoding issue with the BOM or a copy-paste from a different encoding). They render as `?` in the browser.

**Fix:**

```js
function verdictIcon(verdict) {
    if (verdict === "broken") return "✗";
    if (verdict === "kept") return "✓";
    if (verdict === "mixed") return "~";
    return "•";
}
```

Or use actual Unicode codepoints to be safe in any editor:

```js
function verdictIcon(verdict) {
    if (verdict === "broken") return "\u2717";  // ✗
    if (verdict === "kept") return "\u2713";    // ✓
    if (verdict === "mixed") return "\u007E";   // ~
    return "\u2022";                            // •
}
```

---

### 3.2 Same issue likely in `MemberKnowledgeCard` — check/cross icons

**File:** `src/App.jsx` — `MemberKnowledgeCard` component

**Problem:**

```jsx
<span aria-hidden="true">{entry.available ? "?" : "?"}</span>
```

Same encoding issue — both states render `?`.

**Fix:**

```jsx
<span aria-hidden="true">{entry.available ? "✓" : "✗"}</span>
```

---

### 3.3 `goToNextDossier` calls `listDossiers()` twice unnecessarily

**File:** `src/App.jsx` — `goToNextDossier` in `BlindTestPage`

**Problem:**

```js
function goToNextDossier() {
    const currentIndex = listDossiers().findIndex((dossier) => dossier.id === activeDossier.id);
    const next = listDossiers()[currentIndex + 1] ?? getDefaultDossier();
    chooseDossier(next.id);
}
```

Minor, but it calls `listDossiers()` twice. One call is enough:

```js
function goToNextDossier() {
    const dossiers = listDossiers();
    const currentIndex = dossiers.findIndex((dossier) => dossier.id === activeDossier.id);
    const next = dossiers[currentIndex + 1] ?? getDefaultDossier();
    chooseDossier(next.id);
}
```

---

### 3.4 `buildMemberChecklist` accesses `.score` on potentially null dimension without guard

**File:** `src/App.jsx` — `buildMemberChecklist`

**Problem:**

```js
{
    id: "positionTraceability",
    available: dimensions.positionTraceability.score !== null && dimensions.positionTraceability.score >= 100,
    text: dimensions.positionTraceability.score >= 100   // <-- what if score is null?
        ? "De belangrijkste standpunten zijn bekend"
        : "We kennen nog niet alle belangrijke standpunten"
},
```

The `available` guard short-circuits correctly, but `text` re-checks `score >= 100` without first checking for null. If `score` is `null`, `null >= 100` evaluates to `false` in JavaScript (no crash, but it could mislead). More importantly, this is a maintainability trap — if someone adds a case where `score` might be `undefined`, it could crash.

**Fix:**

```js
{
    id: "positionTraceability",
    available: (dimensions.positionTraceability.score ?? 0) >= 100,
    text: (dimensions.positionTraceability.score ?? 0) >= 100
        ? "De belangrijkste standpunten zijn bekend"
        : "We kennen nog niet alle belangrijke standpunten"
},
```

---

### 3.5 `getDefaultDossier()` silently returns `DOSSIERS[0]` — crashes if array is empty

**File:** `src/dataAccess/dossiers.js`

**Problem:**

```js
export function getDefaultDossier() {
    return DOSSIERS[0];
}
```

If `DOSSIERS` is ever empty (e.g., a bad import, a future dynamic load), every component that calls this will crash with `Cannot read properties of undefined`.

**Fix:**

```js
export function getDefaultDossier() {
    if (DOSSIERS.length === 0) throw new Error("No dossiers configured — check src/data/dossiers.js");
    return DOSSIERS[0];
}
```

---

### 3.6 `mapImportedDossiersById()` builds a new object every call

**File:** `src/dataAccess/kamerVotes.js`

**Problem:**

```js
export function mapImportedDossiersById() {
    return Object.fromEntries(importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier]));
}
```

This creates a new object every call. Since the underlying JSON never changes at runtime, this should be cached:

```js
let _importedById = null;

export function mapImportedDossiersById() {
    if (!_importedById) {
        _importedById = Object.fromEntries(
            importedTweedeKamer.dossiers.map((dossier) => [dossier.dossierId, dossier])
        );
    }
    return _importedById;
}
```

Same applies to `mapSourcesById()` in `src/dataAccess/sources.js` and `mapDossiersById()` in `src/dataAccess/dossiers.js`.

---

## Priority 4 — Architecture and organisation

### 4.1 `Politicians.jsx` page exists but is never routed

**File:** `src/pages/Politicians.jsx`

**Problem:** `src/pages/Politicians.jsx` is a full, well-written page with search, filtering, and a `Matcher` component — but it is not registered in the `PAGES` array and never rendered by `App.jsx`. `Matcher.jsx` and `membersApi.js` were built specifically for it but are also unreachable.

**Options:**
1. Add `{ id: "politici", label: "Politici" }` to `PAGES` and `{page === "politici" && <Politicians />}` to the render. Also add it to the `Footer`.
2. If the page is intentionally deferred, move it to `src/pages/_drafts/` so it's clearly parked.

---

### 4.2 `Navbar.jsx` is dead code

**File:** `src/components/Navbar.jsx`

The component exports a static header but is never imported. The real nav is inline in `App.jsx`. Either delete this file or replace it with the actual nav extracted from `App.jsx`.

---

### 4.3 `membersApi.js` uses a fake async delay — remove before production

**File:** `src/api/membersApi.js`

```js
export function fetchMembers() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 500);  // Fake 500ms network delay
    });
}
```

This adds a visible 500ms delay every time the Politicians page loads. It was clearly added to simulate a real API fetch, which is fine during development. But it should either be removed now or gated behind `import.meta.env.DEV`:

```js
import data from "../data/members.json";

export function fetchMembers() {
    if (import.meta.env.DEV) {
        return new Promise((resolve) => setTimeout(() => resolve(data), 500));
    }
    return Promise.resolve(data);
}
```

---

### 4.4 Hash-based routing will not scale past the current 6 pages

**File:** `src/App.jsx` — `PAGES`, `setPage`, `pageFromLocation`

**Problem:** The current routing works, but it has real gaps as the app grows:

- No protected routes — the admin check is ad-hoc
- No lazy loading — all page components load upfront
- Deep links within a page are impossible (e.g., `/onderwerpen#wonen`)
- Back/forward navigation is partially broken (popstate is handled, but scroll position is not restored)

**Recommendation:** Introduce React Router v6 when you do the `App.jsx` split. It's a one-day migration at this scale and unlocks all of the above. TanStack Router is an alternative if you want stricter typing later.

Minimal migration steps:
1. `npm install react-router-dom`
2. Wrap `App` in `<BrowserRouter>` in `main.jsx`
3. Replace `PAGES` + hash logic with `<Routes>` and `<Route path="/" element={...} />`
4. Replace `setPage()` calls with `useNavigate()`
5. Update `wrangler.jsonc` — `not_found_handling: "single-page-application"` is already set, so Cloudflare will handle SPA routing correctly

---

### 4.5 No error boundaries — a single crash tears down the whole app

**File:** `src/main.jsx`, `src/App.jsx`

**Problem:** There are no React Error Boundaries anywhere. If any component throws during render (e.g., a null dereference in imported Kamer data, a missing `source` on a position), the entire app goes white with no recovery path.

**Fix:** Add a simple error boundary in `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from "react";

export class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <main style={{ padding: "2rem" }}>
                    <h2>Er is iets misgegaan</h2>
                    <p>Ververs de pagina. Als het probleem aanhoudt, neem contact op.</p>
                    <details>
                        <summary>Technische details</summary>
                        <pre>{this.state.error.message}</pre>
                    </details>
                </main>
            );
        }
        return this.props.children;
    }
}
```

Then wrap page renders in `main.jsx` or around each page:

```jsx
// In App.jsx render:
{page === "blind" && (
    <ErrorBoundary key="blind">
        <BlindTestPage setPage={setPage} partyReliability={partyReliability} />
    </ErrorBoundary>
)}
```

Using `key={page}` on the boundary resets it when you navigate away and back.

---

### 4.6 Formatting utilities should live in a shared `utils/` module

**File:** `src/App.jsx` — bottom section, lines ~1200–1320

The following functions are pure utilities with no React dependency. They belong in `src/utils/formatting.js` and `src/utils/voteSignals.js`:

**`src/utils/formatting.js`:**
- `formatDate(dateValue)`
- `formatDaysSince(dateValue)`
- `daysSince(dateValue)`
- `getSourcePageUrl(source)`
- `extractionMethodLabel(method)`
- `extractionConfidenceLabel(confidence)`
- `extractionSummaryLabel(extraction)`
- `positionDirectionLabel(position)`
- `formatPartyList(parties)`
- `shortTitle(title, max)`
- `slugifyType(type)`
- `partyInitials(party)`
- `personInitials(name)`

**`src/utils/voteSignals.js`:**
- `getPartyDossierVoteSignal(party, importedDossier)`
- `getPromiseVoteSignal(position, importedDossier)`
- `getDisplayVoteSummary(zaak)`
- `dedupeVoteSummary(voteSummary)`
- `getVoteStats(zaak)`
- `getPartiesByVote(voteSummary, vote)`

**Codex prompt:**
> Create a new file `src/utils/formatting.js`. Move the following pure functions from `App.jsx` into it, adding `export` to each: `formatDate`, `formatDaysSince`, `daysSince`, `getSourcePageUrl`, `extractionMethodLabel`, `extractionConfidenceLabel`, `extractionSummaryLabel`, `positionDirectionLabel`, `formatPartyList`, `shortTitle`, `slugifyType`, `partyInitials`, `personInitials`. Then add the corresponding imports at the top of `App.jsx`. Do not change any function logic.

---

## Priority 5 — Code quality and maintainability

### 5.1 `calculateVotingMatches` should be a custom hook

**File:** `src/App.jsx` — `calculateVotingMatches`, called in `BlindTestPage`

**Problem:** `calculateVotingMatches` is a complex, stateful computation that depends on `answers`, `resultsRevealed`, `importedByDossier`, `partyReliability`, and `priorityWeights`. It's currently a plain function called at the top of `BlindTestPage`. When extracted to a hook, it can be memoized properly and tested independently:

```js
// src/hooks/useVotingMatches.js
import { useMemo } from "react";
import { listDossiers } from "../dataAccess/dossiers";
import { getBlindPositionsForDossier, getDossierWeight, getDisplayVoteSummary } from "../utils/voteSignals";

export function useVotingMatches(answers, resultsRevealed, importedByDossier, partyReliability, priorityWeights) {
    return useMemo(() => {
        if (!resultsRevealed) return [];
        // ... entire calculateVotingMatches body here
    }, [answers, resultsRevealed, importedByDossier, partyReliability, priorityWeights]);
}
```

Then in `BlindTestPage`:

```js
const votingMatches = useVotingMatches(answers, resultsRevealed, importedByDossier, partyReliability, priorityWeights);
```

---

### 5.2 `PositionReviewPage` review state should be a custom hook

**File:** `src/App.jsx` — `PositionReviewPage`, lines ~1550–1900

The review queue's state management (`reviewState`, `setCandidateStatus`, `updateCandidateField`, `updateCandidateNote`, `clearCandidateHistory`, `resetLocalReview`, `appendReviewHistory`, `readStoredReviewQueue`) is 150+ lines and should be extracted to `src/hooks/useReviewQueue.js`. This makes `PositionReviewPage` a pure rendering component and makes the state logic independently testable.

```js
// src/hooks/useReviewQueue.js
export function useReviewQueue() {
    const [reviewState, setReviewState] = useState(readStoredReviewQueue);

    useEffect(() => {
        window.localStorage.setItem(REVIEW_QUEUE_STORAGE_KEY, JSON.stringify(reviewState));
    }, [reviewState]);

    function setCandidateStatus(candidateId, nextStatus) { ... }
    function updateCandidateField(candidateId, field, value) { ... }
    function updateCandidateNote(candidateId, note) { ... }
    function clearCandidateHistory(candidateId) { ... }
    function resetLocalReview() { ... }

    return { reviewState, setCandidateStatus, updateCandidateField, updateCandidateNote, clearCandidateHistory, resetLocalReview };
}
```

---

### 5.3 `DATA_TABS` is defined at module level but only used in `BlindTestPage`

**File:** `src/App.jsx` — line ~22

```js
const DATA_TABS = [
    { id: "stemgedrag", label: "Stemgedrag" },
    { id: "bewijs", label: "Bewijsniveau" },
    { id: "impact", label: "Impact" },
    { id: "bronnen", label: "Bronnen" }
];
```

This should live inside `BlindTestPage` or in `BlindTestPage.jsx` once the file is split, not at module level in `App.jsx`. Same applies to `PARTY_VISUALS`.

---

### 5.4 `dossierNavClass` and `cardClass` should use `clsx` or a template literal array

**File:** `src/App.jsx`

The current approach works, but Codex tends to generate bugs when you ask it to add new conditions to these functions. A small `cn()` utility makes this cleaner:

```js
// src/utils/classNames.js
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

// Usage:
function cardClass(positionId, selectedPositionId, revealed) {
    return cn(
        "blind-card",
        selectedPositionId === positionId && "selected",
        selectedPositionId && selectedPositionId !== positionId && "dimmed",
        revealed && "revealed-card"
    );
}
```

---

### 5.5 No dark mode support

**Files:** `src/index.css`, `src/App.css`

The entire CSS uses hardcoded light-mode values (`#151719`, `#f4f6f8`, `white`, `rgba(...)`) with no `@media (prefers-color-scheme: dark)` block. This is fine for now, but worth noting for when the app goes public — a lot of Dutch users use dark mode and the app will look broken on their devices.

If you add dark mode later, the CSS variable approach you're already using (`--color-ink`, `--trust`, `--accent`, etc.) makes this straightforward — just override the variables in a `@media (prefers-color-scheme: dark)` block.

---

### 5.6 Footer has stub buttons with no `href` or handler

**File:** `src/components/Footer.jsx`

Several footer buttons have no action:

```jsx
<button type="button">Onafhankelijkheid</button>
<button type="button">Hoe wij geld verdienen</button>
<button type="button">Doneer</button>
<button type="button">Word lid</button>
```

These will frustrate users who click them. Either add placeholder `setPage()` calls pointing to a coming-soon section, or convert them to `<a>` tags with `href="#"` (and `aria-disabled="true"`) until the pages exist.

---

### 5.7 `approvedPositionImports.js` is a module wrapping an empty JSON structure

**File:** `src/data/approvedPositionImports.js`

```js
export const APPROVED_POSITION_IMPORTS = {
    generatedAt: null,
    source: "local-promotion-import",
    summary: { positions: 0 },
    positions: []
};
```

This is currently empty. The `positions:promote` script writes to this file. The shape is fine, but consider adding a JSDoc comment explaining that this file is machine-written:

```js
/**
 * AUTO-GENERATED by `npm run positions:promote`
 * Do not edit manually. Run the promote script to update.
 */
export const APPROVED_POSITION_IMPORTS = { ... };
```

---

## Priority 6 — No tests

**This is the biggest long-term risk.**

The entire app has zero tests. For a project that makes factual political claims and has a review pipeline for editorial content, this is a significant liability. A bug in `calculateVotingMatches`, `dedupeVoteSummary`, or `buildPartyReliability` could silently produce wrong scores shown to users.

**Recommended starting point — test the pure logic first:**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Add to `vite.config.js`:
```js
test: { environment: "jsdom", globals: true }
```

**Highest-priority functions to test:**

1. `dedupeVoteSummary` — deduplication logic is non-trivial
2. `calculateVotingMatches` — the core matching algorithm
3. `calculateResults` — the score tally shown to users
4. `getVoteStats` — `forSeats > againstSeats` determines "AANGENOMEN" vs "VERWORPEN"
5. `normalizeBlindPosition` — the data contract between data layer and UI

**Example test:**

```js
// src/utils/voteSignals.test.js
import { describe, it, expect } from "vitest";
import { dedupeVoteSummary } from "./voteSignals";

describe("dedupeVoteSummary", () => {
    it("deduplicates parties with the same name", () => {
        const input = {
            totalVotes: 2,
            parties: [
                { party: "VVD", vote: "Voor", seats: 34 },
                { party: "VVD", vote: "Voor", seats: 34 }  // duplicate
            ]
        };
        const result = dedupeVoteSummary(input);
        expect(result.parties).toHaveLength(1);
        expect(result.parties[0].party).toBe("VVD");
    });

    it("returns null-safe when parties is empty", () => {
        expect(dedupeVoteSummary(null)).toBeNull();
        expect(dedupeVoteSummary({ parties: [] })).toEqual({ parties: [], ... });
    });
});
```

**Codex prompt to bootstrap tests:**
> Create a test file `src/utils/voteSignals.test.js` using Vitest. Write unit tests for `dedupeVoteSummary`, `getVoteStats`, and `getPartiesByVote`. Cover: normal cases, empty party arrays, null input, duplicate party entries, and the case where `forSeats === againstSeats` (tie).

---

## Summary table

| # | Issue | File(s) | Priority | Effort |
|---|-------|---------|----------|--------|
| 1.1 | Admin gate bypassable via localStorage | App.jsx | 🔴 Critical | 1h |
| 1.2 | App.jsx is 2,791 lines — needs splitting | App.jsx | 🔴 Critical | 1–2 days |
| 2.1 | `mapSourcesById` / `mapImportedDossiersById` not memoized | App.jsx | 🟠 High | 30min |
| 2.2 | `buildPromiseVoteStatementItems` runs every render | App.jsx | 🟠 High | 15min |
| 2.3 | `reliability.js` runs at module load time | reliability.js | 🟠 High | 1h |
| 2.4 | Data URI exports rebuilt every render | App.jsx | 🟠 High | 30min |
| 3.1 | Verdict icons are corrupted `?` characters | App.jsx | 🟡 Medium | 5min |
| 3.2 | Check/cross icons also corrupted | App.jsx | 🟡 Medium | 5min |
| 3.3 | `goToNextDossier` calls `listDossiers()` twice | App.jsx | 🟡 Low | 2min |
| 3.4 | Null guard missing in `buildMemberChecklist` | App.jsx | 🟡 Medium | 10min |
| 3.5 | `getDefaultDossier` silently returns undefined | dossiers.js | 🟡 Medium | 5min |
| 3.6 | `mapImportedDossiersById` not cached | kamerVotes.js | 🟡 Medium | 15min |
| 4.1 | `Politicians.jsx` never routed | App.jsx | 🟡 Medium | 30min |
| 4.2 | `Navbar.jsx` is dead code | Navbar.jsx | 🟢 Low | 2min |
| 4.3 | `membersApi.js` fake delay in production | membersApi.js | 🟡 Medium | 5min |
| 4.4 | Hash routing won't scale | App.jsx | 🟡 Medium | 1 day |
| 4.5 | No error boundaries | App.jsx | 🟠 High | 2h |
| 4.6 | Formatting utils inline in App.jsx | App.jsx | 🟢 Low | 1h |
| 5.1 | `calculateVotingMatches` should be a hook | App.jsx | 🟢 Low | 1h |
| 5.2 | Review queue state should be a hook | App.jsx | 🟢 Low | 2h |
| 5.3 | `DATA_TABS` / `PARTY_VISUALS` at wrong scope | App.jsx | 🟢 Low | 5min |
| 5.4 | Class name builders could use `cn()` | App.jsx | 🟢 Low | 30min |
| 5.5 | No dark mode | index.css / App.css | 🟢 Low | future |
| 5.6 | Footer stub buttons do nothing | Footer.jsx | 🟡 Medium | 30min |
| 5.7 | `approvedPositionImports.js` missing auto-gen comment | approvedPositionImports.js | 🟢 Low | 2min |
| 6 | Zero tests | everywhere | 🔴 Critical (long-term) | ongoing |

---

## Suggested order for Codex sessions

**Session 1 — Security (1.1):** Fix the admin gate first. This is the only issue that has a real-world consequence before launch.

**Session 2 — Quick wins (2.1, 2.2, 3.1, 3.2, 3.5, 3.6, 2.4):** All of these are isolated, low-risk changes. Do them together in one session since they don't touch each other.

**Session 3 — File split, stage 1 (1.2, 4.6):** Extract utils first (`formatting.js`, `voteSignals.js`). These have no React dependencies, so they're the lowest-risk extraction.

**Session 4 — File split, stage 2 (1.2 continued):** Extract pages one by one, starting with `MethodPage` (smallest) and ending with `BlindTestPage` (largest).

**Session 5 — Error boundaries and routing (4.5, 4.4):** Add error boundaries first (fast win), then decide if now is the right time to add React Router.

**Session 6 — Hooks (5.1, 5.2):** Extract `useVotingMatches` and `useReviewQueue` after the file split is stable.

**Session 7 — Bootstrap tests (6):** Write tests for the pure utility functions first, then the hooks.
