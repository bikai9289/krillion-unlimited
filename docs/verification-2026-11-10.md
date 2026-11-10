# Local verification — 2026-11-10

## Changes

- Added a first-archive-write failure test using an isolated in-memory database. Only the archive insert throws; production D1 is never modified.
- Verified that today returns seven prompts, start and state succeed, the run has a complete saved puzzle and no answers, no partial archive exists, and the persistence warning is recorded. Seven rounds complete while archive writes fail; owner review succeeds and another identity is denied. Restoring writes creates the archive and preserves the completed run prompts, answers and score.
- Added review ownership checks against the same database: owner with a completed run gets 200; unfinished, missing-cookie, another identity and malformed-cookie requests get 403. A mobile user agent with the owner cookie still gets 200.
- About now states that answers are public during the current edition, rankings do not prove unaided answers, and UTC ranking periods use run start time. A run completed after UTC midnight can add a result to the previous day's board.
- Today and date-page canonical policies are unchanged.

## Verification completed

- `npm test`: 33 tests passed in the release repository.
- `npm run build`: passed, 127 canonical pages published locally.
- `npm run check`: passed.
- `npm run test:browser`: passed seven-round scoring, saved progress reload, rejected answer, pause/resume, pass, completed review, share, repeat game and mobile checks; no page errors.
- Additional local Chrome check: About text rendered; unfinished, missing-cookie and different-browser review requests returned 403.

## Outstanding

- Production deployment completed for commit `5e62192`, Worker version `db518ebc-f443-4361-873e-f16bbffb4eff`.
- Production browser verification passed: updated About, Today/date archives, contact, sports, matching guide, sitemap and health returned 200; seven rounds completed and reloaded; owner completed review returned 200, missing/other identity returned 403.
- The single run created by this release audit and its answers/puzzle snapshot were deleted using its exact locally captured ID. A read-only production query confirmed zero remaining matching runs. Historical FE0A99 and 97D7D6 were not modified.
- FE0A99 was not deleted: no complete run identifier or matching test record was found in this workspace. `fe0a9934` is a prefix, not the complete 36-character identifier expected by the service.
- 97D7D6 remains unchanged; its ownership is unknown.
- No claim of current GSC query/page overlap is made.
- Browser identity cookies have no server-side expiry/revocation mechanism in this change; clearing the cookie is tested as missing identity, not as proof of server-side expiration.
