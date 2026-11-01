---
title: "privacy"
date: "2026-11-01"
---

## Browser storage and the essential cookie

The HttpOnly ok_player cookie holds a random player identifier, not a name or email. It is SameSite=Lax and Secure over HTTPS. Local storage saves a run pointer, answer drafts, sound preference and completed-dive history. Clearing browser data can remove access to your saved progress; there is no cross-device account sync.

## Server game records

Cloudflare D1 stores the random player identifier, run snapshots, submitted answers, scores and round timing. Server validation prevents browser-provided scores from deciding the result. Daily and weekly boards publish an anonymous diver name and depth, not your raw answers or cookie identifier.

## Feedback and rate limits

If feedback is submitted, the service can store it with the random identifier and date. Avoid personal information. Rate limiting uses a short-lived hashed identifier based on the browser cookie, IP supplied by Cloudflare and time window.

## Hosting and third parties

Cloudflare hosts the game. Fonts may be requested from Google Fonts. No third-party analytics scripts are loaded by the current game interface. No official reference service receives your answers, and official puzzle synchronization is not used.

## Retention and control

Completed game records remain in the service for history and ranking calculations. Rate-limit records are routinely pruned. You can clear local browser history, but this does not delete server game records. We do not collect payments or sell player records.

[Back to the game](/) · [About](/about/)
