---
title: "Custos do Azure por serviço, por dia"
description: "Conecte uma assinatura do Microsoft Azure ao CloudBridge com um service principal: custo real do Cost Management, diário, por serviço e tipo de cobrança."
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[日本語](../ja/azure.md)**&emsp;**[한국어](../ko/azure.md)**&emsp;**[Français](../fr/azure.md)**&emsp;**[Español](../es/azure.md)**&emsp;**[Deutsch](../de/azure.md)**&emsp;[Documentação](index.md)

O CloudBridge lê o **custo real** de uma assinatura no Azure Cost
Management: quanto cada serviço custou **por dia**, dividido por tipo de
cobrança. Uma reserva comprada, um reembolso ou um imposto ficam como são,
sem serem somados ao uso, então um mês com uma compra pontual não parece um
mês cujo uso triplicou.

## Conectar a assinatura {#connect}

O CloudBridge entra como um service principal — um registro de aplicativo
com segredo próprio — e não como você.

1. No [portal do Azure](https://portal.azure.com/), abra **Microsoft Entra
   ID → App registrations → New registration**. Dê um nome como
   `cloudbridge`; o resto do formulário não importa.
2. No novo registro, abra **Certificates & secrets → New client secret** e
   copie o **Value** do segredo — não o Secret ID dele. Ele é mostrado uma
   única vez.
3. Abra a assinatura e depois **Access control (IAM) → Add role
   assignment**. Escolha **Cost Management Reader** e atribua ao aplicativo.
4. No CloudBridge, adicione uma conta **Microsoft Azure** com o
   **Application (client) ID** do registro, o valor do segredo e o
   **Subscription ID**.

Você não precisa do tenant ID: o CloudBridge descobre a qual tenant a
assinatura pertence. Se essa busca falhar, informe a assinatura como
`tenant-id/subscription-id`.

Uma atribuição de função pode levar alguns minutos para valer. Se a primeira
busca for recusada logo depois de você fazê-la, espere e clique em
**Validar** de novo.

## O que a fatura mostra {#detail}

| Coluna | Origem |
| --- | --- |
| Serviço | A categoria do medidor — *Virtual Machines*, *Storage*, *Bandwidth* |
| Dia | A data de uso |
| Categoria | Usage, Purchase, Credit (reembolsos), Tax ou Adjustment, conforme o tipo de cobrança |
| Valor | Custo real, na moeda de cobrança da assinatura |

A consulta reporta por serviço, não por recurso nem por região, então a
divisão por região na [Atribuição](attribution.md) aparece como *Outro* para
o Azure, e o [Insights](insights.md) não verifica recursos do Azure.

A API de consulta do Cost Management tem limite de requisições por tenant.
Uma conta é uma consulta por mês buscado; várias assinaturas do mesmo tenant
compartilham o limite, e uma busca limitada é tentada de novo na próxima
atualização.

## Usar as credenciais desta máquina {#system}

Em uma máquina em que `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` e
`AZURE_SUBSCRIPTION_ID` estão definidas — as variáveis que os SDKs do Azure
leem — marque **Usar as credenciais desta máquina** e o CloudBridge as lê a
cada busca em vez de guardar uma cópia. Só `az login` não basta: ele deixa um
usuário conectado, não um segredo que o CloudBridge possa usar.

Veja [Permissões dos provedores](permissions.md#azure) para saber exatamente
quais endpoints o CloudBridge chama.
