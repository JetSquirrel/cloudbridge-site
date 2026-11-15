---
title: "유휴 AWS 및 Cloudflare 리소스 찾기"
description: "CloudBridge 인사이트는 AWS와 Cloudflare의 읽기 전용 스캔을 청구서와 나란히 놓습니다: 중지된 인스턴스, 유휴 주소, 주인 없는 리소스와 그 비용."
---

# 인사이트

**[English](../insights.md)**&emsp;**[中文](../zh/insights.md)**&emsp;**[日本語](../ja/insights.md)**&emsp;**[Français](../fr/insights.md)**&emsp;**[Español](../es/insights.md)**&emsp;**[Deutsch](../de/insights.md)**&emsp;**[Português](../pt/insights.md)**&emsp;[문서](index.md)

인사이트는 청구서를 실제로 돌아가는 것과 비교하고, 살펴볼 만한 항목을 이번 기간 청구서를 기준으로 가격을 매겨 나열합니다.

## 설정 및 스캔 {#scan}

**Set up and scan**을 클릭합니다. 처음에는 CloudBridge가 리소스 스캐너 [corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist)를 설치하기 전에 물어봅니다. 오픈 소스이며 우리가 관리하는 포크로 약 45MB이고, CloudBridge 자체 데이터 폴더에 보관하며 앱에 내장된 체크섬과 대조합니다. 그다음 스캔합니다:

- 각 **AWS** 계정을 액세스 키로, AWS가 기본 활성화한 모든 리전 또는 직접 고른 리전에서;
- 각 **Cloudflare** 계정을 API 토큰으로.

스캔은 읽기만 합니다 — 리소스를 나열하고 아무것도 바꾸지 않습니다 — 하지만 자격 증명에는 리소스 읽기 권한이 필요합니다: [AWS](aws.md#insights)와 [Cloudflare](cloudflare.md#insights)를 참고하세요. **Scan again**은 인벤토리를 새로 고칩니다. 스캔은 macOS(Apple silicon) 또는 Windows의 데스크톱 앱에서 필요합니다.

## 찾아내는 것 {#findings}

AWS의 경우:

- 볼륨이 계속 과금되는 **중지된 인스턴스**;
- **유휴 공인 주소** — 할당되었지만 아무것에도 연결되지 않은 IPv4 주소;
- **주인 없는 리소스** — 소유자 태그(`owner`, `team`, `project`, `cost-center`, `business_line`)가 없고 이를 관리하는 스택이나 앱도 없음;
- **청구되었지만 스캔에 없는 것** — 스캔이 다룬 리전에서.

가격을 매기려면 리소스 수준 청구서가 필요합니다. AWS 계정을 [Data Export](aws.md#data-exports)에 연결한 경우입니다. 없으면 발견 항목은 나열만 되고 가격은 붙지 않습니다.

Cloudflare의 경우 카드가 스캔이 유형별로 찾은 것 — Workers, R2 bucket, D1 데이터베이스, KV 네임스페이스, zone, Durable Objects — 을 보여 주며, 각 유형과 각 리소스의 청구서 내 비중과 이번 기간 사용량을 비용이 큰 순서로 표시합니다. [청구서가 리소스별로 분할](cloudflare.md#split)되어 있으면, 폭주하는 네임스페이스나 bucket이 이름으로 드러나는 곳이 바로 여기입니다.

## 보안 구성 {#security}

CloudBridge 0.9.0부터 별도 섹션이 SSH 또는 RDP를 인터넷 전체(`0.0.0.0/0` 또는 `::/0`)에 여는 AWS 보안 그룹을 표시합니다. 스캔 결과를 읽기만 하고 클라우드의 무엇도 바꾸지 않으며 추가 피드도 필요 없습니다. 규정 준수 점검이나 전체 보안 검토가 아니며, 그 발견 항목은 비용 발견 항목과 절대 합산되지 않습니다.

각 그룹은 **Finding**, **Not evaluated**, **Evaluated, no finding** 중 하나로 읽힙니다. 행을 열면 스캔이 본 규칙, 그것이 중요한 이유, 직접 확인할 것을 볼 수 있습니다. 공개 규칙이 노출의 증거는 아닙니다. 그 그룹이 실제로 무언가에 연결되어 있는지 확인하세요.

**Not evaluated**는 인바운드 규칙을 읽을 수 없었다는 뜻이지 그 그룹이 안전하다는 뜻이 아닙니다. 스캔이 없거나, 부분 스캔이거나, 그룹을 하나도 나열하지 않은 스캔이면 이 섹션은 깨끗하다고 읽히는 대신 그 사실을 알려 줍니다.

## 요약 먼저 {#summary}

모든 카드는 리소스 유형별로 열리며 개수와 비용이 표시됩니다. 유형을 클릭하면 리소스가 50개씩 **Show more**와 함께 나열되고, 다시 클릭하면 닫힙니다. 계정이 커도 요청하기 전까지는 유형당 한 행으로 유지됩니다.

각 발견 항목은 복사 버튼이 있는 전체 ID, 계정, 비용으로 가는 링크를 보여 주므로 청구서와 대조해 확인할 수 있습니다.
