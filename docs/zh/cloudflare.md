---
description: "用 Account ID 和 API token 把 Cloudflare 接入 CloudBridge：按天读取计费用量，拆分到 R2 bucket、Worker、D1 数据库和 Durable Object，并支持只读的资源扫描。"
---

# Cloudflare

**[English](../cloudflare.md)** · [文档](index.md)

CloudBridge 读取 Cloudflare 的计费用量：按服务、**按天**的花费。关键就在"按天"。
一个开始死循环的 Worker 或 Durable Object，第二天就会出现在账本里，而不是等到月底
的发票上。免费额度内的用量也会保留，费用记为零——因为失控往往就是从这里开始的。

## 连接账号 {#connect}

1. 在 [Cloudflare 控制台](https://dash.cloudflare.com/profile/api-tokens)，进入
   **My Profile → API Tokens → Create Token**，从 **Create Custom Token** 开始。
2. 授予 **Account → Billing → Read**，并把 **Account Resources** 限定到要监控的账号。
3. 从控制台里该账号的首页复制 Account ID。
4. 在 CloudBridge 里用 Account ID 和 token 添加账号。

计费用量 API 只覆盖按量付费（自助）账号，而且还是 alpha 版本；企业版账号会提示
不在覆盖范围内。Cloudflare 的账期以订阅开始日为锚点；CloudBridge 里每个自然月
包含落在该月内的那些天。

## 按资源拆分 {#split}

账单只到服务这一级——*R2 Class B operations，10 月 3 日 734 次*——不会告诉你是哪个
bucket。给 token 加上 **Account → Account Analytics → Read**，CloudBridge 就会通过
GraphQL Analytics API 查询每个资源在账单所列计量项上的用量，再按占比拆分每一天的账单行：

| 账单 | 拆分到 |
| --- | --- |
| R2 Class A 与 B 操作、存储 | R2 bucket |
| Workers 请求与 CPU | Worker（按请求数） |
| D1 读写行数、存储 | D1 数据库 |
| Durable Objects 请求、时长、行数、存储 | Durable Object 命名空间 |

拆分后的各部分加起来等于 Cloudflare 的账单金额，并标记为估算：分析数据是采样的，
而且免费额度属于整个账号，不属于某个资源。分析数据无法拆分的计量项——KV、Queues、
任何无法识别的——或者 token 没有这项权限时，该行保持整行记在账号上。
[资源洞察](insights.md)会显示每个资源分到的费用和本期用量。

## 扫描资源 {#insights}

[资源洞察](insights.md)用同一个 token 扫描账号，只做读取。为此需要在同一账号上
再加这些 **Read** 权限：**Account Settings**、**Zone**、**Workers Scripts**、
**Workers R2 Storage**、**Workers KV Storage**、**Queues** 和 **D1**。没有这些权限的
token 仍然可以读取账单；扫描会说明哪些请求被拒绝了。

CloudBridge 具体调用哪些接口，见[云平台权限](permissions.md#cloudflare)。
