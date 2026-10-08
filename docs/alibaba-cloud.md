---
description: "Connect Alibaba Cloud (阿里云) to CloudBridge through the billing API with a read-only RAM user, or import its bill details for per-model Model Studio (百炼) costs."
---

# Alibaba Cloud

**[中文](zh/alibaba-cloud.md)** · [Docs](index.md)

Alibaba Cloud has both channels. The **billing API** gives each product's
total for the month; the **bill details export** gives instance-level rows,
including Model Studio (百炼) per model with token counts. Use the API for
an account kept up to date by itself, and import the export when you want
the finer reading — an imported month is never overwritten by a refresh.

## Billing API {#api}

1. Open the [RAM console](https://ram.console.aliyun.com/) and create a
   RAM user for API access.
2. Attach the built-in `AliyunBSSReadOnlyAccess` system policy.
3. Create an AccessKey for the user.
4. Add the account in CloudBridge with the AccessKey ID and Secret.

Do not use the primary account's AccessKey. The billing API has no
per-query fee documented here; check Alibaba Cloud's current terms. See
[Provider permissions](permissions.md#alibaba-cloud).

## Bill details export {#export}

In the console, go to **Expenses and Costs → Bill Details → Export**,
download the full bill and click **Import** on the account's row. An
import needs no credentials. See [Bill file import](bill-import.md).
