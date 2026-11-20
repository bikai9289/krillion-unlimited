# Existing content and archive hint compatibility

Scope: improve existing player help without adding routes or changing titles,
accepted answers, scores, saved editions or the game API.

## Changes

- Resolve hints by exact question text when a legacy archive has no recognized
  prompt ID. Recognized IDs keep the existing behavior. Unknown wording retains
  the generic, escaped rendering fallback; no fuzzy scope matching is used.
- Add concrete scope, alias guidance and three excluded examples to the
  30-day-month, Great Lakes and SI-base-unit guides. Their editorial dates are
  November 20; other prompt dates remain unchanged.
- Add regression coverage for missing/unknown IDs across the full bank and
  seven distinct hints in a serialized November 21 generated edition.

## Verification

- `npm test`: 47 passed, zero failed. The legacy-ID regression failed before
  the compatibility change and passed afterward.
- `npm run build`: passed.
- `npm run check`: passed.
- Content browser audit: 106 published prompts, nine detailed guides, 53
  accepted-answer checks, 14 alias checks and 27 excluded examples; desktop
  1440px and mobile 390px; Worker and exported HTML checked.
- Game browser audit: seven rounds, server scoring, invalid answer, reload,
  pause/resume, pass, review, share, repeat play and mobile passed.
- Archive hint browser audit: three locally saved editions passed distinct
  hints, closed spoilers, answer reveal and canonical checks.

Browser reports: `output/content-20261118/report.json` (audit script's existing
output path), `output/development-20261120/game/report.json` and
`output/development-20261120/hints/report.json`.

These are local development results. The November 21 edition check is a
generated fixture, not evidence of a future production archive. The supplied
production repetition report was not reproduced against the live service in
this task. No production deployment or AdSense review submission was made.

## Release cross-check

The release branch starts at remote main `5ee21dd`, retaining its materialized
observation storage changes. That tree passes 37 tests, build and check.
The earlier 47-test count above describes the original development workspace,
not this newer release baseline.

Compared with the downloaded current production bundle, the release changes
only the existing `todayContent` function and the `PROMPT_GUIDES` and
`promptPages` declarations, adding the hint lookup module. All other existing
function bodies and declarations match. Existing detailed guides are unchanged.
Current production settings and hourly cron are retained. No database migration
is part of this content release.

Before deployment the scoped package passed desktop/mobile full-game, content,
and archive-hint browser acceptance. Post-deployment status is recorded separately.

## Production acceptance

Code commit: `b82bb654f9da890c38d68da4c5d92a47001e24ab` (pushed to main).
Final Worker version: `7ae6a249-3699-4f33-9c44-ebb9ef64d93a`, 100% traffic.

An initial asset-preserving deployment exposed stale production rules HTML:
the fixed-scoring explanation differed from the repository and actual scoring.
The final deployment therefore publishes the same commit's rebuilt static
collection as well. The complete content audit then passes, including rules
consistency; routes and titles are unchanged.

- Downloaded final Worker matches the release build's parsed JavaScript.
- Homepage, health, matching guide, rules, calendar/science/geography categories
  and sitemap return 200. Health reports database and storage available.
- Sitemap contains 147 URLs; www redirects 301 to the canonical apex.
- 106 prompt pages and nine detailed guides pass the live/static comparison,
  matcher checks, canonical checks and 1440px/390px layout checks.
- All 20 currently published archive dates pass seven distinct hints,
  closed/revealable answers, canonical and mobile-layout checks.
- Final live full-game browser acceptance passes seven server-scored rounds,
  invalid input, pause/resume, reload, pass, review, share, repeat play and mobile
  with zero page errors.

Evidence in this release worktree: `output/content-release-1120/final-content/`
and `output/playwright/production-ui/` (the game's existing fixed output path).
Archive evidence is in the original publish directory under
`output/release-1120/final-hints/`. Private deployment/source checks remain in
the original development directory's ignored `.wrangler/` tree.

November 21 has not occurred in New York at acceptance time: its generated
snapshot regression passed, but natural production rollover remains unverified.
No AdSense review was submitted. Unrelated dirty files in the existing publish
directory were preserved; generated build artifacts were excluded from commits.
