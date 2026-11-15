---
title: "Cost Explorer 또는 FOCUS로 AWS 비용 추적"
description: "한 가지 작업만 담은 IAM 정책으로 Cost Explorer를 통해, 또는 리소스 수준 행을 위해 S3의 FOCUS Data Export를 통해 AWS 계정을 CloudBridge에 연결합니다."
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[日本語](../ja/aws.md)**&emsp;**[Français](../fr/aws.md)**&emsp;[문서](index.md)

AWS 계정은 두 가지 방식 중 하나로 장부에 들어옵니다. **Cost Explorer**는 빠른 방법입니다: 액세스 키와 한 가지 작업만 담은 정책이면 청구서가 서비스별·일별 비용으로 들어옵니다. S3의 **Data Export**는 자세한 방법입니다: 모든 행에 리소스 ID, 태그, 연결된 계정이 있고, [인사이트](insights.md)가 리소스에 가격을 매기려면 바로 이것이 필요합니다.

## Cost Explorer {#cost-explorer}

1. [IAM 콘솔](https://console.aws.amazon.com/iam/)을 열고 **Users**에서 **Create user**를 클릭합니다. 콘솔 접근 권한은 필요 없습니다.
2. 새 사용자에서 **Add permissions → Create inline policy**를 고르고 JSON 편집기로 전환한 뒤 아래 정책을 붙여 넣습니다([aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)으로도 받을 수 있습니다).
3. 사용자의 **Security credentials** 탭을 열고 **Create access key**를 클릭합니다. Access Key ID와 Secret Access Key를 복사하세요. AWS는 secret을 한 번만 보여 줍니다.
4. CloudBridge에서 그 키 쌍으로 계정을 추가합니다.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

이 정책은 CloudBridge가 호출하는 유일한 Cost Explorer 작업인 `ce:GetCostAndUsage`만 부여합니다. 키 검증에는 별도 권한이 필요 없는 STS `GetCallerIdentity`를 씁니다. 세션 토큰이 필요한 임시 자격 증명은 지원하지 않습니다. 이유와 범위를 좁히는 방법은 [공급자 권한](permissions.md#aws)에 있습니다.

### 비용 {#cost}

Cost Explorer는 요청당 과금합니다. 새로 고침 한 번은 계정마다 두 달 — 지난달과 이번 달 — 을 요청하고 각각 한 번이며, 달이 커서 Cost Explorer가 페이지로 나눠 반환하면 요청이 더 늘어납니다(최대 20페이지). 새로 고침 간격 때문에 백그라운드 일정은 간격마다 한 번만 새로 고침하므로, 기본값인 24시간이면 계정 하나에 하루 두 번 정도의 요청이 듭니다. AWS가 응답했지만 CloudBridge가 저장하지 못한 가져오기는 그 간격 안에서 반복하지 않습니다. **Force Refresh**는 이 모든 것을 우회하며, 더 쓸 수 있는 유일한 방법입니다. 현재 요율은 AWS 가격표를 확인하세요.

## S3의 Data Export {#data-exports}

CloudBridge는 AWS Data Export(CUR 2.0, *FOCUS 1.2 with AWS columns* 형식)를 그것이 전달되는 S3 bucket에서 읽을 수 있습니다. 내보내기의 URI — `s3://bucket/prefix` — 를 계정 폼의 **Data export S3 URI** 필드에 넣으면, Refresh가 Cost Explorer 대신 거기서 읽습니다.

- **Parquet 또는 gzip 압축 CSV**, 내보내기가 전달하도록 설정된 형식 그대로.
- **한 달은 한 번만 계산됩니다.** 해당 기간의 manifest가 지정한 파일만 읽으므로, 모든 전달물을 보관하는 내보내기라도 한 달을 한 번만 셉니다.
- **전달되지 않은 것은 0이 아닙니다.** 내보내기가 아직 쓰지 않은 기간은 건너뛰며, 빈 달로 저장하지 않습니다.
- **변경이 없으면 다시 내려받지 않습니다.** 파일의 key, 크기, ETag를 먼저 지난 가져오기와 비교합니다. AWS가 전달을 마친 달은 새로 고침마다 목록 조회 한 번과 manifest 읽기 한 번만 듭니다.
- **지불자 계정의 내보내기는 멤버 계정별로 나뉩니다.** 각 행은 청구된 연결 계정을 그대로 유지합니다.

Cost Explorer 정책은 S3 접근 권한을 **부여하지 않습니다**: [공급자 권한](permissions.md#aws-s3)을 참고하세요. S3 저장 및 요청 요금은 그대로 부과됩니다.

## 리소스 스캔 {#insights}

[인사이트](insights.md)는 같은 액세스 키로 AWS 계정을 스캔하며 읽기만 합니다. 이를 위해 키에는 리소스 읽기 권한이 필요하며, 예를 들어 AWS `ReadOnlyAccess` 관리형 정책이 있습니다.
