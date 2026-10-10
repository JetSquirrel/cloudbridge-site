---
description: "Install CloudBridge on macOS or Windows, look around with the demo bill, add your first account and read your first bill in a few minutes."
---

# Getting started

**[中文](zh/getting-started.md)**&emsp;[Docs](index.md)

CloudBridge reads your cloud and model-provider bills into one ledger on
your machine — from a billing API, or from the export you downloaded — and
draws the trends. There is no sign-up, no sync and no telemetry. This page
takes you from download to your first bill.

## 1. Install {#install}

Download the latest build from the
[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest) page:

| Platform | File |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** Open the `.dmg`, drag **CloudBridge** to **Applications** and
launch it from there. Releases are Developer ID signed and notarized, so
they open without a workaround. If macOS blocks a current release,
[report the exact warning](https://github.com/JetSquirrel/cloudbridge/issues)
and your macOS version; do not remove quarantine protection as a routine
installation step.

**Windows.** The `.exe` is not code-signed, so SmartScreen will likely stop
it with *Windows protected your PC*. Check that the file came from the
official Releases page, then click **More info** and **Run anyway**.
Windows remembers the choice for that file; a new release asks again.

Linux and Intel Mac binaries are not published. Building from source needs
Rust 1.95 or newer — see the
[development setup](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup):

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. Look around first, if you like {#demo}

[The browser demo](https://cloudbridge.jetsquirrel.cloud/demo/) runs the
same pages on a sample bill. It keeps no credentials and reaches no
provider, so importing, refreshing from a billing API and the SQL console
are desktop-only.

In the app, an empty Overview offers **Load demo data**, or open
**Settings → Demo data**. Demo accounts carry no credentials and are
skipped by refreshes; **Clear demo data** on the same page removes them.

## 3. Add an account {#account}

Open **Accounts**, click **Add account**, pick the source and enter a name.

| Source | How the bill arrives | What it needs |
| --- | --- | --- |
| Amazon Web Services | Billing API | Access Key ID + Secret — [AWS](aws.md) |
| Alibaba Cloud | Billing API, or a bill export | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | Billing API | Account ID + API token — [Cloudflare](cloudflare.md) |
| DeepSeek | Balance API, or a bill export | API key — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | Bill export | Nothing |
| OpenAI | Bill export | Nothing |
| Anthropic (Claude) | Bill export | Nothing |

Click **Save**. An API source fetches this month's and last month's bill
straight away, so a wrong key shows up as that fetch failing.

## 4. Get the bill in {#bill}

- **An API source** fetched its bill when you saved it. **Refresh** on the
  Overview fetches again once the refresh interval has passed.
- **A file source** — Volcengine, OpenAI, Anthropic, or Alibaba Cloud and
  DeepSeek when you want finer detail — needs its export: download it from
  the provider's console and click **Import** on the account's row. See
  [Bill file import](bill-import.md).

## 5. Read it {#read}

The **Overview** shows the window you pick: **MTD**, **30d** or **12m**.
Choose USD or CNY under **Settings → Reporting**. From there:

- [Overview and accounts](overview.md) explains the numbers.
- [Alerts, rules and budgets](alerts.md) tells you when spend jumps.
- [Menu bar and background](background.md) keeps that running with the
  window closed.

Something not showing up? See [Troubleshooting](troubleshooting.md).
