---
title: "设置、数据存储与安全"
description: "CloudBridge 存了什么、存在哪里——DuckDB 账本、账号数据库、原始数据和配置——以及刷新间隔、币种、演示数据、备份和安全。"
---

# 设置、数据与安全

**[English](../settings-and-data.md)**&emsp;[文档](index.md)

## 设置 {#settings}

| 设置 | 作用 |
| --- | --- |
| Appearance → Theme | 浅色和深色主题，重启后保持 |
| Appearance → Language | [界面语言](#language)：跟随系统、English 或简体中文 |
| Reporting → Currency | 所有总额用 USD 还是 CNY；每条费用保留自己的币种 |
| Refreshing → Refresh interval | 一个月份过多久会被再次拉取：6、12、24（默认）或 48 小时 |
| Background | [开机启动、后台刷新、告警通知](background.md) |
| Data → Export as FOCUS | 把所有费用导出为使用 FOCUS 列名的 CSV，供其他 FinOps 工具读取（[详情](focus.md#export)） |
| Demo data | 加载或清除五个示例账号（AWS、阿里云、DeepSeek、OpenAI、Anthropic）及其十二个月的历史 |

**Refresh** 拉取早于刷新间隔的月份；**Force Refresh** 拉取全部月份，可能产生云平台
费用。两者都不会覆盖导入的月份。演示账号以 `demo-` 为前缀，不带凭据，刷新时会被跳过。

## 界面语言 {#language}

CloudBridge 0.9.0 及更高版本提供简体中文界面，包括每个页面和对话框、菜单栏面板及其菜单，以及系统
通知。在 **设置 → 外观 → 语言** 里选择语言之前，应用会跟随系统语言；更改后立即生效。
浏览器演示版跟随浏览器语言，侧边栏底部也有切换开关。

- 托盘菜单要到下次启动应用时才会换成新语言。
- 告警保留触发时的语言。低余额告警例外：它会随最新数字改写，使用当前语言。
- 金额和币种的格式不变。

本文档部分页面里的按钮名称来自英文界面。使用中文界面时，按钮上显示的是对应的中文名称。

## 数据存在哪里 {#storage}

| 平台 | 位置 |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux（源码构建） | `~/.local/share/CloudBridge/` |

- `billing.duckdb` —— 账单账本，保留每条费用的原始币种，也存放[月末快照](overview.md#snapshots)和[发票](reconciliation.md)；
- `cloudbridge.duckdb` —— 账号、预算、规则和告警状态；
- `raw/` —— 每一次云平台响应和导入的文件，按数据源、账号和月份存放，修正映射后可以
  不再请求、直接重新读取（**Accounts → Replay normalization**）；
- `inventory/` 和 `tools/` —— 资源洞察的扫描结果和扫描器（如果安装了）；
- `config.json` —— 币种、主题、刷新间隔和后台设置。

## 备份 {#backups}

复制或打开数据库之前先退出 CloudBridge。备份整个目录——两个数据库、`raw/` 和
`config.json`——并在应用关闭时恢复。凭据在系统钥匙串里，不在备份中；换一台机器需要
重新填写。要在应用之外分析账本，请查询副本，而不是正在使用的文件。

## 安全 {#security}

- 凭据保存在系统钥匙串里——macOS 钥匙串或 Windows 凭据管理器；Linux 源码构建使用
  Secret Service——和数据库分开存放。
- 应用只会用凭据向它所属的云平台发请求。在 CloudBridge 里使用一个 key，并不会让它变成
  只读：见[云平台权限](permissions.md)。
- 没有 CloudBridge 同步服务，也没有遥测。导入不会向云平台发任何请求。
- **本地不等于加密。** 应用不会加密账本或原始文件。请启用磁盘加密并保护好备份。
- 分享日志、截图或示例导出文件之前，请对凭据、账号 ID、资源名称和标签做脱敏。
