---
description: "Connect Cloudflare to CloudBridge with an account ID and an API token: daily billable usage, split across R2 buckets, Workers, D1 databases and Durable Objects, and a read-only resource scan."
---

# Cloudflare

**[中文](zh/cloudflare.md)**&emsp;[Docs](index.md)

CloudBridge reads Cloudflare's billable usage: spend per service, **per
day**. That is the point. A Worker or Durable Object that starts looping is
in the ledger the next day, not on the invoice at the end of the month —
and usage inside the free allowance is kept too, with a cost of zero
beside it, because that is where a runaway starts.

## Connect the account {#connect}

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens),
   go to **My Profile → API Tokens → Create Token** and start from
   **Create Custom Token**.
2. Grant **Account → Billing → Read**, and limit **Account Resources** to
   the account to watch.
3. Copy the account ID from the account's home page in the dashboard.
4. Add the account in CloudBridge with the account ID and the token.

The billable usage API covers pay-as-you-go (self-serve) accounts only, and
is an alpha API; an Enterprise account is reported as not covered.
Cloudflare bills on a cycle anchored at the subscription's start; each
calendar month in CloudBridge holds the days that fall inside it.

## Split by resource {#split}

The bill stops at the service — *R2 Class B operations, 734 on 3 October*
— not which bucket. Add **Account → Account Analytics → Read** to the token
and CloudBridge asks the GraphQL Analytics API for each resource's usage of
the meters the bill names, then splits each day's row by those shares:

| Bill | Split across |
| --- | --- |
| R2 Class A and B operations, storage | R2 buckets |
| Workers requests and CPU | Workers (by requests) |
| D1 rows read and written, storage | D1 databases |
| Durable Objects requests, duration, rows, storage | Durable Object namespaces |

The parts add up to what Cloudflare billed and are marked as estimates:
analytics are sampled, and a free allowance belongs to the account, not to
any one resource. A meter the analytics cannot split — KV, Queues,
anything unrecognized — or a token without the permission keeps its row
whole, at the account. [Insights](insights.md) shows each resource's share
and its usage this period.

## Catch a runaway {#runaway}

Nothing stops a pay-as-you-go Cloudflare account at a spending limit, so a
Durable Object alarm or a Worker that loops bills for as long as it runs.
CloudBridge cannot stop it either; it can tell you on the first day rather
than on the invoice. Set this up for every Cloudflare account, the quiet
ones included — a project nobody uses is the one nobody is watching:

1. On the **Rules** page, give the account a **Monthly budget**: what a
   normal month costs, with some room. The rule below measures against it,
   and does nothing for an account without one.
2. Click **New rule**, choose **Account budget** for the account, and set
   **Based on** to **Month-end forecast**.
3. Under **Settings → Refreshing**, shorten the refresh interval to 6
   hours, and keep CloudBridge running in the [menu bar](background.md)
   with **Open at login** on.

The forecast is what makes this work. It averages the month's spend from
the first day that had any, so the first day of a loop is projected across
the rest of the month, and the rule fires on the first refresh that reads
that day.

The **cost growth anomaly** rule does not catch this case. It compares a
service with its own last seven days, and a service that cost nothing has
no baseline to grow from, so a dormant project that wakes up looping never
trips it.

When the alert fires, stop the Worker or Durable Object in the Cloudflare
dashboard. With Account Analytics on the token, [Insights](insights.md)
shows each Worker's and namespace's share of the bill, so the one behind
it stands out.

## Scan resources {#insights}

[Insights](insights.md) scans the account with the same token and only
reads. For that, add these **Read** permissions on the same account:
**Account Settings**, **Zone**, **Workers Scripts**, **Workers R2
Storage**, **Workers KV Storage**, **Queues** and **D1**. A token without
them still reads the bill; the scan says what it was refused.

See [Provider permissions](permissions.md#cloudflare) for exactly which
endpoints CloudBridge calls.
