---
description: "How CloudBridge's Overview reads your spend — net and gross, credits, the chart, biggest movers and unallocated usage — plus account pages, data health, adding and removing accounts."
---

# Overview and accounts

**[中文](zh/overview.md)** · [Docs](index.md)

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

Hovering a chart snaps to the nearest point and shows that bucket's date
and amount. **Refresh** fetches accounts whose data is older than the
refresh interval; **Force Refresh** fetches them all — see
[what it costs](aws.md#cost).

## One account at a time {#account}

Click an account's name on the **Accounts** page to drill into it: the same
range control, a net / gross / credits row, that account's usage trend,
and a per-service table with each service's share and change. The same
dimension breakdown as [Attribution](attribution.md) is there too.

## Adding and removing accounts {#accounts}

To add one, go to **Accounts**, pick the source, enter a name and — for an
API source — the credential, then **Save**. An API source is validated
and its current month fetched at once; **Validate** on its row re-checks
the credential later. On a Mac or Windows machine where the provider's own
tooling is set up, the form can read the credential from the environment
or the CLI's profile instead of storing a copy.

Deleting an account always removes its row and its credentials from the
keyring. If the ledger holds charges for it, the dialog also offers **Also
delete its billing history**, off by default. Left off, the charges stay
and **keep counting in every total**; turned on, they and the raw payloads
behind them are removed. Neither can be undone. History that outlived its
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
