---
description: "Import bill exports from Alibaba Cloud, Volcengine, OpenAI, Anthropic and DeepSeek into CloudBridge: where each comes from, what it adds, and how a month is replaced."
---

# Bill file import

**[中文](zh/bill-import.md)**&emsp;[Docs](index.md)

A bill export downloaded from a provider's console parses into the same
ledger rows a fetch produces. Downstream — totals, charts, alerts,
attribution — an imported month is indistinguishable from a fetched one.
It is often the finer reading: Alibaba Cloud's billing API reports Model
Studio (百炼) as one figure a month, while its export reports it per
model, with token counts.

Volcengine, OpenAI and Anthropic are import-only for now: add the account
with a name, no credentials, and import.

| Source | Where the export comes from | What it adds |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) per model; instance-level detail for everything else |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) per endpoint and token type |
| OpenAI | Usage → Export | Cost or token usage, per project and model |
| Anthropic (Claude) | Usage or Cost → Export | Cost or token usage, per workspace and model |
| DeepSeek | Usage → Download | Per-day, per-model spend — its API reports only a balance |

## Importing {#import}

1. Download the export from the provider's console.
2. Go to **Accounts** and click **Import** on the account's row.
3. Pick the file. CloudBridge reports how many charges it wrote and which
   months it replaced.

::: warning A month is replaced, not added to
An import replaces every month the file covers for the selected account,
so importing twice never doubles a charge. Export the full bill: a
product-filtered file replaces that month's data with only that product.
To update an imported month, re-import a complete, corrected export.
Refresh never overwrites an imported month, Force Refresh included.
:::

## Usage exports carry no money {#usage-exports}

A **usage** export, with token counts but no amounts, is recorded with no
billed cost and a cost basis of *absent*. CloudBridge does not turn token
counts into estimated spend at list prices. A **cost** export keeps a
quantity only where exactly one token column is populated: input and
output tokens have different prices and cannot be one priced quantity.

## Encodings {#encoding}

Text exports must be UTF-8. Alibaba Cloud and Volcengine consoles can
produce GBK files; re-export as UTF-8 or save as *CSV UTF-8* first. More in
[Troubleshooting](troubleshooting.md#import-errors).
