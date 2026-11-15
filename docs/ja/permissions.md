---
title: "プロバイダーごとの最小権限の請求権限"
description: "CloudBridge が必要とする最小権限の認証情報：AWS Cost Explorer と S3、Azure Cost Management、Google Cloud BigQuery、Alibaba Cloud RAM、Cloudflare API トークン、DeepSeek キー。"
---

# プロバイダーの権限

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[한국어](../ko/permissions.md)**&emsp;**[Français](../fr/permissions.md)**&emsp;**[Español](../es/permissions.md)**&emsp;**[Deutsch](../de/permissions.md)**&emsp;**[Português](../pt/permissions.md)**&emsp;[ドキュメント](index.md)

その経路に必要な最小限の権限だけを持つ専用の認証情報を使ってください。
アプリ内での動作が読み取り専用であっても、無制限のキーが読み取り専用になる
わけではありません。キーに何ができるかは、プロバイダー側でアタッチされた
ポリシーが決めます。請求を読むためだけに、ルートアカウントの認証情報を
使ったり、管理者アクセスを付与したりしないでください。

CloudBridge は認証情報を OS のキーリングに保存し、それが属するプロバイダー
へのリクエストの認証にだけ使います。CloudBridge の同期サービスも
テレメトリーもありません。実際のキー、認証情報ファイル、伏せていない請求
エクスポートを、公開の issue、ログ、スクリーンショット、プルリクエストに
決して載せないでください。漏えいしたキーは失効させてください。

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
は、CloudBridge が使う Cost Explorer のアクションである `ce:GetCostAndUsage`
だけを許可します。エクスポート URI なしでキーを検証するときは STS の
`GetCallerIdentity` を使いますが、これには
[許可が不要](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html)
です。このポリシーは Cost Explorer の読み取りのために
`Resource: "*"` を保ちますが、他のどのサービスへのアクセスも許可しません。

1. [IAM コンソール](https://console.aws.amazon.com/iam/)で、テンプレートから
   カスタマー管理ポリシーを作成するか、ユーザーにインラインで追加します。
2. 無関係な広い権限を持たない専用の IAM ユーザーにアタッチします。
3. そのユーザーのアクセスキーを作成し、CloudBridge に入力します。
4. 組織のポリシーに従ってキーをローテーションします。

受け付けられるのはアクセスキー ID とシークレットのペアだけです。セッション
トークンを必要とする一時的な認証情報は受け付けません。組織のポリシーや
アカウントレベルの請求設定によって、アクセスが制限される場合もあります。
Cost Explorer のリクエストには料金がかかる場合があります —
[かかる費用](aws.md#cost)を参照してください。

## S3 からの AWS Data Exports {#aws-s3}

Cost Explorer のポリシーは、エクスポートバケットへのアクセスを**許可しません**。
`s3:ListBucket` はエクスポートのバケットとプレフィックスに、`s3:GetObject` は
そのプレフィックス下のオブジェクトに限定してください。カスタマー管理の KMS
キーで暗号化されたオブジェクトには `kms:Decrypt` と一致するキーポリシーも
必要になる場合があり、バケットポリシーと組織の制限が読み取りを許可して
いなければなりません。CloudBridge は既存のエクスポートを読むだけなので、
エクスポートの作成やオブジェクトの書き込み権限は不要です。S3 の保存料金と
リクエスト料金は別途かかります。

## AWS のリソーススキャン {#aws-scan}

[インサイト](insights.md)は同じキーでスキャンし、リソースの一覧取得と
記述だけを行います。キーにリソースへの読み取りアクセスを与えてください。
たとえば `ReadOnlyAccess` マネージドポリシーや、スキャンしたいサービスを
対象にしたより狭い読み取り専用ポリシーです。

## Alibaba Cloud {#alibaba-cloud}

請求 API では、`AliyunBSSReadOnlyAccess` が組み込みの読み取り専用の請求
ポリシーです。エンドポイント単位のカスタムポリシーより広いため、その範囲を
要件と照らして確認してください。

1. [RAM コンソール](https://ram.console.aliyun.com/)で、専用の RAM ユーザーを
   作成します。
2. `AliyunBSSReadOnlyAccess`、または使用する請求操作に限定したスコープ付き
   カスタムポリシーをアタッチします。
3. AccessKey を作成し、CloudBridge に入力します。

プライマリアカウントの AccessKey は使わないでください。請求エクスポートの
取り込みに認証情報は不要です。

## Microsoft Azure {#azure}

サービスプリンシパル — クライアントシークレットを持つアプリ登録 — に、
サブスクリプション上の組み込みの **Cost Management Reader** ロールを
与えます。このロールはコストと使用量のデータだけを読み、それ以外は何も
しません。動作させるためにアプリへ Reader、Contributor、Owner を与えないで
ください。

| リクエスト | 用途 |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`、認証なし | `401` チャレンジからサブスクリプションのテナントを見つける。サブスクリプションを `tenant-id/subscription-id` の形で入力した場合はスキップされる |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | クライアント資格情報グラントによる、Azure Resource Manager 用のトークン |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | その月の実費を、日ごと、サービスと課金種類別に取得 |

クライアント ID とサブスクリプション ID はシークレットではありません。
クライアントシークレットはシークレットであり、OS のキーリングに保存されます。
組織が許す最短の有効期限を設定し、ローテーションしたら CloudBridge で
差し替えてください。

## Google Cloud {#google-cloud}

請求エクスポートのプロジェクトにあるサービスアカウントに、プロジェクト上の
**BigQuery Job User** と、エクスポートデータセット**のみ**の **BigQuery Data
Viewer** を与えます。プロジェクト上に付けると、他のすべてのデータセットも
読めてしまうためです。

| リクエスト | 用途 |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | サービスアカウントのキーで署名したアサーションから取得するトークン |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | エクスポートテーブルに対する、月ごとに 1 つのクエリジョブ |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | ジョブの結果ページの残り |

クエリジョブはテーブルのプロジェクトで実行され、無料枠を超えた分は
BigQuery のオンデマンド料金でそのプロジェクトに請求されます。CloudBridge は
キーファイルのパスを保存し、キーは保存しません。ファイルは他のサービス
アカウントキーと同様に保護し、不要になったらコンソールでキーを削除して
ください。`gcloud auth application-default login` のユーザー認証情報
ファイルも使え、その場合はそのユーザーのアクセス権でクエリを実行します。

## Cloudflare {#cloudflare}

カスタム API トークンを作成し、**Account Resources** で CloudBridge が読む
べき 1 つのアカウントに限定します。Global API Key は使わないでください。
ユーザーのすべての権限を持ってしまいます。

| 権限 | 用途 | 呼び出し |
| --- | --- | --- |
| Account → Billing → Read | 請求 | `GET /accounts/{id}/billable-usage/info`、`GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | リソースごとの分割 | `POST /graphql` |
| Account Settings、Zone、Workers Scripts、Workers R2 Storage、Workers KV Storage、Queues、D1 の Read | インサイトのスキャン | スキャナー経由のアカウント API |

必須なのは 1 つ目だけです。アカウント ID はシークレットではありません。
リクエストパスの一部です。トークンはシークレットであり、他の認証情報と同様に
OS のキーリングに保存されます。

## DeepSeek {#deepseek}

API 連携では、[platform.deepseek.com](https://platform.deepseek.com/) の
プラットフォームキーを使って `GET /user/balance` を呼びます。これは
読み取りですが、**キー自体は必ずしも読み取り専用ではありません**。モデル
リクエストを認可し、他所で使われれば支出を発生させる可能性があります。支出
権限を持つ認証情報として扱い、DeepSeek が提供する制限があれば使い、共有
しないでください。使用量のダウンロードの取り込みにキーは不要です。

## Volcengine、OpenAI、Anthropic {#file-sources}

これらのソースはローカルの請求エクスポートだけを使います。CloudBridge は
それらの認証情報を求めず、取り込みはプロバイダーへのリクエストを行いません。
API 経路が実際に必要になるまで、管理者キーや組織キーを作らないでください。
