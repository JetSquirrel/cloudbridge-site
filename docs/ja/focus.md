---
title: "FOCUS 1.5 と LLM のトークンデータ"
description: "CloudBridge が AI モデルのトークン使用量を FOCUS 1.5 の用語でどう記録するか：ConsumedQuantity、SkuMeter、SkuPriceDetails の ModelId、TokenDirection、TokenCacheAction プロパティ。"
---

# FOCUS とトークンデータ

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[한국어](../ko/focus.md)**&emsp;**[Français](../fr/focus.md)**&emsp;[ドキュメント](index.md)

CloudBridge の台帳は、FinOps Foundation のコストと使用量データのオープンな
仕様である [FOCUS](https://focus.finops.org/) にちなんで名付けられています。
FOCUS 1.5 は AI モデル API の請求を記述します。トークンの列を追加するのでは
なく、FOCUS がすでに持つ列を使い、CloudBridge も同じ方法でトークンを記録
します。

## トークン行が持つもの {#columns}

| FOCUS の列 | 台帳の列 | 内容 |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | 生のトークン数 |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | プロバイダーによるメーターの名前。たとえば *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | モデルとトークンのプロパティを持つ JSON オブジェクト |

`SkuPriceDetails` は FOCUS が定義する 4 つのプロパティを持ちます。

| プロパティ | 値 |
| --- | --- |
| `ModelDeveloper` | モデルを作った主体：*OpenAI*、*Anthropic*、*DeepSeek* |
| `ModelId` | 請求が名指すモデル |
| `TokenDirection` | モデルへ送ったトークンは `Input`、モデルが生成したトークンは `Output` |
| `TokenCacheAction` | 入力トークンについて：プロンプトキャッシュからの `Read`、キャッシュへの `Write`、どちらでもなければ `Uncached` |

請求から答えられないプロパティは、推測せずに省略します。Alibaba Cloud
Model Studio と Volcengine Ark は、入力と出力を合わせて 1 つの `Tokens` 数と
して課金するため、その行には `TokenDirection` がありません。出力トークンには
`TokenCacheAction` がありません。

## 誰が使ったか {#requester}

FOCUS 1.5 は、課金項目の背後にいる要求者も記録します。`PrincipalId` は
ユーザー、`CredentialId` は API キーの公開 ID（キーそのものではありません）、
`RequesterDetails` はそれらを記述する JSON 配列で、キーの表示名を含みます。
CloudBridge は次のエクスポートから、台帳の `principal_id`、`credential_id`、
`requester_details` の列を埋めます。

- ユーザー別または API キー別にまとめた OpenAI のエクスポート。
- API キー別にまとめた Anthropic のエクスポート。

DeepSeek のエクスポートにはマスクされたキーとその名前しかなく、FOCUS は
それを識別子として認めないため、その行には何も入りません。

## 値の出どころ {#sources}

- **OpenAI、Anthropic、DeepSeek、Model Studio、Ark の取り込み。**
  CloudBridge は、各エクスポートが報告するトークンの種類から列を埋めます。
  FOCUS の要求どおり、各トークンは 1 つの行に数えられます。OpenAI の入力
  合計にはキャッシュされたトークンが含まれるため、それらは入力の行から
  取り除かれます。以前のバージョンの台帳は、初めて開いたときに埋められます。
  この変更より前に取り込んだ月は、再実行するまで OpenAI の古い入力数を保ち
  ます（**Accounts → Replay normalization**）。
- **AWS Data Exports。** FOCUS エクスポート自身の列は、AWS が書いたとおりに
  保たれます。FOCUS 1.5 より前に書かれたエクスポートには `TokenDirection` が
  ありません。トークン行のメーター名が、数えているトークンを示す場合 —
  たとえば *cache-read-input-token-count* や *output-tokens* — は、方向と
  キャッシュアクションを名前から読みます。それ以外では省略されます。

[モデル](models.md)ページはこれらのプロパティを読みます。キャッシュの
読み取りは、プロバイダーがメーターにどんな名前を付けていても
`TokenCacheAction` の `Read` です。

## クエリする {#query}

[クエリ](query.md)ページは、DuckDB の JSON 関数でプロパティを読みます。

```sql
SELECT json_extract_string(sku_price_details, '$.ModelId') AS model,
       json_extract_string(sku_price_details, '$.TokenCacheAction') AS cache,
       sum(consumed_quantity) AS tokens,
       sum(billed_cost) AS cost
FROM v_charge_normalized
WHERE consumed_unit = 'Tokens'
  AND json_extract_string(sku_price_details, '$.TokenDirection') = 'Input'
GROUP BY ALL
ORDER BY tokens DESC;
```

## エクスポートする {#export}

**Settings → Data → Export as FOCUS** は、すべての課金項目を FOCUS の列名を
持つ CSV として書き出します。トークンの列も含み、別の FinOps ツールで使え
ます。金額は各課金項目が請求された通貨のままです。CloudBridge が追加する列は
`x_` で始まり、たとえば `x_CostBasis` です。このファイルは準拠した FOCUS
データセットではありません。どのソースも報告しない列 — `ChargeClass` や
`PricingCategory` など — は省略され、報告された金額のない行では
`BilledCost` が空のままになります。このエクスポートはデスクトップ版のみです。
