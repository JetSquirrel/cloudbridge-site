---
description: "把 AWS 账号接入 CloudBridge：通过只含一个操作的 IAM 策略使用 Cost Explorer，或读取 S3 里的 FOCUS Data Export 获得资源级明细。"
---

# AWS

**[English](../aws.md)**&emsp;[文档](index.md)

AWS 账号有两种接入方式。**Cost Explorer** 最快：一对访问密钥加一条只含一个操作的
策略，账单按服务、按天进来。S3 里的 **Data Export** 最细：每一行都有资源 ID、
标签和所属的关联账号——[资源洞察](insights.md)给单个资源定价需要的正是这些。

## Cost Explorer {#cost-explorer}

1. 打开 [IAM 控制台](https://console.aws.amazon.com/iam/)，进入 **Users**，
   点 **Create user**。这个用户不需要控制台登录权限。
2. 在新用户上选择 **Add permissions → Create inline policy**，切换到 JSON
   编辑器，粘贴下面的策略（也可以下载
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)）。
3. 打开该用户的 **Security credentials** 标签页，点 **Create access key**。
   复制 Access Key ID 和 Secret Access Key；Secret 只显示这一次。
4. 在 CloudBridge 里用这对密钥添加账号。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

它只授予 `ce:GetCostAndUsage`，也就是 CloudBridge 调用的唯一一个 Cost Explorer
操作。校验密钥用的是 STS `GetCallerIdentity`，不需要额外授权。不支持需要 session
token 的临时凭据。原因和收窄范围的办法见[云平台权限](permissions.md#aws)。

### 费用 {#cost}

Cost Explorer 按请求收费。一次刷新为每个账号查询两个月——上个月和本月——各一次请求；
如果某个月数据太多，Cost Explorer 会分页返回，请求会多几次（最多 20 页）。刷新间隔
保证后台调度在每个间隔内只刷新一次，所以按默认的 24 小时，一个账号每天大约两次请求。
AWS 已经返回、但 CloudBridge 没能保存的拉取，在间隔内不会重复。**Force Refresh**
会绕开这些限制，它是唯一会多花钱的操作。具体价格以 AWS 当前定价为准。

## 从 S3 读取 Data Export {#data-exports}

CloudBridge 可以从投递目标 S3 bucket 里读取 AWS Data Export（CUR 2.0，*FOCUS 1.2
with AWS columns* 格式）。在账号表单的 **Data export S3 URI** 字段填上导出的
URI——`s3://bucket/prefix`——之后 Refresh 就从这里读取，而不再调用 Cost Explorer。

- **Parquet 或 gzip 压缩的 CSV**，按导出配置的格式读取。
- **一个月只算一次。** 只读取该账期清单（manifest）列出的文件，所以即使导出保留了
  每一次投递，一个月也只计一次。
- **没投递不等于零。** 导出还没写出的账期会被跳过，不会存成空月份。
- **没变化就不重新下载。** 先比对文件的 key、大小和 ETag；AWS 已经投递完毕的月份，
  每次刷新只需要一次列表请求和一次清单读取。
- **付款账号的导出可以按成员账号拆分。** 每一行都保留它所属的关联账号。

Cost Explorer 策略**不**包含 S3 权限，见[云平台权限](permissions.md#aws-s3)。
S3 的存储和请求费用仍然照常收取。

## 扫描资源 {#insights}

[资源洞察](insights.md)用同一对访问密钥扫描 AWS 账号，只做读取。为此密钥需要
资源的读取权限，例如 AWS 托管策略 `ReadOnlyAccess`。
