---
title: "Gasto na barra de menus e atualização em segundo plano"
description: "Mantenha o CloudBridge de olho com a janela fechada: gasto na barra de menus, uma atualização diária em segundo plano, notificações, abrir no login e novas tentativas seguras."
---

# Barra de menus e segundo plano

**[English](../background.md)**&emsp;**[中文](../zh/background.md)**&emsp;**[日本語](../ja/background.md)**&emsp;**[한국어](../ko/background.md)**&emsp;**[Français](../fr/background.md)**&emsp;**[Español](../es/background.md)**&emsp;**[Deutsch](../de/background.md)**&emsp;[Documentação](index.md)

Um alerta de custo só vale algo enquanto o dinheiro ainda está sendo gasto.
Por isso o CloudBridge continua rodando depois que a janela fecha, atualiza em
uma agenda e avisa quando algo dispara.

## O ícone na barra de menus {#menu-bar}

No macOS e no Windows, fechar a janela deixa o CloudBridge na barra de menus (a
área de notificação no Windows). O título do ícone é o gasto do mês, `$2.8k`.
O ícone é uma ponte em arco com três pontos, e um ponto de exclamação substitui
os pontos enquanto houver algum alerta aberto.

Clique nele para abrir um painel com o mês até a data, a previsão de fim de
mês, os alertas abertos e os serviços que mais variaram em relação ao mês
passado, com **Atualizar** e **Abrir o CloudBridge**. Clicar em um alerta o
abre na página Alertas. Clique com o botão direito no ícone — ou use **Sair**
no painel — para encerrar; fechar a janela não faz mais isso. O ícone do Dock
aparece e desaparece junto com a janela.

Para que fechar a janela encerre o aplicativo, desligue **Configurações →
Segundo plano → Continuar rodando na barra de menus**. O ícone some na hora; a
agenda e as notificações passam a rodar só enquanto a janela está aberta, e
uma inicialização no login abre a janela em vez de começar oculto.

As versões para Linux não têm ícone de bandeja e continuam encerrando com a
janela; a agenda e as notificações rodam enquanto ela está aberta.

## A atualização em segundo plano {#schedule}

O CloudBridge busca cada conta depois que o intervalo de atualização dela
passou (**Configurações → Atualização**, 24 horas por padrão), executa as
[regras de alerta](alerts.md) e publica uma notificação para cada novo alerta.
Assim, a agenda custa o mesmo que clicar em Atualizar uma vez por dia.

A cada 15 minutos ele verifica se alguma conta já está no prazo. Essa
verificação lê apenas o registro local; não envia nada a um provedor. Os 15
minutos decidem com que rapidez, depois que um notebook desperta ou uma falha
é resolvida, uma conta no prazo é buscada — não com que frequência ela é
buscada. Desligue a agenda em **Configurações → Segundo plano → Atualizar em
segundo plano**.

## Abrir no login {#login}

**Configurações → Segundo plano → Abrir no login** inicia o CloudBridge quando
você entra na sessão, na barra de menus e sem a janela, para os alertas
continuarem chegando depois de reiniciar. Ele fica desligado até você ativá-lo;
o macOS o lista em **System Settings → General → Login Items**.

## Quando uma atualização falha {#failures}

- **Uma conta que falha repetidamente** é tentada de novo depois de 15
  minutos, depois de 30, dobrando até o intervalo de atualização, então uma
  chave revogada ou uma indisponibilidade do provedor custa algumas tentativas
  por dia em vez de uma a cada ciclo. Uma notificação avisa quando uma conta
  começa a falhar — o gasto dela deixou de ser vigiado — e o painel a nomeia
  até ela se recuperar.
- **Uma busca que o provedor respondeu mas que o CloudBridge não conseguiu
  armazenar** — disco cheio, por exemplo — não é repetida dentro do intervalo
  de atualização, para não pagar duas vezes pelas mesmas requisições ao Cost
  Explorer ou downloads do S3. **Forçar atualização** tenta na hora.
- **Um mês que falha não impede o outro**: um problema no mês passado não
  deixa este mês, onde um descontrole aparece, sem ser buscado.
