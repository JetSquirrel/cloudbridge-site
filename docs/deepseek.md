---
description: "Connect DeepSeek to CloudBridge with an API key for the prepaid balance, and import its usage download for per-day, per-model spend."
---

# DeepSeek

**[中文](zh/deepseek.md)** · [Docs](index.md)

DeepSeek's API reports a **balance** — granted and topped-up — not a
spending breakdown. For spend detail, import the console's download.

## Balance API {#api}

1. Open [platform.deepseek.com](https://platform.deepseek.com/) and create
   an API key.
2. Add the account in CloudBridge using that key.

The balance feeds the **Balance floor** rule (see
[Alerts, rules and budgets](alerts.md)). A key used for balance queries may
also authorize paid model requests, so protect it and review its
permissions — see [Provider permissions](permissions.md#deepseek).

## Usage download {#export}

In the console, go to **Usage → Download** and import the ZIP exactly as
downloaded: CloudBridge reads the `cost-*.csv` inside it and ignores
`amount-*.csv`, whose `amount` column holds token counts, not money. See
[Bill file import](bill-import.md).
