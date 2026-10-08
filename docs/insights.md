---
description: "CloudBridge Insights compares the bill with a read-only resource scan of AWS and Cloudflare: stopped instances, idle addresses, unclaimed resources and per-resource cost, summarized by type."
---

# Insights

**[中文](zh/insights.md)**&emsp;[Docs](index.md)

Insights compares the bill with what is actually running, and lists what
is worth a look, each priced from this period's bill.

## Set up and scan {#scan}

Click **Set up and scan**. The first time, CloudBridge asks before
installing its resource scanner,
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist)
— open source, our maintained fork, about 30 MB, kept in CloudBridge's own
data folder and checked against a checksum built into the app. After that
it scans:

- each **AWS** account with its access key, in every region AWS enables by
  default or only the ones you choose;
- each **Cloudflare** account with its API token.

The scan only reads — it lists resources and changes nothing — but the
credential needs read access to them: see [AWS](aws.md#insights) and
[Cloudflare](cloudflare.md#insights). **Scan again** refreshes the
inventory. Scanning needs the desktop app on macOS (Apple silicon) or
Windows.

## What it finds {#findings}

For AWS:

- **Stopped instances** whose volumes still bill;
- **Idle public addresses** — IPv4 addresses allocated but attached to
  nothing;
- **Unclaimed resources** — no owner tag (`owner`, `team`, `project`,
  `cost-center`, `business_line`) and no stack or app managing them;
- **Billed but not in the scan** — in a region the scan covered.

Prices need a resource-level bill: an AWS account pointed at its
[Data Export](aws.md#data-exports). Without one the findings are listed,
not priced.

For Cloudflare, a card lists what the scan found by type — Workers, R2
buckets, D1 databases, KV namespaces, zones, Durable Objects — with each
type's and each resource's share of the bill and its usage this period,
costliest first. With [the bill split by resource](cloudflare.md#split),
that is where a runaway namespace or bucket shows up by name.

## Summary first {#summary}

Every card opens on its resource types, with counts and cost. Click a type
to list its resources, fifty at a time with **Show more**; click it again
to close it. A large account stays one row per type until you ask.
