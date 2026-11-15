---
title: "Alibaba Cloud 청구 API와 청구서 가져오기"
description: "읽기 전용 RAM 사용자로 Alibaba Cloud(阿里云)를 CloudBridge에 연결하거나, Model Studio(百炼) 모델별 비용을 위해 청구 상세를 가져옵니다."
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[日本語](../ja/alibaba-cloud.md)**&emsp;**[Français](../fr/alibaba-cloud.md)**&emsp;[문서](index.md)

Alibaba Cloud는 두 경로를 모두 제공합니다. **청구 API**는 제품별 월 합계를 줍니다. **청구 상세 내보내기**는 토큰 수와 함께 Model Studio(百炼)의 모델별 행을 포함한 인스턴스 수준 행을 줍니다. 스스로 최신 상태를 유지하는 계정에는 API를 쓰고, 더 세밀한 내역이 필요할 때는 내보내기를 가져오세요. 가져온 달은 새로 고침으로 덮어쓰지 않습니다.

## 청구 API {#api}

1. [RAM 콘솔](https://ram.console.aliyun.com/)을 열고 API 접근용 RAM 사용자를 만듭니다.
2. 내장 시스템 정책 `AliyunBSSReadOnlyAccess`를 연결합니다.
3. 사용자의 AccessKey를 만듭니다.
4. CloudBridge에서 AccessKey ID와 Secret으로 계정을 추가합니다.

기본 계정의 AccessKey를 사용하지 마세요. 청구 API에는 여기 문서화된 쿼리당 요금이 없으므로 Alibaba Cloud의 현재 약관을 확인하세요. [공급자 권한](permissions.md#alibaba-cloud)을 참고하세요.

## 청구 상세 내보내기 {#export}

콘솔에서 **Expenses and Costs → Bill Details → Export**로 이동해 전체 청구서를 내려받고, 계정 행에서 **Import**를 클릭합니다. 가져오기에는 자격 증명이 필요 없습니다. [청구서 파일 가져오기](bill-import.md)를 참고하세요.
