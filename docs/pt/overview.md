---
title: "Visão geral: gasto líquido, previsão e contas"
description: "Como a Visão geral do CloudBridge lê o gasto: líquido e bruto, créditos, a previsão, as maiores variações e o uso não alocado, além das contas e da saúde dos dados."
---

# Visão geral e contas

**[English](../overview.md)**&emsp;**[中文](../zh/overview.md)**&emsp;**[日本語](../ja/overview.md)**&emsp;**[한국어](../ko/overview.md)**&emsp;**[Français](../fr/overview.md)**&emsp;**[Español](../es/overview.md)**&emsp;**[Deutsch](../de/overview.md)**&emsp;[Documentação](index.md)

## A Visão geral {#overview}

O cabeçalho traz um controle de intervalo — **MTD**, **30d** ou **12m** — e
todo número da página é calculado para a janela que você escolher.

- O **gasto** em destaque é líquido de créditos: o que você realmente pagou.
  O uso bruto e os créditos que o reduziram aparecem ao lado.
- O **gráfico**, o percentual de variação, **Para onde foi** e as **maiores
  variações** rodam sobre o uso bruto. Uma conta cujos créditos de uso cobrem
  tudo chega a cerca de zero no líquido, e uma tendência desenhada sobre essa
  base é ruído.
- Para **MTD**, um segundo cartão prevê o fim do mês a partir do ritmo de
  consumo, com uma faixa otimista e uma pessimista.
- **Não alocado** é a parcela do uso que não chega a nenhuma linha de negócio
  — a parte da fatura que você ainda não consegue explicar. Veja
  [Atribuição](attribution.md).
- Se cobranças do intervalo não têm taxa de câmbio, um aviso diz que elas não
  entram nos totais.

Passar o mouse sobre um gráfico ajusta para o ponto mais próximo e mostra a
data e o valor daquele intervalo. **Atualizar** busca as contas cujos dados
são mais antigos que o intervalo de atualização; **Forçar atualização** busca
todas — veja [quanto custa](aws.md#cost).

## Uma conta por vez {#account}

Clique no nome de uma conta na página **Contas** para entrar nela: o mesmo
controle de intervalo, uma linha de líquido / bruto / créditos, a tendência de
uso dessa conta e uma tabela por serviço com a participação e a variação de
cada serviço. A mesma divisão por dimensão da [Atribuição](attribution.md)
também está lá.

## Exportar uma revisão mensal de custos {#report}

**Exportar relatório** na Visão geral salva um mês como um único arquivo HTML,
pronto para imprimir ou compartilhar. Escolha um mês, com o padrão no mais
recente já encerrado, depois **Escolher arquivo e exportar** e escolha onde
salvar. O arquivo não carrega nada de fora, e nada é enviado. Isso exige o
CloudBridge 0.9.0 ou mais recente no desktop: a demonstração no navegador não
tem exportação.

O relatório cobre todas as contas na moeda de relatório, e não há filtros por
provedor ou por conta. Ele traz:

- custo líquido, uso e créditos, e a variação em relação ao mês anterior;
- **Custo por serviço**, **Custo líquido por região** e **Uso por linha de
  negócio**;
- **Previsão e orçamentos**, para um mês ainda em andamento;
- **Saúde dos dados**, os principais **Insights** e **Fontes**, que lista de
  onde vieram os dados de cada fonte e quando foram ingeridos pela última vez;
- **O que esses números deixam de fora**, como cobranças sem taxa de câmbio,
  linhas de uso sem valor, ou um inventário que nunca foi verificado ou foi
  verificado só em parte.

Um mês ainda em andamento mostra números do mês até a data e nenhuma variação,
porque a coluna do mês anterior é um mês inteiro. O relatório nomeia contas,
serviços e recursos, então leia-o antes de enviá-lo para fora da sua equipe.

## Congelar um mês {#snapshots}

O registro está sempre mudando: uma atualização ou importação pode reescrever
um mês, e os provedores corrigem faturas depois que o mês termina. Os
**snapshots de fim de mês** na página de uma conta guardam uma cópia que não
muda, para fechar o mês contra o que vier depois. Isso exige o CloudBridge
0.9.0 ou mais recente. Para comparar uma cópia com a fatura do provedor, veja
[Conciliação](reconciliation.md#snapshot).

Escolha o mês e clique em **Congelar período**. Uma caixa de diálogo diz
quantas cobranças a cópia vai conter e quanto elas somam. A cópia guarda essas
cobranças, os totais por moeda de cobrança, as taxas de câmbio em uso e de
onde veio a fatura, e nenhuma atualização ou importação posterior a altera.

- **Comparar com o registro.** Cada revisão mostra **Confere com o registro**
  ou **Difere do registro**, com tabelas por moeda de cobrança, serviço e
  categoria de cobrança. Clique em uma linha para ver as cobranças por trás
  dela. As diferenças aparecem por moeda, então uma taxa de câmbio não
  consegue esconder uma.
- **Revisões.** Depois que a fatura mudou, **Congelar nova revisão** adiciona
  outra cópia e mantém as anteriores. Se a fatura não mudou, nenhuma revisão é
  adicionada.
- **Um mês ainda em andamento** pode ser congelado, mas a caixa de diálogo
  avisa que a cópia ficará incompleta, e o snapshot continua dizendo isso
  depois.
- **Valores ausentes.** Um mês cujas cobranças têm uso mas não têm valores não
  tem total, o que não significa que custou zero. O cartão diz isso e informa
  quantas cobranças não têm valor ou não têm taxa de câmbio.
- **Conferir uma cópia.** Cada revisão mostra o ID do snapshot, o lote de
  ingestão e o checksum. Se as cobranças armazenadas não corresponderem mais
  ao checksum, o cartão avisa para não confiar naquela revisão.

Os snapshots ficam em `billing.duckdb`, então um
[backup](settings-and-data.md#backups) da pasta de dados os inclui. Excluir o
histórico de cobrança de uma conta também os remove.

## Adicionar e remover contas {#accounts}

Para adicionar uma, vá em **Contas**, escolha a fonte, informe um nome e — para
uma fonte de API — a credencial, e clique em **Salvar**. Uma fonte de API
busca na hora a fatura deste mês e a do mês passado; **Validar**, na linha
dela, confere a credencial isoladamente. Quando as ferramentas do próprio
provedor estão configuradas na máquina, o formulário pode ler a credencial do
ambiente ou do perfil da CLI em vez de guardar uma cópia.

Excluir uma conta sempre remove a linha dela e as credenciais do chaveiro. Se o
registro tiver cobranças dela, a caixa de diálogo também oferece **Excluir
também o histórico de cobrança**, desligado por padrão. Desligado, as
cobranças ficam e **continuam contando em todos os totais**; ligado, elas, as
cargas brutas por trás delas e quaisquer
[snapshots de fim de mês](#snapshots) são removidos. Nenhuma das duas opções
pode ser desfeita. Histórico que sobreviveu à conta aparece na página Contas
em **Histórico de cobrança de contas excluídas**, onde **Excluir histórico**
o remove.

## Saúde dos dados {#data-health}

O CloudBridge verifica o registro em busca de coisas que tornam um total menos
confiável do que parece:

- cobranças cuja moeda a tabela de câmbio não consegue converter;
- uso sem tag `business_line`;
- uso sem região;
- ajustes que nenhuma cobrança explica;
- uso de produtos que ainda não têm categoria de serviço.

A Visão geral os mostra em uma faixa de **Qualidade dos dados**, a página
Contas em um cartão de **Saúde dos dados**, e a página de uma conta lista os
dela. **Descartar** oculta um achado para aquele período de cobrança; o mesmo
achado em um período posterior aparece de novo.

## Moeda de relatório {#currency}

**Configurações → Relatórios** escolhe USD ou CNY. As cobranças mantêm a
moeda em que foram faturadas; uma tabela de câmbio embutida e com datas as
converte para exibição, a uma taxa não posterior à data da cobrança. As taxas
não são dados de mercado em tempo real. Uma taxa ausente é reportada, nunca
tratada como 1:1.
