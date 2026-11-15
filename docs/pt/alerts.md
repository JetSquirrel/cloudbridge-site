---
title: "Alertas, regras e orçamentos de custo na nuvem"
description: "Regras de alerta do CloudBridge para anomalias de custo, pisos de saldo, gasto sem tags e orçamentos: quando rodam, o que medem e como os alertas se resolvem."
---

# Alertas, regras e orçamentos

**[English](../alerts.md)**&emsp;**[中文](../zh/alerts.md)**&emsp;**[日本語](../ja/alerts.md)**&emsp;**[한국어](../ko/alerts.md)**&emsp;**[Français](../fr/alerts.md)**&emsp;**[Español](../es/alerts.md)**&emsp;**[Deutsch](../de/alerts.md)**&emsp;[Documentação](index.md)

As regras são avaliadas contra o registro quando o aplicativo abre e depois de
cada atualização — incluindo a
[atualização em segundo plano](background.md), que busca cada conta depois que
o intervalo de atualização dela passou enquanto o CloudBridge está rodando,
inclusive com a janela fechada no macOS e no Windows. Cada novo alerta publica
uma notificação do sistema. Abrir a página Alertas verifica de novo se os
alertas abertos foram resolvidos.

## As regras {#rules}

Três regras vêm habilitadas; revise-as na página **Regras** e desabilite as que
você não precisa.

| Regra | Dispara quando | Padrão |
| --- | --- | --- |
| Anomalia de crescimento de custo de modelo | O gasto diário de um par fonte/serviço excede a base dos 7 dias anteriores por dias consecutivos | Acima de 2,5× por 2 dias seguidos |
| Piso de saldo | Um saldo pré-pago cai abaixo do valor do orçamento mensal da conta, ou do piso padrão quando não há orçamento | 200, na moeda do próprio saldo |
| Proporção de gasto sem tags | A parcela de uso não alocado do mês excede o limite e é maior que a do mês passado | Acima de 15% e crescendo |

A regra de anomalia precisa de uma base: um serviço que não custou nada nos
últimos sete dias nunca a dispara, por mais que gaste depois. Um workload que
passa de nada para um descontrole — um projeto esquecido que começa a fazer
loop — é pego por uma regra de [Orçamento da conta](#budgets) baseada na
previsão de fim de mês; [Cloudflare](cloudflare.md#runaway) mostra o passo a
passo.

**Nova regra**, na página Regras, cria mais: escolha um tipo, ajuste as
configurações e clique em **Criar regra**. Uma regra nova fica habilitada na
hora, e uma regra de anomalia pode ser limitada a uma conta.

## Orçamentos {#budgets}

O cartão **Orçamentos mensais**, na página Regras, define quanto uma conta pode
custar em um mês. Escolha a conta, informe um **Orçamento mensal** e um
**Alertar em (% do orçamento)** e clique em **Salvar orçamento**; **Remover**
o exclui. Cada conta com orçamento passa a mostrar quanto do orçamento este mês
já usou, na moeda de relatório.

Um orçamento sozinho só desenha essa linha. Para ser avisado, crie uma regra
de **Orçamento da conta** para a conta e escolha:

- **Com base em** — *Custo até a data* para o mês até agora, ou *Previsão de
  fim de mês* para a projeção pelo ritmo de consumo;
- **Tipo de limite** — *% do orçamento*, ou um *Valor* fixo.

Funciona ao contrário também: a regra mede em relação ao orçamento, então uma
regra de **Orçamento da conta** em uma conta sem orçamento nunca dispara, mesmo
com um limite do tipo *Valor*. Defina o orçamento primeiro.

O orçamento de uma conta também serve como o piso dela na regra de Piso de
saldo.

## Ler um alerta {#alerts}

Um alerta traz as medições por trás dele: gasto e base, saldo e piso, ou
parcela não alocada. As projeções são estimativas a partir de dados recentes,
não custos garantidos para o fim do mês. **Adiar** oculta um alerta por um
tempo; **Descartar** o fecha. Um alerta aberto é marcado como **resolvido**
quando uma avaliação posterior descobre que a condição dele não vale mais.

**Ver as cobranças** abre o serviço do alerta na [Consulta](query.md), em todos
os meses.

Um saldo baixo é um único alerta, e não um cartão novo a cada dia. Ele mantém
os números mais recentes até o saldo se recuperar ou você o descartar, e
cartões antigos do mesmo saldo se fundem nele na próxima verificação.

## Notificações {#notifications}

Cada alerta que dispara enquanto o CloudBridge está rodando é anunciado uma vez
como uma notificação do sistema; alertas que já estavam abertos quando o
aplicativo iniciou não são repetidos. Desligue-as em **Configurações → Segundo
plano → Notificações de alerta**.
