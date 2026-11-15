---
title: "흔한 CloudBridge 문제 해결"
description: "CloudBridge에서 흔한 문제의 해결법: 키체인 요청, AWS AccessDenied, 빈 개요, SmartScreen, Windows의 콘솔 창, 가져오기 오류, 발동하지 않은 알림."
---

# 문제 해결

**[English](../troubleshooting.md)**&emsp;**[中文](../zh/troubleshooting.md)**&emsp;**[日本語](../ja/troubleshooting.md)**&emsp;**[Français](../fr/troubleshooting.md)**&emsp;[문서](index.md)

## macOS가 키체인 접근을 요청합니다 {#keychain}

저장된 자격 증명은 CloudBridge 자체 파일이 아니라 OS 키링에 있으므로, 앱이 자격 증명을 읽을 때 macOS가 CloudBridge가 해당 키체인 항목을 쓸 수 있는지 물을 수 있습니다. **Always Allow**를 클릭하면 새로 고침마다 묻지 않고, **Allow**를 클릭하면 매번 묻습니다. **Deny**를 클릭하면 앱이 자격 증명을 읽지 못해, 접근을 허용할 때까지 그 계정의 가져오기가 실패합니다.

## AWS가 AccessDenied를 보고합니다 {#aws-access-denied}

키 인증은 통과했지만 그 사용자에게 `ce:GetCostAndUsage` 권한이 없습니다. 키를 소유한 IAM 사용자에 [Cost Explorer 정책](aws.md#cost-explorer)을 연결하세요. 조직의 서비스 제어 정책도 Cost Explorer를 거부할 수 있고, AWS Organization에서 멤버 계정은 관리 계정이 허용할 때만 Cost Explorer 데이터를 봅니다.

## 계정을 추가했는데 개요가 비어 있습니다 {#empty-overview}

- **아직 가져온 것이 없습니다.** 개요에서 **Refresh**를 클릭하세요. 파일 가져오기 소스(Volcengine, OpenAI, Anthropic)는 가져올 것이 없으므로 그 행의 **Import**를 쓰세요.
- **공급자가 아직 보고하지 않았습니다.** 공급자는 비용을 지연을 두고 게시합니다. AWS Cost Explorer는 최대 약 24시간까지 늦을 수 있으므로, 새로 만든 계정이나 오늘의 지출이 곧바로 나타나지 않을 수 있습니다. Cost Explorer 요청 요금이 발생할 수 있는 Force Refresh 대신 나중에 다시 시도하세요.
- **기간이 너무 좁습니다.** 월초에는 **MTD**에 데이터가 거의 또는 전혀 없을 수 있습니다. **30d** 또는 **12m**으로 바꾸세요.
- **잔액만 보고하는 소스입니다.** DeepSeek의 API는 지출이 아니라 잔액을 보고합니다. 지출 상세는 사용량 다운로드를 가져오세요.

## 계정 새로 고침이 계속 실패합니다 {#refresh-failing}

메뉴 막대 패널과 개요가 실패한 계정과 그 이유를 알려 줍니다. 실패한 계정은 15분 뒤, 그다음 30분 뒤에 재시도하고, 두 배씩 늘려 새로 고침 간격까지 갑니다. 실패하기 시작하면 알림이 알려 줍니다. 공급자가 응답했지만 CloudBridge가 결과를 저장하지 못한 경우 — 예를 들어 디스크가 가득 찬 경우 — 에는 새로 고침 간격 안에서 그 달을 다시 가져오지 않으므로 같은 데이터에 두 번 비용을 내지 않습니다. **Force Refresh**는 즉시 재시도합니다. [메뉴 막대와 백그라운드](background.md#failures)를 참고하세요.

## Windows SmartScreen이 앱을 막습니다 {#smartscreen}

Windows 빌드는 코드 서명이 없으므로 SmartScreen이 *Windows protected your PC*를 표시합니다. 파일이 공식 [Releases](https://github.com/JetSquirrel/cloudbridge/releases) 페이지에서 온 것인지 확인한 뒤 **More info**, **Run anyway**를 차례로 클릭하세요.

## Windows에서 앱과 함께 콘솔 창이 열립니다 {#windows-console}

0.7.1까지의 Windows 릴리스는 CloudBridge 옆에 검은 콘솔 창을 열고, `.exe`에는 CloudBridge 아이콘이 아니라 일반 아이콘이 표시됩니다. 그 콘솔을 닫으면 알림 영역 아이콘을 포함해 CloudBridge가 종료되므로 닫지 말고 최소화하세요. 이후 릴리스는 콘솔을 열지 않고 `.exe`, 제목 표시줄, 작업 표시줄에 자체 아이콘을 담습니다.

## Windows에서 모든 쿼리가 실패합니다 {#windows-query}

Windows의 0.8.0에서는 쿼리 페이지가 장부 파일을 두 번째로 열기 때문에 쿼리 페이지의 모든 쿼리가 IO 오류로 멈춥니다. CloudBridge 0.9.0이 이를 고칩니다. 데이터는 영향을 받지 않습니다.

## 스캐너 설치가 중간에 멈춥니다 {#scanner-install}

인사이트 스캐너는 약 45MB 다운로드입니다. 0.8.0에서는 연결이 도중에 끊기면 *io: unexpected end of file*과 함께 설치가 멈춥니다: **Set up and scan**을 다시 클릭하세요. 0.9.0부터는 CloudBridge가 끊기거나 시간 초과된 다운로드 또는 서버 오류를 스스로 최대 세 번 재시도합니다.

## 가져오기 오류 {#import-errors}

- **"not UTF-8 text"** — Alibaba Cloud와 Volcengine 콘솔은 GBK 내보내기를 만들 수 있습니다. UTF-8로 다시 내보내거나, 가져오기 전에 파일을 CSV UTF-8로 저장하세요.
- **열을 인식할 수 없음** — 파서는 중국어·영어 내보내기와 공급자 필드 이름의 알려진 별칭을 매칭합니다. 형식이 바뀌었다면 이슈에 오류와 열 헤더를 보고하세요. 민감한 값은 마스킹하고, 마스킹하지 않은 청구서를 첨부하지 마세요.
- **가져온 뒤 어떤 달이 줄었음** — 가져오기는 그 계정에서 파일이 포함하는 모든 달을 교체하므로, 제품으로 필터링한 내보내기는 그 제품만 남깁니다. 필터링하지 않은 전체 청구서를 다시 가져오세요.
- **토큰 수는 있는데 지출이 없음** — 사용량 내보내기에는 금액이 없습니다. 대신 비용 내보내기를 가져오세요. DeepSeek는 `amount-*.csv`가 아니라 내려받은 ZIP을 그대로 가져오세요.

## Cloudflare 스캔이 거부됩니다 {#cloudflare-scan}

스캔은 두 가지 중 무엇이 일어났는지 알려 줍니다. *Cloudflare did not accept this account's API token*은 토큰이 틀렸거나 만료되었다는 뜻이므로 Accounts 페이지에서 확인하세요. *The token cannot read …*는 토큰은 유효하지만 어떤 서비스의 Read 권한이 없다는 뜻이므로 [Cloudflare](cloudflare.md#insights)에 나열된 권한을 추가하세요. 그 권한이 없는 토큰도 청구서는 읽습니다.

## 알림이 발동하지 않았습니다 {#alert-silent}

- **Account budget 규칙에 측정할 예산이 없습니다.** 이 규칙은 **Monthly budget**이 없는 계정에서는 임계값 유형이 무엇이든 아무 일도 하지 않습니다. Rules 페이지에서 예산을 설정하세요.
- **지출이 0에서 시작했습니다.** 비용 성장 이상 규칙은 서비스를 자기 자신의 지난 7일과 비교하므로, 비용이 0이던 서비스에는 기준선이 없어 절대 발동하지 않습니다. 월말 예측에 기반한 예산 규칙이 그 경우를 다룹니다: [폭주 조기 발견](cloudflare.md#runaway)을 참고하세요.
- **그날이 아직 장부에 없습니다.** 규칙은 가져온 데이터로 실행됩니다. 백그라운드 새로 고침은 새로 고침 간격마다 계정을 한 번 가져오며, CloudBridge가 실행 중일 때만 그렇습니다. [메뉴 막대와 백그라운드](background.md)를 참고하세요.
- **알림이 꺼져 있거나**, 앱이 시작될 때 그 알림이 이미 열려 있었습니다. 어느 쪽이든 열려 있는 알림은 알림 페이지에 나열됩니다.

## 그래도 해결되지 않으면 {#help}

문서가 답하지 못하는 질문이 있나요?
[이슈를 열어 주세요](https://github.com/JetSquirrel/cloudbridge/issues).
