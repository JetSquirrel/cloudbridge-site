---
title: "請求台帳を SQL でクエリする"
description: "CloudBridge のクエリページ：ローカルの DuckDB 請求台帳に対する読み取り専用 SQL。支出、サービス、ビジネスライン、予測のテンプレート付き。"
---

# クエリ

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[한국어](../ko/query.md)**&emsp;**[Français](../fr/query.md)**&emsp;[ドキュメント](index.md)

クエリページは、ローカルの DuckDB 台帳に対して SQL を実行します。
デスクトップ版のみです。

- ステートメントを 1 つ書いて **Run** をクリックするか、**⌘Enter**
  （Windows では **Ctrl+Enter**）を押します。メインビューは
  `v_charge_normalized` で、課金項目ごとに 1 行、金額は表示通貨に換算されて
  います。
- テンプレートの一覧は、ひな形のクエリをエディターに入れます。月次の支出、
  プロバイダー別の支出、上位のサービス、ビジネスライン、未配賦の支出、
  月末予測、リージョン別とサービスカテゴリ別の内訳、上位のリソース、
  定価に対する割引、最近の取り込みバッチ、残高スナップショットです。
- 実行されるのは読み取りのステートメントだけです。書き込み得るものは
  データベースに届く前に拒否され、いずれにせよ台帳はクエリのために読み取り
  専用で開かれます。ここに入力したものでデータが変わることはありません。
- 大きな結果は行数の上限で止まります。最大 100,000 行、幅の広い結果では
  さらに少なくなります。結果が打ち切られたときはステータス行に表示され
  ます。すべてを見るには `LIMIT` を付けるか集計してください。
- 結果は、SQL を編集したり表示通貨を変更したりしても画面に残り、ページ上の
  内容ともはや一致していない旨が示されます。

## 便利な列 {#columns}

台帳の列名は [FOCUS](https://focus.finops.org/) の列にちなみます。
`billed_cost` と `effective_cost`、`charge_category`（`Usage`、
`Purchase`、`Credit`、`Tax`、`Adjustment`）、`service_name`、
`service_category`、`resource_id`、`region_id`、`pricing_quantity`、
`pricing_unit`、そしてモデルプロバイダーの行が請求するモデルを表す
`x_model` です。トークンの行はさらに FOCUS 1.5 の `consumed_quantity`、
`consumed_unit`、`sku_meter`、`sku_price_details` を持ちます。それらへの
クエリは [FOCUS とトークンデータ](focus.md#query)を参照してください。
`cost_basis` は金額がどれだけの重みを持つかを示します。請求からの
`authoritative`、Cloudflare のリソース別分割のような配賦の `estimated`、
金額のない使用量の `absent` です。
