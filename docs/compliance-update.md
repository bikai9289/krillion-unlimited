# Compliance update - 2026-11-07

Implemented: Terms, Contact and Disclaimer content pages; shared legal footer; reciprocal legal-page links; sitemap entries and editorial dates; privacy disclosure for potential advertising, cookies and opt-out links.

Pending external setup:
- No confirmed public mailbox is available. Contact explicitly says direct email submissions are unavailable. Open and verify a real mailbox, then replace that notice with a visible mailto address. The contact requirement is not complete yet.
- Remote commit 3169201 supplied the AdSense publisher configuration, verification script and ads.txt; these were merged for release.
- AdSense account approval is not confirmed. This release does not create email routing or submit an AdSense application.
- Production deployment and acceptance results are reported in the release conversation.

Validation commands: npm test; npm run build; npm run check; node scripts/compliance-audit.mjs; npm run test:browser.
The sitemap includes dynamic dated archives; validate URL membership rather than assuming a fixed total of 133.
