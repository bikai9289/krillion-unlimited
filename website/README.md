# GitBase-based site layer

Derived from https://github.com/qiayue/GitBase at f04c8bfedd93ad7a3c24e44e0d9d6d2074143220.

Uses its Next App Router + server metadata + filesystem Markdown approach, adapted Layout/Navigation/Footer, and its `src/lib/posts.js` gray-matter/remark pipeline. Original source excerpts and license are retained under vendor/gitbase. Next has been updated from the template version. No admin, AI development center, GitHub write token or unverified-auth middleware is exposed in this public game site.

`npm run build` from the repository root builds the Worker assets and Next static export, then stages the exported pages under public/site and the Next assets under public/_next. Worker serves each page at its canonical root URL. API paths remain same-origin and keep existing D1 bindings. /answers/today/ is an exception: Worker renders the actual date's own puzzle at request time, using the same site navigation and CSS.

Production resource IDs and existing player database are not replaced. Build this branch before deployment; do not deploy only website/out because the game API still requires Worker + D1.


Runtime SSR exceptions: /, /answers/today/ and /prompts/<slug>/ are rendered by Worker so daily question text and completed-run aggregates cannot freeze at build time. The public prompt index and informational pages use the Next export. All paths share the same content modules and CSS. The root and runtime pages support GET and HEAD and return no-store. Build output includes static prompt guides for verification, but production routing overlays their current aggregate statistics.
