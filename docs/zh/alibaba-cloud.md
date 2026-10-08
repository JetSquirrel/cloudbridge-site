---
description: "把阿里云接入 CloudBridge：用只读的 RAM 用户调用账单 API，或导入账单明细，按模型查看百炼（Model Studio）的费用。"
---

# 阿里云

**[English](../alibaba-cloud.md)** · [文档](index.md)

阿里云两种方式都支持。**账单 API** 提供每个产品当月的总额；**账单明细导出**提供
实例级的明细行，包括按模型拆分、带 token 数量的百炼（Model Studio）费用。想让账号
自动保持最新就用 API；想看更细的明细就导入账单文件——导入的月份不会被刷新覆盖。

## 账单 API {#api}

1. 打开 [RAM 控制台](https://ram.console.aliyun.com/)，创建一个用于 API 访问的
   RAM 用户。
2. 附加系统策略 `AliyunBSSReadOnlyAccess`。
3. 为该用户创建 AccessKey。
4. 在 CloudBridge 里用 AccessKey ID 和 Secret 添加账号。

不要使用主账号的 AccessKey。这里没有查到账单 API 的按次收费说明，请以阿里云当前
条款为准。见[云平台权限](permissions.md#alibaba-cloud)。

## 账单明细导出 {#export}

在控制台进入 **费用与成本 → 账单详情 → 导出**，下载完整账单，然后在账号那一行点
**Import**。导入不需要凭据。见[导入账单文件](bill-import.md)。
