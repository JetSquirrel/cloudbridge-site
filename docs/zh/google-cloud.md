---
title: "从 BigQuery 账单导出读取 Google Cloud 费用"
description: "通过结算账号导出到 BigQuery 的账单接入 Google Cloud：按天、按服务、SKU、项目和区域读取费用，赠金单独记账。"
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;[文档](index.md)

Google Cloud 没有能直接回答"这个月花了多少"的 API。它的账单是结算账号写进 BigQuery
数据集的导出，CloudBridge 读的就是这个：每个月一次查询，得到按服务、SKU、项目和区域
**按天**的费用。赠金——免费层、承诺使用折扣、促销——单独成行，所以用量记的是抵扣前的金额。

## 打开账单导出 {#export}

导出只包含开启当天以后的数据，所以先做这一步，哪怕还没安装 CloudBridge。

1. 在 Google Cloud 控制台，打开 **结算 → 结算导出 → BigQuery 导出**。
2. 在 **标准用量费用** 下点 **修改设置**，选一个项目，为它新建一个数据集（比如
   `billing`），保存。
3. 第一批数据到达后（一天之内），数据集里会出现一张名为 `gcp_billing_export_v1_`
   加结算账号 ID 的表。在 BigQuery 里打开它，点 **复制 ID**：这就是 CloudBridge 要的
   *Billing export table*，例如
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`。

## 给 CloudBridge 一个密钥 {#connect}

1. 在导出数据集所在的项目里，打开 **IAM 和管理 → 服务账号**，新建一个，比如
   `cloudbridge`。
2. 在项目上授予它 **BigQuery Job User**（用于运行查询），在导出数据集上授予
   **BigQuery Data Viewer**（用于读取那张表）。
3. 打开这个服务账号，进入 **密钥 → 添加密钥 → 创建新密钥 → JSON**，把下载的文件放在
   只有自己能访问的地方。
4. 在 CloudBridge 里为 **Google Cloud** 添加账号，填入密钥文件的**路径**和账单导出表。

CloudBridge 只保存路径，不保存密钥：每次拉取时读取文件，所以轮换密钥只需替换文件。
`gcloud auth application-default login` 写出的凭据文件也可以代替它；勾选 **Use this
machine's credentials** 时则读取 `GOOGLE_APPLICATION_CREDENTIALS`。

## 账单里有什么 {#detail}

| 列 | 来自 |
| --- | --- |
| 服务 | `service.description`——*Compute Engine*、*Cloud Storage* |
| 描述 | SKU——*N2 Instance Core running in Americas* |
| 项目 | `project.id` 和 `project.name` |
| 区域 | `location.region` |
| 日期 | 用量日期 |
| 类别 | 由 `cost_type` 得出 Usage、Tax 或 Adjustment；赠金记为 Credit |

一个月指的是**发票月份**，与 Google Cloud 发票一致。迟到计费的用量记在开票的那个月，
即使它实际发生在上个月。

查询会读取整张导出表。超出每月免费额度后按 BigQuery 按需价格计费；账单导出通常远小于
这个额度，但只要导出一直开着，它就会一直变大。[资源洞察](insights.md)不扫描 Google
Cloud 资源。

CloudBridge 具体调用了哪些接口，见[云平台权限](permissions.md#google-cloud)。
