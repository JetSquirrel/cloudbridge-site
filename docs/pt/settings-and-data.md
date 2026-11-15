---
title: "Configurações, armazenamento de dados e segurança"
description: "O que o CloudBridge armazena e onde: o registro DuckDB, contas, cargas brutas e configuração, além de intervalo de atualização, moeda, backups e segurança."
---

# Configurações, dados e segurança

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[日本語](../ja/settings-and-data.md)**&emsp;**[한국어](../ko/settings-and-data.md)**&emsp;**[Français](../fr/settings-and-data.md)**&emsp;**[Español](../es/settings-and-data.md)**&emsp;**[Deutsch](../de/settings-and-data.md)**&emsp;[Documentação](index.md)

## Configurações {#settings}

| Configuração | O que faz |
| --- | --- |
| Aparência → Tema | Temas claro e escuro, lembrados entre execuções |
| Aparência → Idioma | [O idioma da interface](#language): Sistema, inglês ou 简体中文 |
| Relatórios → Moeda | USD ou CNY para todos os totais; as cobranças mantêm a própria moeda |
| Atualização → Intervalo de atualização | 6, 12, 24 (padrão) ou 48 horas antes de um mês ser buscado de novo |
| Segundo plano | [Abrir no login, atualização em segundo plano, notificações de alerta](background.md) |
| Dados → Exportar como FOCUS | Cada cobrança como um CSV com os nomes de coluna do FOCUS, para outra ferramenta de FinOps ([detalhes](focus.md#export)) |
| Dados de demonstração | Carregar ou limpar cinco contas de exemplo (AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic) com doze meses de histórico |

**Atualizar** busca os meses mais antigos que o intervalo de atualização;
**Forçar atualização** busca todos e pode gerar cobranças do provedor. Nenhum
dos dois sobrescreve um mês importado. As contas de demonstração usam o prefixo
`demo-`, não carregam credenciais e são ignoradas pelas atualizações.

## Idioma da interface {#language}

O CloudBridge 0.9.0 e versões posteriores são traduzidos para 简体中文: todas
as páginas e caixas de diálogo, o painel da barra de menus, o menu dele e as
notificações do sistema. Até você escolher um idioma em **Configurações →
Aparência → Idioma**, o aplicativo segue o do sistema, e a mudança vale na
hora. A demonstração no navegador segue o idioma do navegador e tem um seletor
no rodapé da barra lateral.

- O menu da bandeja adota o novo idioma na próxima vez que o aplicativo
  iniciar.
- Um alerta mantém o idioma em que disparou. A exceção é o alerta de saldo
  baixo: ele é reescrito com os números mais recentes, no idioma atual.
- Valores e moedas continuam formatados como antes.

## Onde os dados ficam {#storage}

| Plataforma | Local |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux (compilado do código-fonte) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — o registro de cobrança, com a moeda original de cada
  cobrança, os [snapshots de fim de mês](overview.md#snapshots) e as
  [faturas](reconciliation.md);
- `cloudbridge.duckdb` — contas, orçamentos, regras e estado dos alertas;
- `raw/` — cada resposta de provedor e cada arquivo importado, por fonte, conta
  e mês, para que uma correção de mapeamento possa relê-los sem outra
  requisição (**Contas → Reproduzir normalização**);
- `inventory/` e `tools/` — verificações do Insights e o verificador, se
  instalado;
- `config.json` — moeda, tema, intervalo de atualização e configurações de
  segundo plano.

## Backups {#backups}

Encerre o CloudBridge antes de copiar ou abrir os bancos de dados dele. Faça
backup do diretório inteiro — os dois bancos de dados, `raw/` e `config.json` —
e restaure com o aplicativo fechado. As credenciais ficam no chaveiro do
sistema operacional, não no backup; em outra máquina, informe-as de novo. Para
analisar o registro fora do aplicativo, consulte uma cópia em vez do arquivo em
uso.

## Segurança {#security}

- As credenciais ficam no chaveiro do sistema operacional — Keychain do macOS
  ou Gerenciador de Credenciais do Windows; Secret Service nas compilações para
  Linux a partir do código-fonte —, separadas dos bancos de dados.
- O aplicativo usa uma credencial apenas para requisições ao provedor a que ela
  pertence. Usar uma chave no CloudBridge não a torna somente leitura: veja
  [Permissões dos provedores](permissions.md).
- Não existe serviço de sincronização do CloudBridge nem telemetria. Uma
  importação não faz requisição a nenhum provedor.
- **Local não significa criptografado.** O aplicativo não criptografa o
  registro nem os arquivos brutos. Use criptografia de disco e proteja seus
  backups.
- Antes de compartilhar logs, capturas de tela ou exportações de exemplo,
  oculte credenciais, IDs de conta, nomes de recursos e tags.
