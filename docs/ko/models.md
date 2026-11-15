---
title: "모델별 LLM 토큰 비용"
description: "CloudBridge 모델 페이지: 각 LLM의 토큰당 비용을 지출, 입력·출력·캐시 토큰, 백만 토큰당 혼합 단가, 발견 항목과 함께 봅니다."
---

# 모델

**[English](../models.md)**&emsp;**[中文](../zh/models.md)**&emsp;**[日本語](../ja/models.md)**&emsp;**[Français](../fr/models.md)**&emsp;[문서](index.md)

**Models** 페이지는 헤더에서 고른 기간에 대해 청구서의 LLM 부분을 모델별로 읽습니다. OpenAI, Anthropic, DeepSeek 계정은 항상 나타나고, 다른 소스의 행은 토큰으로 계량되는 사용량이 있을 때 나타납니다. Alibaba Cloud Model Studio, Volcengine, Amazon Bedrock 행처럼요. 모델은 청구서의 FOCUS `ModelId`이거나 가져오기가 지정한 모델입니다. 모델을 지정하지 않는 청구서 — Model Studio나 Ark 같은 — 는 제품으로 묶입니다.

토큰은 공급자가 미터에 붙인 이름이 아니라 FOCUS 속성 `TokenDirection`과 `TokenCacheAction`으로 구분되므로, 같은 종류의 토큰은 어느 청구서에서나 같게 읽힙니다. [FOCUS와 토큰 데이터](focus.md)를 참고하세요.

- 통계 행은 **AI spend**, 총 **tokens**, **blended $/1M**(비용을 전체 토큰으로 나눈 백만 토큰당 값), **cache share** — 프롬프트 캐시에서 읽은 입력 토큰의 비중으로, 전체 입력 토큰 대비이며 캐시 쓰기도 포함 — 를 보여 줍니다.
- **Per model**은 각 모델의 비용과 변화, IN/OUT/CACHE 토큰, 혼합 $/1M, 모델 지출 내 비중을 나열합니다. CACHE는 캐시에서 읽은 토큰입니다. IN은 나머지 입력입니다: 캐시되지 않은 입력, 캐시에 쓴 토큰, 그리고 입력과 출력을 합쳐 세는 청구서에서는 그 합계입니다. 툴팁이 그중 무엇을 담고 있는지 알려 줍니다. 토큰은 있지만 비용이 없는 행도 토큰 열에는 집계됩니다.
- **Tokens per day**는 일별 토큰량을 그립니다.

## 발견 항목 {#findings}

- 어떤 모델의 캐시 읽기가 입력 측의 5% 미만인 경우 — 캐시 가격으로 낼 수 있는 것을 입력 가격으로 내고 있습니다. 입력과 출력을 나누지 않는 청구서에서는 제기하지 않습니다.
- 비용이 발생한 모델이 둘 이상일 때, 한 모델이 모델 지출의 70%를 넘는 경우.
- 지출이 올랐는데 두 기간의 토큰 수로 보아 원인이 사용량이 아니라 단가인 경우.
- 토큰 계량 없이 청구되어 단위 비용을 계산할 수 없는 모델.

Alibaba Cloud와 Volcengine 청구 항목 텍스트 안의 모델 이름은 아직 추출하지 않습니다.
