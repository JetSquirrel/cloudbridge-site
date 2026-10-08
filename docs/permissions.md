---
description: "The least-privilege credentials CloudBridge needs for each provider — AWS Cost Explorer and S3, Alibaba Cloud RAM, Cloudflare API tokens, DeepSeek keys — and how it handles them."
---

# Provider permissions

**[中文](zh/permissions.md)** · [Docs](index.md)

Use dedicated credentials with the least privilege the channel needs.
Read-only behaviour in the app does not make an unrestricted key
read-only: the provider's attached policies decide what a key can do. Do
not use root-account credentials, or grant administrator access, just to
read a bill.

CloudBridge stores credentials in the OS keyring and uses them only to
authenticate requests to the provider they belong to. There is no
CloudBridge sync service and no telemetry. Never post real keys,
credential files or unredacted billing exports in public issues, logs,
screenshots or pull requests, and revoke any key that has been exposed.

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
grants only `ce:GetCostAndUsage`, the Cost Explorer action CloudBridge
uses. Validating a key without an export URI uses STS `GetCallerIdentity`,
which [needs no grant](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html).
The policy keeps `Resource: "*"` for Cost Explorer reads; it does not
grant access to any other service.

1. In the [IAM console](https://console.aws.amazon.com/iam/), create a
   customer-managed policy from the template, or add it to the user inline.
2. Attach it to a dedicated IAM user, without unrelated broad permissions.
3. Create an access key for that user and enter it in CloudBridge.
4. Rotate the key according to your organization's policy.

Only an access-key ID and secret pair is accepted; temporary credentials
that need a session token are not. Organization policies and account-level
billing settings can still restrict access. Cost Explorer requests can
incur fees — see [what it costs](aws.md#cost).

## AWS Data Exports from S3 {#aws-s3}

The Cost Explorer policy does **not** grant access to an export bucket.
Scope `s3:ListBucket` to the export bucket and prefix, and `s3:GetObject`
to the objects under that prefix. Objects encrypted with a customer-managed
KMS key may also need `kms:Decrypt` and a matching key policy, and bucket
policies and organization restrictions must allow the reads. CloudBridge
reads an existing export; it needs no permission to create exports or
write objects. S3 storage and request fees still apply.

## AWS resource scans {#aws-scan}

[Insights](insights.md) scans with the same key and only lists and
describes resources. Give the key read access to them, such as the
`ReadOnlyAccess` managed policy, or a narrower read-only policy covering
the services you want scanned.

## Alibaba Cloud {#alibaba-cloud}

For the billing API, `AliyunBSSReadOnlyAccess` is the built-in read-only
billing policy. It is broader than an endpoint-specific custom policy;
review its scope against your requirements.

1. In the [RAM console](https://ram.console.aliyun.com/), create a
   dedicated RAM user.
2. Attach `AliyunBSSReadOnlyAccess`, or a scoped custom policy for the
   billing operations you use.
3. Create an AccessKey and enter it in CloudBridge.

Do not use the primary account's AccessKey. Importing a bill export needs
no credential.

## Cloudflare {#cloudflare}

Create a custom API token, scoped under **Account Resources** to the one
account CloudBridge should read. Do not use the Global API Key: it carries
every permission of the user.

| Permission | What it is for | Calls |
| --- | --- | --- |
| Account → Billing → Read | The bill | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | Splitting it by resource | `POST /graphql` |
| Read on Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1 | The Insights scan | The account API, through the scanner |

Only the first is required. The account ID is not a secret — it is part of
the request path; the token is, and is kept in the OS keyring like any
other credential.

## DeepSeek {#deepseek}

The API integration uses a platform key from
[platform.deepseek.com](https://platform.deepseek.com/) to call
`GET /user/balance`. That is a read, but **the key itself is not
necessarily read-only**: it may also authorize model requests and incur
spend if used elsewhere. Treat it as a spending credential, use any
restrictions DeepSeek offers, and do not share it. Importing the usage
download needs no key.

## Volcengine, OpenAI and Anthropic {#file-sources}

These sources use local bill exports only. CloudBridge asks for no
credentials for them, and an import makes no provider request. Do not
create an admin or organization key for them until an API channel
actually needs one.
