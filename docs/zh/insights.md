---
title: "资源洞察：找出闲置的 AWS 和 Cloudflare 资源"
description: "CloudBridge 资源洞察把账单和对 AWS、Cloudflare 的只读资源扫描放在一起比对：已停止的实例、闲置的 IP、无人认领的资源，以及每个资源的费用，按类型汇总。"
---

# 资源洞察

**[English](../insights.md)**&emsp;[文档](index.md)

资源洞察把账单和实际在运行的资源放在一起比对，列出值得看一眼的东西，每一项都按
本期账单定价。

## 安装并扫描 {#scan}

点 **Set up and scan**。第一次使用时，CloudBridge 会先征得同意，再安装它的资源扫描器
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist)——开源，
由我们维护的 fork，大约 45 MB，放在 CloudBridge 自己的数据目录里，并用应用内置的
校验和核对。之后它会扫描：

- 每个 **AWS** 账号，使用它的访问密钥，覆盖 AWS 默认启用的全部区域，或只扫你选的区域；
- 每个 **Cloudflare** 账号，使用它的 API token。

扫描只做读取——只列出资源，不做任何修改——但凭据需要有读取这些资源的权限，见
[AWS](aws.md#insights) 和 [Cloudflare](cloudflare.md#insights)。**Scan again**
会刷新资源清单。扫描需要 macOS（Apple 芯片）或 Windows 上的桌面版。

## 能发现什么 {#findings}

AWS：

- **已停止的实例**，它挂的卷仍在计费；
- **闲置的公网 IP**——已分配但没有绑定任何资源的 IPv4 地址；
- **无人认领的资源**——没有所有者标签（`owner`、`team`、`project`、`cost-center`、
  `business_line`），也没有任何堆栈或应用在管理；
- **有账单但不在扫描里的资源**——位于扫描覆盖的区域内。

定价需要资源级账单：也就是把 AWS 账号指向它的 [Data Export](aws.md#data-exports)。
没有的话，这些发现会列出来，但不定价。

Cloudflare 有一张卡片，按类型列出扫描到的资源——Workers、R2 bucket、D1 数据库、
KV 命名空间、zone、Durable Object——并显示每个类型和每个资源分到的费用及本期用量，
按费用从高到低排列。开启了[按资源拆分账单](cloudflare.md#split)后，失控的命名空间
或 bucket 会直接以名字出现在这里。

## 安全配置 {#security}

从 CloudBridge 0.9.0 起，有一个单独的部分会标出向整个互联网（`0.0.0.0/0` 或 `::/0`）
开放 SSH 或 RDP 的 AWS 安全组。它只读取扫描结果，不会更改你的云资源，也不需要额外的
数据源。这不是合规检查，也不是全面的安全评估，其发现也不会和成本发现加总。

每个安全组显示 **发现**、**未评估** 或 **已评估，无发现**。展开一行可以看到规则内容、
为什么重要，以及该人工检查什么。规则公开不等于确实暴露，请确认这个安全组是否绑定了资源。

**未评估** 表示无法读取入站规则，不代表这个安全组是安全的。如果没有扫描、扫描不完整，
或扫描没有列出任何安全组，这部分都会明确说明，而不会显示成没有问题。

## 先看汇总 {#summary}

每张卡片打开时先显示资源类型，带数量和费用。点一个类型可以展开它下面的资源，每次
50 条，点 **Show more** 继续；再点一次收起。资源再多，没展开之前每个类型也只占一行。

每条发现都显示完整 ID（可一键复制）、所属账号和指向相关费用的链接，方便和账单核对。
