---
title: "Encontre recursos ociosos na AWS e na Cloudflare"
description: "O Insights do CloudBridge coloca uma verificação somente leitura da AWS e da Cloudflare ao lado da fatura: instâncias paradas, endereços ociosos, recursos sem dono e o custo deles."
---

# Insights

**[English](../insights.md)**&emsp;**[中文](../zh/insights.md)**&emsp;**[日本語](../ja/insights.md)**&emsp;**[한국어](../ko/insights.md)**&emsp;**[Français](../fr/insights.md)**&emsp;**[Español](../es/insights.md)**&emsp;**[Deutsch](../de/insights.md)**&emsp;[Documentação](index.md)

O Insights compara a fatura com o que está realmente rodando e lista o que
vale a pena olhar, cada item com preço tirado da fatura deste período.

## Configurar e verificar {#scan}

Clique em **Configurar e verificar**. Na primeira vez, o CloudBridge
pergunta antes de instalar o verificador de recursos,
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist)
— código aberto, nosso fork mantido, cerca de 45 MB, guardado na pasta de
dados do próprio CloudBridge e conferido com um checksum embutido no
aplicativo. Depois disso ele verifica:

- cada conta **AWS** com a chave de acesso dela, em todas as regiões que a AWS
  habilita por padrão ou apenas nas que você escolher;
- cada conta **Cloudflare** com o token de API dela.

A verificação só lê — ela lista recursos e não muda nada —, mas a credencial
precisa de acesso de leitura a eles: veja [AWS](aws.md#insights) e
[Cloudflare](cloudflare.md#insights). **Verificar de novo** atualiza o
inventário. A verificação exige o aplicativo de desktop no macOS (Apple
silicon) ou no Windows.

## O que ele encontra {#findings}

Para a AWS:

- **Instâncias paradas** cujos volumes continuam sendo cobrados;
- **Endereços públicos ociosos** — endereços IPv4 alocados mas ligados a
  nada;
- **Recursos sem dono** — sem tag de dono (`owner`, `team`, `project`,
  `cost-center`, `business_line`) e sem stack ou aplicativo que os gerencie;
- **Cobrados mas fora da verificação** — em uma região que a verificação
  cobriu.

Os preços precisam de uma fatura em nível de recurso: uma conta AWS apontada
para o [Data Export](aws.md#data-exports) dela. Sem uma, os achados são
listados, mas sem preço.

Para a Cloudflare, um cartão lista o que a verificação encontrou por tipo —
Workers, buckets R2, bancos de dados D1, namespaces KV, zonas, Durable
Objects —, com a participação de cada tipo e de cada recurso na fatura e o uso
deles neste período, do mais caro para o mais barato. Com
[a fatura dividida por recurso](cloudflare.md#split), é ali que um namespace
ou bucket descontrolado aparece pelo nome.

## Configuração de segurança {#security}

A partir do CloudBridge 0.9.0, uma seção separada sinaliza grupos de
segurança da AWS que abrem SSH ou RDP para toda a internet (`0.0.0.0/0` ou
`::/0`). Ela lê a verificação, não muda nada na sua nuvem e não precisa de
nenhum feed extra. Não é uma checagem de conformidade nem uma revisão de
segurança completa, e os achados dela nunca são somados aos achados de custo.

Cada grupo aparece como **Achado**, **Não avaliado** ou **Avaliado, sem
achado**. Abra uma linha para ver a regra encontrada, por que ela importa e o
que conferir manualmente. Uma regra pública não é prova de exposição: confirme
se o grupo está ligado a alguma coisa.

**Não avaliado** significa que as regras de entrada não puderam ser lidas,
não que o grupo seja seguro. Sem verificação, com uma verificação parcial ou
com uma verificação que não listou nenhum grupo, a seção diz isso em vez de
parecer limpa.

## Resumo primeiro {#summary}

Todo cartão abre nos tipos de recurso, com contagens e custo. Clique em um
tipo para listar os recursos dele, cinquenta por vez, com **Mostrar mais**;
clique de novo para fechá-lo. Uma conta grande fica em uma linha por tipo até
você pedir mais.

Cada achado mostra o ID completo com um botão de copiar, a conta dele e um
link para as cobranças dele, para você conferir contra a fatura.
