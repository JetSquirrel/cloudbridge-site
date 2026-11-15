---
title: "CloudBridge vs OptScale"
description: "하나는 조직을 위한 FinOps 서버이고, 다른 하나는 한 사람의 청구서를 위한 데스크톱 원장입니다. 어느 쪽이 맞는지는 기능보다 누가 묻고 있느냐에 달려 있습니다."
date: 2026-09-24
tag: 비교
---

# CloudBridge vs OptScale

<p class="post-meta">2026-09-24&emsp;비교&emsp;<a href="./">전체 글</a></p>

두 프로젝트 모두 오픈소스이고 둘 다 클라우드 청구서를 읽습니다. 다만 서로 다른 사람을 위해 만들어졌습니다. Hystax의 [OptScale](https://github.com/hystax/optscale)은 조직이 서버 위에서 돌리는 셀프 호스팅 FinOps 플랫폼으로, 엔지니어링과 재무가 클라우드 지출을 같은 시각으로 보고 조치를 취하게 해 줍니다. CloudBridge는 한 사람이 자기 컴퓨터에서 돌리는 데스크톱 앱으로, 자기 청구서를 로컬 파일로 읽어 들입니다.

아래의 OptScale 관련 사실은 2026년 9월 기준 README, 저장소, 문서에서 가져왔고 끝에 링크를 두었습니다. 여기 적힌 내용이 오래되었다면 원문이 우선입니다.

## 짧은 답

여러 사람이 접근해야 하거나, 지출이 Azure, Google Cloud, Kubernetes에 걸쳐 있거나, 원하는 것이 크기를 조정할 인스턴스 목록과 구매할 커밋먼트 목록이라면 OptScale을 쓰면 됩니다. CloudBridge는 그중 어느 것도 하지 않습니다.

혼자 또는 한 사람이 청구서를 보는 작은 팀이고, 지출이 AWS, Alibaba Cloud, Volcengine과 OpenAI, Anthropic, DeepSeek 같은 모델 API에 흩어져 있으며, 얼마를 썼는지 알기 위해 서버를 띄우고 싶지 않다면 CloudBridge가 그 질문에 맞는 더 작은 도구입니다.

## OptScale은 무엇인가

OptScale은 스스로를 AWS, Microsoft Azure, Google Cloud, Alibaba Cloud와 Kubernetes 클러스터를 위한 오픈소스 FinOps 및 클라우드 비용 최적화 플랫폼이라고 설명합니다. 청구와 사용량 데이터를 받아들이고, 비용 대시보드 위에서 미사용·유휴 리소스를 찾고, 적정 크기를 권장하고, Reserved Instance, Savings Plan, Spot 사용을 분석하며, 전원 스케줄로 업무 시간 외에 비운영 VM을 멈출 수도 있습니다. 거버넌스는 조직의 모양을 하고 있습니다. 쿼터와 예산이 붙은 리소스 풀, 이상 탐지 정책, 태깅 정책, 공유 환경, 그리고 네 가지 기본 역할(Member, Engineer, Manager, Organization manager)입니다. Databricks와 S3 저장소 분석도 다룹니다.

여러 서비스로 이루어진 서버입니다. 저장소에는 `rest_api`, `auth`, 웹 인터페이스를 위한 `ngui`, 커밋먼트를 위한 `risp`, 권장 사항을 위한 `bumiworker`, Slack과 Jira 통합 등 20여 개의 최상위 서비스 디렉터리가 있습니다. 운영 설치는 프로젝트의 Ansible 플레이북으로 Ubuntu 24.04에 구성한 Kubernetes 위에 올라가고, 최소 사양은 8 CPU 코어, 16GB RAM, 150GB SSD로 명시되어 있습니다. 평가용으로만 Docker Compose 모드가 있으며 같은 8코어 16GB를 요구합니다. 라이선스는 Apache 2.0입니다.

## CloudBridge는 무엇인가

CloudBridge는 [GPUI](https://gpui.rs/)로 Rust로 작성한 네이티브 데스크톱 앱이며, Apple Silicon용 macOS와 Windows x64로 배포됩니다. 샘플 데이터로 동작하는 [브라우저 데모](https://cloudbridge.jetsquirrel.cloud/demo/)도 있습니다. AWS Cost Explorer API, Alibaba Cloud의 청구 API, DeepSeek의 잔액 API에서 비용을 가져오고, Alibaba Cloud, Volcengine, OpenAI, Anthropic, DeepSeek에서 내려받은 청구서 파일을 가져옵니다. 모든 데이터는 [FOCUS](https://focus.finops.org/)의 열 이름을 쓰는 하나의 로컬 DuckDB 원장에 들어갑니다. 자격 증명은 OS 키링에 보관합니다. 서버도, 계정도, 동기화도, 텔레메트리도 없습니다.

원장 위에는 이번 달 누적·최근 30일·최근 12개월 보기를 제공하는 개요, 미할당 몫을 명시한 서비스·모델·태그별 비용 귀속, 비정상적인 일별 지출과 낮은 선불 잔액, 미할당 비용을 위한 알림 규칙, 날짜가 붙은 환율 표로 만든 하나의 보고 통화가 있습니다. main 브랜치에는 월 예산 규칙, 월말 예상 주변의 신뢰 구간, 원장 위에서 동작하는 읽기 전용 SQL 콘솔, S3에서 AWS FOCUS 내보내기를 바로 읽는 기능이 추가되어 있습니다. 이 중 어느 것도 아직 태그가 붙은 릴리스에는 없고, 0.3.2가 최신입니다. 라이선스는 MIT입니다.

## 나란히 비교

| | OptScale | CloudBridge |
| --- | --- | --- |
| 실행하는 것 | 서버: 운영 환경은 Kubernetes, 평가용은 Docker Compose | macOS 또는 Windows의 데스크톱 앱 |
| 명시된 요구 사양 | 8코어 이상, 16GB RAM, 150GB 이상 SSD | 여러분의 노트북 |
| 사용자 | 역할과 풀을 가진 조직 | 설치 하나당 한 사람 |
| 데이터가 있는 곳 | 여러분의 OptScale 서버 | 앱 데이터 디렉터리의 DuckDB 파일 |
| 클라우드 | AWS, Azure, GCP, Alibaba Cloud, Kubernetes | AWS, Alibaba Cloud, Volcengine |
| 모델 API 청구서 | 오픈소스 README에 나와 있지 않음 | OpenAI, Anthropic, DeepSeek, Alibaba Model Studio(百炼), Volcengine Ark(方舟) |
| 데이터가 들어오는 방식 | 연결한 계정 | 청구 API, 또는 직접 내려받은 청구서 파일 |
| 최적화 조언 | 유휴 리소스, 적정 크기 조정, RI/SP/Spot, 전원 스케줄 | 없음 |
| 이상 탐지와 알림 | 이상 탐지, 쿼터 및 예산 정책 | 일별 지출·잔액·미할당 비용 규칙, main의 예산 규칙 |
| 비용 배분 | 풀, 소유자, 태깅 정책, Kubernetes 네임스페이스와 레이블 | 서비스·모델·태그별, 미할당 몫 표시 |
| 통합 | Slack, Jira, Databricks | 없음 |
| 라이선스 | Apache 2.0 | MIT |
| 소프트웨어 비용 | 셀프 호스팅은 무료, 서버 비용은 별도 | 무료, 서비스 API 요금은 별도 |

## OptScale이 더 나은 경우

**여러 사람이 숫자를 봐야 합니다.** OptScale에는 사용자, 역할, 조직 트리가 있어 재무와 엔지니어링이 역할에 따라 접근 권한이 정해진 같은 수치를 볼 수 있습니다. CloudBridge는 한 대의 컴퓨터에 있는 하나의 원장입니다. README에도 공유 배포와 팀 협업은 범위 밖이라고 분명히 적혀 있습니다.

**지출이 Azure, Google Cloud, Kubernetes에 있습니다.** CloudBridge는 Azure도 Google Cloud도 지원하지 않고, 네임스페이스에 얼마가 드는지도 모릅니다. OptScale은 셋 다 다루며, 클러스터 비용을 네임스페이스, 워크로드, 레이블별로 나눌 수 있습니다.

**무엇을 바꿔야 하는지 알려 주기를 원합니다.** CloudBridge는 돈이 어디로 갔는지 알려 줍니다. 인스턴스가 너무 크다거나, 볼륨이 연결되지 않았다거나, Savings Plan이 본전을 뽑을 것이라고 말해 주지는 않습니다. 그것이 OptScale 가치의 핵심이고, CloudBridge에는 그에 해당하는 기능이 없습니다.

**거버넌스가 필요합니다.** 풀별 쿼터, 태깅 정책, 전원 스케줄, Slack이나 Jira로 보내는 알림은 조직용 도구입니다. CloudBridge의 규칙은 앱이 열려 있을 때와 새로 고침 이후에 실행됩니다. 앱이 닫혀 있는 동안에는 아무것도 실행되지 않습니다.

ML에 관한 참고: Hystax는 OptScale을 실험 추적, 리더보드, 모델 버저닝을 갖춘 MLOps 플랫폼으로도 소개한 적이 있습니다. 2025년 6월에 `arcee`와 `bulldozer` 서비스, ML 프로파일링 에이전트, 대량 실험 실행기가 저장소에서 제거되었고, 현재 README에는 실험 추적이 나와 있지 않습니다. 그것 때문에 OptScale을 보고 있다면, 배포하려는 버전에 실제로 무엇이 들어 있는지 확인하십시오.

## CloudBridge가 맞는 경우

**한 사람, 한 벌의 청구서.** 내려받아 열고, API 키를 추가하거나 내보내기를 가져오면 됩니다. 설치할 클러스터가 없고, 앱 말고는 올릴 것도 없습니다. 개발자 한 명에게 OptScale의 최소 요구 사양이 말하는 서버는 질문에 비해 지나치게 큰 기계입니다.

**클라우드 옆의 모델 API.** 작은 프로젝트가 많아지면 가장 큰 청구서는 더 이상 컴퓨트가 아니라 토큰입니다. CloudBridge는 OpenAI와 Anthropic의 비용 내보내기, DeepSeek의 일별 지출, Alibaba Cloud 청구서 안의 Model Studio 모델, Volcengine 청구서 안의 Ark 엔드포인트를 AWS 계정과 같은 원장으로 읽어 들입니다. 토큰만 있는 사용량 내보내기는 사용량으로 남습니다. 없는 청구서를 만들어 가격을 매기지 않습니다.

**중국 클라우드, 그들 자신의 내보내기로.** Alibaba Cloud의 账单明细와 Volcengine의 청구서 파일은 콘솔에서 나온 그대로 가져올 수 있고, 중국어와 영어 열 이름을 모두 인식합니다. OptScale은 Alibaba Cloud를 지원합니다. Volcengine은 그 목록에 없습니다.

**그 자리에 머무는 데이터.** 원장과 서비스의 원본 응답은 앱 데이터 디렉터리에, 자격 증명은 OS 키링에 남습니다. 저희를 포함해 어느 제3자에게도 가지 않습니다. 다만 로컬이 곧 암호화는 아닙니다. CloudBridge는 원장을 암호화하지 않으므로 디스크 암호화는 여전히 여러분의 몫입니다.

## 둘 다 써도 되나요?

됩니다. 서로 간섭하지 않습니다. 각자 서비스의 청구 데이터를 스스로 읽고, 둘 다 클라우드 계정에 쓰기를 하지 않습니다. 한 팀이 공유 AWS, Azure, Kubernetes 지출을 위해 OptScale을 돌리고, 한 엔지니어가 모델 API 청구서와 OptScale이 읽지 않는 중국 클라우드 계정을 위해 CloudBridge를 유지할 수 있습니다. 주의할 점은 두 가지입니다. AWS Cost Explorer는 API 요청마다 요금을 받으므로 두 도구가 번갈아 조회하면 두 번 지불하게 되고, 두 원장은 청구 항목을 매핑하고 환산하는 방식이 달라 행 단위로 일치하지 않습니다.

## 링크

- CloudBridge: [브라우저 데모](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[문서](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[소스](https://github.com/JetSquirrel/cloudbridge)
- OptScale: [저장소와 README](https://github.com/hystax/optscale)&emsp;[문서](https://hystax.com/documentation/optscale/)&emsp;[역할과 권한](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[이상 탐지](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[쿼터와 예산](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[라이브 데모](https://my.optscale.com/live-demo)
- OptScale의 ML 서비스를 제거한 커밋: [OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
