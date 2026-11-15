---
title: "CloudBridge と OptScale の比較"
description: "一方は組織のための FinOps サーバー、もう一方は個人の請求書のためのデスクトップ台帳です。どちらが合うかは、機能よりも誰が問い合わせているかで決まります。"
date: 2026-09-24
tag: 比較
---

# CloudBridge と OptScale の比較

<p class="post-meta">2026-09-24&emsp;比較&emsp;<a href="./">すべての記事</a></p>

どちらのプロジェクトもオープンソースで、どちらもクラウドの請求書を読みます。しかし作られた相手が違います。[OptScale](https://github.com/hystax/optscale) は Hystax によるセルフホスト型の FinOps プラットフォームで、組織がサーバー上で動かし、エンジニアリングと財務がクラウド支出について 1 つの見方を共有し、それに基づいて行動するためのものです。CloudBridge は、1 人が自分のマシンで動かし、自分の請求書をローカルのファイルに読み込むデスクトップアプリです。

以下の OptScale に関する事実は、2026 年 9 月時点の README、リポジトリ、ドキュメントから取ったもので、末尾にリンクしています。古くなっている点があれば、出典のほうが正しいとお考えください。

## 短い答え

複数の人がアクセスする必要があるなら、支出が Azure、Google Cloud、Kubernetes にあるなら、あるいは欲しいものがサイズ変更すべきインスタンスの一覧や購入すべきコミットメントなら、OptScale を使ってください。CloudBridge はそのどれもしません。

1 人の開発者、あるいは請求書を見る人が 1 人だけの小さなチームで、支出が AWS、Alibaba Cloud、Volcengine、そして OpenAI、Anthropic、DeepSeek のようなモデル API に散らばっていて、使った額を知るためにサーバーを動かしたくないなら、CloudBridge はそのためのより小さな道具です。

## OptScale とは

OptScale は、AWS、Microsoft Azure、Google Cloud、Alibaba Cloud、Kubernetes クラスタのためのオープンソースの FinOps・クラウドコスト最適化プラットフォームだと名乗っています。請求と使用量のデータを取り込み、コストのダッシュボードの上に、未使用・遊休リソースの検出、ライトサイジングの推奨、リザーブドインスタンス・Savings Plan・Spot の使用分析を重ね、電源スケジュールで非本番の VM を業務時間外に停止できます。ガバナンスは組織の形をしています。クォータと予算を持つリソースのプール、異常検知ポリシー、タグ付けポリシー、共有環境、そして 4 つの基本ロール（Member、Engineer、Manager、Organization manager）です。Databricks と S3 ストレージの分析もカバーしています。

それは多数のサービスからなるサーバーです。リポジトリには約 20 のトップレベルのサービスディレクトリがあり、その中には `rest_api`、`auth`、Web インターフェース用の `ngui`、コミットメント用の `risp`、推奨用の `bumiworker`、Slack と Jira の連携があります。本番のインストールは Kubernetes 上に置かれ、プロジェクトの Ansible プレイブックが Ubuntu 24.04 でセットアップします。公称の最小要件は 8 CPU コア、16 GB RAM、150 GB SSD です。評価専用の Docker Compose モードもあり、同じ 8 コアと 16 GB を使います。ライセンスは Apache 2.0 です。

## CloudBridge とは

CloudBridge は Rust と [GPUI](https://gpui.rs/) で書かれたネイティブのデスクトップアプリで、Apple Silicon の macOS と Windows x64 向けにリリースされています。サンプルデータで動く[ブラウザデモ](https://cloudbridge.jetsquirrel.cloud/demo/)もあります。AWS Cost Explorer API、Alibaba Cloud の課金 API、DeepSeek の残高 API からコストを取得し、Alibaba Cloud、Volcengine、OpenAI、Anthropic、DeepSeek からダウンロードした請求ファイルを取り込みます。すべては [FOCUS](https://focus.finops.org/) の列名を使う 1 つのローカル DuckDB 台帳に入ります。認証情報は OS のキーチェーンに入ります。サーバーもアカウントも同期もテレメトリもありません。

台帳の上には、月初来・30 日・12 か月のビューを持つ概要、サービス・モデル・タグ別の帰属（明示的な未割り当ての分とともに）、日次支出の異常、前払い残高の不足、未割り当てコストのアラートルール、日付付きの為替レート表から作る 1 つの報告通貨があります。メインブランチには、月次予算ルール、月末予測の周りの信頼区間、台帳に対する読み取り専用の SQL コンソール、S3 から直接読む AWS FOCUS エクスポートが加わります。これらはいずれもタグ付きリリースにはまだ入っていません。最新は 0.3.2 です。ライセンスは MIT です。

## 並べて比較

| | OptScale | CloudBridge |
| --- | --- | --- |
| 動かすもの | サーバー：本番は Kubernetes、評価は Docker Compose | macOS または Windows のデスクトップアプリ |
| 公称のフットプリント | 8 コア以上、16 GB RAM、150 GB SSD 以上 | お使いのノート PC |
| 利用者 | ロールとプールを持つ組織 | インストールごとに 1 人 |
| データの場所 | 自分の OptScale サーバー | アプリデータディレクトリの DuckDB ファイル |
| クラウド | AWS、Azure、GCP、Alibaba Cloud、Kubernetes | AWS、Alibaba Cloud、Volcengine |
| モデル API の請求 | オープンソースの README には記載なし | OpenAI、Anthropic、DeepSeek、Alibaba Model Studio（百炼）、Volcengine Ark（方舟） |
| データの入り方 | 接続したアカウント | 課金 API、またはダウンロードした請求ファイル |
| 最適化の助言 | 遊休リソース、ライトサイジング、RI/SP/Spot、電源スケジュール | なし |
| 異常とアラート | 異常検知、クォータと予算のポリシー | 日次支出、残高、未割り当てコストのルール。予算ルールはメインにあり |
| コスト配賦 | プール、オーナー、タグ付けポリシー、Kubernetes のネームスペースとラベル | サービス、モデル、タグ。未割り当ての分も表示 |
| 連携 | Slack、Jira、Databricks | なし |
| ライセンス | Apache 2.0 | MIT |
| ソフトウェアのコスト | セルフホストは無料。サーバー代は自己負担 | 無料。プロバイダーの API 利用料は別途 |

## OptScale のほうが良い選択になる場合

**数字を必要とする人が複数いる。** OptScale にはユーザー、ロール、組織ツリーがあるので、財務とエンジニアリングが同じ数値を見て、アクセスはロールで設定できます。CloudBridge は 1 台のマシン上の 1 つの台帳です。その README は、共有デプロイとチームコラボレーションが対象外であるとはっきり書いています。

**支出が Azure、Google Cloud、Kubernetes にある。** CloudBridge は Azure も Google Cloud もサポートせず、ネームスペースのコストが何かを知りません。OptScale は 3 つすべてをカバーし、クラスタのコストをネームスペース、ワークロード、ラベルで分割できます。

**何を変えるべきかを教えてほしい。** CloudBridge はお金がどこに行ったかを教えます。インスタンスが過剰、ボリュームが未接続、Savings Plan が元を取る、とは教えません。それが OptScale の価値の中核で、CloudBridge には対応するものがありません。

**ガバナンスが必要。** プールごとのクォータ、タグ付けポリシー、電源スケジュール、Slack や Jira に送るアラートは組織のための道具です。CloudBridge のルールはアプリが開いているときと更新の後に動きます。閉じている間は何も動きません。

ML についての注記：Hystax は OptScale を、実験のトラッキング、リーダーボード、モデルのバージョニングを備えた MLOps プラットフォームとしても紹介してきました。2025 年 6 月に、`arcee` と `bulldozer` のサービス、つまり ML プロファイリングエージェントとバルク実験ランナーがリポジトリから削除され、現在の README には実験トラッキングの記載がありません。それが理由で OptScale を見ているなら、デプロイするバージョンに実際に何が入っているかを確認してください。

## CloudBridge が合うところ

**1 人、1 組の請求書。** ダウンロードして開き、API キーを追加するかエクスポートを取り込むだけです。インストールするクラスタはなく、アップグレードするものもアプリ以外にありません。1 人の開発者にとって、OptScale の最小要件が示すサーバーは、その問いに対して大きすぎるマシンです。

**モデル API をクラウドの隣に。** 多くの小さなプロジェクトでは、最大の請求書はもはやコンピュートではありません。トークンです。CloudBridge は OpenAI と Anthropic のコストエクスポート、DeepSeek の日次支出、Alibaba Cloud の請求書の中の Model Studio のモデル、Volcengine の請求書の中の Ark エンドポイントを、AWS アカウントと同じ台帳に読み込みます。トークンだけの使用量エクスポートは使用量のままです。作られた請求額に価格を付けることはしません。

**中国のクラウドを、そのエクスポートから。** Alibaba Cloud の账单明细と Volcengine の請求ファイルは、コンソールから出てきたそのままの形で取り込め、中国語と英語の列名の両方を認識します。OptScale は Alibaba Cloud をサポートしています。Volcengine はその一覧にありません。

**動かないデータ。** 台帳とプロバイダーの生の応答はアプリデータディレクトリに残り、認証情報は OS のキーチェーンに残ります。私たちを含め、第三者には何も渡りません。ただしローカルであることは暗号化されていることと同じではありません。CloudBridge は台帳を暗号化しないので、ディスクの暗号化は引き続きご自身の役割です。

## 両方使えますか？

はい、そして互いに干渉しません。それぞれがプロバイダーの請求データを独自に読み、どちらもクラウドアカウントに書き込みません。チームが共有の AWS、Azure、Kubernetes の支出のために OptScale を動かし、1 人のエンジニアがモデル API の請求と OptScale が読まない中国のクラウドアカウントのために CloudBridge を保つ、ということができます。注意すべき点が 2 つあります。AWS Cost Explorer は API リクエストごとに課金されるので、2 つのツールがポーリングすれば二度払いになります。そして 2 つの台帳は行単位で一致しません。明細の対応付けと換算のしかたが違うからです。

## リンク

- CloudBridge：[ブラウザデモ](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[ドキュメント](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[ソース](https://github.com/JetSquirrel/cloudbridge)
- OptScale：[リポジトリと README](https://github.com/hystax/optscale)&emsp;[ドキュメント](https://hystax.com/documentation/optscale/)&emsp;[ロールと権限](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[異常検知](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[クォータと予算](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[ライブデモ](https://my.optscale.com/live-demo)
- OptScale の ML サービスを削除したコミット：[OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
