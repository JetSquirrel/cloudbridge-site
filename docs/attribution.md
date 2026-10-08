---
description: "CloudBridge's Attribution page: a Sankey from source to service or model to business line, and a breakdown by tag, service, region or FOCUS service category."
---

# Attribution

**[中文](zh/attribution.md)** · [Docs](index.md)

The Attribution page draws the month as a Sankey: source, then service or
model, then business line, with an explicit **Unallocated** node. Flows are
gross usage — a net flow can be negative, which means nothing in a Sankey.
A charge is assigned to a line by its `business_line` tag; without one it
lands in Unallocated.

## Breakdown by dimension {#dimensions}

A switcher above the breakdown picks **Tag** (the business-line view),
**Service**, **Region** or **Category**. The non-tag dimensions draw as a
treemap — **Map**, where a tile's area is its cost this period and its
colour the change against the previous period — or as share bars under
**Table**. Charges with no value for the dimension read as *Other*. A **Top
resources** card lists the period's costliest resources.

## Service categories {#categories}

**Category** uses the FOCUS service categories — Compute, Storage,
Databases, Networking, AI and Machine Learning and the rest — the same on
every cloud, so Alibaba Cloud's ECS, Volcengine's ECS and AWS's EC2 all
count as *Compute / Virtual Machines*, and Model Studio, Ark and the model
providers as *AI and Machine Learning / Generative AI*. A product no
mapping knows yet reads as *Uncategorized* and shows up as a
[data health](overview.md#data-health) finding.
