---
description: "CloudBridge 在各云平台需要的最小权限——AWS Cost Explorer 与 S3、阿里云 RAM、Cloudflare API token、DeepSeek key——以及它如何保管这些凭据。"
---

# 云平台权限

**[English](../permissions.md)** · [文档](index.md)

为每种接入方式使用专用凭据，只给它需要的最小权限。应用里只做读取，并不会让一个
权限不受限的 key 变成只读：key 能做什么，由云平台上附加的策略决定。不要为了读账单
就使用根账号凭据或授予管理员权限。

CloudBridge 把凭据存在系统钥匙串里，只用它向对应的云平台发起认证请求。没有
CloudBridge 同步服务，也没有遥测。不要在公开的 issue、日志、截图或 PR 里贴出真实的
key、凭据文件或未脱敏的账单导出；任何泄露过的 key 都要吊销。

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
只授予 `ce:GetCostAndUsage`，也就是 CloudBridge 使用的 Cost Explorer 操作。没有设置
导出 URI 时，校验 key 用的是 STS `GetCallerIdentity`，它
[不需要授权](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html)。
策略里保留了 `Resource: "*"` 用于 Cost Explorer 读取，但不会授予任何其他服务的访问权。

1. 在 [IAM 控制台](https://console.aws.amazon.com/iam/)里，用这个模板创建客户托管
   策略，或者作为内联策略加到用户上。
2. 把它附加到一个专用的 IAM 用户，不要附带无关的宽泛权限。
3. 为该用户创建访问密钥，填进 CloudBridge。
4. 按组织的规定定期轮换密钥。

只接受访问密钥 ID 和 Secret 这一对凭据，不支持需要 session token 的临时凭据。组织
策略和账号级的账单设置仍可能限制访问。Cost Explorer 请求可能产生费用——见
[费用](aws.md#cost)。

## 从 S3 读取 AWS Data Export {#aws-s3}

Cost Explorer 策略**不**包含导出 bucket 的访问权。请把 `s3:ListBucket` 限定到导出
bucket 和前缀，把 `s3:GetObject` 限定到该前缀下的对象。如果对象使用客户托管的 KMS
密钥加密，可能还需要 `kms:Decrypt` 和相应的密钥策略；bucket 策略和组织限制也必须
允许这些读取。CloudBridge 只读取已有的导出，不需要创建导出或写入对象的权限。S3 的
存储和请求费用照常收取。

## AWS 资源扫描 {#aws-scan}

[资源洞察](insights.md)用同一个 key 扫描，只列出和描述资源。请给它资源的读取权限，
例如托管策略 `ReadOnlyAccess`，或者只覆盖你想扫描的服务的更窄的只读策略。

## 阿里云 {#alibaba-cloud}

账单 API 使用内置的只读账单策略 `AliyunBSSReadOnlyAccess`。它比只针对具体接口的
自定义策略范围更大，请根据需求评估。

1. 在 [RAM 控制台](https://ram.console.aliyun.com/)里创建一个专用的 RAM 用户。
2. 附加 `AliyunBSSReadOnlyAccess`，或针对你所用账单操作的自定义策略。
3. 创建 AccessKey 并填进 CloudBridge。

不要使用主账号的 AccessKey。导入账单文件不需要凭据。

## Cloudflare {#cloudflare}

创建一个自定义 API token，在 **Account Resources** 下限定到 CloudBridge 要读取的
那一个账号。不要使用 Global API Key：它拥有该用户的全部权限。

| 权限 | 用途 | 调用 |
| --- | --- | --- |
| Account → Billing → Read | 读取账单 | `GET /accounts/{id}/billable-usage/info`、`GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | 按资源拆分账单 | `POST /graphql` |
| Account Settings、Zone、Workers Scripts、Workers R2 Storage、Workers KV Storage、Queues、D1 的 Read | 资源洞察扫描 | 通过扫描器调用账号 API |

只有第一项是必需的。Account ID 不是机密——它是请求路径的一部分；token 才是，它和
其他凭据一样保存在系统钥匙串里。

## DeepSeek {#deepseek}

API 接入使用 [platform.deepseek.com](https://platform.deepseek.com/) 的平台 key 调用
`GET /user/balance`。这是一次读取，但**这个 key 本身不一定是只读的**：它也可能被用来
发起模型请求、产生花费。请把它当成能花钱的凭据，使用 DeepSeek 提供的任何限制手段，
不要分享出去。导入用量下载文件不需要 key。

## 火山引擎、OpenAI 和 Anthropic {#file-sources}

这些数据源目前只使用本地的账单导出文件。CloudBridge 不会向你要它们的凭据，导入也
不会向云平台发任何请求。在真正需要 API 接入之前，不要为它们创建管理员或组织级的 key。
