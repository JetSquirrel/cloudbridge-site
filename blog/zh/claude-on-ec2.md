---
title: "在 AWS EC2 上开一台 Windows 跑 Claude：步骤、开关机和成本"
description: "开一台 Windows EC2，远程桌面进去用浏览器登录 Claude、跑桌面版和 Claude Code：怎么配弹性 IP、怎么开关机不丢东西，按 us-west-2 的牌价算清楚一个月要花多少，以及停了机还在收的那部分钱。"
date: 2026-11-26
tag: 教程
---

# 在 AWS EC2 上开一台 Windows 跑 Claude：步骤、开关机和成本

<p class="post-meta">2026-11-26&emsp;教程&emsp;<a href="./">全部文章</a></p>

把 Claude 放到云端机器里跑，有几个很实在的好处：

- **合上电脑，任务接着跑。** 让 Claude Code 重构一个模块、把测试跑到全绿，这种动辄一两个小时的活，不用一直守在笔记本前面。
- **和你的主力电脑隔开。** Agent 能直接执行命令、改文件。把它丢在一台只放了这个项目的机器上，就碰不到你本机的密钥、浏览器和别的仓库。
- **环境固定。** 登录状态、依赖包、编译缓存全留在那台机器上，换电脑或者出差都不用重新折腾环境。

这里选 Windows，是因为 Claude 的网页登录和桌面版都需要一个完整的浏览器和图形界面，远程桌面连进去就跟用自己电脑一样。代价就是得付一张按小时算的账单，而且 Windows 比 Linux 贵。下面先讲怎么搭、怎么开关机，最后把这笔账算清楚。

## 一、开一台机器

打开 [EC2 控制台](https://console.aws.amazon.com/ec2/)，选好区域，点 **Launch instance**：

1. **系统**：选 Microsoft Windows Server 2022 Base。
2. **机型**：`t3.large`（2 vCPU、8 GiB）够用；如果浏览器要多开几个标签、再同时开着桌面版和本地编译，上 `t3.xlarge`（4 vCPU、16 GiB）会流畅很多。
3. **密钥对**：新建一个，把 `.pem` 文件下载保存好。后面解密 Windows 管理员密码要靠它。
4. **网络**：安全组只放行 RDP（3389 端口），来源选 **My IP**。千万别选 `0.0.0.0/0`：把 3389 暴露在公网上，几分钟内就会有人来扫端口猜密码。
5. **存储**：gp3，60 GiB 起步。Windows 系统自己就要占掉二三十 GiB；而且磁盘在关机后依然照常收钱，够用就行，不够后面再扩。
6. **高级设置**：打开 **Termination protection**（防误删），**Shutdown behavior** 保持 **Stop**。如果你打算用休眠功能，得在这里把 **Stop - Hibernate behavior** 打开。这个选项只能在创建机器时开启，具体见第四节。

## 二、绑一个弹性 IP

实例自带的公网 IP，每次停机再开机都会变。对一台天天开关的机器来说，这非常折腾：

- 远程桌面的地址每次都得重新查、重新填；
- 机器里登录的网站每次看到的都是新 IP，经常要重新过验证；
- 别处如果要给这台机器开白名单（比如公司 VPN、数据库、Git 服务器），IP 一变就得跟着重配。

所以得给它固定一个地址：

1. 进入 **EC2 → Elastic IPs → Allocate Elastic IP address**，申请一个弹性 IP。
2. 选中它，点 **Actions → Associate Elastic IP address**，绑到刚开的这台实例上。

绑好之后，不管怎么开关机，地址都不会变。弹性 IP 在停机期间也收钱，大概每月 $3.65，第五节已经算进去了。注意别释放它：一旦释放再重新申请，拿到的就是另一个地址了。

## 三、连上去，装 Claude

先拿管理员密码：在控制台选中实例，点 **Connect → RDP client → Get password**，上传刚才下载的 `.pem` 文件解密。接着下载 `.rdp` 文件，用远程桌面打开（macOS 用微软的 Windows App）。用户名填 `Administrator`。

连进去之后：

1. **浏览器**：系统自带 Edge，也可以顺手装个 Chrome。在里面登录 claude.ai，登录状态就留在这台机器上了。
2. **Claude 桌面版**：去 [claude.ai/download](https://claude.ai/download) 下载安装，登录时会自动拉起刚才的浏览器完成授权。
3. **Claude Code**：先装好 [Git for Windows](https://git-scm.com/downloads/win)，然后在 PowerShell 里跑官方安装脚本：

```powershell
irm https://claude.ai/install.ps1 | iex
claude
```

记得给这台机器单独配一套 Git 凭据，比如跑一遍 `gh auth login`，或者配一个只对当前仓库有权限的 deploy key，别把你自己电脑上的个人私钥拷过去。

## 四、开机和关机

这台机器的大头开销，全花在"开着"的时间上。日常开关机有几件事必须分清。

### 关掉远程桌面窗口 ≠ 关机

- **直接点掉远程桌面窗口**，只是"断开连接"：你打开的程序、浏览器、正在跑的 Claude Code 全留在里面继续跑，实例也继续按小时计费。
- **开始菜单里点"注销"（Sign out）**，会把你开着的程序全关掉，但机器本身还在运行，依然计费。
- **开始菜单里点"关机"（Shut down）**，按第一节的设置，这就等同于 EC2 的 **Stop**，停止计费。

想让任务在你离开后继续跑，直接关远程桌面窗口就行；用完了想省钱，就进系统点关机。

### Stop、Hibernate、Terminate 的区别

| 操作 | 机器里正在跑的程序 | 磁盘 | 实例计费 |
| --- | --- | --- | --- |
| **Stop**（停止） | 全部退出，跟正常关电脑一样 | 保留 | 停止 |
| **Hibernate**（休眠） | 把内存写进磁盘，下次开机原样恢复 | 保留 | 停止 |
| **Terminate**（终止） | 彻底没了 | **删除** | 停止 |

- **Stop** 是平时最常用的。浏览器和桌面版的登录状态都保存在磁盘上，下次开机还在；但没跑完的 Claude Code 任务会中断，下次得重来。
- **Hibernate** 适合"桌面上铺开了一堆东西，明天想接着用"的场景。不过它有门槛：必须在创建实例时就勾选开启，根卷必须加密，磁盘得留出足够塞下整块内存的空间，Windows 对内存大小也有限制。开之前最好对照看一下 [EC2 休眠的前提条件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/hibernating-prerequisites.html)。
- **Terminate** 会把机器连同磁盘一起删掉。第一节打开的 Termination protection，防的就是手滑点到这个。

### 开机后要等两三分钟

Windows 实例状态刚变成 **running** 时，远程桌面还连不上，通常得再等两三分钟让系统服务起来。等控制台里的 **Status check** 变成 **2/2 checks passed** 再连，否则会一直连不上。

### 用脚本一键开关机

每次开浏览器进控制台点鼠标太麻烦。本机装好 [AWS CLI](https://aws.amazon.com/cli/) 之后，直接写个脚本：

```bash
#!/usr/bin/env bash
# 用法: ./ec2.sh start|stop|status
# 先在环境里配好: export CLAUDE_BOX=i-xxxxxxxxxxxxxxxxx 和 AWS_REGION=us-west-2
set -euo pipefail

ID="${CLAUDE_BOX:?先设置 CLAUDE_BOX}"
case "${1:-status}" in
  start)
    aws ec2 start-instances --instance-ids "$ID" >/dev/null
    echo "启动中，等状态检查通过（Windows 要几分钟）..."
    aws ec2 wait instance-status-ok --instance-ids "$ID" ;;
  stop)
    aws ec2 stop-instances --instance-ids "$ID" >/dev/null
    aws ec2 wait instance-stopped --instance-ids "$ID" ;;
esac

aws ec2 describe-instances --instance-ids "$ID" \
  --query 'Reservations[0].Instances[0].[State.Name,PublicIpAddress]' --output text
```

`start` 会一直等到状态检查通过才返回，命令一结束就能直接连远程桌面。因为绑了弹性 IP，最后一行打出来的地址每次都是一样的。

### 给自己留一道防忘关机保险

在开始跑一段长任务之前，先在机器里定个定时关机（PowerShell 或命令提示符里敲）：

```powershell
shutdown /s /t 14400   # 4 小时后自动关机；输入 shutdown /a 可以取消
```

如果想每天固定时间关机，就在 Windows 的"任务计划程序"里建一个每天凌晨执行 `shutdown /s /t 0` 的定时任务。

CloudWatch 告警也能实现"CPU 低于 5% 持续一小时就自动停机"，但这里有个坑：**Claude 在等大模型回复时，本地 CPU 占用几乎是零**，一个正在正常跑的长任务很可能会被它误判成闲置，直接给你停掉。

### 还有几个容易踩的坑

- **家里 IP 变了，连不上了**：安全组只放行了你创建时的那个 IP。换了网络环境，去安全组把 3389 的来源改成新的 **My IP** 就行，别图省事改成"任何地方"。
- **Windows 更新自己重启**：系统重启不是停机，照样按小时计费，而且会把正在跑的任务直接打断。记得去"设置 → Windows 更新"里把活动时间设好。
- **偶尔会启动失败**：如果某个可用区刚好没有这个机型的余量，启动时会报 `InsufficientInstanceCapacity`。等几分钟再试，或者临时换个相近的机型。
- **停机期间不是零花费**：磁盘和弹性 IP 一直在扣费，下一节直接算给你看。

## 五、算一算要花多少钱

下面是 **us-west-2（美西俄勒冈）的按需价格**，取自 2026 年 11 月的 AWS 价格 API，不含税。其他区域通常会贵一点，具体以 [EC2 定价页](https://aws.amazon.com/ec2/pricing/on-demand/)为准。EC2 按秒计费，每次开机最少算 60 秒。

| 项目 | 单价 | 停机后还收吗 |
| --- | --- | --- |
| `t3.large`，Windows | $0.1108 / 小时 | 不收 |
| `t3.xlarge`，Windows | $0.2400 / 小时 | 不收 |
| `t3.xlarge`，Linux（对比） | $0.1664 / 小时 | 不收 |
| `t4g.medium`，Linux（对比） | $0.0336 / 小时 | 不收 |
| gp3 磁盘 | $0.08 / GiB·月 | **收** |
| 弹性 IP | $0.005 / 小时（约 $3.65 / 月） | **收** |

另外还有三项杂费，一般不大：

- **CPU 超额积分**：T 系列默认开的是 unlimited 模式，如果长时间满负载跑，超出基准线的 vCPU 小时会另外算钱（Windows $0.096/小时，Linux $0.05/小时）。
- **出网流量**：每月前 100 GB 免费，平时连远程桌面加写代码基本用不完。
- **Claude 本身**：订阅费或者 API 费用照常算，和这台机器的账单分开。

按几种常见用法算出来的月度总成本（按工作日每天 8 小时、一个月 176 小时计算）：

| 用法 | 计算公式 | 每月约 |
| --- | --- | --- |
| Windows `t3.large`，工作日 8 小时，60 GiB，弹性 IP | 176 × 0.1108 + 60 × 0.08 + 3.65 | **$28.0** |
| Windows `t3.xlarge`，工作日 8 小时，120 GiB，弹性 IP | 176 × 0.24 + 120 × 0.08 + 3.65 | **$55.5** |
| 上面这台**忘了关一整个月**（730 小时） | 730 × 0.24 + 9.60 + 3.65 | **$188.5** |
| 对比：Linux `t4g.medium` 只跑 Claude Code，工作日 8 小时，30 GiB，弹性 IP | 176 × 0.0336 + 30 × 0.08 + 3.65 | **$12.0** |

几个很容易被忽略的细节：

- **Windows 贵在系统许可证。** 同样是 `t3.xlarge`，Windows 每小时比 Linux 多出 $0.0736，整整贵了 44%。如果你只用 Claude Code、不需要浏览器登录和桌面版，选 Linux 会便宜得多。
- **停了机也不是零开销。** `t3.xlarge` 那台哪怕整月关机不动，每个月也得固定掏 $13.25：$9.60 是 120 GiB 磁盘的钱，$3.65 是弹性 IP 的钱。`t3.large` 配 60 GiB 的话，停机固定费用是 $8.45。
- **最肉疼的是忘关机。** 同一台机器，"工作日每天开 8 小时"和"忘了关机开满整月"，账单直接差出 $133。

### 一笔真实的账单记录

我自己有一台 Windows `t3.xlarge`，开在 us-west-2，专门用来跑 Claude 桌面版。用了十天，翻了一下 Cost Explorer 里的用量记录：

- 实例一共开了 115.3 小时：115.3 × $0.24 = **$27.67**
- 120 GiB gp3 磁盘，折合 37.6 GiB·月：**$3.01**
- 弹性 IP，绑定和闲置加起来各约 116 小时：**$1.16**
- CPU 超额积分 4.9 vCPU 小时：**$0.47**

加起来一共约 **$32**，平均每天 **$3.2**。但有意思的是，Cost Explorer 里这几行显示的金额全是 **$0**，因为这个账号还在消耗 AWS 送给新账号的抵扣额度。

问题就出在这儿：在抵扣额度用完之前，账单表面根本看不出这台机器在花钱；等到额度耗尽的那天，真实扣费是悄悄开始的。

## 六、让 CloudBridge 帮你盯着

[CloudBridge](https://cloudbridge.jetsquirrel.cloud/zh/) 是一个本地优先的桌面应用，可以把 AWS、Cloudflare 以及各家大模型平台的账单统一归拢到你电脑本地的一本账里。针对上面这种"开台云机器跑 Claude"的场景，它刚好能帮你盯住三件事：

1. **机器开着忘了关。** 建一个只带 `ce:GetCostAndUsage` 权限的 IAM 用户接入 AWS（大概[五分钟配好](https://cloudbridge.jetsquirrel.cloud/docs/zh/aws)），账单就会按服务、按天同步进来。给账号设一个月度预算，再加一条 **Account budget** 规则，**Based on** 选 **Month-end forecast**：一旦忘关机，头一两天按日均消耗外推的月底预测就会超标，CloudBridge 会弹一条系统通知提醒你。为什么选这条规则，见[云上异常用量早知道](./early-warning.md)。
2. **停了机还在暗地里收钱。** 它的[资源洞察](https://cloudbridge.jetsquirrel.cloud/docs/zh/insights)会用只读权限扫描你的 AWS 账号，直接把"已停止但还挂着磁盘的实例"以及"闲置的公网 IP"列出来，抓的就是上面那每月 $13.25 的固定开销。因为它是直接按资源扫描，不看账单金额，所以哪怕账号还在用抵扣额度，也一样能照出来。
3. **RDP、SSH 端口对全网敞开。** 从 0.9.0 版本开始，资源洞察会自动标出向 `0.0.0.0/0` 开放 3389 或 22 端口的安全组。平时家里 IP 一变连不上了，顺手改成"任何地方"、事后又忘了改回来，这种情况太常见了。

另外还有一件事：Claude 本身的花费。Anthropic Console 的用量和账单[导出后也能导入 CloudBridge](https://cloudbridge.jetsquirrel.cloud/docs/zh/bill-import)，在[模型页面](https://cloudbridge.jetsquirrel.cloud/docs/zh/models)里和 Bedrock、DeepSeek 等放在一起按模型统计。这样一来，云机器的钱和模型调用的钱，全都在同一本账里清清楚楚。

CloudBridge 开源且免费，所有凭据和账单数据都只存在你自己的电脑本地，支持 macOS、Windows 和 Linux。可以先在浏览器里试一下[在线演示](https://cloudbridge.jetsquirrel.cloud/demo/)，或者直接[下载](https://github.com/JetSquirrel/cloudbridge/releases/latest)。

当然，它只负责读账单和发提醒，不会替你去停机器。关机这件事，最后还得靠前面那个脚本和你自己。
