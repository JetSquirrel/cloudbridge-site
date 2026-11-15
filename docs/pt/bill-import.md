---
title: "Importe exportações de faturas da OpenAI, Anthropic e da nuvem"
description: "Importe exportações de faturas do Alibaba Cloud, Volcengine, OpenAI, Anthropic e DeepSeek para o CloudBridge: de onde cada uma vem e o que ela acrescenta."
---

# Importação de arquivo de fatura

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[日本語](../ja/bill-import.md)**&emsp;**[한국어](../ko/bill-import.md)**&emsp;**[Français](../fr/bill-import.md)**&emsp;**[Español](../es/bill-import.md)**&emsp;**[Deutsch](../de/bill-import.md)**&emsp;[Documentação](index.md)

Uma exportação de fatura baixada do console de um provedor é convertida nas
mesmas linhas de registro que uma busca produz. Daí para frente — totais,
gráficos, alertas, atribuição —, um mês importado é indistinguível de um mês
buscado. Muitas vezes ela é a leitura mais fina: a API de cobrança do
Alibaba Cloud reporta o Model Studio (百炼) como um único valor por mês,
enquanto a exportação dele o reporta por modelo, com contagens de tokens.

Volcengine, OpenAI e Anthropic são somente importação por enquanto: adicione
a conta com um nome, sem credenciais, e importe.

| Fonte | De onde vem a exportação | O que ela acrescenta |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) por modelo; detalhe em nível de instância para todo o resto |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) por endpoint e tipo de token |
| OpenAI | Usage → Export | Custo ou uso de tokens, por projeto e modelo |
| Anthropic (Claude) | Usage ou Cost → Export | Custo ou uso de tokens, por workspace e modelo |
| DeepSeek | Usage → Download | Gasto por dia e por modelo — a API dele reporta apenas um saldo |

## Importar {#import}

1. Baixe a exportação no console do provedor.
2. Vá em **Contas** e clique em **Importar** na linha da conta.
3. Escolha o arquivo. O CloudBridge informa quantas cobranças gravou e quais
   meses substituiu.

::: warning Um mês é substituído, não somado
Uma importação substitui todos os meses que o arquivo cobre para a conta
selecionada, então importar duas vezes nunca dobra uma cobrança. Exporte a
fatura completa: um arquivo filtrado por produto substitui os dados daquele
mês apenas por aquele produto. Para atualizar um mês importado, importe de
novo uma exportação completa e corrigida. Atualizar nunca sobrescreve um mês
importado, nem mesmo Forçar atualização.
:::

## Exportações de uso não trazem dinheiro {#usage-exports}

Uma exportação de **uso**, com contagens de tokens mas sem valores, é
gravada sem custo faturado e com base de custo *absent*. O CloudBridge não
transforma contagens de tokens em gasto estimado pelos preços de tabela. Uma
exportação de **custo** mantém uma quantidade só onde exatamente uma coluna
de tokens está preenchida: tokens de entrada e de saída têm preços diferentes
e não podem ser uma única quantidade precificada.

## Codificações {#encoding}

Exportações de texto precisam ser UTF-8. Os consoles do Alibaba Cloud e da
Volcengine podem gerar arquivos GBK; exporte de novo em UTF-8 ou salve como
*CSV UTF-8* primeiro. Mais em
[Solução de problemas](troubleshooting.md#import-errors).
