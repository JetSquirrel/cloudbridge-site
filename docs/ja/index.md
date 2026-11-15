---
layout: home
title: "CloudBridge ドキュメント — 請求をつなぎ、読み解き、見張る"
titleTemplate: false
description: "CloudBridge ドキュメント：AWS、Azure、Google Cloud、Alibaba Cloud、Cloudflare、Volcengine、OpenAI、Anthropic、DeepSeek の請求を 1 つのローカル台帳に読み込み、見張り続けます。"
hero:
  name: CloudBridge ドキュメント
  text: クラウドと AI の請求を、1 つの台帳に。
  tagline: 各プロバイダーをつなぎ、お金がどこへ流れたかを読み、暴走し始めたら知らせます。
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: はじめに
      link: /ja/getting-started
    - theme: alt
      text: デモを試す
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: CloudBridge について
      link: https://cloudbridge.jetsquirrel.cloud/ja/
features:
  - title: 請求をつなぐ
    details: AWS、Azure、Alibaba Cloud、Cloudflare は各社の請求 API 経由で、Google Cloud は BigQuery の請求エクスポート経由で接続します。Volcengine、OpenAI、Anthropic、DeepSeek は各コンソールが出力するエクスポートを取り込みます。
    link: /ja/aws
    linkText: データソース
  - title: どこへ流れたかを読む
    details: 月初来・30 日間・12 か月の概要、ビジネスラインへのコスト配賦、モデルごとのトークン経済性、台帳への SQL。
    link: /ja/overview
    linkText: 概要とアカウント
  - title: 削れるものを見つける
    details: インサイトは請求と、AWS と Cloudflare の読み取り専用リソーススキャンを突き合わせ、請求から価格を付け、種類ごとにまとめます。
    link: /ja/insights
    linkText: インサイト
  - title: 見張り続ける
    details: ルール、予算、通知。ウィンドウを閉じてもアプリはメニューバーで動き続け、ログイン時に起動します。
    link: /ja/background
    linkText: メニューバーとバックグラウンド
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ko/">한국어</a>&emsp;<a href="../fr/">Français</a>&emsp;<a href="../es/">Español</a>&emsp;<a href="../de/">Deutsch</a>&emsp;<a href="../pt/">Português</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/ja/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## 目的のページを探す

| やりたいこと | 読むページ |
| --- | --- |
| CloudBridge をインストールして最初の請求を見たい | [はじめに](getting-started.md) |
| 何もインストールせずに試したい | [ブラウザデモ](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Cost Explorer または Data Export で AWS をつなぐ | [AWS](aws.md) |
| Azure サブスクリプションをつなぐ | [Microsoft Azure](azure.md) |
| BigQuery の請求エクスポート経由で Google Cloud をつなぐ | [Google Cloud](google-cloud.md) |
| Alibaba Cloud をつなぐ | [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare をつなぎ、バケット・Worker・Durable Object ごとに分ける | [Cloudflare](cloudflare.md) |
| DeepSeek をつなぐ | [DeepSeek](deepseek.md) |
| Volcengine、OpenAI、Anthropic、Alibaba Cloud、DeepSeek のエクスポートを取り込む | [請求ファイルの取り込み](bill-import.md) |
| CloudBridge に必要最小限のアクセスだけを与える | [プロバイダーの権限](permissions.md) |
| 概要ページの数字を理解する | [概要とアカウント](overview.md) |
| あるコストがどのビジネスラインに属するか知る | [コスト配賦](attribution.md) |
| LLM モデルごとのトークン単価を知る | [モデル](models.md) |
| 停止したインスタンス、遊んでいるアドレス、持ち主のいないリソースを見つける | [インサイト](insights.md) |
| プロバイダーの請求書を台帳と照合する | [照合](reconciliation.md) |
| 台帳に SQL で問い合わせる | [クエリ](query.md) |
| 支出が跳ねたとき、予算が近いときに知らせてほしい | [アラート、ルール、予算](alerts.md) |
| 暴走する Worker や Durable Object を、請求書ではなく初日に知る | [暴走を捕まえる](cloudflare.md#runaway) |
| ウィンドウを閉じたまま CloudBridge を動かし続ける | [メニューバーとバックグラウンド](background.md) |
| CloudBridge が何を保存しているかを知り、バックアップする | [設定、データ、セキュリティ](settings-and-data.md) |
| 動かないところを直す | [トラブルシューティング](troubleshooting.md) |
