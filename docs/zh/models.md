---
title: "大模型 token 成本：按模型统计"
description: "CloudBridge 模型页：每个大模型每个 token 花多少钱——花费、输入/输出/缓存 token、每百万 token 综合成本、缓存占比和相关提示。"
---

# 模型

**[English](../models.md)**&emsp;[文档](index.md)

**Models** 页面按模型读取账单里大模型相关的部分，时间范围由页头选择。OpenAI、
Anthropic 和 DeepSeek 账号总会出现；其他数据源只要带有按 token 计量的用量也会出现，
比如阿里云百炼、火山引擎或 Amazon Bedrock 的数据。模型名取账单的 FOCUS `ModelId`
或导入时写的模型名；没有写模型名的账单（比如百炼或火山方舟的）按产品分组。

token 按 FOCUS 属性 `TokenDirection` 和 `TokenCacheAction` 区分，而不是按服务商给
计量项起的名字，所以同一种 token 在哪份账单里都一样读。见 [FOCUS 与 token 数据](focus.md)。

- 统计行显示 **AI spend**（AI 花费）、总 **tokens**、**blended $/1M**（总花费除以
  全部 token，按每百万计）和 **cache share**（从提示缓存读取的输入 token 占全部输入
  token 的比例，写入缓存的也算在输入里）。
- **Per model** 列出每个模型的花费及其变化、IN/OUT/CACHE token、综合每百万成本和
  它在模型总花费里的占比。CACHE 是从缓存读取的 token；IN 是其余的输入：未缓存的输入、
  写入缓存的 token，以及输入输出合在一起计数的账单的总数，悬停提示会说明包含哪些。
  只有 token 没有金额的行仍计入 token 列。
- **Tokens per day** 画出每天的 token 量。

## 提示 {#findings}

- 某个模型的缓存读取不到输入侧的 5%——本可以按缓存价付的，却按输入价付了。不区分
  输入和输出的账单不会触发这条。
- 有两个以上模型产生花费时，单个模型占模型总花费超过 70%。
- 花费上涨，而两个周期的 token 数量显示原因是单价上升，而不是用量增加。
- 某个模型计费时没有 token 计量，无法算出单位成本。

阿里云和火山引擎账单项文字里的模型名，目前还不会被提取出来。
