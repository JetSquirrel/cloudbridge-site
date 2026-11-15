---
title: "DeepSeek 잔액과 모델별 API 지출"
description: "API 키로 선불 잔액을 위해, 그리고 사용량 다운로드를 가져와 일별·모델별 지출을 위해 DeepSeek를 CloudBridge에 연결합니다."
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[日本語](../ja/deepseek.md)**&emsp;**[Français](../fr/deepseek.md)**&emsp;[문서](index.md)

DeepSeek의 API는 지출 내역이 아니라 **잔액** — 지급분과 충전분 — 을 보고합니다. 지출 상세는 콘솔의 다운로드를 가져오세요.

## 잔액 API {#api}

1. [platform.deepseek.com](https://platform.deepseek.com/)을 열고 API 키를 만듭니다.
2. 그 키로 CloudBridge에 계정을 추가합니다.

잔액은 **Balance floor** 규칙에 쓰입니다([알림, 규칙, 예산](alerts.md) 참고). 잔액 조회에 쓰는 키가 유료 모델 요청도 승인할 수 있으므로, 키를 잘 보호하고 권한을 검토하세요 — [공급자 권한](permissions.md#deepseek)을 참고하세요.

## 사용량 다운로드 {#export}

콘솔에서 **Usage → Download**로 이동해 ZIP을 내려받은 그대로 가져오세요. CloudBridge는 그 안의 `cost-*.csv`를 읽고, `amount` 열에 금액이 아니라 토큰 수가 들어 있는 `amount-*.csv`는 무시합니다. [청구서 파일 가져오기](bill-import.md)를 참고하세요.
