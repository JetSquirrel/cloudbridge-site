---
title: "Azure 서비스별, 일별 비용"
description: "서비스 주체로 Microsoft Azure 구독을 CloudBridge에 연결합니다. Cost Management에서 실제 비용을 서비스와 요금 유형별로 일별로 가져옵니다."
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[日本語](../ja/azure.md)**&emsp;**[Français](../fr/azure.md)**&emsp;[문서](index.md)

CloudBridge는 구독의 **실제 비용**을 Azure Cost Management에서 읽습니다: 각 서비스가 **하루에** 얼마였는지를 요금 유형별로 나눠서요. 예약 구매, 환불, 세금은 있는 그대로 유지되고 사용량에 더해지지 않으므로, 일회성 구매가 있는 달이 사용량이 세 배가 된 달처럼 보이지 않습니다.

## 구독 연결 {#connect}

CloudBridge는 여러분 계정이 아니라 서비스 주체 — 자체 secret을 가진 앱 등록 — 로 로그인합니다.

1. [Azure 포털](https://portal.azure.com/)에서 **Microsoft Entra ID → App registrations → New registration**을 엽니다. `cloudbridge` 같은 이름을 주고, 폼의 다른 항목은 중요하지 않습니다.
2. 새 등록에서 **Certificates & secrets → New client secret**을 열고 secret의 **Value**를 복사합니다. Secret ID가 아닙니다. 한 번만 표시됩니다.
3. 구독을 열고 **Access control (IAM) → Add role assignment**로 이동합니다. **Cost Management Reader**를 골라 앱에 할당합니다.
4. CloudBridge에서 **Microsoft Azure** 계정을 추가하며 등록의 **Application (client) ID**, secret 값, **Subscription ID**를 입력합니다.

테넌트 ID는 필요하지 않습니다. CloudBridge가 구독이 어느 테넌트에 속하는지 조회합니다. 그 조회가 실패하면 구독을 `tenant-id/subscription-id` 형식으로 입력하세요.

역할 할당은 적용까지 몇 분 걸릴 수 있습니다. 방금 만든 직후 첫 가져오기가 거부되면 잠시 기다렸다가 **Validate**를 다시 클릭하세요.

## 청구서에 표시되는 내용 {#detail}

| 열 | 출처 |
| --- | --- |
| 서비스 | 미터 범주 — *Virtual Machines*, *Storage*, *Bandwidth* |
| 일자 | 사용 날짜 |
| 범주 | 요금 유형에 따른 Usage, Purchase, Credit(환불), Tax 또는 Adjustment |
| 금액 | 실제 비용, 구독의 청구 통화 기준 |

쿼리는 리소스나 리전이 아니라 서비스 기준으로 보고하므로, [비용 귀속](attribution.md)의 리전 분류에서 Azure는 *Other*로 표시되고, [인사이트](insights.md)는 Azure 리소스를 스캔하지 않습니다.

Cost Management의 쿼리 API는 테넌트 단위로 속도 제한이 있습니다. 계정 하나는 가져오는 달마다 쿼리 하나이고, 같은 테넌트의 여러 구독은 이 한도를 공유하며, 제한된 가져오기는 다음 새로 고침에서 다시 시도합니다.

## 이 컴퓨터의 자격 증명 사용 {#system}

`AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_SUBSCRIPTION_ID`가 설정된 컴퓨터 — Azure SDK가 읽는 변수들 — 에서는 **Use this machine's credentials**를 선택하면 CloudBridge가 사본을 보관하지 않고 가져올 때마다 이 변수를 읽습니다. `az login`만으로는 충분하지 않습니다. 로그인한 사용자를 남길 뿐, CloudBridge가 쓸 수 있는 secret을 남기지 않습니다.

CloudBridge가 정확히 어떤 엔드포인트를 호출하는지는 [공급자 권한](permissions.md#azure)을 참고하세요.
