---
title: "Custos do Google Cloud a partir da exportação de cobrança no BigQuery"
description: "Conecte o Google Cloud ao CloudBridge pela exportação da conta de faturamento no BigQuery: custo diário por serviço, SKU, projeto e região, com os créditos à parte."
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[日本語](../ja/google-cloud.md)**&emsp;**[한국어](../ko/google-cloud.md)**&emsp;**[Français](../fr/google-cloud.md)**&emsp;**[Español](../es/google-cloud.md)**&emsp;**[Deutsch](../de/google-cloud.md)**&emsp;[Documentação](index.md)

O Google Cloud não tem uma API que responda "quanto custou este mês". A
fatura dele é a exportação que uma conta de faturamento grava em um conjunto
de dados do BigQuery, então é isso que o CloudBridge lê: uma consulta por
mês, trazendo o custo **por dia** por serviço, SKU, projeto e região. Os
créditos — nível gratuito, uso comprometido, promoções — voltam como linhas
próprias, então o uso permanece o que custou antes deles.

## Ativar a exportação {#export}

A exportação guarda dados a partir do dia em que é ativada, então faça isso
primeiro, antes mesmo de instalar o CloudBridge.

1. No console do Google Cloud, abra **Billing → Billing export → BigQuery
   export**.
2. Em **Standard usage cost**, clique em **Edit settings**, escolha um
   projeto e crie um conjunto de dados para ele (por exemplo `billing`), e
   salve.
3. Quando as primeiras linhas chegarem — em até um dia — o conjunto de dados
   terá uma tabela chamada `gcp_billing_export_v1_` seguida do ID da conta de
   faturamento. No BigQuery, abra-a e use **Copy ID**: é essa a *tabela de
   exportação de cobrança* que o CloudBridge pede, como
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`.

## Dar uma chave ao CloudBridge {#connect}

1. No projeto do conjunto de dados da exportação, abra **IAM & Admin →
   Service accounts** e crie uma, como `cloudbridge`.
2. Conceda a ela **BigQuery Job User** no projeto, para que possa executar
   uma consulta, e **BigQuery Data Viewer** no conjunto de dados da
   exportação, para que a consulta possa ler a tabela.
3. Abra a conta de serviço e depois **Keys → Add key → Create new key →
   JSON**. Guarde o arquivo baixado em um lugar privado.
4. No CloudBridge, adicione uma conta **Google Cloud** com o **caminho** do
   arquivo de chave e a tabela de exportação de cobrança.

O CloudBridge guarda o caminho, não a chave: o arquivo é lido a cada busca,
então trocar a chave é só substituir o arquivo. O arquivo de credenciais que
`gcloud auth application-default login` grava funciona no lugar dela, e
`GOOGLE_APPLICATION_CREDENTIALS` também, com **Usar as credenciais desta
máquina**.

## O que a fatura mostra {#detail}

| Coluna | Origem |
| --- | --- |
| Serviço | `service.description` — *Compute Engine*, *Cloud Storage* |
| Descrição | O SKU — *N2 Instance Core running in Americas* |
| Projeto | `project.id` e `project.name` |
| Região | `location.region` |
| Dia | O dia de uso |
| Categoria | Usage, Tax ou Adjustment, conforme `cost_type`; créditos como Credit |

Um mês é o **mês da fatura**, como na fatura do Google Cloud. O uso cobrado
com atraso cai no mês em que foi faturado, mesmo quando rodou no mês
anterior.

A consulta lê a tabela de exportação inteira. O preço sob demanda do BigQuery
se aplica depois do nível gratuito mensal; uma exportação de cobrança
normalmente é bem menor que isso, mas cresce enquanto a exportação rodar. O
[Insights](insights.md) não verifica recursos do Google Cloud.

Veja [Permissões dos provedores](permissions.md#google-cloud) para saber
exatamente quais endpoints o CloudBridge chama.
