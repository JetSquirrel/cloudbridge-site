---
description: "Connect an AWS account to CloudBridge through Cost Explorer with a one-action IAM policy, or through a FOCUS Data Export in S3 for resource-level rows."
---

# AWS

**[中文](zh/aws.md)** · [Docs](index.md)

An AWS account reaches the ledger one of two ways. **Cost Explorer** is the
quick one: an access key and a one-action policy, and the bill arrives as
costs per service per day. A **Data Export** in S3 is the detailed one:
resource IDs, tags and the linked account of every row — what
[Insights](insights.md) needs to price a resource.

## Cost Explorer {#cost-explorer}

1. Open the [IAM console](https://console.aws.amazon.com/iam/), go to
   **Users** and **Create user**. It needs no console access.
2. On the new user, choose **Add permissions → Create inline policy**,
   switch to the JSON editor and paste the policy below (also available as
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)).
3. Open the user's **Security credentials** tab and click **Create access
   key**. Copy the Access Key ID and Secret Access Key; AWS shows the
   secret only once.
4. Add the account in CloudBridge with that key pair.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

It grants only `ce:GetCostAndUsage`, the one Cost Explorer action
CloudBridge calls. Validating the key uses STS `GetCallerIdentity`, which
needs no grant. Temporary credentials that need a session token are not
supported. [Provider permissions](permissions.md#aws) has the reasoning
and how to scope it.

### What it costs {#cost}

Cost Explorer charges per request. A refresh asks for two months per
account — last month and this one — one request each, and more for a month
so large Cost Explorer returns it in pages (at most 20). The refresh
interval keeps the background schedule to one refresh per interval, so
with the default 24 hours an account costs about two requests a day. A
fetch AWS answered but CloudBridge failed to store is not repeated within
the interval. **Force Refresh** goes around all of this; it is the one way
to spend more. Check AWS pricing for current rates.

## Data Exports from S3 {#data-exports}

CloudBridge can read AWS Data Exports (CUR 2.0, in the *FOCUS 1.2 with AWS
columns* shape) from the S3 bucket they are delivered to. Put the export's
URI — `s3://bucket/prefix` — in the account form's **Data export S3 URI**
field, and Refresh reads from there instead of Cost Explorer.

- **Parquet or gzipped CSV**, whichever the export was set to deliver.
- **A month counts once.** Only the files the period's manifest names are
  read, so an export that keeps every delivery still counts a month once.
- **Not delivered is not zero.** A period the export has not written yet
  is skipped, never stored as an empty month.
- **Unchanged is not downloaded again.** The files' keys, sizes and ETags
  are compared with the last fetch first; a month AWS finished delivering
  costs one listing and a manifest read per refresh.
- **A payer's export splits by member account.** Each row keeps the linked
  account it was billed under.

The Cost Explorer policy does **not** grant S3 access: see
[Provider permissions](permissions.md#aws-s3). S3 storage and request fees
still apply.

## Scanning resources {#insights}

[Insights](insights.md) scans an AWS account with the same access key, and
only reads. For that the key needs read access to resources, such as the
AWS `ReadOnlyAccess` managed policy.
