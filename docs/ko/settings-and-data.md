---
title: "설정, 데이터 저장, 보안"
description: "CloudBridge가 무엇을 어디에 저장하는지: DuckDB 장부, 계정, 원본 페이로드와 설정, 그리고 새로 고침 간격, 통화, 백업, 보안."
---

# 설정, 데이터, 보안

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[日本語](../ja/settings-and-data.md)**&emsp;**[Français](../fr/settings-and-data.md)**&emsp;**[Español](../es/settings-and-data.md)**&emsp;**[Deutsch](../de/settings-and-data.md)**&emsp;**[Português](../pt/settings-and-data.md)**&emsp;[문서](index.md)

## 설정 {#settings}

| 설정 | 하는 일 |
| --- | --- |
| Appearance → Theme | 라이트/다크 테마, 실행 간 유지 |
| Appearance → Language | [인터페이스 언어](#language): System, English 또는 简体中文 |
| Reporting → Currency | 모든 합계에 쓸 USD 또는 CNY, 비용은 자체 통화 유지 |
| Refreshing → Refresh interval | 한 달을 다시 가져오기까지 6, 12, 24(기본), 48시간 |
| Background | [로그인 시 시작, 백그라운드 새로 고침, 알림](background.md) |
| Data → Export as FOCUS | 모든 비용을 FOCUS 열 이름의 CSV로, 다른 FinOps 도구용([자세히](focus.md#export)) |
| Demo data | 12개월 이력이 있는 샘플 계정 다섯 개(AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic)를 불러오거나 지우기 |

**Refresh**는 새로 고침 간격보다 오래된 달을 가져오고, **Force Refresh**는 전부 가져오며 공급자 요금이 발생할 수 있습니다. 둘 다 가져온 달을 덮어쓰지 않습니다. 데모 계정은 `demo-` 접두사를 쓰고 자격 증명이 없으며 새로 고침에서 건너뜁니다.

## 인터페이스 언어 {#language}

CloudBridge 0.9.0 이상은 简体中文로 번역되어 있습니다: 모든 페이지와 대화 상자, 메뉴 막대 패널과 그 메뉴, 시스템 알림까지요. **Settings → Appearance → Language**에서 언어를 고르기 전까지 앱은 시스템 언어를 따르며, 변경은 즉시 적용됩니다. 브라우저 데모는 브라우저 언어를 따르며 사이드바 하단에 전환 스위치가 있습니다.

- 트레이 메뉴는 앱이 다음에 시작될 때 새 언어를 반영합니다.
- 알림은 발동할 때의 언어를 유지합니다. 잔액 부족 알림은 예외로, 최신 수치와 현재 언어로 다시 작성됩니다.
- 금액과 통화 형식은 이전과 같습니다.

## 데이터 위치 {#storage}

| 플랫폼 | 위치 |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux(소스 빌드) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — 청구 장부, 각 비용의 원래 통화, [월말 스냅샷](overview.md#snapshots), [청구서](reconciliation.md) 포함;
- `cloudbridge.duckdb` — 계정, 예산, 규칙, 알림 상태;
- `raw/` — 모든 공급자 응답과 가져온 파일을 소스, 계정, 월별로. 매핑 수정 시 추가 요청 없이 다시 읽을 수 있습니다(**Accounts → Replay normalization**);
- `inventory/` 및 `tools/` — 인사이트 스캔 결과와, 설치된 경우 스캐너;
- `config.json` — 통화, 테마, 새로 고침 간격, 백그라운드 설정.

## 백업 {#backups}

데이터베이스를 복사하거나 열기 전에 CloudBridge를 종료하세요. 디렉터리 전체 — 두 데이터베이스, `raw/`, `config.json` — 를 백업하고 앱을 닫은 상태에서 복원하세요. 자격 증명은 백업이 아니라 OS 키링에 있으므로 다른 컴퓨터에서는 다시 입력해야 합니다. 앱 밖에서 장부를 분석하려면 실제 파일이 아니라 사본을 쿼리하세요.

## 보안 {#security}

- 자격 증명은 OS 키링 — macOS 키체인, Windows 자격 증명 관리자, Linux 소스 빌드의 Secret Service — 에 보관되며 데이터베이스와 분리되어 있습니다.
- 앱은 자격 증명을 해당 공급자에 대한 요청에만 사용합니다. CloudBridge에서 키를 쓴다고 그 키가 읽기 전용이 되지는 않습니다: [공급자 권한](permissions.md)을 참고하세요.
- CloudBridge 동기화 서비스도, 텔레메트리도 없습니다. 가져오기는 어떤 공급자 요청도 하지 않습니다.
- **로컬이 곧 암호화는 아닙니다.** 앱은 장부나 원본 파일을 암호화하지 않습니다. 디스크 암호화를 쓰고 백업을 보호하세요.
- 로그, 스크린샷, 샘플 내보내기를 공유하기 전에 자격 증명, 계정 ID, 리소스 이름, 태그를 마스킹하세요.
