---
title: "サービスごと、日ごとの Azure コスト"
description: "サービスプリンシパルで Microsoft Azure サブスクリプションを CloudBridge につなぎます。Cost Management から実費を、日ごと、サービスと課金種類別に読みます。"
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[한국어](../ko/azure.md)**&emsp;**[Français](../fr/azure.md)**&emsp;**[Español](../es/azure.md)**&emsp;**[Deutsch](../de/azure.md)**&emsp;**[Português](../pt/azure.md)**&emsp;[ドキュメント](index.md)

CloudBridge は、サブスクリプションの**実費**を Azure Cost Management から
読み取ります。各サービスが**日ごと**にいくらかかったかを、課金種類ごとに
分けて読みます。購入した予約、返金、税金は、そのままの性質で保持され、
使用量に加算されません。そのため、一時的な購入が 1 件ある月が、使用量が 3 倍に
なった月のように見えることはありません。

## サブスクリプションをつなぐ {#connect}

CloudBridge は、あなた自身としてではなく、サービスプリンシパル — 独自の
シークレットを持つアプリ登録 — としてサインインします。

1. [Azure ポータル](https://portal.azure.com/)で **Microsoft Entra
   ID → App registrations → New registration** を開きます。`cloudbridge` の
   ような名前を付けます。フォームの他の項目は何でもかまいません。
2. 新しい登録で **Certificates & secrets → New client
   secret** を開き、シークレットの **Value** をコピーします。Secret ID では
   ありません。表示されるのは 1 回だけです。
3. サブスクリプションを開き、**Access control (IAM) → Add role
   assignment** を選びます。**Cost Management Reader** を選んでアプリに
   割り当てます。
4. CloudBridge で **Microsoft Azure** のアカウントを追加し、登録の
   **Application (client) ID**、シークレットの値、**Subscription ID** を
   入力します。

テナント ID は不要です。CloudBridge がサブスクリプションの属するテナントを
調べます。その検索に失敗する場合は、サブスクリプションを
`tenant-id/subscription-id` の形で入力してください。

ロールの割り当てが反映されるまで数分かかることがあります。割り当て直後に
最初の取得が拒否されたら、少し待って **Validate** をもう一度クリックして
ください。

## 請求に表示される内容 {#detail}

| 列 | 由来 |
| --- | --- |
| サービス | メーターのカテゴリ — *Virtual Machines*、*Storage*、*Bandwidth* |
| 日 | 使用日 |
| カテゴリ | 課金種類から、Usage、Purchase、Credit（返金）、Tax、Adjustment |
| 金額 | 実費。サブスクリプションの請求通貨で表示 |

クエリはサービス別に報告し、リソース別やリージョン別には報告しません。
そのため [コスト配賦](attribution.md)のリージョン別内訳は Azure では
*Other* と表示され、[インサイト](insights.md)は Azure のリソースをスキャン
しません。

Cost Management のクエリ API はテナントごとにレート制限があります。
1 アカウントは取得する月ごとに 1 クエリです。同じテナント内の複数の
サブスクリプションは制限を共有し、スロットリングされた取得は次の更新で
再試行されます。

## このマシンの認証情報を使う {#system}

`AZURE_CLIENT_ID`、`AZURE_CLIENT_SECRET`、`AZURE_SUBSCRIPTION_ID` が設定
されているマシン — Azure SDK が読む変数です — では、**Use this machine's
credentials** にチェックを入れると、CloudBridge はコピーを保持せず、取得の
たびにそれらを読みます。`az login` だけでは不十分です。サインイン済みの
ユーザーが残るだけで、CloudBridge が使えるシークレットにはなりません。

CloudBridge がどのエンドポイントを呼ぶかの正確な一覧は、
[プロバイダーの権限](permissions.md#azure)を参照してください。
