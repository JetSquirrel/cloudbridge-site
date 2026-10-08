---
description: "CloudBridge alert rules — cost anomalies, balance floors, untagged spend and account budgets — when they run, what they measure, and how alerts are snoozed, dismissed and resolved."
---

# Alerts, rules and budgets

**[中文](zh/alerts.md)**&emsp;[Docs](index.md)

Rules are evaluated against the ledger when the app opens and after each
refresh — including the [background refresh](background.md), which
fetches each account once its refresh interval has passed while CloudBridge
runs, with its window closed too on macOS and Windows. Each new alert posts a system notification. Opening the
Alerts page re-checks whether open alerts have resolved.

## The rules {#rules}

Three rules ship enabled; review them on the **Rules** page and disable
the ones you do not need.

| Rule | Fires when | Default |
| --- | --- | --- |
| Model cost growth anomaly | A source/service pair's daily spend exceeds its trailing 7-day baseline for consecutive days | Above 2.5× for 2 consecutive days |
| Balance floor | A prepaid balance falls below the account's monthly budget amount, or the default floor without one | 200, in the balance's own currency |
| Untagged spend ratio | The month's unallocated usage share exceeds the threshold and is higher than last month's | Above 15% and growing |

**New rule** on the Rules page creates more: pick a kind, adjust its
settings and click **Create rule**. A new rule is enabled at once, and an
anomaly rule can be scoped to one account.

## Budgets {#budgets}

The **Monthly budgets** card on the Rules page sets what an account may
cost in a month. Pick the account, enter a **Monthly budget** and an
**Alert at (% of budget)**, and click **Save budget**; **Remove** deletes
it. Each budgeted account then shows how much of its budget this month has
used, in the reporting currency.

A budget on its own only draws that line. To be alerted, create an
**Account budget** rule for the account and choose:

- **Based on** — *Cost to date* for the month so far, or *Month-end
  forecast* for the run-rate projection;
- **Threshold type** — *% of budget*, or a fixed *Amount*.

An account's budget also serves as its floor in the Balance floor rule.

## Reading an alert {#alerts}

An alert carries the measurements behind it: spend and baseline, balance
and floor, or unallocated share. Projections are estimates from recent
data, not guaranteed month-end costs. **Snooze** hides an alert for a
while; **Dismiss** closes it. An open alert is marked **resolved** when a
later evaluation finds its condition no longer holds.

## Notifications {#notifications}

Each alert that fires while CloudBridge runs is announced once as a system
notification; alerts already open when the app started are not repeated.
Turn them off under **Settings → Background → Alert notifications**.
