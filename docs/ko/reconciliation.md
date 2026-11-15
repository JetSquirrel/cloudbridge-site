---
title: "클라우드 청구서를 청구 장부와 대사하기"
description: "CloudBridge 청구서 대사는 각 공급자의 최종 청구서를 청구서 자체 통화로 장부 또는 고정된 스냅샷과 비교하고, 무엇을 확인해야 하는지 알려 줍니다."
---

# 청구서 대사

**[English](../reconciliation.md)**&emsp;**[中文](../zh/reconciliation.md)**&emsp;**[日本語](../ja/reconciliation.md)**&emsp;**[Français](../fr/reconciliation.md)**&emsp;**[Español](../es/reconciliation.md)**&emsp;**[Deutsch](../de/reconciliation.md)**&emsp;**[Português](../pt/reconciliation.md)**&emsp;[문서](index.md)

**Reconciliation** 페이지는 한 가지 질문에 답합니다: 각 공급자의 최종
청구서가 CloudBridge가 가져온 것과 일치합니까? CloudBridge 0.9.0 이상이
필요합니다.

청구서 자체 통화로 된 권위 있는 청구 비용만 비교하므로, 환율이 차이를 가릴
수 없습니다. 청구서는 비용과 별도로 저장되며 비용을 절대 바꾸지 않습니다.

## 청구서 추가 {#add}

- **Enter total**은 청구서 하나를 기록합니다. **Total**은 청구서의 최종
  금액입니다. 세금, 크레딧, 조정은 청구서가 표시하는 그대로입니다. 합계에
  더해지지 않고 차이를 설명하는 데만 도움이 됩니다. 크레딧은 0 또는 음수로
  입력하세요.
- **Import invoice CSV**는 여러 개를 한 번에 읽으며 데스크톱에서만 됩니다. 한
  줄이라도 잘못되면 아무것도 가져오지 않고, 오류가 그 줄을 지목합니다.

CSV에는 헤더 행이 필요합니다:

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

`tax`부터의 열은 선택 사항입니다. `billing_period`는 `YYYY-MM`이고,
`currency`는 세 글자 코드이며, 금액은 천 단위 구분 기호가 없는 순수한
숫자입니다. 모든 행은 계정 중 하나를 지정해야 합니다.

계정의 비용이 둘 이상의 청구 계정에 걸쳐 있으면, 청구서의 billing account ID를
설정해 올바른 청구 계정과 비교되게 하세요.

## 결과 읽기 {#status}

| 상태 | 의미 |
| --- | --- |
| Matched | 청구서와 장부가 그 통화의 허용 오차 안에서 일치합니다 |
| Difference | 일치하지 않습니다. 행이 차이와 다음에 확인할 것을 보여 줍니다 |
| Cannot verify | 아직 공정하게 비교할 것이 없으며, 행이 그 이유를 말합니다 |
| Missing evidence | 그 달에 청구된 비용은 있지만 청구서가 없어 아직 확인하지 않았습니다 |

어떤 달은 **Cannot verify**로 읽힙니다. 예를 들어 아직 끝나지 않았거나, 장부에
청구서 통화의 비용이 없거나, 모든 비용이 금액 없는 사용량인 경우입니다.
파생되거나 추정된 금액은 장부 수치에서 제외됩니다.

행을 열면 비용 범주별 분석, 청구서의 세부 정보, 그리고 확인할 것 — 한쪽에만
있는 세금, 늦게 도착한 크레딧이나 조정, 그 달의 일부만 다루는 내보내기, 다른
달에 맞는 합계 — 을 볼 수 있습니다.

## 스냅샷과 비교 {#snapshot}

**Compare with**는 현재 장부 또는 [월말
스냅샷](overview.md#snapshots)을 고르게 하므로, 이후 새로 고침이 무엇을
바꾸든 마감한 그 달 그대로를 기준으로 청구서를 확인할 수 있습니다.

청구서를 삭제하면 그 기록만 제거됩니다. 장부와 스냅샷은 그대로 남습니다.
