---
description: "把阿里云、火山引擎、OpenAI、Anthropic 和 DeepSeek 的账单导出文件导入 CloudBridge：各自从哪里导出、能补充什么，以及月份如何被替换。"
---

# 导入账单文件

**[English](../bill-import.md)** · [文档](index.md)

从云平台控制台下载的账单文件，会解析成和 API 拉取完全相同的账本记录。在后续环节——
总额、图表、告警、成本归属——导入的月份和拉取的月份没有任何区别。而且导入往往更细：
阿里云的账单 API 每月只给百炼（Model Studio）一个总数，它的导出文件则按模型列出，
并带 token 数量。

火山引擎、OpenAI 和 Anthropic 目前只支持导入：用一个名字添加账号，不需要凭据，
然后导入即可。

| 数据源 | 从哪里导出 | 能补充什么 |
| --- | --- | --- |
| 阿里云 | 费用与成本 → 账单详情 → 导出 | 按模型的百炼（Model Studio）费用；其他产品的实例级明细 |
| 火山引擎 | 费用中心 → 账单详情 → 导出 | 按接入点和 token 类型的火山方舟费用 |
| OpenAI | Usage → Export | 按项目和模型的费用或 token 用量 |
| Anthropic（Claude） | Usage 或 Cost → Export | 按 workspace 和模型的费用或 token 用量 |
| DeepSeek | 用量信息 → 导出 | 按天、按模型的花费——它的 API 只报余额 |

## 导入 {#import}

1. 从云平台控制台下载导出文件。
2. 进入 **Accounts**，在账号那一行点 **Import**。
3. 选择文件。CloudBridge 会告诉你写入了多少条费用、替换了哪几个月。

::: warning 月份是替换，不是追加
导入会替换文件覆盖的每个月份在所选账号下的全部数据，所以导入两次也不会让费用翻倍。
请导出完整账单：按产品筛选过的文件，会把那个月的数据替换成只剩该产品。要更新一个
已导入的月份，请重新导入一份完整、更正后的文件。刷新永远不会覆盖导入的月份，
Force Refresh 也一样。
:::

## 用量导出不含金额 {#usage-exports}

只有 token 数量、没有金额的**用量**导出，会记为没有计费金额、成本依据为 *absent*。
CloudBridge 不会按标价把 token 数量折算成估算花费。**费用**导出只在恰好一列 token
有值时保留数量：输入和输出 token 单价不同，不能合成一个有单价的数量。

## 编码 {#encoding}

文本导出文件必须是 UTF-8。阿里云和火山引擎控制台可能导出 GBK 编码的文件，请先
重新以 UTF-8 导出，或另存为 *CSV UTF-8*。更多见
[常见问题排查](troubleshooting.md#import-errors)。
