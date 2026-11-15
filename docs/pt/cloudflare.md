---
title: "Custos da Cloudflare por bucket R2, Worker e D1"
description: "Conecte a Cloudflare ao CloudBridge com um token de API: uso faturável diário dividido entre buckets R2, Workers, D1 e Durable Objects."
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[日本語](../ja/cloudflare.md)**&emsp;**[한국어](../ko/cloudflare.md)**&emsp;**[Français](../fr/cloudflare.md)**&emsp;**[Español](../es/cloudflare.md)**&emsp;**[Deutsch](../de/cloudflare.md)**&emsp;[Documentação](index.md)

O CloudBridge lê o uso faturável da Cloudflare: gasto por serviço, **por
dia**. Esse é o ponto. Um Worker ou um Durable Object que entra em loop
aparece no registro no dia seguinte, não na fatura no fim do mês — e o uso
dentro da franquia gratuita também é guardado, com custo zero ao lado, porque
é exatamente ali que um descontrole começa.

## Conectar a conta {#connect}

1. No [painel da Cloudflare](https://dash.cloudflare.com/profile/api-tokens),
   vá em **My Profile → API Tokens → Create Token** e comece por
   **Create Custom Token**.
2. Conceda **Account → Billing → Read** e limite **Account Resources** à
   conta que você quer acompanhar.
3. Copie o ID da conta na página inicial da conta no painel.
4. Adicione a conta no CloudBridge com o ID da conta e o token.

A API de uso faturável cobre apenas contas pay-as-you-go (self-serve) e é uma
API alpha; uma conta Enterprise é reportada como não coberta. A Cloudflare
cobra em um ciclo ancorado no início da assinatura; cada mês calendário no
CloudBridge guarda os dias que caem dentro dele.

## Divisão por recurso {#split}

A fatura para no serviço — *R2 Class B operations, 734 on 3 October* —, não
em qual bucket. Adicione **Account → Account Analytics → Read** ao token e o
CloudBridge pede à API GraphQL Analytics o uso de cada recurso dos medidores
que a fatura nomeia, e então divide a linha de cada dia por essas
participações:

| Fatura | Dividida entre |
| --- | --- |
| Operações R2 Class A e B, armazenamento | Buckets R2 |
| Requisições e CPU de Workers | Workers (por requisições) |
| Linhas lidas e gravadas, armazenamento de D1 | Bancos de dados D1 |
| Requisições, duração, linhas e armazenamento de Durable Objects | Namespaces de Durable Object |

As partes somam o que a Cloudflare cobrou e são marcadas como estimativas:
as análises são amostradas, e uma franquia gratuita pertence à conta, não a
um recurso específico. Um medidor que as análises não conseguem dividir — KV,
Queues, qualquer coisa não reconhecida — ou um token sem a permissão mantém a
linha inteira, na conta. O [Insights](insights.md) mostra a participação de
cada recurso e o uso dele neste período.

## Detectar um descontrole {#runaway}

Nada impede uma conta Cloudflare pay-as-you-go em um limite de gastos, então
um alarme de Durable Object ou um Worker em loop cobra enquanto rodar. O
CloudBridge também não consegue impedir; ele consegue avisar no primeiro dia,
e não na fatura. Configure isso para toda conta Cloudflare, inclusive as
silenciosas — um projeto que ninguém usa é justamente o que ninguém vigia:

1. Na página **Regras**, dê à conta um **Orçamento mensal**: quanto custa um
   mês normal, com alguma folga. A regra abaixo mede em relação a ele, e não
   faz nada para uma conta sem um.
2. Clique em **Nova regra**, escolha **Orçamento da conta** para a conta e
   defina **Com base em** como **Previsão de fim de mês**.
3. Em **Configurações → Atualização**, encurte o intervalo de atualização
   para 6 horas, e mantenha o CloudBridge rodando na
   [barra de menus](background.md) com **Abrir no login** ativado.

A previsão é o que faz isso funcionar. Ela calcula a média do gasto do mês a
partir do primeiro dia que teve algum, então o primeiro dia de um loop é
projetado para o resto do mês, e a regra dispara na primeira atualização que
lê aquele dia.

A regra de **anomalia de crescimento de custo** não pega esse caso. Ela
compara um serviço com os próprios últimos sete dias, e um serviço que não
custava nada não tem base para crescer, então um projeto adormecido que
acorda em loop nunca a aciona.

Quando o alerta disparar, pare o Worker ou o Durable Object no painel da
Cloudflare. Com o Account Analytics no token, o [Insights](insights.md)
mostra a participação de cada Worker e de cada namespace na fatura, então o
responsável se destaca.

## Verificar recursos {#insights}

O [Insights](insights.md) verifica a conta com o mesmo token e só lê. Para
isso, adicione estas permissões **Read** na mesma conta: **Account
Settings**, **Zone**, **Workers Scripts**, **Workers R2 Storage**, **Workers
KV Storage**, **Queues** e **D1**. Um token sem elas ainda lê a fatura; a
verificação informa o que foi recusado.

Veja [Permissões dos provedores](permissions.md#cloudflare) para saber
exatamente quais endpoints o CloudBridge chama.
