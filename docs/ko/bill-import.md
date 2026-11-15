---
title: "OpenAI, Anthropic 및 클라우드 청구서 내보내기 가져오기"
description: "Alibaba Cloud, Volcengine, OpenAI, Anthropic, DeepSeek의 청구서 내보내기를 CloudBridge로 가져옵니다. 각 파일의 출처와 추가되는 내용을 정리합니다."
---

# 청구서 파일 가져오기

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[日本語](../ja/bill-import.md)**&emsp;**[Français](../fr/bill-import.md)**&emsp;[문서](index.md)

공급자 콘솔에서 내려받은 청구서 내보내기는 가져오기가 만드는 것과 같은 장부 행으로 파싱됩니다. 합계, 차트, 알림, 비용 귀속 같은 하위 단계에서 가져온 달과 새로 고침으로 받은 달은 구별되지 않습니다. 오히려 더 세밀한 경우가 많습니다. Alibaba Cloud의 청구 API는 Model Studio(百炼)를 한 달에 하나의 숫자로 보고하지만, 내보내기는 모델별로 토큰 수와 함께 보고합니다.

Volcengine, OpenAI, Anthropic은 현재 가져오기 전용입니다. 자격 증명 없이 이름만으로 계정을 추가하고 가져오세요.

| 소스 | 내보내기 출처 | 추가되는 내용 |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio(百炼)는 모델별, 그 밖의 항목은 인스턴스 수준 상세 |
| Volcengine | Billing → Bill Details → Export | Ark(火山方舟)는 엔드포인트 및 토큰 유형별 |
| OpenAI | Usage → Export | 프로젝트 및 모델별 비용 또는 토큰 사용량 |
| Anthropic (Claude) | Usage or Cost → Export | 워크스페이스 및 모델별 비용 또는 토큰 사용량 |
| DeepSeek | Usage → Download | 일별·모델별 지출 — API는 잔액만 보고합니다 |

## 가져오기 {#import}

1. 공급자 콘솔에서 내보내기를 내려받습니다.
2. **Accounts**로 이동해 계정 행의 **Import**를 클릭합니다.
3. 파일을 고릅니다. CloudBridge는 몇 건의 비용을 기록했고 어느 달을 교체했는지 보고합니다.

::: warning 달은 더해지는 것이 아니라 교체됩니다
가져오기는 선택한 계정에서 파일이 포함하는 모든 달을 교체하므로, 두 번 가져와도 비용이 두 배가 되지 않습니다. 전체 청구서를 내보내세요. 제품으로 필터링한 파일은 그 달의 데이터를 그 제품만 남기고 교체합니다. 가져온 달을 갱신하려면 완전하고 수정된 내보내기를 다시 가져오세요. 새로 고침은 Force Refresh를 포함해 가져온 달을 절대 덮어쓰지 않습니다.
:::

## 사용량 내보내기에는 금액이 없습니다 {#usage-exports}

토큰 수는 있지만 금액이 없는 **사용량** 내보내기는 청구 비용 없이, 비용 근거를 *absent*로 기록됩니다. CloudBridge는 토큰 수를 정가로 환산해 추정 지출로 바꾸지 않습니다. **비용** 내보내기는 토큰 열이 정확히 하나만 채워진 경우에만 수량을 보관합니다. 입력 토큰과 출력 토큰은 가격이 달라 하나의 가격 수량이 될 수 없습니다.

## 인코딩 {#encoding}

텍스트 내보내기는 UTF-8이어야 합니다. Alibaba Cloud와 Volcengine 콘솔은 GBK 파일을 만들 수 있으므로, UTF-8로 다시 내보내거나 먼저 *CSV UTF-8*로 저장하세요. 자세한 내용은 [문제 해결](troubleshooting.md#import-errors)을 참고하세요.
