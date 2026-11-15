---
title: "Resolva problemas comuns do CloudBridge"
description: "Soluções para problemas comuns do CloudBridge: pedidos de acesso ao Keychain, AccessDenied na AWS, Visão geral vazia, SmartScreen, janela de console no Windows, erros de importação e alertas que não dispararam."
---

# Solução de problemas

**[English](../troubleshooting.md)**&emsp;**[中文](../zh/troubleshooting.md)**&emsp;**[日本語](../ja/troubleshooting.md)**&emsp;**[한국어](../ko/troubleshooting.md)**&emsp;**[Français](../fr/troubleshooting.md)**&emsp;**[Español](../es/troubleshooting.md)**&emsp;**[Deutsch](../de/troubleshooting.md)**&emsp;[Documentação](index.md)

## O macOS pede acesso ao Keychain {#keychain}

As credenciais salvas ficam no chaveiro do sistema operacional, não nos
arquivos do próprio CloudBridge, então o macOS pode perguntar se o
CloudBridge pode usar o item do Keychain quando o aplicativo lê uma
credencial. Clique em **Always Allow** para que ele não pergunte a cada
atualização, ou em **Allow** para ser perguntado sempre. Se você clicar em
**Deny**, o aplicativo não consegue ler a credencial e a busca dessa conta
falha até você permitir o acesso.

## A AWS retorna AccessDenied {#aws-access-denied}

A chave foi autenticada, mas o usuário dela não tem `ce:GetCostAndUsage`.
Anexe a [política do Cost Explorer](aws.md#cost-explorer) ao usuário do IAM
que é dono da chave. Uma política de controle de serviço da organização
também pode negar o Cost Explorer; e, em uma organização da AWS, as contas
membro só veem dados do Cost Explorer se a conta de gerenciamento permitir.

## A Visão geral fica vazia depois de adicionar uma conta {#empty-overview}

- **Nada foi buscado ainda.** Clique em **Atualizar** na Visão geral. Uma
  fonte de importação de arquivo (Volcengine, OpenAI, Anthropic) não tem o
  que buscar: use **Importar** na linha dela.
- **O provedor ainda não reportou.** Os provedores publicam cobranças com
  atraso; o Cost Explorer da AWS pode levar até cerca de 24 horas, então uma
  conta recém-criada ou o gasto de hoje pode não aparecer de imediato.
  Tente de novo mais tarde em vez de usar Forçar atualização, que pode gerar
  cobranças de requisição do Cost Explorer.
- **A janela é curta demais.** No começo do mês, **MTD** pode ter pouco ou
  nada; mude para **30d** ou **12m**.
- **A fonte é só de saldo.** A API do DeepSeek reporta um saldo, não gasto.
  Importe o download de uso dela para ver o detalhe do gasto.

## Uma conta falha na atualização toda vez {#refresh-failing}

O painel da barra de menus e a Visão geral indicam quais contas falharam e
por quê. Uma conta que falha é tentada de novo depois de 15 minutos, depois
de 30, dobrando até o intervalo de atualização, e uma notificação avisa
quando ela começa a falhar. Se o provedor respondeu mas o CloudBridge não
conseguiu armazenar o resultado — disco cheio, por exemplo — ele não busca
aquele mês de novo dentro do intervalo de atualização, para não pagar duas
vezes pelos mesmos dados; **Forçar atualização** tenta na hora. Veja
[Barra de menus e segundo plano](background.md#failures).

## O SmartScreen do Windows bloqueia o aplicativo {#smartscreen}

A versão para Windows não tem assinatura de código, então o SmartScreen
mostra *Windows protected your PC*. Depois de conferir que o arquivo veio da
página oficial de [Releases](https://github.com/JetSquirrel/cloudbridge/releases),
clique em **More info** e depois em **Run anyway**.

## Uma janela de console abre junto com o aplicativo no Windows {#windows-console}

As versões para Windows até a 0.7.1 abrem uma janela de console preta ao lado
do CloudBridge, e o `.exe` mostra um ícone genérico em vez do ícone do
CloudBridge. Fechar esse console encerra o CloudBridge, inclusive o ícone na
área de notificação, então minimize-o em vez de fechá-lo. As versões
posteriores não abrem console e trazem o ícone no `.exe`, na barra de título
e na barra de tarefas.

## Toda consulta falha no Windows {#windows-query}

Na 0.8.0 no Windows, toda consulta na página Consulta para com um erro de
IO, porque a página abre o arquivo do registro uma segunda vez. O
CloudBridge 0.9.0 corrige isso. Seus dados não são afetados.

## A instalação do verificador para no meio {#scanner-install}

O verificador de recursos do Insights é um download de cerca de 45 MB. Na
0.8.0, uma conexão interrompida no meio faz a instalação parar com *io:
unexpected end of file*: clique em **Configurar e verificar** de novo. A
partir da 0.9.0, o CloudBridge repete sozinho até três vezes um download
interrompido ou que expirou, ou um erro do servidor.

## Erros de importação {#import-errors}

- **"not UTF-8 text"** — os consoles do Alibaba Cloud e da Volcengine podem
  gerar exportações em GBK. Exporte de novo em UTF-8 ou salve o arquivo como
  CSV UTF-8 antes de importar.
- **Colunas não reconhecidas** — os parsers reconhecem alias conhecidos de
  exportações em chinês e em inglês e os nomes de campo dos provedores. Se um
  formato mudou, relate o erro e os cabeçalhos das colunas em uma issue.
  Oculte valores sensíveis; não anexe uma fatura sem ocultação.
- **Um mês diminuiu depois da importação** — uma importação substitui todos
  os meses que o arquivo cobre para aquela conta, então uma exportação
  filtrada por produto deixa só aquele produto. Importe de novo a fatura
  completa, sem filtro.
- **Contagem de tokens, mas nenhum gasto** — uma exportação de uso não traz
  dinheiro; importe a exportação de custo. Para o DeepSeek, importe o ZIP
  como baixado, e não o `amount-*.csv` dele.

## Uma verificação da Cloudflare é recusada {#cloudflare-scan}

A verificação diz qual das duas coisas aconteceu. *Cloudflare did not accept
this account's API token* significa que o token está errado ou expirou:
confira-o na página Contas. *The token cannot read …* significa que o token é
válido mas não tem a permissão Read de algum serviço; adicione as permissões
listadas em [Cloudflare](cloudflare.md#insights). Um token sem elas ainda lê
a fatura.

## Um alerta não disparou {#alert-silent}

- **A regra de orçamento da conta não tem orçamento para medir.** A regra
  não faz nada para uma conta sem **Orçamento mensal**, qualquer que seja o
  tipo de limite. Defina um na página Regras.
- **O gasto começou do zero.** A regra de anomalia de crescimento de custo
  compara um serviço com os próprios últimos sete dias, então um serviço que
  não custava nada não tem base e nunca a dispara. Uma regra de orçamento
  sobre a previsão de fim de mês cobre esse caso: veja
  [Detectar um descontrole](cloudflare.md#runaway).
- **O dia ainda não está no registro.** As regras rodam sobre o que foi
  buscado. A atualização em segundo plano busca uma conta uma vez por
  intervalo de atualização, e só enquanto o CloudBridge está rodando; veja
  [Barra de menus e segundo plano](background.md).
- **As notificações estão desligadas,** ou o alerta já estava aberto quando o
  aplicativo iniciou. De qualquer forma, os alertas abertos aparecem na
  página Alertas.

## Ainda travado {#help}

Dúvidas que a documentação não responde?
[Abra uma issue](https://github.com/JetSquirrel/cloudbridge/issues).
