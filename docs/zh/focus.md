---
title: "FOCUS 1.5 与大模型 token 数据"
description: "CloudBridge 如何按 FOCUS 1.5 记录 AI 模型的 token 用量：ConsumedQuantity、SkuMeter，以及 SkuPriceDetails 里的 ModelId、TokenDirection 和 TokenCacheAction。"
---

# FOCUS 与 token 数据

**[English](../focus.md)**&emsp;[文档](index.md)

CloudBridge 的账本沿用 FinOps 基金会的开放成本与用量规范 [FOCUS](https://focus.finops.org/)
的列名。FOCUS 1.5 规定了 AI 模型 API 的账单怎么描述：它没有新增 token 列，而是用 FOCUS
已有的列来表达，CloudBridge 也按同样的方式记录 token。

## token 行里有什么 {#columns}

| FOCUS 列 | 账本列 | 内容 |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | 原始 token 数 |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | 服务商给这个计量项起的名字，比如 *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | 一个 JSON 对象，写明模型和这些 token 的属性 |

`SkuPriceDetails` 里有四个 FOCUS 定义的属性：

| 属性 | 取值 |
| --- | --- |
| `ModelDeveloper` | 模型由谁开发：*OpenAI*、*Anthropic*、*DeepSeek* |
| `ModelId` | 账单里写的模型名 |
| `TokenDirection` | `Input` 是发给模型的 token，`Output` 是模型生成的 token |
| `TokenCacheAction` | 仅输入 token：`Read` 从提示缓存读取，`Write` 写入缓存，`Uncached` 两者都不是 |

账单答不出来的属性就不写，不去猜。阿里云百炼和火山方舟的账单只有一个输入输出合在一起的
`Tokens` 数，所以这些行没有 `TokenDirection`；输出 token 没有 `TokenCacheAction`。

## 谁花的 {#requester}

FOCUS 1.5 还记录一笔费用背后的请求方：`PrincipalId` 是用户，`CredentialId` 是 API key
公开的 ID（绝不是 key 本身），`RequesterDetails` 是描述它们的 JSON 数组，包含 key 的显示
名称。CloudBridge 从以下导出填写账本里的 `principal_id`、`credential_id` 和
`requester_details` 列：

- 按用户或 API key 分组的 OpenAI 导出；
- 按 API key 分组的 Anthropic 导出。

DeepSeek 的导出只有打码后的 key 和它的名称，FOCUS 不允许把它们当作标识，所以这些行
没有请求方信息。

## 这些值从哪来 {#sources}

- **OpenAI、Anthropic、DeepSeek、百炼和方舟的导入。** 按每份导出报告的 token 类型填写。
  按 FOCUS 的要求，每个 token 只记在一行上：OpenAI 的输入总数里含有缓存 token，导入时会
  从输入行里扣掉。旧版本的账本在第一次打开时补全。在这之前导入的月份，OpenAI 的输入数
  仍是旧值，重放一次即可更正（**Accounts → Replay normalization**）。
- **AWS Data Exports。** FOCUS 导出自带的列按 AWS 写的保留。FOCUS 1.5 之前写出的导出
  没有 `TokenDirection`：如果 token 行的计量项名称说明了是哪种 token（比如
  *cache-read-input-token-count*、*output-tokens*），就从名称读出方向和缓存动作，否则不写。

[模型](models.md)页面读取的就是这些属性：不管服务商怎么命名计量项，`TokenCacheAction`
为 `Read` 的都算缓存读取。

## 查询 {#query}

在 [SQL 查询](query.md)页面可以用 DuckDB 的 JSON 函数读取这些属性：

```sql
SELECT json_extract_string(sku_price_details, '$.ModelId') AS model,
       json_extract_string(sku_price_details, '$.TokenCacheAction') AS cache,
       sum(consumed_quantity) AS tokens,
       sum(billed_cost) AS cost
FROM v_charge_normalized
WHERE consumed_unit = 'Tokens'
  AND json_extract_string(sku_price_details, '$.TokenDirection') = 'Input'
GROUP BY ALL
ORDER BY tokens DESC;
```

## 导出 {#export}

**Settings → Data → Export as FOCUS** 会把所有费用写成一个使用 FOCUS 列名的 CSV（包括
token 相关的列），方便导入其他 FinOps 工具。金额保留每条费用的计费币种；CloudBridge
自己加的列以 `x_` 开头，比如 `x_CostBasis`。这个文件不是完全符合规范的 FOCUS 数据集：
没有任何数据源提供的列（比如 `ChargeClass`、`PricingCategory`）会省略；没有报告金额的行，
`BilledCost` 留空。仅桌面版提供。
