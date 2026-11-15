---
title: "0.2.0: um visualizador de custos vira um registro"
description: "As cobranças de todas as fontes agora chegam a uma única tabela de fatos no formato FOCUS, as respostas brutas ficam guardadas para que corrigir um mapeamento não custe nada além de reprocessar, e um total enfim tem uma única moeda."
date: 2026-09-01
tag: Lançamento
---

# 0.2.0: um visualizador de custos vira um registro

<p class="post-meta">2026-09-01&emsp;Lançamento&emsp;<a href="./">Todos os posts</a></p>

A versão 0.1 mostrava um número por provedor e chamava aquilo de total. Se você tinha uma conta AWS em dólares e uma conta Alibaba Cloud em yuans, o “total” somava as duas. Créditos eram lidos como consumo. Um saldo era lido como gasto. A 0.2.0 reconstrói a base sobre a qual esses números se apoiam.

## Uma única tabela de fatos

Cada fonte agora é normalizada em uma única tabela de fatos, `fct_charge`, em um novo `billing.duckdb`. As colunas levam os nomes do [FOCUS](https://focus.finops.org/), a especificação aberta de custos e uso da FinOps Foundation, então um crédito é um `Credit`, um reembolso é um reembolso, impostos e taxas de suporte são rotulados como eles mesmos, e os valores mantêm o sinal. Quando um voucher do Alibaba Cloud cobre parte de uma cobrança, a cobrança bruta e o voucher ficam cada um em sua própria linha, e a soma das linhas dá exatamente o que você pagou de fato. Uma diferença que não pode ser explicada vira uma linha `Adjustment` em vez de desaparecer.

Como o esquema já fala FOCUS, um export real de fatura — um AWS CUR ou um arquivo de fatura do Alibaba Cloud — pode entrar depois sem nenhuma mudança de esquema.

## Guardar as respostas brutas

O Cost Explorer cobra US$ 0,01 por requisição, então pedir duas vezes a mesma coisa é uma falha de projeto, não um padrão de uso. Cada resposta de provedor agora é gravada em disco sem alteração, como Parquet particionado no estilo Hive em `raw/` — o mesmo layout que um bucket de export de faturas usa. A normalização é uma função pura de um lote armazenado para as linhas do registro. Duas consequências: uma correção de mapeamento reprocessa o que está em disco em vez de pagar por outra coleta, e a lógica de faturamento pode ser testada a partir de uma resposta gravada.

## Uma única moeda

As cobranças são armazenadas na moeda em que foram faturadas e convertidas para exibição, cada uma a uma taxa cuja data não é posterior à da própria cobrança. Os totais vêm de uma view, `v_charge_normalized`, então trocar a moeda de relatório em Configurações reconstrói uma view e não reescreve nada. Uma cobrança em uma moeda que nenhuma taxa cobre é reportada no painel — nunca contabilizada em silêncio à paridade.

## As credenciais saem do banco de dados

As credenciais agora ficam apenas no keyring do sistema operacional (Gerenciador de Credenciais do Windows, Keychain do macOS). A migração v1 move as que ainda estavam no banco de dados e remove as colunas que as guardavam. O banco pode ser copiado, ter backup feito ou ser inspecionado sem levar suas chaves junto.

## Coletar e normalizar, separados

Uma fonte de faturamento costumava ser um enum com cinco braços de `match`. Agora é uma linha de tabela com um descritor de capacidades, e seus dois métodos são deliberadamente separados: `fetch` acessa a rede e não interpreta nada; `normalize` interpreta e não acessa nada. Adicionar uma fonte é adicionar linhas e um mapeamento, não editar um painel de comutação.

## Também na 0.2.0

- O macOS é distribuído como um `.dmg` contendo o `CloudBridge.app`, em vez de um binário puro compactado que o Finder tomava por um documento.
- Uma atualização agora ingere o período de faturamento atual e o anterior em duas chamadas ao Cost Explorer, onde o painel antes fazia três.
- Os saldos da DeepSeek são registrados como snapshots; uma alta no saldo recarregado entre observações é derivada como uma `Purchase`.
- O botão de Modo Escuro agora realmente muda o tema.

## O que vem a seguir

O [roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) traça o P1: um canal de exportação de arquivos de fatura (S3 / OSS + Parquet), alocação por tag com um nó “não alocado” explícito e um fluxo de custos Sankey. O registro era o pré-requisito dos três — e agora está no lugar.
