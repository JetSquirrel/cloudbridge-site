---
description: "CloudBridge's Query page: read-only SQL over the local DuckDB billing ledger, with starter templates for spend, services, business lines, forecasts and resources."
---

# Query

**[中文](zh/query.md)** · [Docs](index.md)

The **Query** page runs SQL over the local DuckDB ledger. Desktop only.

- Write one statement and click **Run**, or press **⌘Enter**
  (**Ctrl+Enter** on Windows). The main view is `v_charge_normalized`: one
  row per charge, with amounts converted to the reporting currency.
- The template list fills the editor with a starter query — monthly spend,
  spend by provider, top services, business lines, unallocated spend, a
  month-end forecast, region and service-category splits, top resources,
  discounts against list price, recent ingest batches and balance
  snapshots.
- Only reading statements run: anything that could write is refused before
  it reaches the database, and the ledger is opened read-only for the query
  in any case. Nothing typed here can change your data.
- Large results stop at a row budget — at most 100,000 rows, fewer for wide
  results — and the status line says when a result was cut. Add a `LIMIT`
  or aggregate to see all of it.

## Useful columns {#columns}

The ledger is named after [FOCUS](https://focus.finops.org/) columns:
`billed_cost` and `effective_cost`, `charge_category` (`Usage`,
`Purchase`, `Credit`, `Tax`, `Adjustment`), `service_name`,
`service_category`, `resource_id`, `region_id`, `pricing_quantity` and
`pricing_unit`, plus `x_model` for the model a model-provider row bills.
`cost_basis` says how much weight an amount carries: `authoritative` from
the bill, `estimated` for an allocation such as Cloudflare's per-resource
split, `absent` for usage with no amount.
