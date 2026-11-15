---
layout: home
title: "CloudBridge 문서 — 청구서를 연결하고, 읽고, 계속 지켜보기"
titleTemplate: false
description: "CloudBridge 문서: AWS, Azure, Google Cloud, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic, DeepSeek 청구서를 하나의 로컬 장부로 읽어 들이고 계속 지켜봅니다."
hero:
  name: CloudBridge 문서
  text: 클라우드와 AI 청구서를, 하나의 장부에.
  tagline: 각 공급자를 연결하고, 돈이 어디로 갔는지 읽고, 감당하기 어려워지기 시작할 때 알림을 받습니다.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/getting-started
    - theme: alt
      text: 데모 체험
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: CloudBridge 소개
      link: https://cloudbridge.jetsquirrel.cloud/ko/
features:
  - title: 청구서 연결
    details: AWS, Azure, Alibaba Cloud, Cloudflare는 각자의 청구 API로, Google Cloud는 BigQuery 청구 내보내기로 연결합니다. Volcengine, OpenAI, Anthropic, DeepSeek는 각 콘솔이 만들어 주는 내보내기로 읽습니다.
    link: /ko/aws
    linkText: 소스
  - title: 어디로 갔는지 읽기
    details: 월초부터 오늘까지, 최근 30일, 최근 12개월을 보는 개요와 비즈니스 라인별 비용 귀속, 모델별 토큰 경제성, 그리고 장부에 대한 SQL.
    link: /ko/overview
    linkText: 개요와 계정
  - title: 줄일 곳 찾기
    details: 인사이트는 청구서를 AWS와 Cloudflare의 읽기 전용 리소스 스캔과 비교하고, 청구서를 기준으로 가격을 매겨 유형별로 요약합니다.
    link: /ko/insights
    linkText: 인사이트
  - title: 계속 지켜보기
    details: 규칙, 예산, 알림을 두고, 창을 닫아도 메뉴 막대에서 실행되며 로그인 시 시작합니다.
    link: /ko/background
    linkText: 메뉴 막대와 백그라운드
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ja/">日本語</a>&emsp;<a href="../fr/">Français</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/ko/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## 길 찾기

| 하고 싶은 일 | 읽을 문서 |
| --- | --- |
| CloudBridge를 설치하고 첫 청구서 보기 | [시작하기](getting-started.md) |
| 설치 전에 먼저 둘러보기 | [브라우저 데모](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Cost Explorer 또는 Data Export로 AWS 연결 | [AWS](aws.md) |
| Azure 구독 연결 | [Microsoft Azure](azure.md) |
| BigQuery 청구 내보내기로 Google Cloud 연결 | [Google Cloud](google-cloud.md) |
| Alibaba Cloud 연결 | [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare 연결, 그리고 bucket, Worker, Durable Object별 분할 | [Cloudflare](cloudflare.md) |
| DeepSeek 연결 | [DeepSeek](deepseek.md) |
| Volcengine, OpenAI, Anthropic, Alibaba Cloud 또는 DeepSeek 내보내기 가져오기 | [청구서 파일 가져오기](bill-import.md) |
| CloudBridge에 필요한 최소 권한만 주기 | [공급자 권한](permissions.md) |
| 개요의 숫자 이해 | [개요와 계정](overview.md) |
| 비용이 어느 비즈니스 라인에 속하는지 확인 | [비용 귀속](attribution.md) |
| LLM 모델별 토큰당 비용 확인 | [모델](models.md) |
| 중지된 인스턴스, 유휴 주소, 주인 없는 리소스 찾기 | [인사이트](insights.md) |
| SQL로 장부에 질문하기 | [쿼리](query.md) |
| 지출이 튀거나 예산에 근접할 때 알림 받기 | [알림, 규칙, 예산](alerts.md) |
| 루프를 도는 Worker나 Durable Object를 청구서가 아니라 첫날에 알기 | [폭주 조기 발견](cloudflare.md#runaway) |
| 창을 닫은 채로 CloudBridge 계속 실행 | [메뉴 막대와 백그라운드](background.md) |
| CloudBridge가 저장하는 것과 백업 방법 | [설정, 데이터, 보안](settings-and-data.md) |
| 동작하지 않는 부분 해결 | [문제 해결](troubleshooting.md) |
