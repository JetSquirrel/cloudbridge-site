---
title: "OpenAI、Anthropic、クラウドの請求エクスポートを取り込む"
description: "Alibaba Cloud、Volcengine、OpenAI、Anthropic、DeepSeek の請求エクスポートを CloudBridge に取り込みます。それぞれの入手元と、何が加わるかを説明します。"
---

# 請求ファイルの取り込み

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[한국어](../ko/bill-import.md)**&emsp;**[Français](../fr/bill-import.md)**&emsp;[ドキュメント](index.md)

プロバイダーのコンソールからダウンロードした請求エクスポートは、取得が生成
するのと同じ台帳の行に解析されます。下流 — 合計、グラフ、アラート、コスト配賦
— では、取り込んだ月と取得した月は区別できません。多くの場合、取り込みの
ほうが細かい読み取りになります。Alibaba Cloud の請求 API は Model Studio
(百炼) を月に 1 つの数字として報告しますが、エクスポートはトークン数付きで
モデルごとに報告します。

Volcengine、OpenAI、Anthropic は現時点では取り込み専用です。名前だけで
認証情報なしにアカウントを追加し、取り込んでください。

| ソース | エクスポートの取得元 | 追加される内容 |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) はモデル別。それ以外はインスタンスレベルの明細 |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) はエンドポイント別・トークン種別 |
| OpenAI | Usage → Export | コストまたはトークン使用量、プロジェクト別・モデル別 |
| Anthropic (Claude) | Usage or Cost → Export | コストまたはトークン使用量、ワークスペース別・モデル別 |
| DeepSeek | Usage → Download | 日別・モデル別の支出 — API は残高のみを報告 |

## 取り込む {#import}

1. プロバイダーのコンソールからエクスポートをダウンロードします。
2. アカウントページに進み、そのアカウントの行の **Import** をクリックします。
3. ファイルを選びます。CloudBridge は書き込んだ課金項目の数と、置き換えた
   月を報告します。

::: warning 月は加算されず、置き換えられます
取り込みは、選択したアカウントについてファイルが対象とするすべての月を
置き換えるため、2 回取り込んでも課金項目が二重になることはありません。
完全な請求をエクスポートしてください。製品で絞り込んだファイルは、その月の
データをその製品だけに置き換えてしまいます。取り込んだ月を更新するには、
完全で修正済みのエクスポートを再度取り込んでください。Refresh が取り込んだ
月を上書きすることはなく、Force Refresh でも同じです。
:::

## 使用量エクスポートには金額がない {#usage-exports}

**使用量**エクスポートは、トークン数はあっても金額がないため、請求コスト
なし、コスト基準 *absent* として記録されます。CloudBridge がトークン数を
定価で推定支出に変換することはありません。**コスト**エクスポートは、トークン
列がちょうど 1 つだけ埋まっている場合に限り数量を保持します。入力トークンと
出力トークンは価格が異なり、1 つの価格付き数量にはできないからです。

## 文字エンコーディング {#encoding}

テキストのエクスポートは UTF-8 である必要があります。Alibaba Cloud と
Volcengine のコンソールは GBK のファイルを生成することがあるため、UTF-8 で
再エクスポートするか、先に *CSV UTF-8* として保存してください。詳しくは
[トラブルシューティング](troubleshooting.md#import-errors)を参照してください。
