---
title: "FOCUS 1.5와 LLM 토큰 데이터"
description: "CloudBridge가 AI 모델 토큰 사용량을 FOCUS 1.5 용어로 기록하는 방식: ConsumedQuantity, SkuMeter, 그리고 SkuPriceDetails의 ModelId, TokenDirection, TokenCacheAction 속성."
---

# FOCUS와 토큰 데이터

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[日本語](../ja/focus.md)**&emsp;**[Français](../fr/focus.md)**&emsp;[문서](index.md)

CloudBridge의 장부는 FinOps Foundation의 비용·사용량 데이터 공개 사양인 [FOCUS](https://focus.finops.org/)의 이름을 따릅니다. FOCUS 1.5는 AI 모델 API의 청구서를 설명합니다. 토큰 열을 새로 추가하지 않고, FOCUS에 이미 있는 열을 쓰며, CloudBridge도 같은 방식으로 토큰을 기록합니다.

## 토큰 행이 담는 것 {#columns}

| FOCUS 열 | 장부 열 | 담는 내용 |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | 원시 토큰 수 |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | 공급자가 미터에 붙인 이름, 예: *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | 모델과 토큰 속성을 담은 JSON 객체 |

`SkuPriceDetails`는 FOCUS가 정의한 네 가지 속성을 담습니다:

| 속성 | 값 |
| --- | --- |
| `ModelDeveloper` | 모델을 만든 곳: *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | 청구서가 부르는 모델 이름 |
| `TokenDirection` | 모델로 보낸 토큰은 `Input`, 모델이 생성한 토큰은 `Output` |
| `TokenCacheAction` | 입력 토큰에서: 프롬프트 캐시에서 `Read`, 캐시로 `Write`, 둘 다 아니면 `Uncached` |

청구서가 답할 수 없는 속성은 추측하지 않고 비웁니다. Alibaba Cloud Model Studio와 Volcengine Ark는 입력과 출력을 합친 하나의 `Tokens` 수로 청구하므로, 그 행에는 `TokenDirection`이 없습니다. 출력 토큰에는 `TokenCacheAction`이 없습니다.

## 누가 썼는가 {#requester}

FOCUS 1.5는 비용 뒤의 요청자도 기록합니다. `PrincipalId`는 사용자, `CredentialId`는 API 키의 공개된 ID(키 자체는 절대 아님), `RequesterDetails`는 이들을 설명하는 JSON 배열이며 키의 표시 이름을 담습니다. CloudBridge는 다음 내보내기에서 이 값들을 장부의 `principal_id`, `credential_id`, `requester_details` 열에 채웁니다:

- 사용자 또는 API 키로 묶은 OpenAI 내보내기;
- API 키로 묶은 Anthropic 내보내기.

DeepSeek 내보내기에는 마스킹된 키와 그 이름만 있고, FOCUS는 이를 식별자로 허용하지 않으므로 그 행에는 아무 값도 없습니다.

## 값의 출처 {#sources}

- **OpenAI, Anthropic, DeepSeek, Model Studio, Ark 가져오기.** CloudBridge는 각 내보내기가 보고하는 토큰 유형으로 열을 채웁니다. FOCUS가 요구하는 대로 토큰마다 한 행에서 계산됩니다. OpenAI의 입력 합계에는 캐시된 토큰이 포함되므로 입력 행에서 빼냅니다. 이전 버전의 장부는 처음 열 때 채워집니다. 이 변경 전에 가져온 달은 다시 재생할 때까지(**Accounts → Replay normalization**) OpenAI의 예전 입력 수치를 유지합니다.
- **AWS Data Exports.** FOCUS 내보내기의 자체 열은 AWS가 쓴 그대로 유지됩니다. FOCUS 1.5 이전에 작성된 내보내기에는 `TokenDirection`이 없습니다. 토큰 행의 미터 이름이 어떤 토큰을 세는지 알려 주면 — *cache-read-input-token-count*나 *output-tokens*처럼 — 이름에서 방향과 캐시 동작을 읽습니다. 그렇지 않으면 비웁니다.

[모델](models.md) 페이지는 이 속성들을 읽습니다. 캐시 읽기는 공급자가 미터에 어떤 이름을 붙였든 `TokenCacheAction`의 `Read`입니다.

## 쿼리하기 {#query}

[쿼리](query.md) 페이지는 DuckDB의 JSON 함수로 속성을 읽습니다:

```sql
SELECT json_extract_string(sku_price_details, '$.ModelId') AS model,
       json_extract_string(sku_price_details, '$.TokenCacheAction') AS cache,
       sum(consumed_quantity) AS tokens,
       sum(billed_cost) AS cost
FROM v_charge_normalized
WHERE consumed_unit = 'Tokens'
  AND json_extract_string(sku_price_details, '$.TokenDirection') = 'Input'
GROUP BY ALL
ORDER BY tokens DESC;
```

## 내보내기 {#export}

**Settings → Data → Export as FOCUS**는 모든 비용을 FOCUS 열 이름의 CSV로 쓰며, 토큰 열도 포함되고, 다른 FinOps 도구에서 쓸 수 있습니다. 금액은 각 비용이 청구된 통화로 유지됩니다. CloudBridge가 추가하는 열은 `x_`로 시작합니다(예: `x_CostBasis`). 이 파일은 FOCUS 준수 데이터셋이 아닙니다. 어떤 소스도 보고하지 않는 열 — `ChargeClass`, `PricingCategory` 같은 — 은 비우고, 보고된 금액이 없는 행은 `BilledCost`를 빈 값으로 둡니다. 내보내기는 데스크톱 전용입니다.
