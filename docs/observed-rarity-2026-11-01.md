# Published-page freeze and observed rarity

Date: 2026-11-01.

| Request | Implementation |
| --- | --- |
| Stop adding prompt pages | published-prompts.json pins the existing 106 guide IDs. Bank changes no longer automatically generate more routes. |
| Small-subject assignment | Food, Animals, General knowledge, Entertainment, Calendar, Art and Mathematics have explicit labels. Only Calendar gets a new category page. |
| Calendar | Code inspection finds three existing prompts (weekdays, 30-day months, 31-day months), not four. No duplicate question is invented. |
| Real rarity | 100 accepted browser choices per prompt over 30 days. Only the first accepted choice per browser in completed runs counts. |
| Small public statistics | Below 100 qualifying choices, the statistics heading and figures are omitted. |
| Privacy breadcrumb | Visible Home / page name equals the two JSON-LD breadcrumb labels. |

Observed scoring uses add-one smoothing: (answer choices + 1) / (qualifying choices + accepted entries). Shares >=25%, 15%, 8%, 3% and 1% map to Plankton, Too Clever, Schooler, Rare and Deep Cut; below 1% maps to One in a Krillion. Equal frequencies produce equal tiers. Browser identifiers are not verified human identities. Passing, rejected guesses, blanks and unfinished dives are excluded. Repeated practice from the same browser does not inflate the denominator.

Below the threshold, editorial fallback is explicitly labelled. New practice runs snapshot their scores; a new Daily date snapshots its scores once. Existing runs, results and date archives are never rescored. Public prompt guides show observed tiers only when their current sample qualifies. No raw identifiers are published.

This release does not claim that production already has enough observations to activate measured scoring. The code waits for genuine recorded data. The existing Name an ocean guide is the single targeted content experiment; other prompt-guide URLs are frozen. Search-volume estimates supplied by the user are not independently verified here.

## Production acceptance

- Code: ca48de4 (main); Worker version 35dd557b-3561-45a9-a9a6-cda1cc2cfc2a.
- 26 unit/integration tests passed, including the 100-browser threshold, tied frequencies, repeated-browser deduplication, real SQL aggregate input and unchanged scoring snapshots.
- Next build, static export checks and browser regression passed.
- Formal site followup audit passed: Calendar contains 3 real prompt links; low-sample figures are absent; Privacy visible breadcrumb matches JSON-LD; the existing ocean page has specific answer-scope copy.
- Formal SEO audit passed: 123 sitemap URLs, all direct 200, one H1, exact canonical/sitemap agreement, valid lastmod; prompt detail inventory is still 106.
- Final production seven-round game audit passed: API-verified point totals (not an assumption that every answer must still score 100), rejection, pause/resume, passing, review, sharing, refresh, replay and mobile.
- No new prompt detail URLs or fabricated player observations were created. The synthetic 100-browser test data was confined to an in-memory test database, not production.
- Production switches each prompt only when the actual sample qualifies; otherwise the editorial fallback remains explicitly labelled. This acceptance does not assert that a live prompt has already reached the threshold.
