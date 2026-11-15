---
title: "Cost Explorer または FOCUS による AWS のコスト追跡"
description: "AWS アカウントを CloudBridge につなぐには、1 つのアクションだけの IAM ポリシーで Cost Explorer を使うか、S3 の FOCUS Data Export でリソースレベルの行を読みます。"
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[한국어](../ko/aws.md)**&emsp;**[Français](../fr/aws.md)**&emsp;**[Español](../es/aws.md)**&emsp;**[Deutsch](../de/aws.md)**&emsp;**[Português](../pt/aws.md)**&emsp;[ドキュメント](index.md)

AWS アカウントが台帳に入る方法は 2 つあります。**Cost Explorer** は手軽な
ほうです。アクセスキーと 1 つのアクションだけのポリシーで、請求はサービス
ごと・日ごとのコストとして届きます。S3 の **Data Export** は詳細なほうで、
すべての行にリソース ID、タグ、リンクされたアカウントが含まれます。
[インサイト](insights.md)がリソースに価格を付けるのに必要なのはこれです。

## Cost Explorer {#cost-explorer}

1. [IAM コンソール](https://console.aws.amazon.com/iam/)を開き、**Users** に
   進んで **Create user** をクリックします。コンソールへのアクセスは不要です。
2. 新しいユーザーで **Add permissions → Create inline policy** を選び、
   JSON エディターに切り替えて、以下のポリシーを貼り付けます
   （[aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
   としても入手できます）。
3. そのユーザーの **Security credentials** タブを開き、**Create access
   key** をクリックします。Access Key ID と Secret Access Key をコピーして
   ください。AWS がシークレットを表示するのは 1 回だけです。
4. CloudBridge で、そのキーペアを使ってアカウントを追加します。

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

これは `ce:GetCostAndUsage` だけを許可します。CloudBridge が呼ぶ唯一の
Cost Explorer アクションです。キーの検証には STS の `GetCallerIdentity` を
使いますが、これに許可は不要です。セッショントークンを必要とする一時的な
認証情報には対応していません。[プロバイダーの権限](permissions.md#aws)に、
その理由とスコープの絞り方を載せています。

### かかる費用 {#cost}

Cost Explorer はリクエストごとに料金がかかります。更新ではアカウントごとに
2 か月分 — 前月と今月 — を、それぞれ 1 リクエストで要求します。Cost Explorer が
ページに分けて返すほど大きい月では、リクエストが増えます（最大 20）。
更新間隔によってバックグラウンドのスケジュールは間隔ごとに 1 回の更新に
保たれるため、既定の 24 時間では 1 アカウントあたり 1 日およそ 2 リクエスト
です。AWS が応答したのに CloudBridge が保存できなかった取得は、間隔の中で
繰り返されません。**Force Refresh** はこうした仕組みをすべて迂回する唯一の
方法で、これだけが支出を増やします。現在の料金は AWS の価格表で確認して
ください。

## S3 からの Data Exports {#data-exports}

CloudBridge は、AWS Data Exports（CUR 2.0、*FOCUS 1.2 with AWS columns*
の形）を、配信先の S3 バケットから読めます。アカウントのフォームの
**Data export S3 URI** 欄にエクスポートの URI — `s3://bucket/prefix` — を
入れると、Refresh は Cost Explorer ではなくそこから読みます。

- **Parquet または gzip 圧縮 CSV** の、エクスポートが配信するよう設定された
  ほう。
- **1 か月は 1 回だけ数える。** その期間のマニフェストが挙げるファイルだけを
  読むため、すべての配信を保持するエクスポートでも 1 か月を 1 回だけ数えます。
- **配信されていないものはゼロではない。** エクスポートがまだ書き出して
  いない期間はスキップされ、空の月として保存されることはありません。
- **変わっていなければ再ダウンロードしない。** まずファイルのキー、サイズ、
  ETag を前回の取得と比較します。AWS が配信を終えた月は、更新ごとに
  1 回のリスト取得とマニフェストの読み取りだけで済みます。
- **支払者アカウントのエクスポートはメンバーアカウントごとに分かれる。**
  各行は、それが請求されたリンク先のアカウントを保持します。

Cost Explorer のポリシーは S3 へのアクセスを**許可しません**。
[プロバイダーの権限](permissions.md#aws-s3)を参照してください。S3 の保存料金と
リクエスト料金は別途かかります。

## リソースのスキャン {#insights}

[インサイト](insights.md)は同じアクセスキーで AWS アカウントをスキャンし、
読み取りだけを行います。そのためにはキーにリソースへの読み取りアクセスが
必要です。たとえば AWS の `ReadOnlyAccess` マネージドポリシーなどです。
