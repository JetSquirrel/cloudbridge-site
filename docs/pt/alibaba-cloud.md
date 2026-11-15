---
title: "API de cobrança e importação de fatura do Alibaba Cloud"
description: "Conecte o Alibaba Cloud (阿里云) ao CloudBridge com um usuário RAM somente leitura, ou importe os detalhes da fatura para ter os custos por modelo do Model Studio (百炼)."
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[日本語](../ja/alibaba-cloud.md)**&emsp;**[한국어](../ko/alibaba-cloud.md)**&emsp;**[Français](../fr/alibaba-cloud.md)**&emsp;**[Español](../es/alibaba-cloud.md)**&emsp;**[Deutsch](../de/alibaba-cloud.md)**&emsp;[Documentação](index.md)

O Alibaba Cloud tem os dois canais. A **API de cobrança** dá o total de cada
produto para o mês; a **exportação de detalhes da fatura** dá linhas em nível
de instância, incluindo o Model Studio (百炼) por modelo, com contagens de
tokens. Use a API para uma conta que se mantém atualizada sozinha, e importe
a exportação quando quiser a leitura mais fina — um mês importado nunca é
sobrescrito por uma atualização.

## API de cobrança {#api}

1. Abra o [console do RAM](https://ram.console.aliyun.com/) e crie um
   usuário RAM para acesso à API.
2. Anexe a política de sistema embutida `AliyunBSSReadOnlyAccess`.
3. Crie um AccessKey para o usuário.
4. Adicione a conta no CloudBridge com o AccessKey ID e o Secret.

Não use o AccessKey da conta principal. A API de cobrança não tem taxa por
consulta documentada aqui; confira os termos atuais do Alibaba Cloud. Veja
[Permissões dos provedores](permissions.md#alibaba-cloud).

## Exportação de detalhes da fatura {#export}

No console, vá em **Expenses and Costs → Bill Details → Export**, baixe a
fatura completa e clique em **Importar** na linha da conta. Uma importação
não precisa de credenciais. Veja
[Importação de arquivo de fatura](bill-import.md).
