---
description: "在 macOS 或 Windows 上安装 CloudBridge，用演示账单先看一看，然后添加第一个账号、读到第一份账单，几分钟即可完成。"
---

# 快速上手

**[English](../getting-started.md)** · [文档](index.md)

CloudBridge 把你的云平台和大模型平台账单读进本机的一本账——数据可以来自账单
API，也可以来自你下载的账单文件——然后画出趋势。不用注册，不同步，没有遥测。
这一页带你从下载走到第一份账单。

## 1. 安装 {#install}

从 [Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest)
页面下载最新版本：

| 平台 | 文件 |
| --- | --- |
| macOS（Apple 芯片） | `cloudbridge-macos-arm64.dmg` |
| Windows（x64） | `cloudbridge-windows-x64.exe` |

**macOS。** 打开 `.dmg`，把 **CloudBridge** 拖进 **Applications**（应用程序），
再从那里启动。发布版本带 Developer ID 签名并经过公证，打开时不需要任何绕过操作。
如果 macOS 拦截了当前版本，请
[报告具体的提示内容](https://github.com/JetSquirrel/cloudbridge/issues)
和你的 macOS 版本；不要把移除隔离属性当成常规安装步骤。

**Windows。** `.exe` 没有代码签名，SmartScreen 很可能会提示
*Windows protected your PC*。先确认文件来自官方 Releases 页面，再点
**More info** 和 **Run anyway**。Windows 会记住对这个文件的选择；新版本会再问一次。

不提供 Linux 和 Intel Mac 的安装包。从源码构建需要 Rust 1.95 或更新版本，见
[开发环境配置](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup)：

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. 想先看看也可以 {#demo}

[浏览器演示](https://cloudbridge.jetsquirrel.cloud/demo/) 用一份示例账单运行同样的页面。
它不保存任何凭据，也不连接任何云平台，所以导入账单、从账单 API 刷新和 SQL
查询只能在桌面版里用。

在应用里，空的总览页会提供 **Load demo data**（加载演示数据），也可以打开
**Settings → Demo data**。演示账号不带凭据，刷新时会跳过；同一页的
**Clear demo data** 可以清除它们。

## 3. 添加账号 {#account}

打开 **Accounts**，点 **Add account**，选择数据源并填一个名字。

| 数据源 | 账单怎么进来 | 需要什么 |
| --- | --- | --- |
| Amazon Web Services | 账单 API | Access Key ID + Secret — [AWS](aws.md) |
| 阿里云 | 账单 API，或账单导出文件 | AccessKey ID + Secret — [阿里云](alibaba-cloud.md) |
| Cloudflare | 账单 API | Account ID + API token — [Cloudflare](cloudflare.md) |
| DeepSeek | 余额 API，或账单导出文件 | API key — [DeepSeek](deepseek.md) |
| 火山引擎 | 账单导出文件 | 不需要 |
| OpenAI | 账单导出文件 | 不需要 |
| Anthropic（Claude） | 账单导出文件 | 不需要 |

点 **Save**。API 类数据源会立即校验凭据，并拉取当月账单。

## 4. 把账单拿进来 {#bill}

- **API 类数据源**在保存时已经拉取了当月账单。超过刷新间隔后，总览页上的
  **Refresh** 会再拉一次。
- **文件类数据源**——火山引擎、OpenAI、Anthropic，以及想看更细明细时的阿里云和
  DeepSeek——需要导出文件：从云平台控制台下载，然后在账号那一行点 **Import**。
  见[导入账单文件](bill-import.md)。

## 5. 读账单 {#read}

**Overview**（总览）显示你选择的时间窗口：**MTD**（本月至今）、**30d** 或
**12m**。在 **Settings → Reporting** 里选择 USD 或 CNY。接下来：

- [总览与账号](overview.md) 解释这些数字。
- [告警、规则与预算](alerts.md) 在花费突增时提醒你。
- [状态栏与后台运行](background.md) 让这一切在关掉窗口后继续运行。

有东西没显示出来？见[常见问题排查](troubleshooting.md)。
