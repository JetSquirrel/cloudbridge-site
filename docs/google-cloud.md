---
title: "Google Cloud costs from the BigQuery billing export"
description: "Connect Google Cloud to CloudBridge through the billing account's BigQuery export: daily cost by service, SKU, project and region, with credits apart."
---

# Google Cloud

**[中文](zh/google-cloud.md)**&emsp;[Docs](index.md)

Google Cloud has no API that answers "what did this month cost". Its bill
is the export a billing account writes to a BigQuery dataset, so that is
what CloudBridge reads: one query per month, giving cost **per day** by
service, SKU, project and region. Credits — free tier, committed use,
promotions — come back as their own rows, so usage stays what it cost
before them.

## Turn on the export {#export}

The export holds data from the day it is turned on, so do this first, even
before installing CloudBridge.

1. In the Google Cloud console, open **Billing → Billing export →
   BigQuery export**.
2. Under **Standard usage cost**, click **Edit settings**, pick a project
   and create a dataset for it (for example `billing`), and save.
3. Once the first rows arrive — within a day — the dataset holds a table
   named `gcp_billing_export_v1_` followed by the billing account ID. In
   BigQuery, open it and use **Copy ID**: that is the *Billing export
   table* CloudBridge asks for, such as
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`.

## Give CloudBridge a key {#connect}

1. In the export dataset's project, open **IAM & Admin → Service
   accounts** and create one, such as `cloudbridge`.
2. Grant it **BigQuery Job User** on the project, so it can run a query,
   and **BigQuery Data Viewer** on the export dataset, so the query can read
   the table.
3. Open the service account, then **Keys → Add key → Create new key →
   JSON**. Keep the downloaded file somewhere private.
4. In CloudBridge, add an account for **Google Cloud** with the key file's
   **path** and the billing export table.

CloudBridge keeps the path, not the key: the file is read at each fetch,
so rotating the key is a matter of replacing the file. The credentials
file `gcloud auth application-default login` writes works in its place,
and so does `GOOGLE_APPLICATION_CREDENTIALS` with **Use this machine's
credentials**.

## What the bill shows {#detail}

| Column | From |
| --- | --- |
| Service | `service.description` — *Compute Engine*, *Cloud Storage* |
| Description | The SKU — *N2 Instance Core running in Americas* |
| Project | `project.id` and `project.name` |
| Region | `location.region` |
| Day | The usage day |
| Category | Usage, Tax or Adjustment, from `cost_type`; credits as Credit |

A month is the **invoice month**, as on the Google Cloud invoice. Usage
billed late lands in the month it was invoiced in, even when it ran in the
month before.

The query reads the whole export table. BigQuery's on-demand pricing
applies past the monthly free tier; a billing export is usually far
smaller than that, but it grows for as long as the export runs.
[Insights](insights.md) does not scan Google Cloud resources.

See [Provider permissions](permissions.md#google-cloud) for exactly which
endpoints CloudBridge calls.
