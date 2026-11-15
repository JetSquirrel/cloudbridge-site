---
title: "공급자별 최소 권한 청구 자격 증명"
description: "AWS Cost Explorer와 S3, Azure Cost Management, Google Cloud BigQuery, Alibaba Cloud RAM, Cloudflare API 토큰, DeepSeek 키에 대해 CloudBridge가 필요로 하는 최소 권한 자격 증명."
---

# 공급자 권한

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[日本語](../ja/permissions.md)**&emsp;**[Français](../fr/permissions.md)**&emsp;[문서](index.md)

채널에 필요한 최소 권한만 가진 전용 자격 증명을 사용하세요. 앱이 읽기 전용으로 동작한다고 해서 제한 없는 키가 읽기 전용이 되지는 않습니다. 키로 무엇을 할 수 있는지는 공급자에 연결된 정책이 결정합니다. 청구서를 읽기 위해 루트 계정 자격 증명을 쓰거나 관리자 권한을 부여하지 마세요.

CloudBridge는 자격 증명을 OS 키링에 저장하고, 해당 공급자에 대한 요청을 인증하는 데만 사용합니다. CloudBridge 동기화 서비스도, 텔레메트리도 없습니다. 실제 키, 자격 증명 파일, 마스킹하지 않은 청구서 내보내기를 공개 이슈, 로그, 스크린샷, 풀 리퀘스트에 절대 올리지 말고, 노출된 키는 폐기하세요.

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)은 CloudBridge가 사용하는 Cost Explorer 작업인 `ce:GetCostAndUsage`만 부여합니다. 내보내기 URI 없이 키를 검증할 때는 STS `GetCallerIdentity`를 쓰며, 이는 [별도 권한이 필요 없습니다](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html). 이 정책은 Cost Explorer 읽기를 위해 `Resource: "*"`를 유지하며, 다른 어떤 서비스에도 접근 권한을 주지 않습니다.

1. [IAM 콘솔](https://console.aws.amazon.com/iam/)에서 템플릿으로 고객 관리형 정책을 만들거나, 사용자에게 인라인으로 추가합니다.
2. 관련 없는 광범위한 권한이 없는 전용 IAM 사용자에 연결합니다.
3. 그 사용자의 액세스 키를 만들어 CloudBridge에 입력합니다.
4. 조직 정책에 따라 키를 교체합니다.

액세스 키 ID와 secret 쌍만 허용되며, 세션 토큰이 필요한 임시 자격 증명은 허용되지 않습니다. 조직 정책과 계정 수준 청구 설정이 여전히 접근을 제한할 수 있습니다. Cost Explorer 요청에는 요금이 발생할 수 있습니다 — [비용](aws.md#cost)을 참고하세요.

## S3에서 AWS Data Exports {#aws-s3}

Cost Explorer 정책은 내보내기 bucket에 대한 접근 권한을 **부여하지 않습니다**. `s3:ListBucket`은 내보내기 bucket과 prefix로 범위를 좁히고, `s3:GetObject`는 그 prefix 아래 객체로 좁히세요. 고객 관리형 KMS 키로 암호화된 객체는 `kms:Decrypt`와 일치하는 키 정책이 더 필요할 수 있으며, bucket 정책과 조직 제한이 읽기를 허용해야 합니다. CloudBridge는 기존 내보내기를 읽으며, 내보내기를 만들거나 객체를 쓰는 권한은 필요 없습니다. S3 저장 및 요청 요금은 그대로 부과됩니다.

## AWS 리소스 스캔 {#aws-scan}

[인사이트](insights.md)는 같은 키로 스캔하며 리소스를 나열하고 설명만 합니다. 키에 리소스 읽기 권한을 주세요. `ReadOnlyAccess` 관리형 정책이나, 스캔하려는 서비스를 다루는 더 좁은 읽기 전용 정책이면 됩니다.

## Alibaba Cloud {#alibaba-cloud}

청구 API의 경우 `AliyunBSSReadOnlyAccess`가 내장된 읽기 전용 청구 정책입니다. 엔드포인트별 사용자 지정 정책보다 넓으므로, 요구 사항에 비추어 범위를 검토하세요.

1. [RAM 콘솔](https://ram.console.aliyun.com/)에서 전용 RAM 사용자를 만듭니다.
2. `AliyunBSSReadOnlyAccess`, 또는 사용하는 청구 작업에 맞춘 범위 지정 사용자 지정 정책을 연결합니다.
3. AccessKey를 만들어 CloudBridge에 입력합니다.

기본 계정의 AccessKey를 사용하지 마세요. 청구서 내보내기 가져오기에는 자격 증명이 필요 없습니다.

## Microsoft Azure {#azure}

서비스 주체 — 클라이언트 secret이 있는 앱 등록 — 에 구독의 내장 **Cost Management Reader** 역할을 부여합니다. 그 역할은 비용 및 사용량 데이터만 읽고 그 밖에는 아무것도 하지 않습니다. 동작하게 하려고 앱에 Reader, Contributor, Owner를 주지 마세요.

| 요청 | 용도 |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`, 인증 없음 | `401` 챌린지에서 구독의 테넌트를 찾습니다. 구독을 `tenant-id/subscription-id`로 입력하면 생략됩니다 |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | 클라이언트 자격 증명 부여 방식으로 Azure Resource Manager용 토큰을 받습니다 |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | 해당 월의 실제 비용을 서비스와 요금 유형별로 일별 조회합니다 |

클라이언트 ID와 구독 ID는 secret이 아닙니다. 클라이언트 secret은 secret이며 OS 키링에 보관됩니다. 조직이 허용하는 가장 짧은 만료를 주고, 교체되면 CloudBridge에서 바꿔 주세요.

## Google Cloud {#google-cloud}

청구 내보내기가 있는 프로젝트의 서비스 계정에, 프로젝트에는 **BigQuery Job User**를, 내보내기 데이터셋에만 **BigQuery Data Viewer**를 부여합니다. 프로젝트에 주면 다른 모든 데이터셋까지 읽게 됩니다.

| 요청 | 용도 |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | 서비스 계정 키로 서명한 어서션으로 토큰을 받습니다 |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | 내보내기 테이블에 대해 달마다 쿼리 작업 하나 |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | 작업 결과의 나머지 페이지 |

쿼리 작업은 테이블이 있는 프로젝트에서 실행되고, 무료 한도를 넘으면 BigQuery 종량제 요율로 그 프로젝트에 청구됩니다. CloudBridge는 키가 아니라 키 파일의 경로를 보관합니다. 파일은 다른 서비스 계정 키처럼 보호하고, 더 쓰지 않게 되면 콘솔에서 키를 삭제하세요. `gcloud auth application-default login`이 만든 사용자 자격 증명 파일도 동작하며, 그 사용자의 권한으로 쿼리합니다.

## Cloudflare {#cloudflare}

사용자 지정 API 토큰을 만들고, **Account Resources**에서 CloudBridge가 읽어야 할 계정 하나로 범위를 제한하세요. Global API Key는 쓰지 마세요. 사용자의 모든 권한을 담고 있습니다.

| 권한 | 용도 | 호출 |
| --- | --- | --- |
| Account → Billing → Read | 청구서 | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | 리소스별 분할 | `POST /graphql` |
| Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1에 대한 Read | 인사이트 스캔 | 스캐너를 통한 계정 API |

첫 번째만 필수입니다. 계정 ID는 secret이 아닙니다 — 요청 경로의 일부입니다. 토큰은 secret이며 다른 자격 증명처럼 OS 키링에 보관됩니다.

## DeepSeek {#deepseek}

API 연동은 [platform.deepseek.com](https://platform.deepseek.com/)의 플랫폼 키로 `GET /user/balance`를 호출합니다. 읽기이지만 **키 자체가 반드시 읽기 전용인 것은 아닙니다**: 다른 곳에서 쓰면 모델 요청을 승인하고 지출을 발생시킬 수 있습니다. 지출 자격 증명으로 취급하고, DeepSeek가 제공하는 제한을 활용하며, 공유하지 마세요. 사용량 다운로드 가져오기에는 키가 필요 없습니다.

## Volcengine, OpenAI, Anthropic {#file-sources}

이 소스들은 로컬 청구서 내보내기만 사용합니다. CloudBridge는 이들에 대해 자격 증명을 요구하지 않으며, 가져오기는 어떤 공급자 요청도 하지 않습니다. API 채널이 실제로 필요해지기 전까지 이들을 위한 관리자 키나 조직 키를 만들지 마세요.
