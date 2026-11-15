---
title: "SQL로 청구 장부 조회하기"
description: "CloudBridge 쿼리 페이지: 로컬 DuckDB 청구 장부에 대한 읽기 전용 SQL과 지출, 서비스, 비즈니스 라인, 예측용 템플릿."
---

# 쿼리

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[日本語](../ja/query.md)**&emsp;**[Français](../fr/query.md)**&emsp;**[Español](../es/query.md)**&emsp;**[Deutsch](../de/query.md)**&emsp;**[Português](../pt/query.md)**&emsp;[문서](index.md)

**Query** 페이지는 로컬 DuckDB 장부에 SQL을 실행합니다. 데스크톱 전용입니다.

- 문장 하나를 작성하고 **Run**을 클릭하거나 **⌘Enter**(Windows에서는 **Ctrl+Enter**)를 누릅니다. 기본 뷰는 `v_charge_normalized`이며 비용당 한 행이고 금액은 보고 통화로 변환되어 있습니다.
- 템플릿 목록은 편집기를 시작 쿼리로 채웁니다 — 월별 지출, 공급자별 지출, 상위 서비스, 비즈니스 라인, 미할당 지출, 월말 예측, 리전 및 서비스 범주 분할, 상위 리소스, 정가 대비 할인, 최근 수집 배치, 잔액 스냅샷.
- 읽기 문장만 실행됩니다. 쓸 수 있는 것은 데이터베이스에 도달하기 전에 거부되고, 어쨌든 장부는 쿼리를 위해 읽기 전용으로 열립니다. 여기에 입력한 어떤 것도 데이터를 바꿀 수 없습니다.
- 큰 결과는 행 예산에서 멈춥니다 — 최대 100,000행이고, 넓은 결과면 더 적습니다 — 결과가 잘렸을 때는 상태 줄이 알려 줍니다. 전부 보려면 `LIMIT`을 붙이거나 집계하세요.
- SQL을 편집하거나 보고 통화를 바꾼 뒤에도 결과는 화면에 남아 있으며, 페이지의 내용과 더 이상 일치하지 않는다고 표시됩니다.

## 유용한 열 {#columns}

장부는 [FOCUS](https://focus.finops.org/) 열 이름을 따릅니다: `billed_cost`와 `effective_cost`, `charge_category`(`Usage`, `Purchase`, `Credit`, `Tax`, `Adjustment`), `service_name`, `service_category`, `resource_id`, `region_id`, `pricing_quantity`, `pricing_unit`, 그리고 모델 공급자 행이 청구하는 모델을 담는 `x_model`이 있습니다. 토큰 행은 FOCUS 1.5의 `consumed_quantity`, `consumed_unit`, `sku_meter`, `sku_price_details`도 함께 가집니다. 이들에 대한 쿼리는 [FOCUS와 토큰 데이터](focus.md#query)를 참고하세요. `cost_basis`는 금액이 얼마나 무게를 갖는지 말해 줍니다: 청구서에서 온 `authoritative`, Cloudflare의 리소스별 분할 같은 배분의 `estimated`, 금액이 없는 사용량의 `absent`.
