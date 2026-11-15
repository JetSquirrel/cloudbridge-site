---
title: "비즈니스 라인, 태그, 서비스별 비용 귀속"
description: "CloudBridge 비용 귀속: 소스에서 서비스 또는 모델을 거쳐 비즈니스 라인으로 가는 Sankey와 태그, 서비스, 리전, FOCUS 범주별 분류."
---

# 비용 귀속

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[日本語](../ja/attribution.md)**&emsp;**[Français](../fr/attribution.md)**&emsp;**[Español](../es/attribution.md)**&emsp;**[Deutsch](../de/attribution.md)**&emsp;**[Português](../pt/attribution.md)**&emsp;[문서](index.md)

비용 귀속 페이지는 그 달을 Sankey로 그립니다. 소스, 다음 서비스 또는 모델, 다음 비즈니스 라인 순이며 **Unallocated** 노드가 명시적으로 있습니다. 흐름은 총 사용량입니다. 순액은 음수가 될 수 있는데, Sankey에서는 아무 의미가 없습니다. 비용은 `business_line` 태그로 라인에 배정되며, 태그가 없으면 Unallocated에 들어갑니다.

## 차원별 분류 {#dimensions}

분류 위의 스위처에서 **Tag**(비즈니스 라인 보기), **Service**, **Region**, **Category**를 고릅니다. 태그가 아닌 차원은 트리맵 — **Map**, 타일의 면적이 이번 기간 비용이고 색이 이전 기간 대비 변화 — 또는 **Table** 아래의 비중 막대로 그려집니다. 해당 차원의 값이 없는 비용은 *Other*로 표시됩니다. **Top resources** 카드는 그 기간에 가장 비싼 리소스를 나열합니다.

## 서비스 범주 {#categories}

**Category**는 FOCUS 서비스 범주 — Compute, Storage, Databases, Networking, AI and Machine Learning 등 — 를 사용하며 모든 클라우드에서 같습니다. 그래서 Alibaba Cloud의 ECS, Volcengine의 ECS, AWS의 EC2가 모두 *Compute / Virtual Machines*로 집계되고, Model Studio, Ark, 모델 공급자들은 *AI and Machine Learning / Generative AI*로 집계됩니다. 아직 매핑이 없는 제품은 *Uncategorized*로 표시되고 [데이터 상태](overview.md#data-health) 발견 항목으로 나타납니다.
