---
title: "FOCUS 1.5 e dados de tokens de LLM"
description: "Como o CloudBridge registra o uso de tokens de modelos de IA nos termos do FOCUS 1.5: ConsumedQuantity, SkuMeter e as propriedades ModelId, TokenDirection e TokenCacheAction de SkuPriceDetails."
---

# FOCUS e dados de tokens

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[日本語](../ja/focus.md)**&emsp;**[한국어](../ko/focus.md)**&emsp;**[Français](../fr/focus.md)**&emsp;**[Español](../es/focus.md)**&emsp;**[Deutsch](../de/focus.md)**&emsp;[Documentação](index.md)

O registro do CloudBridge tem os nomes do [FOCUS](https://focus.finops.org/),
a especificação aberta da FinOps Foundation para dados de custo e uso. O FOCUS
1.5 descreve a fatura de uma API de modelo de IA. Ele não acrescenta coluna de
tokens; usa as colunas que o FOCUS já tem, e o CloudBridge registra tokens da
mesma forma.

## O que uma linha de tokens contém {#columns}

| Coluna FOCUS | Coluna do registro | Contém |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | A contagem bruta de tokens |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | O nome que o provedor dá ao medidor, como *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | Um objeto JSON com o modelo e as propriedades dos tokens |

`SkuPriceDetails` traz quatro propriedades definidas pelo FOCUS:

| Propriedade | Valores |
| --- | --- |
| `ModelDeveloper` | Quem fez o modelo: *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | O modelo como a fatura o nomeia |
| `TokenDirection` | `Input` para tokens enviados ao modelo, `Output` para tokens que ele gerou |
| `TokenCacheAction` | Nos tokens de entrada: `Read` de um cache de prompt, `Write` para um, `Uncached` para nenhum dos dois |

Uma propriedade que a fatura não consegue responder fica de fora, em vez de ser
adivinhada. O Alibaba Cloud Model Studio e o Volcengine Ark cobram uma única
contagem de `Tokens` para entrada e saída juntas, então as linhas deles não têm
`TokenDirection`. Tokens de saída não têm `TokenCacheAction`.

## Quem gastou {#requester}

O FOCUS 1.5 também registra o solicitante por trás de uma cobrança.
`PrincipalId` é o usuário, `CredentialId` é o ID publicado da chave de API
(nunca a chave em si), e `RequesterDetails` é um array JSON que os descreve,
com o nome de exibição da chave. O CloudBridge os preenche nas colunas
`principal_id`, `credential_id` e `requester_details` do registro a partir
destas exportações:

- uma exportação da OpenAI agrupada por usuário ou por chave de API;
- uma exportação da Anthropic agrupada por chave de API.

A exportação do DeepSeek tem apenas a chave mascarada e o nome dela, o que o
FOCUS não permite como identificador, então as linhas dele não têm nenhum.

## De onde vêm os valores {#sources}

- **Importações da OpenAI, Anthropic, DeepSeek, Model Studio e Ark.** O
  CloudBridge preenche as colunas a partir do tipo de token que cada exportação
  reporta. Cada token é contado em uma linha, como o FOCUS exige: o total de
  entrada da OpenAI inclui os tokens em cache dela, então eles são retirados da
  linha de entrada. Registros de versões anteriores são preenchidos quando são
  abertos pela primeira vez. Meses importados antes dessa mudança mantêm as
  contagens de entrada antigas da OpenAI até você repeti-los (**Contas →
  Reproduzir normalização**).
- **AWS Data Exports.** As colunas de uma exportação FOCUS são mantidas como a
  AWS as escreveu. Uma exportação gravada antes do FOCUS 1.5 não tem
  `TokenDirection`. Quando o nome do medidor de uma linha de tokens diz quais
  tokens ela conta, como *cache-read-input-token-count* ou *output-tokens*, a
  direção e a ação de cache são lidas do nome. Caso contrário, ficam de fora.

A página [Modelos](models.md) lê essas propriedades: uma leitura de cache é
`TokenCacheAction` `Read`, qualquer que seja o nome que o provedor dê ao
medidor.

## Consultar {#query}

A página [Consulta](query.md) lê as propriedades com as funções JSON do DuckDB:

```sql
SELECT json_extract_string(sku_price_details, '$.ModelId') AS model,
       json_extract_string(sku_price_details, '$.TokenCacheAction') AS cache,
       sum(consumed_quantity) AS tokens,
       sum(billed_cost) AS cost
FROM v_charge_normalized
WHERE consumed_unit = 'Tokens'
  AND json_extract_string(sku_price_details, '$.TokenDirection') = 'Input'
GROUP BY ALL
ORDER BY tokens DESC;
```

## Exportar {#export}

**Configurações → Dados → Exportar como FOCUS** grava cada cobrança em um CSV
com os nomes de coluna do FOCUS, incluindo as colunas de tokens, para outra
ferramenta de FinOps. Os valores ficam na moeda em que cada cobrança foi
faturada. As colunas que o CloudBridge acrescenta começam com `x_`, como
`x_CostBasis`. O arquivo não é um conjunto de dados FOCUS em conformidade.
Colunas que nenhuma fonte reporta, como `ChargeClass` e `PricingCategory`,
ficam de fora, e uma linha sem valor reportado mantém `BilledCost` vazio. A
exportação existe apenas no desktop.
