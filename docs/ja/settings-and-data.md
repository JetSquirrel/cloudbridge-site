---
title: "設定、データの保存、セキュリティ"
description: "CloudBridge が何をどこに保存するか：DuckDB の台帳、アカウント、生のペイロード、設定、さらに更新間隔、通貨、バックアップ、セキュリティ。"
---

# 設定、データ、セキュリティ

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[한국어](../ko/settings-and-data.md)**&emsp;**[Français](../fr/settings-and-data.md)**&emsp;**[Español](../es/settings-and-data.md)**&emsp;**[Deutsch](../de/settings-and-data.md)**&emsp;**[Português](../pt/settings-and-data.md)**&emsp;[ドキュメント](index.md)

## 設定 {#settings}

| 設定 | 内容 |
| --- | --- |
| Appearance → Theme | ライトとダークのテーマ。起動をまたいで記憶されます |
| Appearance → Language | [インターフェースの言語](#language)：System、English、简体中文 |
| Reporting → Currency | すべての合計に USD または CNY。課金項目は自らの通貨を保ちます |
| Refreshing → Refresh interval | 月を再度取得するまでの 6、12、24（既定）、48 時間 |
| Background | [ログイン時の起動、バックグラウンド更新、アラート通知](background.md) |
| Data → Export as FOCUS | すべての課金項目を FOCUS の列名を持つ CSV として、別の FinOps ツール向けに出力（[詳細](focus.md#export)） |
| Demo data | 12 か月分の履歴を持つ 5 つのサンプルアカウント（AWS、Alibaba Cloud、DeepSeek、OpenAI、Anthropic）を読み込むか消去します |

**Refresh** は更新間隔より古い月を取得し、**Force Refresh** はすべてを取得
しますが、プロバイダーの料金がかかる場合があります。どちらも取り込んだ月を
上書きしません。デモアカウントは `demo-` の接頭辞を使い、認証情報を持たず、
更新時にはスキップされます。

## インターフェースの言語 {#language}

CloudBridge 0.9.0 以降は簡体中国語に翻訳されています。すべてのページと
ダイアログ、メニューバーのパネルとそのメニュー、システム通知が対象です。
**Settings → Appearance → Language** で言語を選ぶまでは、アプリは
システムの言語に従い、変更はすぐに反映されます。ブラウザデモはブラウザの
言語に従い、サイドバーのフッターに切り替えがあります。

- トレイメニューは、次にアプリを起動したときに新しい言語になります。
- アラートは、発火したときの言語を保ちます。ただし残高下限のアラートは
  例外で、最新の数値とともに現在の言語で書き換えられます。
- 金額と通貨の書式はこれまでどおりです。

## データの保存場所 {#storage}

| プラットフォーム | 場所 |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux（ソースビルド） | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — 請求台帳。各課金項目の元の通貨、
  [月末スナップショット](overview.md#snapshots)、
  [請求書](reconciliation.md)を保持します。
- `cloudbridge.duckdb` — アカウント、予算、ルール、アラートの状態。
- `raw/` — すべてのプロバイダー応答と取り込んだファイルを、ソース、
  アカウント、月ごとに。マッピングの修正時に、再度リクエストすることなく
  読み直せます（**Accounts → Replay normalization**）。
- `inventory/` と `tools/` — インサイトのスキャン結果と、インストールされて
  いればスキャナー。
- `config.json` — 通貨、テーマ、更新間隔、バックグラウンドの設定。

## バックアップ {#backups}

データベースをコピーしたり開いたりする前に CloudBridge を終了してください。
ディレクトリ全体 — 両方のデータベース、`raw/`、`config.json` — を
バックアップし、アプリを閉じた状態で復元します。認証情報はバックアップでは
なく OS のキーリングにあるため、別のマシンでは再入力してください。アプリの
外で台帳を分析するには、稼働中のファイルではなくコピーに対してクエリして
ください。

## セキュリティ {#security}

- 認証情報は OS のキーリング — macOS の Keychain、Windows の
  Credential Manager、Linux のソースビルドでは Secret Service — に保持され、
  データベースとは分かれています。
- アプリは認証情報を、それが属するプロバイダーへのリクエストにだけ使います。
  CloudBridge でキーを使っても、それが読み取り専用になるわけではありません。
  [プロバイダーの権限](permissions.md)を参照してください。
- CloudBridge の同期サービスもテレメトリーもありません。取り込みは
  プロバイダーへのリクエストを行いません。
- **ローカルであることは暗号化されていることを意味しません。** アプリは台帳や
  生のファイルを暗号化しません。ディスクの暗号化を使い、バックアップを
  保護してください。
- ログ、スクリーンショット、サンプルのエクスポートを共有する前に、認証情報、
  アカウント ID、リソース名、タグを伏せてください。
