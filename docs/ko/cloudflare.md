---
title: "R2 bucket, Worker, D1별 Cloudflare 비용"
description: "API 토큰으로 Cloudflare를 CloudBridge에 연결합니다. 일별 과금 사용량을 R2 bucket, Workers, D1, Durable Objects로 나눠 봅니다."
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[日本語](../ja/cloudflare.md)**&emsp;**[Français](../fr/cloudflare.md)**&emsp;[문서](index.md)

CloudBridge는 Cloudflare의 과금 사용량을 읽습니다: 서비스별 지출을 **일별로**. 바로 그게 핵심입니다. 루프를 돌기 시작한 Worker나 Durable Object는 월말 청구서가 아니라 다음 날 장부에 나타납니다. 무료 한도 안의 사용량도 비용 0으로 옆에 함께 남습니다. 폭주는 바로 거기서 시작되니까요.

## 계정 연결 {#connect}

1. [Cloudflare 대시보드](https://dash.cloudflare.com/profile/api-tokens)에서 **My Profile → API Tokens → Create Token**으로 이동해 **Create Custom Token**에서 시작합니다.
2. **Account → Billing → Read**를 부여하고, **Account Resources**를 지켜볼 계정으로 제한합니다.
3. 대시보드의 계정 홈 페이지에서 계정 ID를 복사합니다.
4. CloudBridge에서 계정 ID와 토큰으로 계정을 추가합니다.

과금 사용량 API는 종량제(self-serve) 계정만 다루며 알파 API입니다. Enterprise 계정은 대상이 아니라고 보고됩니다. Cloudflare는 구독 시작일을 기준으로 한 주기로 청구하므로, CloudBridge의 각 달력 월은 그 안에 들어오는 날들을 담습니다.

## 리소스별 분할 {#split}

청구서는 서비스에서 멈춥니다 — *R2 Class B operations, 734 on 3 October* — 어느 bucket인지는 알려 주지 않습니다. 토큰에 **Account → Account Analytics → Read**를 추가하면 CloudBridge가 GraphQL Analytics API에 청구서가 지목한 미터의 리소스별 사용량을 물어보고, 그 비중으로 하루의 행을 나눕니다:

| 청구서 | 분할 기준 |
| --- | --- |
| R2 Class A/B 작업, 스토리지 | R2 bucket |
| Workers 요청 및 CPU | Workers(요청 수 기준) |
| D1 읽기/쓰기 행, 스토리지 | D1 데이터베이스 |
| Durable Objects 요청, 기간, 행, 스토리지 | Durable Object 네임스페이스 |

각 부분의 합은 Cloudflare가 청구한 금액과 같고, 추정치로 표시됩니다. 분석은 샘플링되며, 무료 한도는 특정 리소스가 아니라 계정에 속하기 때문입니다. 분석이 나눌 수 없는 미터 — KV, Queues, 인식되지 않는 것 — 나 권한이 없는 토큰의 경우에는 행이 계정 단위로 통째로 남습니다. [인사이트](insights.md)는 리소스별 비중과 이번 기간의 사용량을 보여 줍니다.

## 폭주 조기 발견 {#runaway}

종량제 Cloudflare 계정은 지출 한도에서 멈춰 주지 않으므로, Durable Object 알람이나 루프를 도는 Worker는 돌아가는 동안 계속 과금됩니다. CloudBridge도 그것을 멈출 수는 없습니다. 다만 청구서가 아니라 첫날에 알려 줄 수는 있습니다. 조용한 계정까지 모든 Cloudflare 계정에 이렇게 설정하세요. 아무도 쓰지 않는 프로젝트야말로 아무도 지켜보지 않는 프로젝트입니다:

1. **Rules** 페이지에서 계정에 **Monthly budget**을 지정합니다. 평소 한 달 비용에 여유를 더한 값입니다. 아래 규칙이 그것을 기준으로 측정하며, 예산이 없는 계정에서는 아무 일도 하지 않습니다.
2. **New rule**을 클릭하고 계정에 대해 **Account budget**을 고른 뒤 **Based on**을 **Month-end forecast**로 설정합니다.
3. **Settings → Refreshing**에서 새로 고침 간격을 6시간으로 줄이고, **Open at login**을 켠 채 [메뉴 막대](background.md)에서 CloudBridge를 계속 실행합니다.

예측이 이 방법을 작동하게 만듭니다. 그 달에 지출이 있었던 첫날부터 평균을 내므로, 루프가 시작된 첫날의 지출이 남은 달 전체로 투영되고, 그날을 읽는 첫 새로 고침에서 규칙이 발동합니다.

**cost growth anomaly** 규칙은 이 경우를 잡지 못합니다. 서비스를 자기 자신의 지난 7일과 비교하는데, 비용이 0이던 서비스에는 성장할 기준선이 없습니다. 그래서 잠자던 프로젝트가 루프를 돌며 깨어나는 경우에는 절대 걸리지 않습니다.

알림이 발동하면 Cloudflare 대시보드에서 Worker나 Durable Object를 중지하세요. 토큰에 Account Analytics가 있으면 [인사이트](insights.md)가 각 Worker와 네임스페이스의 청구서 내 비중을 보여 주므로, 원인인 것이 눈에 띕니다.

## 리소스 스캔 {#insights}

[인사이트](insights.md)는 같은 토큰으로 계정을 스캔하며 읽기만 합니다. 이를 위해 같은 계정에 **Read** 권한을 추가하세요: **Account Settings**, **Zone**, **Workers Scripts**, **Workers R2 Storage**, **Workers KV Storage**, **Queues**, **D1**. 이러한 권한이 없는 토큰도 청구서는 읽습니다. 스캔은 무엇이 거부되었는지 알려 줍니다.

CloudBridge가 정확히 어떤 엔드포인트를 호출하는지는 [공급자 권한](permissions.md#cloudflare)을 참고하세요.
