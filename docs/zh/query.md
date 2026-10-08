---
description: "CloudBridge 查询页：对本地 DuckDB 账单账本执行只读 SQL，内置花费、服务、业务线、预测和资源等常用查询模板。"
---

# SQL 查询

**[English](../query.md)** · [文档](index.md)

**Query** 页面对本地 DuckDB 账本执行 SQL。仅限桌面版。

- 写一条语句后点 **Run**，或按 **⌘Enter**（Windows 上是 **Ctrl+Enter**）。主视图是
  `v_charge_normalized`：每条费用一行，金额已换算成报告币种。
- 模板列表可以把一条入门查询填进编辑器——按月花费、按数据源花费、最贵的服务、业务线、
  未归属花费、月底预测、按区域和服务类别拆分、最贵的资源、相对标价的折扣、最近的拉取
  批次和余额快照。
- 只会执行读取语句：任何可能写入的语句在到达数据库之前就会被拒绝，而且查询时账本本身
  也是以只读方式打开的。在这里输入的任何内容都改不了你的数据。
- 结果太大时会在行数上限处截断——最多 100,000 行，列多时更少——状态栏会提示结果被截断
  了。加 `LIMIT` 或做聚合即可看到全部。

## 常用列 {#columns}

账本的列名沿用 [FOCUS](https://focus.finops.org/) 规范：`billed_cost` 和
`effective_cost`，`charge_category`（`Usage`、`Purchase`、`Credit`、`Tax`、
`Adjustment`），`service_name`，`service_category`，`resource_id`，`region_id`，
`pricing_quantity` 和 `pricing_unit`，另有 `x_model` 表示模型平台账单行对应的模型。
`cost_basis` 说明一个金额有多可靠：`authoritative` 来自账单，`estimated` 是分摊值
（比如 Cloudflare 按资源的拆分），`absent` 表示只有用量没有金额。
