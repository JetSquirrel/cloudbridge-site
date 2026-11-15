---
title: "CloudBridge 설치하고 첫 청구서 읽기"
description: "macOS 또는 Windows에 CloudBridge를 설치하고, 데모 청구서로 둘러본 뒤, 첫 계정을 추가해 몇 분 만에 첫 청구서를 읽습니다."
---

# 시작하기

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[日本語](../ja/getting-started.md)**&emsp;**[Français](../fr/getting-started.md)**&emsp;[문서](index.md)

CloudBridge는 클라우드와 모델 공급자의 청구서를 청구 API에서든 직접 내려받은 내보내기에서든 여러분의 컴퓨터에 있는 하나의 장부로 읽어 들이고 추세를 그립니다. 가입도, 동기화도, 텔레메트리도 없습니다. 이 페이지는 다운로드에서 첫 청구서까지 안내합니다.

## 1. 설치 {#install}

[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest) 페이지에서 최신 빌드를 내려받습니다:

| 플랫폼 | 파일 |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** `.dmg`를 열고 **CloudBridge**를 **Applications**로 끌어다 놓은 다음 거기서 실행합니다. 릴리스는 Developer ID로 서명되고 공증되었으므로 별도의 우회 없이 열립니다. macOS가 현재 릴리스를 막는다면 [정확한 경고 내용](https://github.com/JetSquirrel/cloudbridge/issues)과 macOS 버전을 알려 주세요. 격리 보호를 해제하는 것을 일상적인 설치 절차로 삼지 마세요.

**Windows.** `.exe`는 코드 서명이 없으므로 SmartScreen이 *Windows protected your PC*와 함께 실행을 막을 가능성이 높습니다. 파일이 공식 Releases 페이지에서 온 것인지 확인한 뒤 **More info**와 **Run anyway**를 클릭하세요. Windows는 그 파일에 대한 선택을 기억합니다. 새 릴리스에서는 다시 묻습니다.

Linux와 Intel Mac 바이너리는 배포하지 않습니다. 소스에서 빌드하려면 Rust 1.95 이상이 필요합니다 — [개발 환경 설정](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup)을 참고하세요:

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. 먼저 둘러보기(원한다면) {#demo}

[브라우저 데모](https://cloudbridge.jetsquirrel.cloud/demo/)는 샘플 청구서로 같은 페이지를 실행합니다. 자격 증명을 보관하지 않고 어떤 공급자에도 접속하지 않으므로, 가져오기와 청구 API에서의 새로 고침, SQL 콘솔은 데스크톱 앱에서만 됩니다.

앱에서 개요가 비어 있으면 **Load demo data**를 제공하고, 아니면 **Settings → Demo data**를 엽니다. 데모 계정은 자격 증명이 없고 새로 고침에서 건너뜁니다. 같은 페이지의 **Clear demo data**가 이들을 제거합니다.

## 3. 계정 추가 {#account}

**Accounts**를 열고 **Add account**를 클릭한 뒤 소스를 고르고 이름을 입력합니다.

| 소스 | 청구서가 들어오는 방식 | 필요한 것 |
| --- | --- | --- |
| Amazon Web Services | 청구 API | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | Cost Management API | 클라이언트 ID + secret + 구독 ID — [Azure](azure.md) |
| Google Cloud | BigQuery 청구 내보내기 | 서비스 계정 키 파일 + 내보내기 테이블 — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | 청구 API 또는 청구서 내보내기 | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | 청구 API | Account ID + API token — [Cloudflare](cloudflare.md) |
| DeepSeek | 잔액 API 또는 청구서 내보내기 | API key — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | 청구서 내보내기 | 없음 |
| OpenAI | 청구서 내보내기 | 없음 |
| Anthropic (Claude) | 청구서 내보내기 | 없음 |

**Save**를 클릭합니다. API 소스는 이번 달과 지난달 청구서를 곧바로 가져오므로, 키가 잘못되었으면 그 가져오기가 실패하는 것으로 드러납니다.

## 4. 청구서 받기 {#bill}

- **API 소스**는 저장할 때 청구서를 가져왔습니다. 개요의 **Refresh**는 새로 고침 간격이 지난 뒤에 다시 가져옵니다.
- **파일 소스** — Volcengine, OpenAI, Anthropic, 그리고 더 세밀한 내역이 필요할 때의 Alibaba Cloud와 DeepSeek — 는 내보내기가 필요합니다: 공급자 콘솔에서 내려받고 계정 행의 **Import**를 클릭하세요. [청구서 파일 가져오기](bill-import.md)를 참고하세요.

## 5. 읽기 {#read}

**Overview**(개요)는 선택한 기간을 보여 줍니다: **MTD**, **30d**, **12m**. 통화는 **Settings → Reporting**에서 USD 또는 CNY를 고릅니다. 여기서부터:

- [개요와 계정](overview.md)이 숫자를 설명합니다.
- [알림, 규칙, 예산](alerts.md)이 지출이 튈 때 알려 줍니다.
- [메뉴 막대와 백그라운드](background.md)가 창을 닫은 뒤에도 이를 계속 실행합니다.

무언가 표시되지 않나요? [문제 해결](troubleshooting.md)을 참고하세요.
