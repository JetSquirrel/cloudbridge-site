---
description: "CloudBridge 告警规则——费用异常、余额下限、未打标签的花费和账号预算——何时运行、衡量什么，以及告警如何暂停、忽略和自动解除。"
---

# 告警、规则与预算

**[English](../alerts.md)**&emsp;[文档](index.md)

规则会在应用启动时和每次刷新后对账本进行评估——包括 CloudBridge 运行期间的
[后台刷新](background.md)（每个账号过了刷新间隔才拉取一次），在 macOS 和 Windows 上关掉窗口后也照常进行。每条新
告警都会发一条系统通知。打开 Alerts 页面时会重新检查未处理的告警是否已经解除。

## 规则 {#rules}

默认启用三条规则；在 **Rules** 页面检查它们，把不需要的关掉。

| 规则 | 触发条件 | 默认值 |
| --- | --- | --- |
| Model cost growth anomaly（费用增长异常） | 某个数据源/服务组合的每日花费连续几天超过它过去 7 天的基线 | 连续 2 天超过 2.5 倍 |
| Balance floor（余额下限） | 预付费余额低于账号的月度预算金额；没设预算时低于默认下限 | 200，按余额自身的币种 |
| Untagged spend ratio（未打标签花费占比） | 当月未归属用量的占比超过阈值，且高于上个月 | 超过 15% 且在上升 |

异常规则需要基线：过去七天一分钱没花的服务，接下来花多少都不会触发它。从零突然失控的
工作负载——比如一个被遗忘、又开始死循环的项目——要靠基于月底预测的
[Account budget](#budgets) 规则来发现；[Cloudflare](cloudflare.md#runaway) 一页有完整步骤。

在 Rules 页面点 **New rule** 可以创建更多规则：选一种类型，调整设置，点
**Create rule**。新规则创建后立即生效，异常规则可以限定到某一个账号。

## 预算 {#budgets}

Rules 页面上的 **Monthly budgets** 卡片设置一个账号每月可以花多少。选择账号，填
**Monthly budget**（月度预算）和 **Alert at (% of budget)**（达到预算多少比例时提醒），
点 **Save budget**；**Remove** 删除预算。之后每个设了预算的账号都会显示本月已经用掉
多少，按报告币种计算。

只设预算只会画出这条线。要收到提醒，还需要为这个账号创建一条 **Account budget**
规则，并选择：

- **Based on** —— *Cost to date*（本月至今的花费），或 *Month-end forecast*
  （按消耗速度预测的月底金额）；
- **Threshold type** —— *% of budget*（预算比例），或一个固定的 *Amount*（金额）。

账号的预算金额同时也是它在余额下限规则里的下限。

## 看懂一条告警 {#alerts}

每条告警都附带触发它的数据：花费与基线、余额与下限，或未归属占比。预测值是基于近期
数据的估算，不保证月底就是这个数。**Snooze** 暂时隐藏一条告警；**Dismiss** 关闭它。
之后的评估发现触发条件不再成立时，未处理的告警会被标记为 **resolved**（已解除）。

## 通知 {#notifications}

CloudBridge 运行期间触发的每条告警，都会以系统通知的形式提醒一次；应用启动时已经
存在的告警不会重复提醒。可以在 **Settings → Background → Alert notifications** 里关闭。
