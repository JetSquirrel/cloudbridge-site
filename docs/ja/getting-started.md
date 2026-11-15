---
title: "CloudBridge をインストールして最初の請求を読む"
description: "macOS または Windows に CloudBridge をインストールし、デモ請求でひと通り見てから、最初のアカウントを追加して数分で最初の請求を読みます。"
---

# はじめに

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[한국어](../ko/getting-started.md)**&emsp;**[Français](../fr/getting-started.md)**&emsp;[ドキュメント](index.md)

CloudBridge は、クラウドとモデルプロバイダーの請求を、お使いのマシン上の
1 つの台帳に読み込みます。請求 API からでも、ダウンロードしたエクスポート
からでもかまいません。そして傾向を描きます。サインアップも同期もテレメトリーも
ありません。このページでは、ダウンロードから最初の請求までを案内します。

## 1. インストール {#install}

[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest) ページから
最新ビルドをダウンロードします。

| プラットフォーム | ファイル |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS。** `.dmg` を開き、**CloudBridge** を **Applications** にドラッグして、
そこから起動します。リリースは Developer ID で署名され公証済みなので、
回避策なしで開けます。macOS が現行リリースをブロックする場合は、
[警告の内容を正確に報告](https://github.com/JetSquirrel/cloudbridge/issues)し、
macOS のバージョンも添えてください。インストール手順の一環として
quarantine 保護を外さないでください。

**Windows。** `.exe` はコード署名されていないため、SmartScreen が
*Windows protected your PC* と表示して止める可能性が高いです。ファイルが
公式の Releases ページから来たことを確認してから、**More info**、**Run
anyway** の順にクリックします。Windows はそのファイルについて選択を覚えて
います。新しいリリースでは再び確認されます。

Linux と Intel Mac 向けのバイナリは公開されていません。ソースからの
ビルドには Rust 1.95 以降が必要です。[開発環境のセットアップ](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup)
を参照してください。

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. まずはひと通り見る（任意） {#demo}

[ブラウザデモ](https://cloudbridge.jetsquirrel.cloud/demo/) は、サンプル請求で
同じページを動かします。認証情報は保持せず、どのプロバイダーにも接続しない
ため、取り込み、請求 API からの更新、SQL コンソールはデスクトップ版のみです。

アプリ内では、空の概要ページに **Load demo data** が表示されるか、
**Settings → Demo data** を開きます。デモアカウントは認証情報を持たず、
更新時にはスキップされます。同じページの **Clear demo data** で削除できます。

## 3. アカウントを追加する {#account}

アカウントページを開き、**Add account** をクリックし、ソースを選んで名前を入力します。

| ソース | 請求の届き方 | 必要なもの |
| --- | --- | --- |
| Amazon Web Services | 請求 API | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | Cost Management API | Client ID + シークレット + サブスクリプション ID — [Azure](azure.md) |
| Google Cloud | BigQuery 請求エクスポート | サービスアカウントのキーファイル + エクスポートテーブル — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | 請求 API、または請求エクスポート | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | 請求 API | アカウント ID + API トークン — [Cloudflare](cloudflare.md) |
| DeepSeek | 残高 API、または請求エクスポート | API キー — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | 請求エクスポート | なし |
| OpenAI | 請求エクスポート | なし |
| Anthropic (Claude) | 請求エクスポート | なし |

**Save** をクリックします。API ソースは今月と前月の請求をすぐに取得するので、
キーが間違っていればその取得の失敗として現れます。

## 4. 請求を取り込む {#bill}

- **API ソース**は保存時に請求を取得済みです。概要ページの **Refresh** は、
  更新間隔が過ぎた後に再び取得します。
- **ファイルソース** — Volcengine、OpenAI、Anthropic、そしてより細かい
  内訳が欲しいときの Alibaba Cloud と DeepSeek — はエクスポートが必要です。
  プロバイダーのコンソールからダウンロードし、アカウントの行の **Import** を
  クリックします。[請求ファイルの取り込み](bill-import.md)を参照してください。

## 5. 請求を読む {#read}

概要ページは、選んだ期間を表示します。**MTD**、**30d**、**12m** です。
**Settings → Reporting** で USD か CNY を選べます。そこから先は次のとおりです。

- [概要とアカウント](overview.md)で数字の意味を説明します。
- [アラート、ルール、予算](alerts.md)で、支出が跳ねたときに知る方法を説明します。
- [メニューバーとバックグラウンド](background.md)で、ウィンドウを閉じたまま
  動かし続ける方法を説明します。

表示されないものがありますか。[トラブルシューティング](troubleshooting.md)を
参照してください。
