---
title: "0.4.0: mais formas de entrar, mais formas de ler"
description: "AWS Data Exports direto do S3, uma página de Modelos para quanto cada modelo de LLM custa por token, um console SQL somente leitura, orçamentos mensais — e o aplicativo inteiro rodando em um navegador."
date: 2026-10-05
tag: Lançamento
---

# 0.4.0: mais formas de entrar, mais formas de ler

<p class="post-meta">2026-10-05&emsp;Lançamento&emsp;<a href="./">Todos os posts</a></p>

A 0.3.0 colocou toda fatura em um único registro; a 0.3.1 fez a interface concordar consigo mesma. A 0.4.0 trabalha nas duas pontas desse registro. Na entrada, uma conta AWS agora pode ler sua fatura a partir do export que a AWS grava no S3, em vez de pedi-la ao Cost Explorer. Na saída, há quatro novas formas de ler o que já está lá: por modelo, por dimensão, contra um orçamento e em SQL. E o mesmo aplicativo agora roda em um navegador, então você pode experimentar tudo antes de instalar qualquer coisa.

## AWS Data Exports, lidos do S3

O Cost Explorer responde com totais, e cada pergunta custa uma requisição. Os Data Exports da AWS (CUR 2.0, no formato “FOCUS 1.2 with AWS columns”) gravam a fatura completa — IDs de recursos, tags, a conta vinculada sob a qual cada linha foi faturada — em um bucket S3 seu. Dê a uma conta AWS a URI `s3://bucket/prefix` do export e Atualizar passa a ler de lá: Parquet ou CSV comprimido com gzip, o que o export estiver configurado para entregar.

Algumas coisas que ele acerta e que são fáceis de errar:

- **Um mês é contado uma vez.** Um export configurado como “create new” mantém todas as entregas lado a lado. O CloudBridge lê apenas os arquivos que o manifesto do período nomeia, então doze atualizações de setembro continuam sendo um setembro.
- **Não entregue não é zero.** Um período que o export ainda não gravou é ignorado, nunca armazenado como um mês vazio.
- **O export de um pagador se divide por conta membro.** Cada linha mantém seu `SubAccountId` e seu `SubAccountName`.

As tarifas de armazenamento e de requisição do S3 continuam valendo, e a política do Cost Explorer não concede acesso ao S3 — a [página de permissões](https://cloudbridge.jetsquirrel.cloud/docs/permissions#aws-s3) traz a política restrita de que o canal de export precisa. Contas sem uma URI continuam usando o Cost Explorer.

## A página de Modelos

O registro armazena quantidades de tokens ao lado dos custos de LLM desde a 0.2.0; nada as lia. A nova página de Modelos lê. Para o intervalo que você escolher, cada modelo recebe seu custo e sua variação, seus tokens de entrada, de saída e de cache, um custo combinado por milhão de tokens e sua parcela de cache, com um gráfico diário de tokens logo abaixo.

Ela também diz o que chama atenção. Um modelo cujas leituras de cache ficam abaixo de 5% do seu lado de entrada está pagando preço de entrada por algo que poderia custar preço de cache. Um modelo que carrega mais de 70% do gasto com modelos é algo que vale a pena saber. Um modelo faturado sem medição de tokens é sinalizado como tal, porque seu custo unitário não pode ser calculado. E uma alta de gasto é confrontada com as contagens de tokens dos dois períodos: quando os tokens extras explicam a alta, é consumo, e só quando não explicam é que ela é reportada como aumento de preço unitário.

Nomes de modelos embutidos no texto dos itens de faturamento do Alibaba Cloud e da Volcengine ainda não são extraídos; as importações da OpenAI, da Anthropic e da DeepSeek nomeiam seus modelos diretamente.

## Outras formas de ler o registro

- **Consulta.** Um console SQL somente leitura sobre o registro DuckDB local, com modelos iniciais. Só instruções de leitura rodam, e o registro é aberto como somente leitura para elas de qualquer forma. Apenas no desktop.
- **Orçamentos.** A página de Regras guarda um orçamento mensal por conta, e uma regra “Orçamento da conta” alerta sobre uma porcentagem ou um valor, contra o custo até a data ou a previsão de fechamento do mês. Regras de anomalia agora também podem ser limitadas a uma conta.
- **Detalhamento por dimensão.** A Atribuição alterna entre tag, serviço, região e categoria de serviço, desenhada como um treemap — a área é o custo, a cor é a variação — ou como barras de participação, com os recursos mais caros do período ao lado. A página de detalhe de uma conta tem o mesmo drill-down.
- **Saúde dos dados.** Achados sobre o que torna um total menos confiável do que parece: moedas que a tabela de taxas não consegue converter, consumo sem tag de atribuição ou sem região, ajustes que nenhuma cobrança explica. Dispense um e ele continua dispensado naquele período.

## CloudBridge no navegador

O crate agora também compila para WebAssembly. A [demo](https://cloudbridge.jetsquirrel.cloud/demo/) não é um mock-up: as páginas, os view models e as regras de alerta são o código do próprio desktop, rodando sobre um registro em memória semeado com a fatura de demonstração no lugar do DuckDB, das APIs dos provedores e do keyring. Consulta, Regras e Configurações ficam no desktop; todo o resto, incluindo a página de Modelos, está lá.

Para manter isso assim, a CI compila a versão de navegador como verificação obrigatória, e as estatísticas que os dois builds calculam — previsões, comparações, decomposições, achados — vivem em um único módulo compartilhado e testado, em vez de uma cópia por backend.

## Coisas menores

- **Excluir uma conta pergunta sobre o histórico dela.** Antes, as cobranças ficavam para trás em silêncio e continuavam contando nos totais sem conta alguma para explicá-las. O diálogo de exclusão agora oferece removê-las, e o histórico deixado por uma exclusão anterior é listado na página de Contas, onde pode ser removido.
- **Uma primeira execução que leva a algum lugar.** Uma Visão geral vazia oferece adicionar uma conta ou carregar a fatura de demonstração, e salvar uma conta de API já coleta a fatura dela na hora.
- **Atalhos de teclado.** ⌘1–⌘9 trocam de página, ⌘R recarrega.
- **A janela abre primeiro.** Os stores abrem e as páginas carregam em segundo plano, cada página na sua primeira visita.
- **O preenchimento do gráfico de gastos** não corta mais uma cunha diagonal atravessando o gráfico.
- **Segurança:** rustls e quick-xml foram atualizados para além de três avisos do RUSTSEC.
- **Rust 1.95** é o mínimo declarado; a declaração antiga nunca era compilável.

A lista completa está no [changelog](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## O que vem a seguir

O [roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) deixa as faturas e passa aos recursos por trás delas: primeiro o custo por recurso, lido das linhas que o export do S3 já fornece, e depois as relações entre recursos — o custo agregado ao longo da propriedade, órfãos que ainda custam dinheiro. As APIs de faturamento da Volcengine, da OpenAI e da Anthropic ainda estão pendentes; até lá, os exports delas são importados.
