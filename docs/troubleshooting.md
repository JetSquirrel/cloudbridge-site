---
description: "Fixes for common CloudBridge problems: Keychain prompts, AWS AccessDenied, an empty Overview, Windows SmartScreen, import errors, Cloudflare scans that are refused, and alerts that did not fire."
---

# Troubleshooting

**[中文](zh/troubleshooting.md)**&emsp;[Docs](index.md)

## macOS asks for Keychain access {#keychain}

Saved credentials live in the OS keyring, not in CloudBridge's own files,
so macOS may ask whether CloudBridge can use its Keychain item when the app
reads a credential. Click **Always Allow** so it does not ask on every
refresh, or **Allow** to be asked each time. If you click **Deny**, the app
cannot read the credential and that account's fetch fails until you allow
access.

## AWS reports AccessDenied {#aws-access-denied}

The key authenticated, but its user lacks `ce:GetCostAndUsage`. Attach the
[Cost Explorer policy](aws.md#cost-explorer) to the IAM user that owns the
key. An organization service control policy can also deny Cost Explorer;
and in an AWS Organization, member accounts only see Cost Explorer data if
the management account allows it.

## The Overview is empty after adding an account {#empty-overview}

- **Nothing was fetched yet.** Click **Refresh** on the Overview. A
  file-import source (Volcengine, OpenAI, Anthropic) has nothing to fetch:
  use **Import** on its row instead.
- **The provider has not reported yet.** Providers publish charges with a
  delay; AWS Cost Explorer can lag up to about 24 hours, so a brand-new
  account or today's spend may not appear at once. Try again later rather
  than using Force Refresh, which can incur Cost Explorer request charges.
- **The window is too narrow.** Early in the month **MTD** may hold little
  or nothing; switch to **30d** or **12m**.
- **It is a balance-only source.** DeepSeek's API reports a balance, not
  spend. Import its usage download for spend detail.

## An account keeps failing to refresh {#refresh-failing}

The menu bar panel and the Overview name the accounts that failed and why.
An account that fails is retried after 15 minutes, then 30, doubling up to
the refresh interval, and a notification says when it starts failing. If
a provider answered but CloudBridge could not store the result — a full
disk, for example — it does not fetch that month again within the refresh
interval, so the same data is not paid for twice; **Force Refresh** retries
at once. See [Menu bar and background](background.md#failures).

## Windows SmartScreen blocks the app {#smartscreen}

The Windows build is not code-signed, so SmartScreen shows *Windows
protected your PC*. After checking the file came from the official
[Releases](https://github.com/JetSquirrel/cloudbridge/releases) page, click
**More info**, then **Run anyway**.

## Import errors {#import-errors}

- **"not UTF-8 text"** — Alibaba Cloud and Volcengine consoles can produce
  GBK exports. Re-export as UTF-8 or save the file as CSV UTF-8 before
  importing.
- **Unrecognized columns** — parsers match known aliases for Chinese and
  English exports and provider field names. If a format has changed,
  report the error and column headers in an issue. Redact sensitive
  values; do not attach an unredacted bill.
- **A month shrank after importing** — an import replaces every month the
  file covers for that account, so a product-filtered export leaves only
  that product. Re-import the full, unfiltered bill.
- **Token counts but no spend** — a usage export carries no money; import
  the cost export instead. For DeepSeek, import the ZIP as downloaded
  rather than its `amount-*.csv`.

## A Cloudflare scan is refused {#cloudflare-scan}

The scan says which of two things happened. *Cloudflare did not accept
this account's API token* means the token is wrong or expired: check it on
the Accounts page. *The token cannot read …* means the token is valid but
lacks a service's Read permission; add the permissions listed under
[Cloudflare](cloudflare.md#insights). A token without them still reads the
bill.

## An alert did not fire {#alert-silent}

- **The Account budget rule has no budget to measure against.** The rule
  does nothing for an account without a **Monthly budget**, whatever its
  threshold type. Set one on the Rules page.
- **The spend started from nothing.** The cost growth anomaly rule compares
  a service with its own last seven days, so a service that cost nothing
  has no baseline and never fires it. A budget rule on the month-end
  forecast covers that case: see [Catch a runaway](cloudflare.md#runaway).
- **The day is not in the ledger yet.** Rules run on what has been fetched.
  The background refresh fetches an account once per refresh interval, and
  only while CloudBridge runs; see [Menu bar and background](background.md).
- **Notifications are off,** or the alert was already open when the app
  started. Open alerts are listed on the Alerts page either way.

## Still stuck {#help}

Questions the docs don't answer?
[Open an issue](https://github.com/JetSquirrel/cloudbridge/issues).
