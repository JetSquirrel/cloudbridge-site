---
title: "BigQuery 청구 내보내기로 보는 Google Cloud 비용"
description: "청구 계정의 BigQuery 내보내기로 Google Cloud를 CloudBridge에 연결합니다. 서비스, SKU, 프로젝트, 리전별 일별 비용을 크레딧과 분리해 보여 줍니다."
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[日本語](../ja/google-cloud.md)**&emsp;**[Français](../fr/google-cloud.md)**&emsp;[문서](index.md)

Google Cloud에는 "이번 달에 얼마 나왔나"에 답하는 API가 없습니다. 청구서는 청구 계정이 BigQuery 데이터셋에 쓰는 내보내기이므로, CloudBridge는 그것을 읽습니다: 달마다 쿼리 한 번으로 서비스, SKU, 프로젝트, 리전별 **일별** 비용을 냅니다. 크레딧 — 무료 등급, 약정 사용, 프로모션 — 은 별도 행으로 돌아오므로 사용량은 크레딧 전 비용 그대로 남습니다.

## 내보내기 켜기 {#export}

내보내기는 켠 날부터의 데이터를 담으므로, CloudBridge를 설치하기 전이라도 이것을 먼저 하세요.

1. Google Cloud 콘솔에서 **Billing → Billing export → BigQuery export**를 엽니다.
2. **Standard usage cost** 아래에서 **Edit settings**를 클릭하고 프로젝트를 고른 뒤 데이터셋을 만듭니다(예: `billing`). 그리고 저장합니다.
3. 첫 행이 도착하면 — 하루 안에 — 데이터셋에 `gcp_billing_export_v1_` 뒤에 청구 계정 ID가 붙은 테이블이 생깁니다. BigQuery에서 그것을 열고 **Copy ID**를 사용하세요. CloudBridge가 요구하는 *Billing export table*이 바로 이것이며, 예를 들면 `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`입니다.

## CloudBridge에 키 주기 {#connect}

1. 내보내기 데이터셋의 프로젝트에서 **IAM & Admin → Service accounts**를 열고 서비스 계정을 만듭니다(예: `cloudbridge`).
2. 프로젝트에 **BigQuery Job User**를 부여해 쿼리를 실행할 수 있게 하고, 내보내기 데이터셋에 **BigQuery Data Viewer**를 부여해 쿼리가 테이블을 읽을 수 있게 합니다.
3. 서비스 계정을 열고 **Keys → Add key → Create new key → JSON**을 진행합니다. 내려받은 파일은 사적인 곳에 보관하세요.
4. CloudBridge에서 **Google Cloud** 계정을 추가하며 키 파일의 **경로**와 청구 내보내기 테이블을 입력합니다.

CloudBridge는 키가 아니라 경로를 보관합니다. 파일은 가져올 때마다 읽히므로 키 교체는 파일 교체로 끝납니다. `gcloud auth application-default login`이 만드는 자격 증명 파일도 그 자리에 쓸 수 있고, **Use this machine's credentials**와 함께 `GOOGLE_APPLICATION_CREDENTIALS`를 쓰는 방법도 됩니다.

## 청구서에 표시되는 내용 {#detail}

| 열 | 출처 |
| --- | --- |
| 서비스 | `service.description` — *Compute Engine*, *Cloud Storage* |
| 설명 | SKU — *N2 Instance Core running in Americas* |
| 프로젝트 | `project.id` 및 `project.name` |
| 리전 | `location.region` |
| 일자 | 사용일 |
| 범주 | `cost_type`에 따른 Usage, Tax 또는 Adjustment, 크레딧은 Credit |

한 달은 Google Cloud 청구서에서처럼 **청구 월**입니다. 늦게 청구된 사용량은 이전 달에 실행되었더라도 청구된 달에 들어갑니다.

쿼리는 내보내기 테이블 전체를 읽습니다. 월별 무료 한도를 넘으면 BigQuery의 종량제 요금이 적용됩니다. 청구 내보내기는 보통 그보다 훨씬 작지만, 내보내기가 도는 동안 계속 커집니다. [인사이트](insights.md)는 Google Cloud 리소스를 스캔하지 않습니다.

CloudBridge가 정확히 어떤 엔드포인트를 호출하는지는 [공급자 권한](permissions.md#google-cloud)을 참고하세요.
