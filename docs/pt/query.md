---
title: "Consulte o registro de cobrança com SQL"
description: "A página Consulta do CloudBridge: SQL somente leitura sobre o registro de cobrança local no DuckDB, com modelos para gasto, serviços, linhas de negócio e previsões."
---

# Consulta

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[日本語](../ja/query.md)**&emsp;**[한국어](../ko/query.md)**&emsp;**[Français](../fr/query.md)**&emsp;**[Español](../es/query.md)**&emsp;**[Deutsch](../de/query.md)**&emsp;[Documentação](index.md)

A página **Consulta** executa SQL sobre o registro local no DuckDB. Somente
no desktop.

- Escreva uma instrução e clique em **Executar**, ou pressione **⌘Enter**
  (**Ctrl+Enter** no Windows). A visão principal é `v_charge_normalized`: uma
  linha por cobrança, com os valores convertidos para a moeda de relatório.
- A lista de modelos preenche o editor com uma consulta inicial — gasto
  mensal, gasto por provedor, principais serviços, linhas de negócio, gasto
  não alocado, previsão de fim de mês, divisões por região e por categoria de
  serviço, principais recursos, descontos em relação ao preço de tabela,
  lotes de ingestão recentes e snapshots de saldo.
- Só instruções de leitura rodam: qualquer coisa que possa gravar é recusada
  antes de chegar ao banco de dados, e o registro é aberto como somente
  leitura para a consulta de qualquer forma. Nada digitado aqui pode alterar
  seus dados.
- Resultados grandes param em um orçamento de linhas — no máximo 100.000
  linhas, menos para resultados largos — e a linha de status avisa quando um
  resultado foi cortado. Adicione um `LIMIT` ou uma agregação para ver tudo.
- Um resultado continua na tela depois que você edita o SQL ou muda a moeda
  de relatório, marcado como não correspondendo mais ao que está na página.

## Colunas úteis {#columns}

O registro tem os nomes das colunas do [FOCUS](https://focus.finops.org/):
`billed_cost` e `effective_cost`, `charge_category` (`Usage`, `Purchase`,
`Credit`, `Tax`, `Adjustment`), `service_name`, `service_category`,
`resource_id`, `region_id`, `pricing_quantity` e `pricing_unit`, além de
`x_model` para o modelo que uma linha de provedor de modelos cobra. As linhas
de tokens também trazem `consumed_quantity`, `consumed_unit`, `sku_meter` e
`sku_price_details` do FOCUS 1.5; veja
[FOCUS e dados de tokens](focus.md#query) para uma consulta sobre eles.
`cost_basis` diz quanto peso um valor tem: `authoritative` quando vem da
fatura, `estimated` para uma alocação como a divisão por recurso da
Cloudflare, `absent` para uso sem valor.
