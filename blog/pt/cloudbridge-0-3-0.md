---
title: "0.3.0: traga a sua própria fatura"
description: "Uma fatura baixada de um console agora é importada para o mesmo registro que as APIs alimentam, a Visão geral deixa de confundir um custo coberto com um custo barato, e a interface é reconstruída com a densidade de um desktop."
date: 2026-09-11
tag: Lançamento
---

# 0.3.0: traga a sua própria fatura

<p class="post-meta">2026-09-11&emsp;Lançamento&emsp;<a href="./">Todos os posts</a></p>

A 0.2.0 deu ao CloudBridge uma única tabela de fatos e uma única moeda. Deixou uma coisa de fora: uma API de faturamento nem sempre é a melhor leitura de uma fatura e, às vezes, não é leitura nenhuma. O `QueryBillOverview` do Alibaba Cloud reporta o Model Studio (百炼) como um único número por mês. A API da DeepSeek reporta um saldo e nada sobre em que o dinheiro foi gasto. Volcengine, OpenAI e Anthropic têm uma API administrativa para a qual você pode não ter uma chave.

Mas cada um desses consoles tem um botão de download. A 0.3.0 transforma o que sai dele em uma forma de primeira classe de entrar no registro.

## Um segundo canal, não um segundo esquema

Um export importado vira as mesmas linhas `fct_charge` que uma coleta produz. Daí para frente — o painel, os alertas, o Sankey — um mês importado é indistinguível de um mês coletado. O que difere fica registrado em vez de escondido: `ingest_batch.channel` diz se um período chegou por coleta ou por importação, e um mês importado nunca é sobrescrito por uma coleta automática, **inclusive com Forçar atualização**. O export é a leitura mais fina; “forçar” significa “não confiar na janela de atualidade”, não “jogar fora o que eu importei”. Para atualizar um mês importado, importe um export corrigido dele.

Uma importação **substitui** todos os meses que o arquivo cobre. Tem de ser assim: o export é a fatura do próprio provedor, então somá-lo a uma leitura de API do mesmo mês contaria o mês duas vezes.

Cinco fontes importam hoje: o detalhamento de faturas (账单明细) do Alibaba Cloud e da Volcengine, os exports de custo ou de consumo da OpenAI e da Anthropic, e a DeepSeek.

## Contagens de tokens não são dinheiro

Um export de consumo traz contagens de tokens e nenhum valor. Essas linhas são armazenadas com `billed_cost` NULL e `cost_basis = absent` — precificá-las pela tabela colocaria em `billed_cost` um número que ninguém jamais pagou.

O console da DeepSeek faz o mesmo ponto de forma mais afiada. O download é um zip de dois CSVs: `cost-*.csv`, cuja coluna de dinheiro se chama `cost`, e `amount-*.csv`, cuja coluna chamada `amount` é uma *contagem de tokens*. Leia o segundo como dinheiro e um dia de 10.787 tokens de entrada em cache é lançado como ¥10.787. Por isso o CloudBridge abre o zip, lê a metade de custo e recusa a outra metade pelo nome. Você importa o zip exatamente como o baixou.

Os nomes das colunas, por sua vez, são associados por listas de aliases que cobrem o console em chinês, o console em inglês e os nomes de campo da API de cada provedor — nenhum desses exports é um formato de arquivo documentado. Uma coluna que não corresponde a nada gera um erro que nomeia as colunas que o seu arquivo realmente tem. Um arquivo que não é UTF-8 é recusado com a instrução que resolve o problema, em vez de ser decodificado por um palpite que destruiria todos os nomes de produto da fatura.

## O que um crédito esconde

Um total líquido de créditos é o número certo para o destaque: é o que você pagou. É a base errada para uma tendência. Uma conta cujo consumo é totalmente coberto por créditos fecha em cerca de US$ 0, e uma porcentagem mês a mês calculada sobre isso é ruído — uma conta real produziu −318,9%.

Então a Visão geral agora separa as duas coisas. O destaque continua líquido, com o consumo bruto e os créditos que o reduziram mostrados ao lado. Tudo o que vira tendência ou ranking — o gráfico, a porcentagem de variação, “Para onde foi”, as maiores variações — roda sobre o consumo bruto. O que você consumiu e o que foi faturado são perguntas diferentes, e a página agora responde às duas em vez de tirar uma média entre elas.

O cabeçalho também traz um controle de intervalo: do mês até hoje, os últimos 30 dias corridos ou os últimos 12 meses de calendário. Todo número da página é calculado para a janela que você escolheu.

## Densidade de desktop

A interface passa para o [GPUI Kit](https://crates.io/crates/gpui-kit) 0.6 — uma dependência no lugar de três, com as gramáticas do tree-sitter desligadas, porque um painel de custos não tem por que compilar uma pilha de realce de sintaxe.

Com isso veio uma decisão que o framework deixa em aberto: esta é uma ferramenta de dados densa, não uma página web. Uma fonte base de 13px e um raio de cartão de 6px são aplicados no nível do aplicativo, por cima do que quer que um arquivo de tema traga. O cartão de sincronização da barra lateral virou uma barra de status na base da janela, do jeito que um aplicativo de desktop informa estado. Os tamanhos derivam da escala rem, então a interface inteira continua ampliando junto com a fonte base.

E os valores deixaram de arredondar gastos abaixo de um dólar para `$0`: unidades inteiras a partir de 100, duas casas decimais a partir de um centavo, e `<$0.01` abaixo de um centavo — um número pequeno agora é legível como um número pequeno, e não como nada.

## Também na 0.3.0

- **Dados de demonstração**, em Configurações: três contas e doze meses de um registro fictício com formatos realistas, carregados e apagados com um botão. Tudo o que é de demonstração fica sob o prefixo `demo-`, não contém credenciais e é ignorado pela atualização, então nenhuma linha de demonstração chega jamais à API de um provedor.
- **Um item de keychain por conta, não dois.** No macOS, toda leitura do keychain pode abrir um pedido de senha — o controle de acesso do item nomeia o binário que o armazenou, então uma recompilação é um binário novo. Uma atualização que coletava vários períodos pagava esse custo por período e por chave. O par agora é um único item, lido uma vez por sessão; um par ainda no formato antigo de duas entradas migra na primeira leitura.
- **O intervalo de atualização é de 24 horas, e configurável** (6, 12, 24 ou 48). Antes era um 6 fixo. A fatura de um provedor não se move mais rápido do que um dia de nenhuma forma que valha o custo.
- **“Resolvidos neste mês”** na página de Alertas se baseia em quando um alerta foi resolvido, não em quando foi gerado.
- As gravações de Configurações e a troca de moeda rodam fora da thread da UI, e uma gravação que falha aparece em uma cor própria, para não ser confundida com uma que foi salva.

## O que vem a seguir

O [roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) tem o resto do P1: um canal de *exportação* de arquivos de fatura (S3 / OSS + Parquet) para as faturas que chegam em uma agenda em vez de pelo navegador, e alocação por tag com um nó “não alocado” explícito. As APIs de faturamento da Volcengine, da OpenAI e da Anthropic ainda estão pendentes — essas fontes ficam no registro com a credencial que cada uma vai querer já nomeada.
