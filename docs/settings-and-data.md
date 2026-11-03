---
title: "Settings, data storage and security"
description: "What CloudBridge stores and where: the DuckDB ledger, accounts, raw payloads and config, plus refresh interval, currency, backups and security."
---

# Settings, data and security

**[中文](zh/settings-and-data.md)**&emsp;[Docs](index.md)

## Settings {#settings}

| Setting | What it does |
| --- | --- |
| Appearance → Theme | Light and dark themes, remembered across launches |
| Appearance → Language | [The interface language](#language): System, English or 简体中文 |
| Reporting → Currency | USD or CNY for every total; charges keep their own currency |
| Refreshing → Refresh interval | 6, 12, 24 (default) or 48 hours before a month is fetched again |
| Background | [Open at login, background refresh, alert notifications](background.md) |
| Data → Export as FOCUS | Every charge as a CSV with FOCUS column names, for another FinOps tool ([details](focus.md#export)) |
| Demo data | Load or clear five sample accounts (AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic) with twelve months of history |

**Refresh** fetches months older than the refresh interval; **Force
Refresh** fetches them all and can incur provider charges. Neither
overwrites an imported month. Demo accounts use a `demo-` prefix, carry no
credentials and are skipped by refreshes.

## Interface language {#language}

CloudBridge 0.9.0 and later are translated into 简体中文: every page and dialog, the
menu bar panel, its menu and system notifications. Until you pick a language
under **Settings → Appearance → Language**, the app follows the system's, and
a change applies at once. The browser demo follows the browser's language and
has a switch in its sidebar footer.

- The tray menu picks up a new language the next time the app starts.
- An alert keeps the language it fired in. A low balance alert is the
  exception: it is rewritten with its latest figures, in the current language.
- Amounts and currencies are formatted as before.

## Where the data lives {#storage}

| Platform | Location |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux (source builds) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — the billing ledger, with each charge's original
  currency, [month-end snapshots](overview.md#snapshots) and
  [invoices](reconciliation.md);
- `cloudbridge.duckdb` — accounts, budgets, rules and alert state;
- `raw/` — every provider response and imported file, by source, account
  and month, so a mapping fix can re-read them without another request
  (**Accounts → Replay normalization**);
- `inventory/` and `tools/` — Insights scans and the scanner, if installed;
- `config.json` — currency, theme, refresh interval and background
  settings.

## Backups {#backups}

Quit CloudBridge before copying or opening its databases. Back up the
whole directory — both databases, `raw/` and `config.json` — and restore
it with the app closed. Credentials are in the OS keyring, not in the
backup; on another machine, enter them again. To analyse the ledger
outside the app, query a copy rather than the live file.

## Security {#security}

- Credentials are held in the OS keyring — macOS Keychain or Windows
  Credential Manager; Secret Service on Linux source builds — separate from
  the databases.
- The app uses a credential only for requests to the provider it belongs
  to. Using a key in CloudBridge does not make it read-only: see
  [Provider permissions](permissions.md).
- There is no CloudBridge sync service and no telemetry. An import makes no
  provider request.
- **Local does not mean encrypted.** The app does not encrypt the ledger or
  raw files. Use disk encryption and protect your backups.
- Before sharing logs, screenshots or sample exports, redact credentials,
  account IDs, resource names and tags.
