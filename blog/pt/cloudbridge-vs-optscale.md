---
title: "CloudBridge vs OptScale"
description: "Um é um servidor de FinOps para uma organização, o outro é um registro de desktop para as faturas de uma pessoa. Qual deles serve depende menos de recursos do que de quem está perguntando."
date: 2026-09-24
tag: Comparação
---

# CloudBridge vs OptScale

<p class="post-meta">2026-09-24&emsp;Comparação&emsp;<a href="./">Todos os posts</a></p>

Os dois projetos são de código aberto e os dois leem faturas de nuvem. Eles foram feitos para pessoas diferentes. O [OptScale](https://github.com/hystax/optscale), da Hystax, é uma plataforma de FinOps auto-hospedada que uma organização roda em um servidor para que engenharia e finanças compartilhem uma visão do gasto em nuvem e ajam sobre ela. O CloudBridge é um aplicativo de desktop que uma pessoa roda na própria máquina, lendo as próprias faturas em um arquivo local.

Os fatos sobre o OptScale abaixo vêm do README, do repositório e da documentação dele em setembro de 2026, com links no final. Se algo aqui ficou desatualizado, as fontes prevalecem.

## A resposta curta

Se várias pessoas precisam de acesso, se o seu gasto está no Azure, no Google Cloud ou no Kubernetes, ou se o que você quer é uma lista de instâncias para redimensionar e de compromissos para comprar, use o OptScale. O CloudBridge não faz nada disso.

Se você é um desenvolvedor ou uma equipe pequena com uma pessoa olhando a fatura, se o seu gasto está espalhado por AWS, Alibaba Cloud, Volcengine e APIs de modelos como OpenAI, Anthropic ou DeepSeek, e se você prefere não rodar um servidor para descobrir quanto gastou, o CloudBridge é a ferramenta menor para isso.

## O que é o OptScale

O OptScale se descreve como uma plataforma de código aberto de FinOps e otimização de custos de nuvem para AWS, Microsoft Azure, Google Cloud, Alibaba Cloud e clusters Kubernetes. Ela ingere dados de faturamento e de consumo e, sobre painéis de custo, detecta recursos não usados e ociosos, recomenda redimensionamento, analisa o uso de Reserved Instance, Savings Plan e Spot, e pode parar VMs de não produção fora do horário de trabalho seguindo uma agenda de energia. A governança tem forma de organização: pools de recursos com cotas e orçamentos, políticas de detecção de anomalias, políticas de tags, ambientes compartilhados e quatro papéis básicos (Member, Engineer, Manager, Organization manager). Ela também cobre Databricks e análise de armazenamento S3.

É um servidor feito de muitos serviços. O repositório tem cerca de vinte diretórios de serviço no nível superior, entre eles `rest_api`, `auth`, `ngui` para a interface web, `risp` para compromissos, `bumiworker` para recomendações, e integrações com Slack e Jira. As instalações de produção vão para o Kubernetes, configurado pelos playbooks Ansible do projeto em Ubuntu 24.04, com um mínimo declarado de 8 núcleos de CPU, 16 GB de RAM e 150 GB de SSD. Existe um modo Docker Compose apenas para avaliação, nos mesmos 8 núcleos e 16 GB. A licença é Apache 2.0.

## O que é o CloudBridge

O CloudBridge é um aplicativo de desktop nativo escrito em Rust com [GPUI](https://gpui.rs/), distribuído para macOS em Apple Silicon e Windows x64. Há também uma [demo no navegador](https://cloudbridge.jetsquirrel.cloud/demo/) rodando com dados de amostra. Ele puxa custos da API do AWS Cost Explorer, da API de faturamento do Alibaba Cloud e da API de saldo da DeepSeek, e importa arquivos de fatura baixados do Alibaba Cloud, da Volcengine, da OpenAI, da Anthropic e da DeepSeek. Tudo cai em um registro DuckDB local, usando nomes de coluna do [FOCUS](https://focus.finops.org/). As credenciais vão para o keyring do sistema operacional. Não há servidor, nem conta, nem sincronização, nem telemetria.

Sobre o registro: uma Visão geral com visões de mês até hoje, 30 dias e 12 meses, atribuição por serviço, modelo e tag com uma parcela não alocada explícita, regras de alerta para gasto diário fora do comum, saldos pré-pagos baixos e custo não alocado, e uma única moeda de relatório construída a partir de uma tabela de taxas de câmbio datada. O branch principal acrescenta regras de orçamento mensal, faixas de confiança em torno da previsão de fechamento do mês, um console SQL somente leitura sobre o registro, e a leitura de exports FOCUS da AWS direto do S3. Nada disso está em uma versão marcada ainda; a 0.3.2 é a mais recente. A licença é MIT.

## Lado a lado

| | OptScale | CloudBridge |
| --- | --- | --- |
| O que você roda | Um servidor: Kubernetes em produção, Docker Compose para avaliar | Um aplicativo de desktop em macOS ou Windows |
| Requisitos declarados | 8+ núcleos, 16 GB de RAM, 150+ GB de SSD | Seu notebook |
| Usuários | Organizações, com papéis e pools | Uma pessoa por instalação |
| Onde os dados ficam | Seu servidor OptScale | Um arquivo DuckDB no diretório de dados do aplicativo |
| Nuvens | AWS, Azure, GCP, Alibaba Cloud, Kubernetes | AWS, Alibaba Cloud, Volcengine |
| Faturas de API de modelos | Não listadas no README de código aberto | OpenAI, Anthropic, DeepSeek, Alibaba Model Studio (百炼), Volcengine Ark (方舟) |
| Como os dados entram | Contas conectadas | APIs de faturamento, ou arquivos de fatura que você baixa |
| Recomendações de otimização | Recursos ociosos, redimensionamento, RI/SP/Spot, agendas de energia | Nenhuma |
| Anomalias e alertas | Detecção de anomalias, políticas de cota e orçamento | Regras de gasto diário, saldo e custo não alocado; regras de orçamento no branch main |
| Alocação de custos | Pools, proprietários, políticas de tags, namespaces e labels do Kubernetes | Serviço, modelo e tag, com a parcela não alocada exibida |
| Integrações | Slack, Jira, Databricks | Nenhuma |
| Licença | Apache 2.0 | MIT |
| Custo do software | Grátis para auto-hospedar; você paga pelo servidor | Grátis; as tarifas de API dos provedores são à parte |

## Onde o OptScale é a melhor escolha

**Mais de uma pessoa precisa dos números.** O OptScale tem usuários, papéis e uma árvore de organização, então finanças e engenharia podem ver os mesmos números com acesso definido por papel. O CloudBridge é um registro em uma máquina. O README dele diz explicitamente que implantações compartilhadas e colaboração em equipe estão fora do escopo.

**Seu gasto está no Azure, no Google Cloud ou no Kubernetes.** O CloudBridge não suporta nem o Azure nem o Google Cloud, e não faz ideia de quanto custa um namespace. O OptScale cobre os três, e consegue dividir o custo de um cluster por namespace, workload e label.

**Você quer que alguém diga o que mudar.** O CloudBridge diz para onde o dinheiro foi. Ele não diz que uma instância está superdimensionada, que um volume está desanexado ou que um Savings Plan se pagaria sozinho. Esse é o núcleo do valor do OptScale, e o CloudBridge não tem equivalente.

**Você precisa de governança.** Cotas por pool, políticas de tags, agendas de energia e alertas enviados ao Slack ou ao Jira são ferramentas de organização. As regras do CloudBridge rodam quando o aplicativo está aberto e depois de uma atualização. Nada roda enquanto ele está fechado.

Uma nota sobre ML: a Hystax já apresentou o OptScale também como uma plataforma de MLOps, com rastreamento de experimentos, leaderboards e versionamento de modelos. Em junho de 2025, os serviços `arcee` e `bulldozer`, o agente de profiling de ML e o executor de experimentos em lote foram removidos do repositório, e o README atual não lista rastreamento de experimentos. Se é por isso que você está olhando o OptScale, confira o que a versão que você implantar realmente inclui.

## Onde o CloudBridge se encaixa

**Uma pessoa, um conjunto de faturas.** Baixe, abra e adicione uma chave de API ou importe um export. Não há cluster para instalar nem nada para atualizar além do aplicativo. Para um desenvolvedor, o servidor que os requisitos mínimos do OptScale descrevem é mais máquina do que a pergunta precisa.

**APIs de modelos ao lado da nuvem.** Para muitos projetos pequenos, a maior fatura não é mais de computação. É de tokens. O CloudBridge lê os exports de custo da OpenAI e da Anthropic, o gasto diário da DeepSeek, os modelos do Model Studio dentro de uma fatura do Alibaba Cloud e os endpoints do Ark dentro de uma fatura da Volcengine, no mesmo registro da conta AWS. Um export de consumo só com tokens continua sendo consumo: ele não é precificado em uma fatura inventada.

**Nuvens chinesas, a partir dos próprios exports.** O 账单明细 do Alibaba Cloud e os arquivos de fatura da Volcengine são importados como saem do console, com nomes de coluna em chinês e em inglês reconhecidos igualmente. O OptScale suporta o Alibaba Cloud. A Volcengine não está na lista dele.

**Dados que ficam onde estão.** O registro e as respostas brutas dos provedores ficam no diretório de dados do aplicativo, e as credenciais ficam no keyring do sistema operacional. Nada vai para terceiros, incluindo nós. Local, porém, não é o mesmo que criptografado. O CloudBridge não criptografa o registro, então a criptografia de disco continua sendo tarefa sua.

## Dá para usar os dois?

Dá, e eles não interferem. Cada um lê os dados de faturamento do provedor por conta própria, e nenhum dos dois escreve em uma conta de nuvem. Uma equipe poderia rodar o OptScale para o gasto compartilhado de AWS, Azure e Kubernetes, enquanto um engenheiro mantém o CloudBridge para as faturas de API de modelos e as contas de nuvens chinesas que o OptScale não lê. Duas coisas a observar: o AWS Cost Explorer cobra por requisição de API, então duas ferramentas consultando-o pagam duas vezes, e os dois registros não vão bater linha por linha, porque mapeiam e convertem as cobranças de formas diferentes.

## Links

- CloudBridge: [demo no navegador](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[documentação](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[código-fonte](https://github.com/JetSquirrel/cloudbridge)
- OptScale: [repositório e README](https://github.com/hystax/optscale)&emsp;[documentação](https://hystax.com/documentation/optscale/)&emsp;[papéis e permissões](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[detecção de anomalias](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[cotas e orçamentos](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[demo ao vivo](https://my.optscale.com/live-demo)
- O commit que removeu os serviços de ML do OptScale: [OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
