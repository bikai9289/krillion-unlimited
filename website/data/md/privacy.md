---
title: "privacy"
date: "2026-11-07"
---

## Browser storage and the essential cookie

The HttpOnly ok_player cookie holds a random player identifier, not a name or email. It is SameSite=Lax and Secure over HTTPS. Local storage saves a run pointer, answer drafts, sound preference and completed-dive history. Clearing browser data can remove access to your saved progress; there is no cross-device account sync.

## Server game records

Cloudflare D1 stores the random player identifier, run snapshots, submitted answers, scores and round timing. Server validation prevents browser-provided scores from deciding the result. Daily and weekly boards publish an anonymous diver name and depth, not your raw answers or cookie identifier.

## Feedback and rate limits

If feedback is submitted, the service can store it with the random identifier and date. Avoid personal information. Rate limiting uses a short-lived hashed identifier based on the browser cookie, IP supplied by Cloudflare and time window.

## Hosting and third parties

Cloudflare hosts the game. Fonts may be requested from Google Fonts. If third-party advertising or analytics is enabled, those providers may process browser and usage data as described below. No official reference service receives your answers, and official puzzle synchronization is not used.

## Retention and control

Completed game records remain in the service for history and ranking calculations. Rate-limit records are routinely pruned. You can clear local browser history, but this does not delete server game records. We do not collect payments or sell player records.

[Back to the game](/) · [About](/about/)


## Aggregate answer frequencies

The server can count accepted choices from completed dives over 30 days, using at most one choice per random browser identifier and prompt. This derives aggregates from the game records already described above. Observed scoring and public aggregate figures require at least 100 browser choices. Repeated practice by one browser does not count as extra independent choices. No raw browser identifier is published.


## Advertising and cookies

Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to this website or other websites. Google advertising cookies enable Google and its partners to serve personalized ads. This describes possible advertising use; it does not mean advertising is currently enabled.

You can turn off personalized Google advertising in [Google Ads Settings](https://adssettings.google.com/). You can also visit [aboutads.info](https://www.aboutads.info/choices/) to opt out of personalized advertising by participating third-party vendors. Browser cookie controls can restrict cookies; these advertising choices do not delete essential game cookies or server-held records.


[Back to the game](/) | [About](/about/) | [Terms](/terms/) | [Contact](/contact/) | [Disclaimer](/disclaimer/) | [Privacy](/privacy/)
