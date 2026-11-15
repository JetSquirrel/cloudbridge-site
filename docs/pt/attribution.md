---
title: "Atribuição de custos por linha de negócio, tag e serviço"
description: "Atribuição do CloudBridge: um Sankey da fonte ao serviço ou modelo e à linha de negócio, e divisões por tag, serviço, região ou categoria FOCUS."
---

# Atribuição

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[日本語](../ja/attribution.md)**&emsp;**[한국어](../ko/attribution.md)**&emsp;**[Français](../fr/attribution.md)**&emsp;**[Español](../es/attribution.md)**&emsp;**[Deutsch](../de/attribution.md)**&emsp;[Documentação](index.md)

A página Atribuição desenha o mês como um Sankey: fonte, depois serviço ou
modelo, depois linha de negócio, com um nó **Não alocado** explícito. Os
fluxos são de uso bruto — um fluxo líquido pode ser negativo, o que não
significa nada em um Sankey. Uma cobrança é atribuída a uma linha pela tag
`business_line` dela; sem uma, ela cai em Não alocado.

## Divisão por dimensão {#dimensions}

Um seletor acima da divisão escolhe **Tag** (a visão por linha de negócio),
**Serviço**, **Região** ou **Categoria**. As dimensões que não são tag são
desenhadas como um treemap — **Mapa**, em que a área de um bloco é o custo
dele neste período e a cor é a variação em relação ao período anterior — ou
como barras de participação em **Tabela**. Cobranças sem valor para a
dimensão aparecem como *Outro*. Um cartão de **Principais recursos** lista os
recursos mais caros do período.

## Categorias de serviço {#categories}

**Categoria** usa as categorias de serviço do FOCUS — Compute, Storage,
Databases, Networking, AI and Machine Learning e as demais — as mesmas em
todas as nuvens, então o ECS do Alibaba Cloud, o ECS da Volcengine e o EC2 da
AWS contam todos como *Compute / Virtual Machines*, e o Model Studio, o Ark e
os provedores de modelos como *AI and Machine Learning / Generative AI*. Um
produto que nenhum mapeamento conhece ainda aparece como *Não categorizado*
e surge como um achado de [saúde dos dados](overview.md#data-health).
