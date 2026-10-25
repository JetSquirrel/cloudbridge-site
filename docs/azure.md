---
title: "Azure costs per service, per day"
description: "Connect a Microsoft Azure subscription to CloudBridge with a service principal: actual cost from Cost Management, daily, by service and charge type."
---

# Microsoft Azure

**[中文](zh/azure.md)**&emsp;[Docs](index.md)

CloudBridge reads a subscription's **actual cost** from Azure Cost
Management: what each service cost **per day**, split by charge type. A
reservation bought, a refund or tax is kept as what it is, not added to
usage, so a month with a one-off purchase in it does not look like a month
whose usage tripled.

## Connect the subscription {#connect}

CloudBridge signs in as a service principal — an app registration with its
own secret — rather than as you.

1. In the [Azure portal](https://portal.azure.com/), open **Microsoft Entra
   ID → App registrations → New registration**. Give it a name such as
   `cloudbridge`; nothing else on the form matters.
2. In the new registration, open **Certificates & secrets → New client
   secret**, and copy the secret's **Value** — not its Secret ID. It is
   shown once.
3. Open the subscription, then **Access control (IAM) → Add role
   assignment**. Pick **Cost Management Reader** and assign it to the app.
4. In CloudBridge, add an account for **Microsoft Azure** with the
   registration's **Application (client) ID**, the secret's value and the
   **Subscription ID**.

You do not need the tenant ID: CloudBridge looks up which tenant the
subscription belongs to. If that lookup fails, enter the subscription as
`tenant-id/subscription-id`.

A role assignment can take a few minutes to apply. If the first fetch is
refused right after you made it, wait and click **Validate** again.

## What the bill shows {#detail}

| Column | From |
| --- | --- |
| Service | The meter category — *Virtual Machines*, *Storage*, *Bandwidth* |
| Day | The usage date |
| Category | Usage, Purchase, Credit (refunds), Tax or Adjustment, from the charge type |
| Amount | Actual cost, in the subscription's billing currency |

The query reports by service, not by resource or region, so the Region
breakdown on [Attribution](attribution.md) reads *Other* for Azure, and
[Insights](insights.md) does not scan Azure resources.

Cost Management's query API is rate limited per tenant. One account is one
query per month fetched; several subscriptions in the same tenant share the
limit, and a throttled fetch is retried on the next refresh.

## Use this machine's credentials {#system}

On a machine where `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and
`AZURE_SUBSCRIPTION_ID` are set — the variables the Azure SDKs read — tick
**Use this machine's credentials** and CloudBridge reads them at each fetch
instead of keeping a copy. `az login` alone is not enough: it leaves a
signed-in user, not a secret CloudBridge can use.

See [Provider permissions](permissions.md#azure) for exactly which
endpoints CloudBridge calls.
