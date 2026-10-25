---
title: "Azure 费用按服务、按天读取"
description: "用服务主体把 Microsoft Azure 订阅接入 CloudBridge：从 Cost Management 读取实际成本，按天、按服务和费用类型拆分。"
---

# Microsoft Azure

**[English](../azure.md)**&emsp;[文档](index.md)

CloudBridge 从 Azure Cost Management 读取订阅的**实际成本**：每个服务**每天**花了多少，
并按费用类型分开。购买的预留实例、退款和税费都按原本的类型记账，不会算进用量，
所以某个月里有一笔一次性购买，不会看起来像用量涨了三倍。

## 连接订阅 {#connect}

CloudBridge 以服务主体的身份登录——一个带有自己密钥的应用注册——而不是以你本人的身份。

1. 在 [Azure 门户](https://portal.azure.com/)，打开 **Microsoft Entra ID → 应用注册 →
   新注册**。起个名字，比如 `cloudbridge`，表单上的其他项不用管。
2. 在新建的应用注册里，打开 **证书和密码 → 新客户端密码**，复制密码的**值**——不是
   密码 ID。它只显示这一次。
3. 打开订阅，进入 **访问控制 (IAM) → 添加角色分配**，选择 **Cost Management
   Reader**（成本管理读者），分配给这个应用。
4. 在 CloudBridge 里为 **Microsoft Azure** 添加账号，填入应用注册的**应用程序（客户端）
   ID**、密码的值和**订阅 ID**。

不需要租户 ID：CloudBridge 会自己查出订阅属于哪个租户。如果查找失败，把订阅填成
`租户ID/订阅ID` 即可。

角色分配可能要几分钟才生效。如果刚分配完第一次拉取就被拒绝，稍等片刻再点 **Validate**。

## 账单里有什么 {#detail}

| 列 | 来自 |
| --- | --- |
| 服务 | 计量类别——*Virtual Machines*、*Storage*、*Bandwidth* |
| 日期 | 用量日期 |
| 类别 | 由费用类型得出：Usage、Purchase、Credit（退款）、Tax 或 Adjustment |
| 金额 | 实际成本，以订阅的计费币种计 |

查询按服务汇总，不到资源或区域这一级，所以[成本归属](attribution.md)里按区域拆分时
Azure 显示为 *Other*，[资源洞察](insights.md)也不扫描 Azure 资源。

Cost Management 的查询 API 按租户限流。一个账号每拉取一个月就是一次查询；同一租户下
的多个订阅共用这个额度，被限流的拉取会在下一次刷新时重试。

## 使用本机凭据 {#system}

如果机器上设置了 `AZURE_CLIENT_ID`、`AZURE_CLIENT_SECRET` 和 `AZURE_SUBSCRIPTION_ID`
——Azure SDK 读取的那几个变量——勾选 **Use this machine's credentials**，CloudBridge
每次拉取时直接读取它们，不另存一份。只执行过 `az login` 不够：那只是一个已登录的用户，
不是 CloudBridge 能用的密钥。

CloudBridge 具体调用了哪些接口，见[云平台权限](permissions.md#azure)。
