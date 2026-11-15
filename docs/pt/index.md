---
layout: home
title: "Documentação do CloudBridge — conecte suas faturas, leia-as, fique de olho"
titleTemplate: false
description: "Documentação do CloudBridge: leia faturas da AWS, Azure, Google Cloud, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic e DeepSeek em um único registro local e fique de olho."
hero:
  name: Documentação do CloudBridge
  text: Suas faturas de nuvem e de IA, em um único registro.
  tagline: Conecte cada provedor, veja para onde o dinheiro foi e seja avisado quando os gastos começarem a fugir do controle.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: Comece agora
      link: /pt/getting-started
    - theme: alt
      text: Experimente a demonstração
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: Sobre o CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/pt/
features:
  - title: Conecte suas faturas
    details: AWS, Azure, Alibaba Cloud e Cloudflare pelas próprias APIs de cobrança, Google Cloud pela exportação de cobrança no BigQuery; Volcengine, OpenAI, Anthropic e DeepSeek pelas exportações que os consoles produzem.
    link: /pt/aws
    linkText: Fontes
  - title: Veja para onde o dinheiro foi
    details: Uma Visão geral do mês até a data, dos últimos 30 dias ou dos últimos 12 meses, atribuição a linhas de negócio, custo de tokens por modelo e SQL sobre o registro.
    link: /pt/overview
    linkText: Visão geral e contas
  - title: Descubra o que cortar
    details: Insights compara a fatura com uma verificação somente leitura dos recursos da AWS e da Cloudflare, com preços tirados da fatura, resumidos por tipo.
    link: /pt/insights
    linkText: Insights
  - title: Fique de olho
    details: Regras, orçamentos e notificações, com o aplicativo rodando na barra de menus depois que a janela fecha e iniciando no login.
    link: /pt/background
    linkText: Barra de menus e segundo plano
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ja/">日本語</a>&emsp;<a href="../ko/">한국어</a>&emsp;<a href="../fr/">Français</a>&emsp;<a href="../es/">Español</a>&emsp;<a href="../de/">Deutsch</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/pt/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## Encontre o seu caminho

| Eu quero… | Leia |
| --- | --- |
| Instalar o CloudBridge e ver uma primeira fatura | [Primeiros passos](getting-started.md) |
| Ver como é antes de instalar qualquer coisa | [A demonstração no navegador](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Conectar a AWS com o Cost Explorer ou um Data Export | [AWS](aws.md) |
| Conectar uma assinatura do Azure | [Microsoft Azure](azure.md) |
| Conectar o Google Cloud pela exportação de cobrança no BigQuery | [Google Cloud](google-cloud.md) |
| Conectar o Alibaba Cloud | [Alibaba Cloud](alibaba-cloud.md) |
| Conectar a Cloudflare e dividir por bucket, Worker e Durable Object | [Cloudflare](cloudflare.md) |
| Conectar o DeepSeek | [DeepSeek](deepseek.md) |
| Importar uma exportação da Volcengine, OpenAI, Anthropic, Alibaba Cloud ou DeepSeek | [Importação de arquivo de fatura](bill-import.md) |
| Dar ao CloudBridge o mínimo de acesso de que ele precisa | [Permissões dos provedores](permissions.md) |
| Entender os números da Visão geral | [Visão geral e contas](overview.md) |
| Ver a qual linha de negócio um custo pertence | [Atribuição](attribution.md) |
| Ver quanto custa cada modelo de LLM por token | [Modelos](models.md) |
| Encontrar instâncias paradas, endereços ociosos e recursos sem dono | [Insights](insights.md) |
| Conferir a fatura de um provedor com o registro | [Conciliação](reconciliation.md) |
| Fazer uma pergunta ao registro em SQL | [Consulta](query.md) |
| Ser avisado quando os gastos dispararem ou um orçamento estiver perto do limite | [Alertas, regras e orçamentos](alerts.md) |
| Saber de um Worker ou Durable Object em loop no primeiro dia, não na fatura | [Detectar um descontrole](cloudflare.md#runaway) |
| Manter o CloudBridge rodando com a janela fechada | [Barra de menus e segundo plano](background.md) |
| Saber o que o CloudBridge armazena e fazer backup | [Configurações, dados e segurança](settings-and-data.md) |
| Resolver algo que não está funcionando | [Solução de problemas](troubleshooting.md) |
