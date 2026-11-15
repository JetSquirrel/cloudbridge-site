---
title: "0.3.1: um de cada"
description: "Uma passada de consistência por toda a interface — um único conjunto compartilhado de cartões, botões, pills e cabeçalhos de tabela — além de um build de macOS assinado e notarizado."
date: 2026-09-12
tag: Lançamento
---

# 0.3.1: um de cada

<p class="post-meta">2026-09-12&emsp;Lançamento&emsp;<a href="./">Todos os posts</a></p>

A 0.3.0 reconstruiu a interface sobre o GPUI Kit, mas reconstruiu página por página. Cada página ganhou o novo visual; cada página também manteve a sua própria cópia do que é um cartão, um botão primário ou um cabeçalho de tabela. Cópias divergem: a página de Configurações ainda tinha os estilos de antes da reconstrução, e em outros lugares o mesmo controle de “escolha um de três” aparecia em quatro formatos diferentes. A 0.3.1 é a passada que torna o design system real — uma definição por elemento, no tema, com toda página tomando dele.

## A severidade decide o destaque

A passada encontrou lugares em que a hierarquia visual brigava com a informação. Na página de Contas, **Saudável** — o único estado que não pede nada de você — usava o selo mais chamativo, enquanto Anomalia e Saldo baixo apareciam como texto simples. Na página de Alertas, um alerta Crítico tinha menos destaque do que um Aviso. Os dois agora estão invertidos do jeito certo: quanto mais alto o estado, mais alto o estilo, e o vermelho de alerta e o amarelo de aviso ficam reservados a alertas de verdade, não a rótulos neutros.

A mesma lógica valeu para as ações. Atualizar, a operação barata do dia a dia, agora é o botão primário da Visão geral; Forçar atualização, a operação cara, é secundário. Botões de excluir e confirmações de exclusão usam o estilo de perigo. E os botões de ação de um alerta são estilizados pelo que fazem, não por onde por acaso ficam em uma lista — então Dispensar nunca pode acabar como o grande botão primário só porque veio primeiro.

## Erros que não expulsam o conteúdo

Um interruptor que falhava na página de Regras substituía a lista inteira de regras por um banner vermelho. Agora os erros ficam na própria linha, acima da lista, a lista não sai do lugar, e todo erro oferece Tentar de novo.

## Correções menores

- **“Maiores variações”** agora ordena pelo tamanho da mudança, não pelo tamanho do gasto — um serviço grande, mas estável, deixa de ocupar a lista para sempre.
- O ponto de atualidade da barra de status reflete se a próxima coleta está vencida, em vez de ficar verde para sempre depois da primeira sincronização.
- **“Resolvidos neste mês”** mostra a data em que um alerta foi resolvido, não a data em que foi gerado.
- Valores em ienes não exibem mais casas decimais sem sentido.
- A página de detalhe da conta funde seus cartões GASTO / CONSUMO / CRÉDITOS em um único cartão GASTO que decompõe o total em uma linha.
- O site de documentação recebeu o mesmo tratamento: um título duplicado foi renomeado, explicações repetidas foram desduplicadas, cores fixas no código foram movidas para os tokens de design.

## Um build de macOS assinado

Os builds de lançamento para macOS agora são assinados e notarizados na CI. O contorno do Gatekeeper nas notas de instalação — Control-clique, “Abrir assim mesmo”, a linha de `xattr` — deixa de fazer parte da instalação do CloudBridge; baixe o DMG e arraste para Aplicativos.

## O que vem a seguir

Sem mudanças em relação à 0.3.0: o [roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) ainda deve um canal de *exportação* de arquivos de fatura (S3 / OSS + Parquet), alocação por tag com um nó “não alocado” explícito, e as APIs de faturamento da Volcengine, da OpenAI e da Anthropic.
