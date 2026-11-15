---
title: "Instale o CloudBridge e leia sua primeira fatura"
description: "Instale o CloudBridge no macOS ou no Windows, explore com a fatura de demonstração, adicione sua primeira conta e leia sua primeira fatura em poucos minutos."
---

# Primeiros passos

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[日本語](../ja/getting-started.md)**&emsp;**[한국어](../ko/getting-started.md)**&emsp;**[Français](../fr/getting-started.md)**&emsp;**[Español](../es/getting-started.md)**&emsp;**[Deutsch](../de/getting-started.md)**&emsp;[Documentação](index.md)

O CloudBridge lê suas faturas de nuvem e de provedores de modelos em um único
registro na sua máquina — a partir de uma API de cobrança ou da exportação
que você baixou — e desenha as tendências. Não há cadastro, nem
sincronização, nem telemetria. Esta página leva você do download à sua
primeira fatura.

## 1. Instalar {#install}

Baixe a versão mais recente na página de
[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest):

| Plataforma | Arquivo |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** Abra o `.dmg`, arraste o **CloudBridge** para **Applications** e
inicie-o de lá. As versões publicadas são assinadas com Developer ID e
notarizadas, então abrem sem necessidade de contorno. Se o macOS bloquear
uma versão atual, [relate o aviso exato](https://github.com/JetSquirrel/cloudbridge/issues)
e sua versão do macOS; não remova a proteção de quarentena como etapa
rotineira de instalação.

**Windows.** O `.exe` não tem assinatura de código, então o SmartScreen
provavelmente vai bloqueá-lo com *Windows protected your PC*. Confira se o
arquivo veio da página oficial de Releases e clique em **More info** e
**Run anyway**. O Windows memoriza a escolha para aquele arquivo; uma nova
versão pergunta de novo.

Binários para Linux e para Mac com Intel não são publicados. Compilar a
partir do código-fonte exige Rust 1.95 ou mais recente — veja a
[configuração de desenvolvimento](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup):

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. Dê uma olhada antes, se quiser {#demo}

[A demonstração no navegador](https://cloudbridge.jetsquirrel.cloud/demo/)
roda as mesmas páginas sobre uma fatura de exemplo. Ela não guarda
credenciais nem acessa nenhum provedor, então importar, atualizar a partir de
uma API de cobrança e o console SQL existem só no aplicativo de desktop.

No aplicativo, uma Visão geral vazia oferece **Carregar dados de
demonstração**, ou abra **Configurações → Dados de demonstração**. As contas
de demonstração não carregam credenciais e são ignoradas pelas atualizações;
**Limpar dados de demonstração**, na mesma página, as remove.

## 3. Adicionar uma conta {#account}

Abra **Contas**, clique em **Adicionar conta**, escolha a fonte e informe um
nome.

| Fonte | Como a fatura chega | O que é preciso |
| --- | --- | --- |
| Amazon Web Services | API de cobrança | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | API do Cost Management | Client ID + secret + ID da assinatura — [Azure](azure.md) |
| Google Cloud | Exportação de cobrança no BigQuery | Arquivo de chave da conta de serviço + tabela de exportação — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | API de cobrança ou uma exportação de fatura | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | API de cobrança | ID da conta + token de API — [Cloudflare](cloudflare.md) |
| DeepSeek | API de saldo ou uma exportação de fatura | Chave de API — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | Exportação de fatura | Nada |
| OpenAI | Exportação de fatura | Nada |
| Anthropic (Claude) | Exportação de fatura | Nada |

Clique em **Salvar**. Uma fonte de API busca na hora a fatura deste mês e a
do mês passado, então uma chave errada aparece como falha nessa busca.

## 4. Traga a fatura para dentro {#bill}

- **Uma fonte de API** buscou a fatura quando você salvou. **Atualizar** na
  Visão geral busca de novo depois que o intervalo de atualização passou.
- **Uma fonte de arquivo** — Volcengine, OpenAI, Anthropic, ou Alibaba Cloud
  e DeepSeek quando você quiser mais detalhe — precisa da exportação: baixe-a
  no console do provedor e clique em **Importar** na linha da conta. Veja
  [Importação de arquivo de fatura](bill-import.md).

## 5. Leia a fatura {#read}

A **Visão geral** mostra a janela que você escolher: **MTD**, **30d** ou
**12m**. Escolha USD ou CNY em **Configurações → Relatórios**. A partir daí:

- [Visão geral e contas](overview.md) explica os números.
- [Alertas, regras e orçamentos](alerts.md) avisa quando os gastos disparam.
- [Barra de menus e segundo plano](background.md) mantém tudo isso rodando
  com a janela fechada.

Algo não aparece? Veja a [Solução de problemas](troubleshooting.md).
