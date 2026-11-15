---
title: "Concilie as faturas da nuvem com o registro de cobrança"
description: "A Conciliação do CloudBridge compara a fatura final de cada provedor com o registro ou com um snapshot congelado, na moeda da fatura, e diz o que conferir."
---

# Conciliação

**[English](../reconciliation.md)**&emsp;**[中文](../zh/reconciliation.md)**&emsp;**[日本語](../ja/reconciliation.md)**&emsp;**[한국어](../ko/reconciliation.md)**&emsp;**[Français](../fr/reconciliation.md)**&emsp;**[Español](../es/reconciliation.md)**&emsp;**[Deutsch](../de/reconciliation.md)**&emsp;[Documentação](index.md)

A página **Conciliação** responde a uma pergunta: a fatura final de cada
provedor confere com o que o CloudBridge importou? Ela exige o CloudBridge
0.9.0 ou mais recente.

Só o custo faturado autoritativo, na moeda da própria fatura, é comparado,
então uma taxa de câmbio não consegue esconder uma diferença. As faturas são
armazenadas separadas das suas cobranças e nunca as alteram.

## Adicionar uma fatura {#add}

- **Informar total** registra uma fatura. O **Total** é o valor final da
  fatura. Impostos, créditos e ajustes são o que a fatura declara: eles não
  são somados ao total e só ajudam a explicar uma diferença. Informe créditos
  como zero ou negativos.
- **Importar CSV de faturas** lê várias de uma vez, somente no desktop. Se
  qualquer linha estiver errada, nada é importado, e o erro indica a linha.

O CSV precisa de uma linha de cabeçalho:

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

As colunas a partir de `tax` são opcionais. `billing_period` é `YYYY-MM`,
`currency` é um código de três letras, e os valores são números simples, sem
separador de milhar. Toda linha precisa nomear uma das suas contas.

Se as cobranças de uma conta abrangem mais de uma conta de faturamento,
informe o ID da conta de faturamento da fatura para que ela seja comparada
com a correta.

## Ler o resultado {#status}

| Status | O que significa |
| --- | --- |
| Confere | A fatura e o registro concordam, dentro da tolerância da moeda |
| Diferença | Eles discordam. A linha mostra a diferença e o que conferir em seguida |
| Não é possível verificar | Ainda não há nada justo para comparar, e a linha diz por quê |
| Falta de evidência | O mês tem cobranças faturadas mas nenhuma fatura, então não foi conferido |

Um mês aparece como **Não é possível verificar** quando, por exemplo, ainda
não terminou, o registro não tem cobranças na moeda da fatura, ou toda
cobrança é uso sem valor. Valores derivados ou estimados ficam de fora do
número do registro.

Abra uma linha para ver a divisão por categoria de cobrança, os detalhes da
fatura e o que conferir, como imposto só de um lado, um crédito ou ajuste
tardio, uma exportação que cobre parte do mês, ou um total que corresponde a
outro mês.

## Comparar com um snapshot {#snapshot}

**Comparar com** escolhe o registro atual ou um
[snapshot de fim de mês](overview.md#snapshots), para você conferir uma
fatura contra o mês como o fechou, independentemente do que atualizações
posteriores mudaram.

Excluir uma fatura remove apenas esse registro. O registro e quaisquer
snapshots ficam como estão.
