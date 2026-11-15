---
title: "DeepSeek の残高とモデル別 API 支出"
description: "API キーで DeepSeek を CloudBridge につないでプリペイド残高を読み、使用量のダウンロードを取り込んで日別・モデル別の支出を読みます。"
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[한국어](../ko/deepseek.md)**&emsp;**[Français](../fr/deepseek.md)**&emsp;**[Español](../es/deepseek.md)**&emsp;**[Deutsch](../de/deepseek.md)**&emsp;**[Português](../pt/deepseek.md)**&emsp;[ドキュメント](index.md)

DeepSeek の API が報告するのは**残高** — 付与分とチャージ分 — であり、支出の
内訳ではありません。支出の内訳は、コンソールのダウンロードを取り込んで
ください。

## 残高 API {#api}

1. [platform.deepseek.com](https://platform.deepseek.com/) を開き、API
   キーを作成します。
2. そのキーを使って CloudBridge でアカウントを追加します。

残高は **Balance floor** ルールに使われます
（[アラート、ルール、予算](alerts.md)を参照）。残高照会に使うキーが、有料の
モデルリクエストも認可できる場合があるため、安全に保管し、その権限を確認して
ください。[プロバイダーの権限](permissions.md#deepseek)を参照してください。

## 使用量のダウンロード {#export}

コンソールで **Usage → Download** に進み、ZIP をダウンロードしたままの形で
取り込みます。CloudBridge は中の `cost-*.csv` を読み、`amount-*.csv` は
無視します。その `amount` 列には金額ではなくトークン数が入っているからです。
[請求ファイルの取り込み](bill-import.md)を参照してください。
