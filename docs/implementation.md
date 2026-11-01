# Krillion Unlimited implementation

Source base: https://github.com/VulcanEon/openkrillion.com-service
Upstream revision: 33fdff48623fb4815e95081a1a1d41bd1902f99d

The approved concept 03 is now the live homepage, served by src/html.mjs with markup in src/game-page.mjs and styling in public/game.css. public/game.mjs calls the upstream Worker APIs; it does not calculate scores locally. The original matching, tier scoring, cookie ownership, rate limiting, deadlines, daily runs and review implementation remain in src/worker.mjs and public/rules.mjs.

- Homepage prepares a real seven-prompt practice run in ready state. Start Answering explicitly starts the preview and server clock.
- Run snapshots preserve prompts and answers for both daily and practice games.
- Daily resumes one daily dive; Unlimited creates independent randomized runs.
- Refresh restores ready, active, landed and completed states. Local storage contains a run pointer, drafts and completed history; server holds authoritative scores.
- Answers support rejection and correction confirmation. Passing and timeout score zero. All seven rounds must complete before review is available.
- Help, logbook and rankings pause the active server deadline and resume when closed.
- Rankings use completed server runs, one best per browser in each UTC period.
- Reference synchronization and third-party analytics remain disabled by default.

Local: npm ci; npm run build; npm run db:local; npm run dev
Validation: npm test; npm run build; npm run check; npm run test:browser

Current limitation: 28 independently assembled starter prompts, with small prepared answer sets and curated tiers. This is a playable starter bank rather than a comprehensive knowledge database or measured popularity model. The Daily puzzle uses America/New_York day boundaries; leaderboard periods use UTC and Monday weekly boundaries.

Deployment has not been performed. Production Cloudflare database/bucket bindings and domain setup are still required.


## GitBase site migration (2026-11-01)

The public content layer now derives from qiayue/GitBase: Next App Router, build-time filesystem Markdown, adapted Layout/Navigation/Footer and the upstream gray-matter/remark pipeline. See website/README.md and vendor source/license references.

The homepage is a short generated page with an explicit Play Now launcher and four internal cards. Clicking Play Now creates/restores a real server run and starts its preview, followed by the server answer window. The existing D1 schema, essential cookie, scoring, snapshots and API routes remain in place.

The build exports 10 Next pages; the Worker separately renders /answers/today/ with the exact own Daily puzzle. All 11 URLs are in sitemap.xml. Existing /about and /privacy canonical URLs are preserved; the added content pages use trailing slashes. Slash variants permanently redirect. Daily answers have no-store caching and use New York day boundaries, so no deployment is required at midnight.

Official synchronization is disabled in runtime and the admin endpoint returns 404. Legacy exported validation code is retained for compatibility tests but no reference fetch is made. Product HTML, structured data and public documentation no longer promote a source repository; license and origin notices remain inside this repository.

Production build command remains npm run build at the repository root. It builds Next, copies generated assets under public/site and public/_next, and preserves the original Worker/D1 deployment model. Do not deploy website/out alone. GSC_VERIFY is injected at request time into the exported HTML as well as the dynamic answer page. GSC verification/submission itself has not been completed in this session.

User-provided SEO evidence and metric caveats are saved in docs/seo-evidence.md. Indexation timing is not guaranteed.


## Live question SSR and prompt guides

The homepage is now rendered at request time by Worker from the same puzzleFor(env, etDate()) source as /api/today. It includes all seven prompt texts with categories, six tiers, point/depth rules, and four expanded FAQs. It never caches an old daily HTML response: Cache-Control is no-store. The GitBase static shell is still built, while the root response adds the actual day-specific content server-side. No bot-specific content or client-only question placeholder is used.

/prompts/ indexes 28 real bank entries. Each /prompts/<slug>/ page has one question H1, its own metadata/canonical and BreadcrumbList, answer scope, actual aliases and prepared tier distribution. Worker adds historical aggregate scored-round counts using completed runs joined to their saved prompt snapshots, matching both prompt id and text. Zero observations are shown as empty data, not made-up popularity. No player identifiers or raw submitted answer strings are published. Static fallback documents explain that live aggregates are supplied at request time.

The sitemap now contains 40 URLs. Homepage schema contains VideoGame with the own origin, FAQPage matching the four visible expanded FAQs, and BreadcrumbList. Today's answers and prompt pages also include breadcrumbs. Category listings and the prompt index provide crawlable links to every guide.

Validation: 18 Node tests; full Next export and source checks; all 40 URLs' H1/canonical checks; live seven-round browser flow; a separate JavaScript-disabled browser check via node scripts/no-js-audit.mjs. GSC submission and deployment are still separate operations.


## Six categories and daily answer archives

Music, Language and Games are now explicit categories backed by existing bank entries and linked from /categories/. The bank remains 28 prompts. The static sitemap baseline is 43 pages; saved daily dates are added dynamically (44 including the first date).

Migration 0004_daily_archives.sql adds an independent immutable-by-application daily snapshot table. puzzleFor first reads a saved archive; when today is missing it selects the existing own puzzle (or deterministic own bank), inserts once and reads the winning snapshot back. This preserves the exact Daily version across concurrent first requests. Existing runs, answers and player records are not rewritten.

/answers/today/ is the rotating current-date hub. /answers/YYYY-MM-DD/ renders the stored version with its own H1/title/canonical, full accepted answer lists, point values and neighbouring saved-date links. /answers/ and sitemap.xml discover saved dates. Invalid/future/unrecorded dates return 404 rather than generating speculative past content. No historical archive was invented during deployment.

Cron triggers 04:05 and 05:05 UTC cover New York midnight in DST and standard time. A normal daily request also creates the snapshot. Deploying the new Worker requires applying migration 0004 first. The scheduled handler performs no reference synchronization.

Validation adds an automated three-day rollover test (including scheduled-only snapshot creation before API reads), immutable older answers after bank-row edits, canonical/index/sitemap checks, invalid/future/missing date cases and HEAD/redirect checks. Browser acceptance: npm run test:archives [production URL can be passed directly to the script]. Real three-day accumulation will happen over calendar time, not immediately after this release.
