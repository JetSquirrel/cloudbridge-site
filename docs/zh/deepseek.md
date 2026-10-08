---
description: "把 DeepSeek 接入 CloudBridge：用 API key 读取预付费余额，导入用量下载文件获得按天、按模型的花费。"
---

# DeepSeek

**[English](../deepseek.md)** · [文档](index.md)

DeepSeek 的 API 只报告**余额**——赠送余额和充值余额——不提供花费明细。要看花费明细，
请导入控制台的下载文件。

## 余额 API {#api}

1. 打开 [platform.deepseek.com](https://platform.deepseek.com/)，创建一个 API key。
2. 在 CloudBridge 里用这个 key 添加账号。

余额会用于 **Balance floor**（余额下限）规则（见[告警、规则与预算](alerts.md)）。
用来查余额的 key 也可能有权发起付费的模型请求，所以请妥善保管并检查它的权限——见
[云平台权限](permissions.md#deepseek)。

## 用量下载 {#export}

在控制台进入 **用量信息 → 导出**（Usage → Download），直接导入下载得到的 ZIP：
CloudBridge 读取其中的 `cost-*.csv`，忽略 `amount-*.csv`——后者的 `amount` 列是
token 数量，不是金额。见[导入账单文件](bill-import.md)。
