# Blind Democracy Data Pipeline

Blind Democracy should publish reviewed political evidence, not raw automation output.

The long-term data flow is:

1. Import raw sources.
2. Extract passages and candidate interpretations.
3. Classify candidates against fixed dossiers and issues.
4. Send every candidate to human review.
5. Publish only approved records.
6. Keep review actions and corrections visible in the audit trail.

## Publication Boundary

Public pages should eventually read from:

- `approved_positions`
- approved `kamer_votes`
- approved `promise_checks`
- public `correction_ledger`

In the current local app this boundary is represented by `src/data/approvedPositions.js`.
The legacy public party positions are exposed there as an approved seed snapshot, while
new imported positions stay in `candidatePositions.js` until review.

The local review queue can export two browser-generated files: a full review report and
an `approved_positions` promotion snapshot containing only candidates marked `Goedgekeurd`.
That promotion snapshot can be imported back into the local app with:

```sh
npm run positions:promote -- path/to/blind-democracy-approved-positions.json
```

The importer writes `src/data/approvedPositionImports.js`, which is merged into the
local public `APPROVED_POSITIONS` layer.
The local file is stored as a JS module so both Vite and Node scripts can read it without
JSON import assertions.

Importers and AI extraction should write only to:

- `source_documents`
- `extracted_passages`
- `candidate_positions`
- review-pending `kamer_votes`
- review-pending `promise_checks`

AI output is never the source. The source is always the raw document, quote, Kamerzaak, vote record, or factcheck record.

## First Milestone

The first database milestone is intentionally modest:

- create the schema in `supabase/migrations`
- export local app data into seed snapshots
- keep the current React app on local JS/JSON data
- use the schema as the contract for future import and review screens
- keep public position reads pointed at the local approved layer

This keeps the product stable while making the future backend shape explicit.

## Review Statuses

`needs_human_review`
: imported or AI-assisted data waiting for a reviewer.

`approved`
: reviewed data that may be shown publicly.

`rejected`
: candidate data that should not be published.

`needs_more_source`
: candidate data that might be valid but lacks enough source support.

`superseded`
: older candidate or approved data replaced by a newer version.

## Near-Term Build Order

1. Keep `dossiers` and `issues` stable.
2. Seed parties, politicians, dossiers, current positions, Kamer votes, and promise checks.
3. Build a local review queue UI against the candidate model.
4. Move approved local data behind a repository/API layer.
5. Introduce Supabase only when the local contract feels right.

The first repository boundaries live in `src/dataAccess`:

- `positions.js`
- `dossiers.js`
- `kamerVotes.js`
- `sources.js`

UI and scripts should prefer these modules over direct imports from `src/data`.
Later these modules can switch from local JS/JSON data to Supabase reads.

## Current Seed Export

`npm run db:export-seeds` exports the local prototype data into `supabase/seed`:

- `parties.json`
- `politicians.json`
- `dossiers.json`
- `source_documents.json`
- `extracted_passages.json`
- `candidate_positions.json`
- `approved_positions.json`
- `kamer_votes.json`
- `promise_checks.json`

The export keeps deterministic text ids for editorial records such as source documents,
candidate positions, approved positions, and promise checks. This makes review exports,
promotion imports, and later database sync reproducible.

At this stage `source_documents` records are created from known party-program sources.
`extracted_passages` remains empty until exact source quotes and page references are
available. That is intentional: the project should not claim passage-level evidence
until a real quote has been captured and reviewed.

## Access Model

The database scaffold already includes role-based RLS in
`supabase/migrations/202605050002_auth_roles_and_rls.sql`.

Public users can read public reference data and reviewed rows only. Candidate data,
raw source text, extracted passages, and review logs require admin/moderator/viewer roles.
