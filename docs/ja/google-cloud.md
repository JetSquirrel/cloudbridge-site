---
title: "BigQuery 請求エクスポートから読む Google Cloud コスト"
description: "請求アカウントの BigQuery エクスポートを通じて Google Cloud を CloudBridge につなぎます。サービス、SKU、プロジェクト、リージョン別の日次コストを、クレジットは別に読みます。"
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[한국어](../ko/google-cloud.md)**&emsp;**[Français](../fr/google-cloud.md)**&emsp;[ドキュメント](index.md)

Google Cloud には「今月いくらかかったか」に答える API がありません。その請求は
請求アカウントが BigQuery データセットに書き出すエクスポートなので、CloudBridge
はそれを読みます。月に 1 クエリで、サービス、SKU、プロジェクト、リージョン
別の**日ごと**のコストが得られます。クレジット — 無料枠、確約利用、
プロモーション — は独自の行として返るため、使用量はそれらを差し引く前の
コストのままです。

## エクスポートを有効にする {#export}

エクスポートには有効にした日からのデータが入るため、CloudBridge を
インストールする前でも、まずこれを済ませてください。

1. Google Cloud コンソールで **Billing → Billing export →
   BigQuery export** を開きます。
2. **Standard usage cost** の下で **Edit settings** をクリックし、プロジェクト
   を選んでデータセットを作成し（たとえば `billing`）、保存します。
3. 最初の行が届いたら — 1 日以内です — データセットに、`gcp_billing_export_v1_`
   に続けて請求アカウント ID を付けた名前のテーブルができます。BigQuery で
   それを開き、**Copy ID** を使います。これが CloudBridge の求める
   *Billing export table* で、たとえば
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01` の
   ようなものです。

## CloudBridge にキーを渡す {#connect}

1. エクスポート先データセットのプロジェクトで **IAM & Admin → Service
   accounts** を開き、`cloudbridge` などのサービスアカウントを作成します。
2. プロジェクトに対して **BigQuery Job User** を付与し、クエリを実行できる
   ようにします。またエクスポート先データセットに対して **BigQuery Data
   Viewer** を付与し、クエリがテーブルを読めるようにします。
3. サービスアカウントを開き、**Keys → Add key → Create new key →
   JSON** と進みます。ダウンロードしたファイルは安全な場所に保管して
   ください。
4. CloudBridge で **Google Cloud** のアカウントを追加し、キーファイルの
   **パス**と請求エクスポートテーブルを入力します。

CloudBridge が保持するのはパスであり、キーではありません。ファイルは取得の
たびに読まれるため、キーのローテーションはファイルの差し替えだけで済みます。
`gcloud auth application-default login` が書き出す認証情報ファイルも代わりに
使え、**Use this machine's credentials** と `GOOGLE_APPLICATION_CREDENTIALS`
の組み合わせも同様に使えます。

## 請求に表示される内容 {#detail}

| 列 | 由来 |
| --- | --- |
| サービス | `service.description` — *Compute Engine*、*Cloud Storage* |
| 説明 | SKU — *N2 Instance Core running in Americas* |
| プロジェクト | `project.id` と `project.name` |
| リージョン | `location.region` |
| 日 | 使用日 |
| カテゴリ | `cost_type` から Usage、Tax、Adjustment。クレジットは Credit |

1 か月は、Google Cloud の請求書と同じく**請求月**です。遅れて請求された
使用量は、前の月に使われたものでも請求された月に入ります。

クエリはエクスポートテーブル全体を読みます。月間の無料枠を超えると
BigQuery のオンデマンド料金がかかります。請求エクスポートは通常それより
ずっと小さいものですが、エクスポートが続く限り大きくなっていきます。
[インサイト](insights.md)は Google Cloud のリソースをスキャンしません。

CloudBridge がどのエンドポイントを呼ぶかの正確な一覧は、
[プロバイダーの権限](permissions.md#google-cloud)を参照してください。
