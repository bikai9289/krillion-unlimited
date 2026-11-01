# Production release acceptance — 2026-11-01

Code: 09cdcbd, fast-forward merged and pushed to main.
Worker: krillion-unlimited.
Published version: 65fbf4ed-784c-4166-83e8-1dbd0a5b511f.
Previous version: 9dfa74ce-100d-457a-91de-8e926a4c86fa.
The existing D1 and R2 bindings and secret bindings were retained. Remote migration listing reported no pending migrations. No production schema replacement was performed.

| Check | Result |
| --- | --- |
| Node unit/integration tests | 18/18 pass |
| Next/Worker build and generated HTML checks | pass |
| Local complete seven-round browser and 40-page checks | pass |
| Formal HTTPS homepage | 200; seven current Daily prompts; no Loading placeholder |
| No-JS formal homepage | seven prompts, six tiers, four expanded FAQs; matches /api/today |
| Formal sitemap | 40 canonical URLs |
| All 40 formal sitemap URLs | HTTP 200, one H1 and canonical present |
| Homepage JSON-LD | VideoGame, FAQPage, BreadcrumbList |
| www to apex | 301 to HTTPS apex |
| Production browser game | seven rounds, 700-point server score, rejection, pause/resume, pass, review, share, reload, repeat, mobile pass |
| workers.dev binding | Cloudflare deployment reports the new version serving the enabled workers.dev address and both custom domains |
| Direct workers.dev acceptance | NOT VERIFIED: Python and Chrome timed out in the current network; independent web fetch also unavailable. Not claimed as passed. |

workers.dev address: https://krillion-unlimited.bikai9289.workers.dev
Formal site: https://krillion-unlimited.app/

Evidence on this machine: output/production-40-pages.json and output/playwright/production-ui/report.json. The full browser audit was executed against https://krillion-unlimited.app, not only localhost. Automated acceptance used Unlimited and did not claim a public display name or alter another player's run.

Developer workflow rule added to AGENTS.md: testing is required after development, and production acceptance is required after deployment. Unreachable checks must be recorded explicitly rather than replaced by local results.
