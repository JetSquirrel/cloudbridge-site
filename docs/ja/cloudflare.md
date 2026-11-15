---
title: "R2 バケット、Worker、D1 ごとの Cloudflare コスト"
description: "API トークンで Cloudflare を CloudBridge につなぎます。日次の課金対象使用量を、R2 バケット、Workers、D1、Durable Objects ごとに分けて読みます。"
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[한국어](../ko/cloudflare.md)**&emsp;**[Français](../fr/cloudflare.md)**&emsp;[ドキュメント](index.md)

CloudBridge は Cloudflare の課金対象使用量を読みます。サービスごと、
**日ごと**の支出です。ここが要点です。ループし始めた Worker や Durable Object
は、月末の請求書ではなく翌日には台帳に載ります。しかも無料枠内の使用量も、
横にコスト 0 を付けて保持します。暴走はそこから始まるからです。

## アカウントをつなぐ {#connect}

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/profile/api-tokens)で
   **My Profile → API Tokens → Create Token** に進み、
   **Create Custom Token** から始めます。
2. **Account → Billing → Read** を付与し、**Account Resources** を監視する
   アカウントに限定します。
3. ダッシュボードのアカウントのホームページからアカウント ID をコピーします。
4. CloudBridge で、アカウント ID とトークンを使ってアカウントを追加します。

課金対象使用量 API は従量課金（セルフサーブ）アカウントのみを対象とし、
アルファ版の API です。Enterprise アカウントは対象外として報告されます。
Cloudflare の請求サイクルはサブスクリプション開始日を基準にするため、
CloudBridge の各暦月には、その中に入る日が入ります。

## リソースごとに分ける {#split}

請求はサービス単位で止まります — *R2 Class B operations, 734 on 3 October*
— どのバケットかまでは分かりません。トークンに **Account → Account
Analytics → Read** を追加すると、CloudBridge は GraphQL Analytics API に
対して、請求が名指すメーターの各リソースの使用量を問い合わせ、その割合で
各日の行を分割します。

| 請求 | 分割先 |
| --- | --- |
| R2 Class A と B のオペレーション、ストレージ | R2 バケット |
| Workers のリクエストと CPU | Workers（リクエスト数による） |
| D1 の読み書き行数、ストレージ | D1 データベース |
| Durable Objects のリクエスト、実行時間、行数、ストレージ | Durable Object の名前空間 |

各部分の合計は Cloudflare が請求した額になり、推定として示されます。
アナリティクスはサンプリングされ、無料枠はアカウントに属し、特定の
リソースには属しません。アナリティクスが分割できないメーター — KV、
Queues、認識できないもの — や、権限のないトークンでは、その行は
アカウントのまま分割されずに残ります。[インサイト](insights.md)は各
リソースの割合と、この期間の使用量を表示します。

## 暴走を捕まえる {#runaway}

従量課金の Cloudflare アカウントは支出上限で止まらないため、Durable Object
のアラームやループする Worker は、動いている限り課金され続けます。
CloudBridge も止めることはできませんが、請求書ではなく初日に知らせることは
できます。すべての Cloudflare アカウントで、静かなものも含めて設定して
ください。誰も使っていないプロジェクトこそ、誰も見ていないものです。

1. ルールページで、そのアカウントに **Monthly budget** を設定します。
   通常の月のコストに余裕を加えた額です。以下のルールはこれを基準に測定し、
   予算のないアカウントでは何もしません。
2. **New rule** をクリックし、そのアカウントの **Account budget** を選び、
   **Based on** を **Month-end forecast** に設定します。
3. **Settings → Refreshing** で更新間隔を 6 時間に短縮し、**Open at
   login** をオンにして CloudBridge を[メニューバー](background.md)で
   動かし続けます。

この仕組みを成立させるのが予測です。予測は、支出があった最初の日から
その月の支出を平均するため、ループの初日が残りの月に投影され、その日を
読んだ最初の更新でルールが発火します。

**コスト成長異常**のルールではこのケースを捕まえられません。サービスを
そのサービス自身の直近 7 日間と比較するため、コストがゼロだったサービスには
成長の基準がなく、眠っていたプロジェクトが目覚めてループしても決して
発火しません。

アラートが発火したら、Cloudflare ダッシュボードでその Worker または
Durable Object を停止してください。トークンに Account Analytics があれば、
[インサイト](insights.md)が各 Worker と名前空間の請求に占める割合を表示
するので、原因のものが目立つはずです。

## リソースをスキャンする {#insights}

[インサイト](insights.md)は同じトークンでアカウントをスキャンし、読み取り
だけを行います。そのためには同じアカウントに次の **Read** 権限を追加して
ください。**Account Settings**、**Zone**、**Workers Scripts**、**Workers R2
Storage**、**Workers KV Storage**、**Queues**、**D1** です。これらのない
トークンでも請求は読めます。スキャンは何を拒否されたかを表示します。

CloudBridge がどのエンドポイントを呼ぶかの正確な一覧は、
[プロバイダーの権限](permissions.md#cloudflare)を参照してください。
