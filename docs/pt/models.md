---
title: "Custo de tokens de LLM por modelo"
description: "A página Modelos do CloudBridge: quanto cada LLM custa por token, com gasto, tokens de entrada, saída e cache, custo combinado por milhão e achados."
---

# Modelos

**[English](../models.md)**&emsp;**[中文](../zh/models.md)**&emsp;**[日本語](../ja/models.md)**&emsp;**[한국어](../ko/models.md)**&emsp;**[Français](../fr/models.md)**&emsp;**[Español](../es/models.md)**&emsp;**[Deutsch](../de/models.md)**&emsp;[Documentação](index.md)

A página **Modelos** lê o lado de LLM da fatura por modelo, no intervalo
escolhido no cabeçalho dela. Contas da OpenAI, Anthropic e DeepSeek sempre
aparecem; linhas de outra fonte aparecem quando trazem uso medido em tokens,
como linhas do Alibaba Cloud Model Studio, da Volcengine ou do Amazon
Bedrock. O modelo é o `ModelId` do FOCUS na fatura, ou o que a importação
nomeia; uma fatura que não nomeia nenhum, como as do Model Studio ou do Ark,
é agrupada pelo produto.

Os tokens são distinguidos pelas propriedades do FOCUS, `TokenDirection` e
`TokenCacheAction`, não pelo nome do medidor do provedor, então o mesmo tipo
de token aparece igual em toda fatura. Veja
[FOCUS e dados de tokens](focus.md).

- A linha de estatísticas mostra o **gasto com IA**, o total de **tokens**, o
  **US$/1M combinado** (custo dividido por todos os tokens, por milhão) e a
  **participação do cache** — tokens de entrada lidos de um cache de prompt,
  como parcela de todos os tokens de entrada, incluindo as gravações no
  cache.
- **Por modelo** lista o custo de cada modelo e a variação dele, os tokens IN,
  OUT e CACHE, o US$/1M combinado e a participação dele no gasto com modelos.
  CACHE são os tokens lidos do cache. IN é o resto da entrada: entrada sem
  cache, tokens gravados no cache e, para uma fatura que conta entrada e saída
  juntas, esse total. A dica contextual dele diz qual desses ele contém.
  Linhas com tokens mas sem custo ainda contam para as colunas de tokens. O
  mês até a data é comparado com os mesmos dias do mês passado, não com o mês
  inteiro.
- **Tokens por dia** mostra em gráfico o volume diário de tokens.

## Achados {#findings}

- Um modelo cujas leituras de cache ficam abaixo de 5% do lado de entrada —
  pagando preço de entrada por algo que poderia custar preço de cache. Não é
  levantado para uma fatura que não separa entrada de saída.
- Um modelo acima de 70% do gasto com modelos, quando dois ou mais custam
  algo.
- Um aumento de gasto que as contagens de tokens dos dois períodos atribuem ao
  preço unitário, e não ao uso.
- Um modelo cobrado sem medição de tokens, cujo custo unitário não pode ser
  calculado.

Nomes de modelos dentro do texto de itens de cobrança do Alibaba Cloud e da
Volcengine ainda não são extraídos.
