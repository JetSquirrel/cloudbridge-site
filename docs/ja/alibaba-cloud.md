---
title: "Alibaba Cloud の請求 API と請求取り込み"
description: "読み取り専用の RAM ユーザーで Alibaba Cloud (阿里云) を CloudBridge につなぐか、請求明細を取り込んで Model Studio (百炼) のモデル別コストを読みます。"
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[한국어](../ko/alibaba-cloud.md)**&emsp;**[Français](../fr/alibaba-cloud.md)**&emsp;**[Español](../es/alibaba-cloud.md)**&emsp;**[Deutsch](../de/alibaba-cloud.md)**&emsp;**[Português](../pt/alibaba-cloud.md)**&emsp;[ドキュメント](index.md)

Alibaba Cloud には両方の経路があります。**請求 API** は各製品の月間合計を
返し、**請求明細のエクスポート**はインスタンスレベルの行を返します。
Model Studio (百炼) については、トークン数付きでモデルごとの行も含まれます。
自動で最新に保たれるアカウントには API を使い、より細かく読みたいときは
エクスポートを取り込んでください。取り込んだ月が更新で上書きされることは
ありません。

## 請求 API {#api}

1. [RAM コンソール](https://ram.console.aliyun.com/)を開き、API アクセス用の
   RAM ユーザーを作成します。
2. 組み込みの `AliyunBSSReadOnlyAccess` システムポリシーをアタッチします。
3. そのユーザーの AccessKey を作成します。
4. CloudBridge で AccessKey ID と Secret を使ってアカウントを追加します。

プライマリアカウントの AccessKey は使わないでください。請求 API の
クエリごとの料金はここには記載していません。Alibaba Cloud の現在の規約を
確認してください。[プロバイダーの権限](permissions.md#alibaba-cloud)を
参照してください。

## 請求明細のエクスポート {#export}

コンソールで **Expenses and Costs → Bill Details → Export** に進み、完全な
請求をダウンロードして、アカウントの行の **Import** をクリックします。
取り込みに認証情報は不要です。[請求ファイルの取り込み](bill-import.md)を
参照してください。
