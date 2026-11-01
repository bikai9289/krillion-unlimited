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
