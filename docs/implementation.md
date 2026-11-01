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
