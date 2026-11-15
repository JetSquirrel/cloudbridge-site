---
title: "0.5.0: ele continua vigiando"
description: "O CloudBridge fica na barra de menus e se atualiza em uma agenda, a Cloudflare entra no registro dividida até o bucket e o Durable Object, e o Insights escaneia AWS e Cloudflare em busca do que cortar."
date: 2026-10-08
tag: Lançamento
---

# 0.5.0: ele continua vigiando

<p class="post-meta">2026-10-08&emsp;Lançamento&emsp;<a href="./">Todos os posts</a></p>

Um alerta de custo só vale alguma coisa enquanto o dinheiro ainda está sendo gasto. Até agora, o CloudBridge coletava uma fatura quando alguém o abria e apertava Atualizar, então um alerta podia ficar sem ser lido por todo o tempo em que a janela ficasse fechada. Esta versão trata dessa lacuna: o aplicativo continua rodando depois que a janela fecha, a fatura que ele lê desce até o recurso que a gastou, e uma atualização que dá errado não custa mais nada em dobro.

## Ele continua rodando

No macOS e no Windows, fechar a janela deixa o CloudBridge na barra de menus (a área de notificação no Windows). O título do ícone é o gasto do mês, com o número de alertas abertos ao lado quando há algum. Clicar nele abre um painel com o mês até hoje, a previsão de fechamento do mês, os alertas abertos e os serviços que mais mudaram em relação ao mês passado.

Por trás, uma agenda acorda a cada 15 minutos, coleta as contas vencidas, executa as regras de alerta e publica uma notificação do sistema para cada alerta que dispara. Ela ainda espera o intervalo de atualização antes de perguntar de novo a um provedor, então custa o que custaria um Atualizar diário. **Abrir ao iniciar**, em Configurações → Segundo plano, o inicia na barra de menus depois de uma reinicialização, sem abrir a janela.

Os builds para Linux não têm ícone de bandeja e ainda encerram junto com a janela; a agenda e as notificações rodam enquanto ele está aberto.

## Cloudflare, até o recurso

A Cloudflare é a sétima fonte. Um ID de conta e um token de API com Billing → Read leem seu consumo faturável: gasto por serviço, por dia. O diário importa aqui. Um Worker ou Durable Object que começa a fazer loop está no registro no dia seguinte, não na fatura no fim do mês.

A fatura, porém, para no serviço: “operações Classe B do R2, 734 em 3 de outubro”, não em qual bucket. Adicione Account Analytics → Read ao token e o CloudBridge pede à API GraphQL Analytics da Cloudflare o consumo de cada recurso nos medidores que a fatura nomeia, e então divide a linha de cada dia por essas parcelas. Buckets R2, Workers, bancos D1 e namespaces de Durable Object recebem cada um a sua parte, e as partes continuam somando o que a Cloudflare faturou. Elas são marcadas como estimativas, porque as analytics são amostradas e uma franquia gratuita pertence à conta, não a um recurso específico.

O consumo dentro da franquia gratuita também é mantido, com um custo zero ao lado. É normalmente ali que um descontrole começa: o consumo sobe por dias antes de o primeiro centavo ser faturado.

## Insights: o que cortar

O Insights compara a fatura com o que está de fato rodando. É opcional: **Configurar e escanear** pergunta antes, e então instala um build fixado e verificado por checksum do [corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist), o nosso fork, que escaneia cada conta em modo somente leitura.

Na AWS, ele encontra instâncias paradas cujos volumes ainda são faturados, endereços IPv4 públicos ociosos, recursos sem tag de proprietário e sem nenhuma stack que os gerencie, e recursos que são faturados mas estão ausentes do escaneamento. Cada um é precificado a partir da fatura quando a conta lê o seu Data Export. Na Cloudflare, ele lista Workers, buckets R2, bancos D1, namespaces KV, zonas e Durable Objects, cada um com a sua parcela da fatura e o seu consumo neste período.

Uma conta grande não inunda mais a página. Todo cartão abre em um resumo por tipo, com contagens e custo, e lista recursos apenas quando você abre um tipo, cinquenta por vez.

## Nada pago duas vezes

Auditamos o que o próprio CloudBridge pode custar a você, agora que ele se atualiza sozinho:

- **Uma ingestão que falha não é coletada de novo dentro do intervalo de atualização.** Se a AWS respondeu a uma requisição e o armazenamento da resposta falhou depois (disco cheio, um bug de mapeamento), a agenda antes comprava os mesmos dados de novo a cada 15 minutos. Agora ela espera o intervalo e diz por quê; Forçar atualização ainda tenta de novo na hora.
- **Uma conta que falha é tentada cada vez menos.** A espera começa em 15 minutos e dobra até o intervalo de atualização, e uma notificação avisa que a conta deixou de se atualizar.
- **Um mês de AWS Data Export que não mudou não é baixado de novo.** Os ETags dos arquivos são verificados antes.
- **Os meses do Cost Explorer são lidos por inteiro.** Um mês grande volta em páginas, e antes só a primeira página era lida. Cada página extra é uma requisição faturada, limitada a 20.

## Coisas menores

- **As categorias de serviço significam a mesma coisa em toda nuvem.** ECS, EC2 e o ECS da Volcengine são todos Computação / Máquinas virtuais, então a visão Categoria da página de Atribuição compara nuvens. Um registro existente é migrado na primeira abertura.
- **Uma homepage que mostra o que ele lê.** O site de documentação lista toda nuvem e plataforma de modelos suportada com o seu logo.

A lista completa está no [changelog](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## O que vem a seguir

Achados da própria Cloudflare, começando por namespaces de Durable Object cujos objetos mantêm alarmes ativos, precisam de um escaneamento de verdade para serem julgados. As APIs de faturamento da Volcengine, da OpenAI e da Anthropic ainda estão pendentes; até lá, os exports delas são importados.
