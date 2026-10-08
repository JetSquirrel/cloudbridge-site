---
layout: home
title: "CloudBridge 文档 — 连接账单、读懂账单、盯住花费"
titleTemplate: false
description: "CloudBridge 文档：把 AWS、阿里云、Cloudflare、火山引擎、OpenAI、Anthropic 和 DeepSeek 的账单读进本机的一本账，涵盖接入、权限、各个页面、告警与状态栏。"
hero:
  name: CloudBridge 文档
  text: 云与 AI 账单，一本账。
  tagline: 接入各家云平台，看清钱花在哪，并在花费开始失控时第一时间知道。
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: 快速上手
      link: /zh/getting-started
    - theme: alt
      text: 在线演示
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: 关于 CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/zh/
features:
  - title: 连接账单
    details: AWS、阿里云和 Cloudflare 通过账单 API 接入；火山引擎、OpenAI、Anthropic 和 DeepSeek 导入控制台导出的账单文件。
    link: /zh/aws
    linkText: 数据源
  - title: 看清钱花在哪
    details: 按本月至今、近 30 天或近 12 个月的总览，按业务线的成本归属，按模型的 token 经济账，以及对账本的 SQL 查询。
    link: /zh/overview
    linkText: 总览与账号
  - title: 找出可以省的
    details: 资源洞察把账单和对 AWS、Cloudflare 的只读资源扫描放在一起比对，按账单定价，按类型汇总。
    link: /zh/insights
    linkText: 资源洞察
  - title: 盯住花费
    details: 规则、预算和系统通知；关掉窗口后应用仍在状态栏运行，并可开机启动。
    link: /zh/background
    linkText: 状态栏与后台运行
---

<p align="center"><strong><a href="../">English</a></strong>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/zh/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## 按需查找

| 我想要… | 看这里 |
| --- | --- |
| 安装 CloudBridge，看到第一份账单 | [快速上手](getting-started.md) |
| 先不安装，看看长什么样 | [浏览器演示](https://cloudbridge.jetsquirrel.cloud/demo/) |
| 通过 Cost Explorer 或 Data Export 接入 AWS | [AWS](aws.md) |
| 接入阿里云 | [阿里云](alibaba-cloud.md) |
| 接入 Cloudflare，并按 bucket、Worker、Durable Object 拆分 | [Cloudflare](cloudflare.md) |
| 接入 DeepSeek | [DeepSeek](deepseek.md) |
| 导入火山引擎、OpenAI、Anthropic、阿里云或 DeepSeek 的账单文件 | [导入账单文件](bill-import.md) |
| 只给 CloudBridge 最少的权限 | [云平台权限](permissions.md) |
| 读懂总览上的数字 | [总览与账号](overview.md) |
| 看某项成本属于哪条业务线 | [成本归属](attribution.md) |
| 看每个大模型每个 token 花多少钱 | [模型](models.md) |
| 找出已停止的实例、闲置的 IP 和无人认领的资源 | [资源洞察](insights.md) |
| 用 SQL 查账本 | [SQL 查询](query.md) |
| 花费突增或预算快用完时收到提醒 | [告警、规则与预算](alerts.md) |
| 关掉窗口后让 CloudBridge 继续运行 | [状态栏与后台运行](background.md) |
| 了解 CloudBridge 存了什么、怎么备份 | [设置、数据与安全](settings-and-data.md) |
| 解决遇到的问题 | [常见问题排查](troubleshooting.md) |
