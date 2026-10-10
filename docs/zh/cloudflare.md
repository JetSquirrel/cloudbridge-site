---
description: "用 Account ID 和 API token 把 Cloudflare 接入 CloudBridge：按天读取计费用量，拆分到 R2 bucket、Worker、D1 数据库和 Durable Object，并支持只读的资源扫描。"
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;[文档](index.md)

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

## 及早发现失控 {#runaway}

按量付费的 Cloudflare 账号没有到某个金额就停下的上限，一个死循环的 Durable Object
alarm 或 Worker 跑多久就计费多久。CloudBridge 也停不了它，但能让你在第一天就知道，
而不是等到发票上才看见。给每个 Cloudflare 账号都这样设置一遍，包括那些没什么动静的
——没人用的项目，往往也没人盯着：

1. 在 **Rules** 页面给这个账号设一个 **Monthly budget**（月度预算）：正常一个月的
   花费，再留些余量。下面的规则以它为准；没设预算的账号，规则什么也不做。
2. 点 **New rule**，为这个账号选择 **Account budget**，把 **Based on** 设为
   **Month-end forecast**（月底预测）。
3. 在 **Settings → Refreshing** 里把刷新间隔缩短到 6 小时，并让 CloudBridge 留在
   [状态栏](background.md)里运行，打开 **Open at login**。

关键在于预测的算法。它从本月第一个有花费的日子开始求日均，所以死循环的第一天就会
被外推到整个月剩下的日子，读到那一天的第一次刷新就会触发规则。

**费用增长异常**规则抓不到这种情况。它拿一个服务和它自己过去七天比，而一直不花钱的
服务没有基线可以"增长"——一个沉睡的项目突然醒来死循环，永远不会触发它。

告警触发后，到 Cloudflare 控制台停掉那个 Worker 或 Durable Object。token 带有
Account Analytics 权限时，[资源洞察](insights.md)会列出每个 Worker 和命名空间分到的
费用，罪魁祸首一眼就能看出来。

## 扫描资源 {#insights}

[资源洞察](insights.md)用同一个 token 扫描账号，只做读取。为此需要在同一账号上
再加这些 **Read** 权限：**Account Settings**、**Zone**、**Workers Scripts**、
**Workers R2 Storage**、**Workers KV Storage**、**Queues** 和 **D1**。没有这些权限的
token 仍然可以读取账单；扫描会说明哪些请求被拒绝了。

CloudBridge 具体调用哪些接口，见[云平台权限](permissions.md#cloudflare)。
