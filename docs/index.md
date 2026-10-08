---
layout: home
title: "CloudBridge documentation — connect your bills, read them, keep watch"
titleTemplate: false
description: "Documentation for CloudBridge, the desktop app that reads AWS, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic and DeepSeek bills into one local ledger: setup, permissions, the pages, alerts and the menu bar."
hero:
  name: CloudBridge Docs
  text: Your cloud and AI bills, in one ledger.
  tagline: Connect each provider, read where the money went, and get told when it starts running away.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: Try the demo
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: About CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/
features:
  - title: Connect your bills
    details: AWS, Alibaba Cloud and Cloudflare through their billing APIs; Volcengine, OpenAI, Anthropic and DeepSeek through the exports their consoles produce.
    link: /aws
    linkText: Sources
  - title: Read where it went
    details: An Overview over month to date, 30 days or 12 months, attribution to business lines, per-model token economics and SQL over the ledger.
    link: /overview
    linkText: Overview and accounts
  - title: Find what to cut
    details: Insights compares the bill with a read-only resource scan of AWS and Cloudflare, priced from the bill, summarized by type.
    link: /insights
    linkText: Insights
  - title: Keep watch
    details: Rules, budgets and notifications, with the app running in the menu bar after its window closes and starting at login.
    link: /background
    linkText: Menu bar and background
---

<p align="center"><strong><a href="./zh/">中文文档</a></strong>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## Find your way

| I want to… | Read |
| --- | --- |
| Install CloudBridge and see a first bill | [Getting started](getting-started.md) |
| See it before installing anything | [The browser demo](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Connect AWS with Cost Explorer or a Data Export | [AWS](aws.md) |
| Connect Alibaba Cloud | [Alibaba Cloud](alibaba-cloud.md) |
| Connect Cloudflare, and split it by bucket, Worker and Durable Object | [Cloudflare](cloudflare.md) |
| Connect DeepSeek | [DeepSeek](deepseek.md) |
| Import a Volcengine, OpenAI, Anthropic, Alibaba Cloud or DeepSeek export | [Bill file import](bill-import.md) |
| Give CloudBridge the least access it needs | [Provider permissions](permissions.md) |
| Understand the Overview's numbers | [Overview and accounts](overview.md) |
| See which business line a cost belongs to | [Attribution](attribution.md) |
| See what each LLM model costs per token | [Models](models.md) |
| Find stopped instances, idle addresses and resources nobody owns | [Insights](insights.md) |
| Ask the ledger a question in SQL | [Query](query.md) |
| Be told when spend jumps, or a budget is near | [Alerts, rules and budgets](alerts.md) |
| Keep CloudBridge running with its window closed | [Menu bar and background](background.md) |
| Know what CloudBridge stores, and back it up | [Settings, data and security](settings-and-data.md) |
| Fix something that is not working | [Troubleshooting](troubleshooting.md) |
