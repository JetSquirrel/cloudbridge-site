---
description: "Keep CloudBridge watching with its window closed: the menu bar icon and panel, the 15-minute background refresh, notifications, Open at login, and how failures are retried without paying twice."
---

# Menu bar and background

**[中文](zh/background.md)** · [Docs](index.md)

A cost alert is worth something only while the money is still being spent.
So CloudBridge keeps running after its window closes, refreshes on a
schedule, and tells you when something fires.

## The menu bar icon {#menu-bar}

On macOS and Windows, closing the window leaves CloudBridge in the menu bar
(the notification area on Windows). The icon's title is the month's spend,
with the number of open alerts beside it when there are any: `$2.8k · 2`.

Click it for a panel with the month to date, the month-end forecast, the
open alerts and the services that moved most against last month, with
**Refresh** and **Open CloudBridge**. Clicking an alert opens it on the
Alerts page. Right-click the icon — or use **Quit** in the panel — to quit;
closing the window no longer does. The Dock icon comes and goes with the
window.

Linux builds have no tray icon and still quit with their window; the
schedule and notifications run while it is open.

## The background refresh {#schedule}

Every 15 minutes CloudBridge fetches the accounts that are due, runs the
[alert rules](alerts.md) and posts a notification for each new alert. "Due"
is the refresh interval's call (**Settings → Refreshing**, 24 hours by
default), so the schedule costs what a daily Refresh would — the 15
minutes only decides how soon a due account is noticed. Turn it off under
**Settings → Background → Refresh in the background**.

## Open at login {#login}

**Settings → Background → Open at login** starts CloudBridge when you log
in, in the menu bar and without its window, so alerts keep arriving after
a restart. It is off until you turn it on; macOS lists it under **System
Settings → General → Login Items**.

## When a refresh fails {#failures}

- **An account that keeps failing** is retried after 15 minutes, then 30,
  doubling up to the refresh interval, so a revoked key or a provider
  outage costs a handful of tries a day rather than one every tick. A
  notification says when an account starts failing — its spend has
  stopped being watched — and the panel names it until it recovers.
- **A fetch the provider answered but CloudBridge could not store** — a
  full disk, say — is not repeated within the refresh interval, so the
  same Cost Explorer requests or S3 downloads are not paid for twice.
  **Force Refresh** retries at once.
- **One month failing does not stop the other**: last month's trouble does
  not leave this month, where a runaway shows, unfetched.
