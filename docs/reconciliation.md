---
title: "Reconcile cloud invoices with your billing ledger"
description: "CloudBridge Reconciliation compares each provider's final invoice with the ledger or a frozen snapshot, in the invoice's currency, and says what to check."
---

# Reconciliation

**[中文](zh/reconciliation.md)**&emsp;[Docs](index.md)

The **Reconciliation** page answers one question: does each provider's final
invoice match what CloudBridge imported? It needs CloudBridge 0.9.0 or later.

Only authoritative billed cost in the invoice's own currency is compared, so
an exchange rate can't hide a difference. Invoices are stored apart from your
charges and never change them.

## Add an invoice {#add}

- **Enter total** records one invoice. **Total** is the invoice's final amount.
  Tax, credits and adjustments are what the invoice states: they aren't added to
  the total, and only help explain a difference. Enter credits as zero or
  negative.
- **Import invoice CSV** reads many at once, on the desktop only. If any line is
  wrong, nothing is imported, and the error names the line.

The CSV needs a header row:

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

Columns from `tax` on are optional. `billing_period` is `YYYY-MM`, `currency` is
a three-letter code, and amounts are plain numbers with no thousands separator.
Every row must name one of your accounts.

If an account's charges span more than one billing account, set the invoice's
billing account ID so it's compared with the right one.

## Read the result {#status}

| Status | What it means |
| --- | --- |
| Matched | The invoice and the ledger agree, within the currency's tolerance |
| Difference | They disagree. The row shows the difference, and what to check next |
| Cannot verify | There's nothing fair to compare yet, and the row says why |
| Missing evidence | The month has billed charges but no invoice, so it hasn't been checked |

A month reads **Cannot verify** when, for example, it hasn't ended, the ledger
has no charges in the invoice's currency, or every charge is usage with no
amount. Derived or estimated amounts are left out of the ledger figure.

Open a row to see the breakdown by charge category, the invoice's details and
what to check, such as tax on one side only, a late credit or adjustment, an
export that covers part of the month, or a total that fits a different month.

## Compare with a snapshot {#snapshot}

**Compare with** chooses the current ledger or a
[month-end snapshot](overview.md#snapshots), so you can check an invoice against
the month as you closed it, whatever later refreshes changed.

Deleting an invoice removes only that record. The ledger and any snapshots stay
as they are.
