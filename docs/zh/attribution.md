---
description: "CloudBridge 成本归属页：从数据源到服务或模型再到业务线的桑基图，以及按标签、服务、区域或 FOCUS 服务类别的拆分。"
---

# 成本归属

**[English](../attribution.md)**&emsp;[文档](index.md)

成本归属页把当月画成一张桑基图：数据源，然后是服务或模型，最后是业务线，并有一个
明确的 **Unallocated**（未归属）节点。流向用的是总用量——净额可能为负，在桑基图里
没有意义。一条费用按它的 `business_line` 标签归到某条业务线；没有标签就落进未归属。

## 按维度拆分 {#dimensions}

拆分区上方的切换可以选 **Tag**（即业务线视图）、**Service**、**Region** 或
**Category**。非标签维度以树图显示——**Map**，色块面积是本期费用，颜色是相对上期的
变化——或在 **Table** 下显示为占比条。在该维度上没有值的费用记为 *Other*。
**Top resources** 卡片列出本期最贵的资源。

## 服务类别 {#categories}

**Category** 使用 FOCUS 服务类别——Compute、Storage、Databases、Networking、
AI and Machine Learning 等——在每家云上含义一致：阿里云的 ECS、火山引擎的 ECS 和
AWS 的 EC2 都算 *Compute / Virtual Machines*，百炼、火山方舟和各家模型平台都算
*AI and Machine Learning / Generative AI*。还没有映射的产品记为 *Uncategorized*，
并作为[数据健康](overview.md#data-health)问题提示出来。
