---
title: "Saldo do DeepSeek e gasto por modelo da API"
description: "Conecte o DeepSeek ao CloudBridge com uma chave de API para o saldo pré-pago e importe o download de uso para o gasto por dia e por modelo."
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[日本語](../ja/deepseek.md)**&emsp;**[한국어](../ko/deepseek.md)**&emsp;**[Français](../fr/deepseek.md)**&emsp;**[Español](../es/deepseek.md)**&emsp;**[Deutsch](../de/deepseek.md)**&emsp;[Documentação](index.md)

A API do DeepSeek reporta um **saldo** — concedido e recarregado —, não um
detalhamento de gastos. Para o detalhe do gasto, importe o download do
console.

## API de saldo {#api}

1. Abra [platform.deepseek.com](https://platform.deepseek.com/) e crie uma
   chave de API.
2. Adicione a conta no CloudBridge usando essa chave.

O saldo alimenta a regra **Piso de saldo** (veja
[Alertas, regras e orçamentos](alerts.md)). Uma chave usada para consultas de
saldo também pode autorizar requisições pagas de modelos, então proteja-a e
revise as permissões dela — veja
[Permissões dos provedores](permissions.md#deepseek).

## Download de uso {#export}

No console, vá em **Usage → Download** e importe o ZIP exatamente como
baixado: o CloudBridge lê o `cost-*.csv` dentro dele e ignora o
`amount-*.csv`, cuja coluna `amount` traz contagens de tokens, não dinheiro.
Veja [Importação de arquivo de fatura](bill-import.md).
