---
description: "CloudBridge 常见问题的解决办法：钥匙串授权提示、AWS AccessDenied、总览为空、Windows SmartScreen、导入报错、Cloudflare 扫描被拒，以及该来却没来的告警。"
---

# 常见问题排查

**[English](../troubleshooting.md)**&emsp;[文档](index.md)

## macOS 请求钥匙串访问权限 {#keychain}

保存的凭据放在系统钥匙串里，而不是 CloudBridge 自己的文件里，所以应用读取凭据时，
macOS 可能会询问是否允许 CloudBridge 使用对应的钥匙串项。点 **Always Allow**
（始终允许）就不会每次刷新都问；点 **Allow** 则每次都会问。如果点了 **Deny**，
应用读不到凭据，这个账号的拉取会一直失败，直到你允许访问。

## AWS 报 AccessDenied {#aws-access-denied}

密钥认证通过了，但它所属的用户没有 `ce:GetCostAndUsage` 权限。把
[Cost Explorer 策略](aws.md#cost-explorer)附加到这个密钥所属的 IAM 用户上。
组织的服务控制策略（SCP）也可能禁止 Cost Explorer；在 AWS Organization 里，
成员账号只有在管理账号允许时才能看到 Cost Explorer 数据。

## 添加账号后总览是空的 {#empty-overview}

- **还没拉取。** 在总览页点 **Refresh**。文件类数据源（火山引擎、OpenAI、
  Anthropic）没有可拉取的内容，请在它那一行用 **Import**。
- **云平台还没出账。** 云平台公布费用有延迟，AWS Cost Explorer 最多可能滞后约
  24 小时，所以新账号或当天的花费不一定马上出现。稍后再试，不要用 Force Refresh，
  它可能产生 Cost Explorer 请求费用。
- **时间窗口太短。** 月初时 **MTD** 可能几乎没有数据，换成 **30d** 或 **12m**。
- **这是只报余额的数据源。** DeepSeek 的 API 只报余额，不报花费。要看花费明细，
  请导入它的用量下载文件。

## 某个账号一直刷新失败 {#refresh-failing}

状态栏面板和总览页会列出失败的账号和原因。失败的账号会在 15 分钟后重试，然后是
30 分钟，依次翻倍，最长到刷新间隔；开始失败时会发一条系统通知。如果云平台已经
返回了数据，但 CloudBridge 没能保存下来（比如磁盘满了），它在刷新间隔内不会再拉
这个月，避免同一份数据付两次钱；**Force Refresh** 会立即重试。见
[状态栏与后台运行](background.md#failures)。

## Windows SmartScreen 拦截了应用 {#smartscreen}

Windows 版本没有代码签名，所以 SmartScreen 会提示 *Windows protected your PC*。
确认文件来自官方 [Releases](https://github.com/JetSquirrel/cloudbridge/releases)
页面后，点 **More info**，再点 **Run anyway**。

## 导入报错 {#import-errors}

- **"not UTF-8 text"** —— 阿里云和火山引擎控制台可能导出 GBK 编码的文件。
  重新以 UTF-8 导出，或另存为 CSV UTF-8 后再导入。
- **列名无法识别** —— 解析器能识别中英文导出和各家字段名的常见写法。如果导出格式
  变了，请在 issue 里报告错误信息和表头。注意脱敏，不要附上未脱敏的账单。
- **导入后某个月的金额变少了** —— 导入会替换文件覆盖的每个月份在该账号下的全部数据，
  所以按产品筛选过的导出文件只会留下那个产品。请重新导入完整、未筛选的账单。
- **只有 token 数量，没有花费** —— 用量导出不含金额，请改为导入费用导出。
  DeepSeek 请直接导入下载得到的 ZIP，而不是里面的 `amount-*.csv`。

## Cloudflare 扫描被拒 {#cloudflare-scan}

扫描会说明是哪一种情况。*Cloudflare did not accept this account's API token*
表示 token 错误或已过期，请在 Accounts 页面检查。*The token cannot read …*
表示 token 有效，但缺少某个服务的 Read 权限，请补上
[Cloudflare](cloudflare.md#insights) 里列出的权限。没有这些权限的 token
仍然可以读取账单。

## 该来的告警没来 {#alert-silent}

- **Account budget 规则没有预算可比。** 账号没设 **Monthly budget** 时，这条规则不管
  阈值选哪种类型都不会触发。请在 Rules 页面设好预算。
- **花费是从零开始的。** 费用增长异常规则拿一个服务和它自己过去七天比，一直不花钱的
  服务没有基线，永远不会触发它。这种情况要靠基于月底预测的预算规则，见
  [及早发现失控](cloudflare.md#runaway)。
- **那一天还没进账本。** 规则只看已经拉取到的数据。后台刷新每个刷新间隔才拉取一次
  账号，而且只在 CloudBridge 运行时进行；见[状态栏与后台运行](background.md)。
- **通知被关掉了**，或者应用启动时这条告警就已经存在。不管哪种情况，未处理的告警都会
  列在 Alerts 页面上。

## 还是没解决 {#help}

文档里找不到答案？
[提一个 issue](https://github.com/JetSquirrel/cloudbridge/issues)。
