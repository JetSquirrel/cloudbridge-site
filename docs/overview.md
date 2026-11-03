---
title: "Overview: net spend, forecast and accounts"
description: "How CloudBridge’s Overview reads spend: net and gross, credits, the forecast, biggest movers and unallocated usage, plus accounts and data health."
---

# Overview and accounts

**[中文](zh/overview.md)**&emsp;[Docs](index.md)

## The Overview {#overview}

The header carries a range control — **MTD**, **30d** or **12m** — and
every number on the page is computed for the window you pick.

- The headline **spend** is net of credits: what you were actually charged.
  The gross usage and the credits that took it down are shown beside it.
- The **chart**, the change percent, **Where it went** and the **biggest
  movers** run on gross usage. An account whose usage credits cover in full
  nets to about zero, and a trend drawn on that base is noise.
- For **MTD**, a second card forecasts the month's end from the run rate,
  with an optimistic and a pessimistic band.
- **Unallocated** is the share of usage that reaches no business line —
  the part of the bill you cannot yet explain. See
  [Attribution](attribution.md).
- If charges in the range have no exchange rate, a warning says they are not
  counted in the totals.

Hovering a chart snaps to the nearest point and shows that bucket's date
and amount. **Refresh** fetches accounts whose data is older than the
refresh interval; **Force Refresh** fetches them all — see
[what it costs](aws.md#cost).

## One account at a time {#account}

Click an account's name on the **Accounts** page to drill into it: the same
range control, a net / gross / credits row, that account's usage trend,
and a per-service table with each service's share and change. The same
dimension breakdown as [Attribution](attribution.md) is there too.

## Export a monthly cost review {#report}

**Export report** on the Overview saves one month as a single HTML file, ready
to print or share. Pick a month, which starts on the newest one that has ended,
then **Choose file and export** and choose where it goes. The file loads
nothing from elsewhere, and nothing is uploaded. It needs CloudBridge 0.9.0 or
later on the desktop: the browser demo has no export.

The report covers every account in the reporting currency, and there are no
provider or account filters. It holds:

- net cost, usage and credits, and the change from the month before;
- **Cost by service**, **Net cost by region** and **Usage by business line**;
- **Forecast and budgets**, for a month still in progress;
- **Data health**, the top **Insights** and **Sources**, which lists where each
  source's data came from and when it was last ingested;
- **What these figures leave out**, such as charges with no exchange rate, usage
  rows with no amount, or an inventory that was never scanned or only partly
  scanned.

A month still in progress shows month-to-date figures and no change, because
the previous month's column is a whole month. The report names accounts,
services and resources, so read it before sending it outside your team.

## Freeze a month {#snapshots}

The ledger keeps changing: a refresh or import can rewrite a month, and
providers correct bills after the month ends. **Month-end snapshots** on an
account's page keeps a copy that doesn't change, to close the month against
later. It needs CloudBridge 0.9.0 or later. To compare a copy with the provider's
invoice, see [Reconciliation](reconciliation.md#snapshot).

Pick the month and click **Freeze period**. A dialog says how many charges the
copy will hold and what they total. The copy keeps those charges, the totals
per billing currency, the exchange rates in use and where the bill came from,
and no later refresh or import changes it.

- **Comparing with the ledger.** Each revision reads **Matches the ledger** or
  **Differs from the ledger**, with tables by billing currency, service and
  charge category. Click a row to see the charges behind it. Differences are
  shown per currency, so an exchange rate can't hide one.
- **Revisions.** Once the bill has changed, **Freeze new revision** adds another
  copy and keeps the earlier ones. If the bill hasn't changed, no revision is
  added.
- **A month still in progress** can be frozen, but the dialog warns that the
  copy will be incomplete, and the snapshot keeps saying so afterwards.
- **Missing amounts.** A month whose charges carry usage but no amounts has no
  total, which doesn't mean it cost nothing. The card says so, and says how many
  charges have no amount or no exchange rate.
- **Checking a copy.** Each revision shows its snapshot ID, ingest batch and
  checksum. If the stored charges no longer match the checksum, the card warns
  you not to rely on that revision.

Snapshots are stored in `billing.duckdb`, so a [backup](settings-and-data.md#backups)
of the data folder includes them. Deleting an account's billing history removes
them too.

## Adding and removing accounts {#accounts}

To add one, go to **Accounts**, pick the source, enter a name and — for an
API source — the credential, then **Save**. An API source fetches this
month's and last month's bill at once; **Validate** on its row checks the
credential on its own. Where the provider's own tooling is set up on the
machine, the form can read the credential from the environment or the
CLI's profile instead of storing a copy.

Deleting an account always removes its row and its credentials from the
keyring. If the ledger holds charges for it, the dialog also offers **Also
delete its billing history**, off by default. Left off, the charges stay
and **keep counting in every total**; turned on, they, the raw payloads
behind them and any [month-end snapshots](#snapshots) are removed. Neither
can be undone. History that outlived its
account is listed on the Accounts page under **Billing history from
deleted accounts**, where **Delete history** removes it.

## Data health {#data-health}

CloudBridge checks the ledger for things that make a total less
trustworthy than it looks:

- charges whose currency the rate table cannot convert;
- usage with no `business_line` tag;
- usage with no region;
- adjustments no charge explains;
- usage from products with no service category yet.

The Overview shows them as a **Data quality** strip, the Accounts page as
a **Data health** card, and an account's page lists its own. **Dismiss**
hides a finding for that billing period; the same finding in a later
period shows again.

## Reporting currency {#currency}

**Settings → Reporting** chooses USD or CNY. Charges keep the currency they
were billed in; a dated, built-in exchange-rate table converts them for
display, at a rate no later than the charge date. Rates are not live market
data. A missing rate is reported, never treated as 1:1.
