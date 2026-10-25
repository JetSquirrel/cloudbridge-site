---
title: "0.6.0: Azure and Google Cloud"
description: "Azure and Google Cloud join as billing sources, a command palette reaches every page and account from the keyboard, and Attribution's treemap opens a tile one level down."
date: 2026-10-26
tag: Release
---

# 0.6.0: Azure and Google Cloud

Until now the honest answer to "does it read Azure or Google Cloud?" was no. This release changes that, which brings CloudBridge to nine sources. It also makes the app quicker to get around and clearer about an account that has stopped refreshing.

## Microsoft Azure

CloudBridge reads a subscription's **actual cost** from Cost Management's query API, per service per day, split by charge type. A reservation purchase, a refund or a tax line keeps its own category instead of counting as usage, so a month with a one-off purchase doesn't look like usage tripled.

It signs in as a service principal with the built-in **Cost Management Reader** role, which reads cost data and nothing else. The form asks for the app's client ID, its secret and the subscription ID. You don't need the tenant ID, because CloudBridge looks it up from the subscription. If `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and `AZURE_SUBSCRIPTION_ID` are set on the machine, **Use this machine's credentials** reads them at each fetch.

The query groups by service, not by resource, so Azure has no per-resource or per-region breakdown yet. See [Microsoft Azure](https://cloudbridge.jetsquirrel.cloud/docs/azure) for the setup.

## Google Cloud

Google Cloud has no API that answers "what did this month cost". Its bill is the export that a billing account writes to BigQuery, so that's what CloudBridge reads, with one query per invoice month. Cost comes back per day, by service, SKU, project and region. Credits (free tier, committed use, promotions) are rows of their own, so usage keeps its cost before them.

The credential is a service account key file, with **BigQuery Job User** on the project and **BigQuery Data Viewer** on the export dataset only. CloudBridge stores the file's path, not the key, and reads the file at each fetch, so rotating the key means replacing the file.

A BigQuery query is billed past the monthly free tier. A billing export is usually far smaller than that tier, but it keeps growing while the export runs. See [Google Cloud](https://cloudbridge.jetsquirrel.cloud/docs/google-cloud) for the setup.

## Getting around

- **A command palette.** ⌘K (Ctrl+K on Windows and Linux), or **Search…** at the top of the sidebar, searches every page, every account and the Reload and Add account commands. Each page shows its shortcut beside it.
- **The treemap opens a tile.** In Attribution's Service, Region and Category views, click a tile, or select it with the arrow keys and press Enter, to split it one level down: a service into its resources, a region or category into its services. Escape or Backspace goes back up.
- **A failing account says so.** When the background refresh keeps failing on an account, Accounts marks it **Failing**, with the provider's reason on hover. The status bar shows how many accounts are failing, and the mark clears after the account's next successful refresh.
- **Copy system info** under Settings → About gathers what a bug report needs: version, platform, settings and the kinds of source configured. It leaves out account names, keys and amounts.

The full list is in the [changelog](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## What's next

Azure's bill down to the resource, and resource scans for Azure and Google Cloud in Insights. The billing APIs for Volcengine, OpenAI and Anthropic are still owed; until they're done, their exports can be imported.
