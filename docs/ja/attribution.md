---
title: "ビジネスライン、タグ、サービス別のコスト配賦"
description: "CloudBridge のコスト配賦：ソースからサービスまたはモデル、ビジネスラインへの Sankey と、タグ、サービス、リージョン、FOCUS カテゴリ別の内訳。"
---

# コスト配賦

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[한국어](../ko/attribution.md)**&emsp;**[Français](../fr/attribution.md)**&emsp;**[Español](../es/attribution.md)**&emsp;**[Deutsch](../de/attribution.md)**&emsp;**[Português](../pt/attribution.md)**&emsp;[ドキュメント](index.md)

コスト配賦ページは、その月を Sankey として描きます。ソース、次にサービス
またはモデル、次にビジネスラインで、**Unallocated** ノードも明示されます。
フローは総使用量です。純額のフローは負になり得ますが、Sankey では何の意味も
持ちません。課金項目は `business_line` タグでビジネスラインに割り当てられ、
タグがなければ Unallocated に入ります。

## 次元ごとの内訳 {#dimensions}

内訳の上の切り替えで、**Tag**（ビジネスラインの表示）、**Service**、
**Region**、**Category** を選びます。タグ以外の次元はツリーマップとして描かれ
ます — **Map** では、タイルの面積がこの期間のコスト、色が前期間に対する変化
です — または **Table** の下に割合のバーとして描かれます。その次元の値が
ない課金項目は *Other* と表示されます。**Top resources** カードには、その
期間で最もコストの高いリソースが並びます。

## サービスカテゴリ {#categories}

**Category** は FOCUS のサービスカテゴリを使います。Compute、Storage、
Databases、Networking、AI and Machine Learning などで、どのクラウドでも同じ
です。そのため Alibaba Cloud の ECS、Volcengine の ECS、AWS の EC2 はすべて
*Compute / Virtual Machines* に数えられ、Model Studio、Ark、モデル
プロバイダーは *AI and Machine Learning / Generative AI* に数えられます。
まだどのマッピングも知らない製品は *Uncategorized* と表示され、
[データヘルス](overview.md#data-health)の所見として現れます。
