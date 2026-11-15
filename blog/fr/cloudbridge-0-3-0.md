---
title: "0.3.0 : apportez votre propre facture"
description: "Une facture téléchargée depuis une console s'importe désormais dans le même grand livre que celui qu'alimentent les API, la Vue d'ensemble cesse de prendre un coût couvert pour un coût faible, et l'interface est reconstruite à la densité d'une application de bureau."
date: 2026-09-11
tag: Version
---

# 0.3.0 : apportez votre propre facture

<p class="post-meta">2026-09-11&emsp;Version&emsp;<a href="./">Tous les articles</a></p>

La 0.2.0 a donné à CloudBridge une seule table de faits et une seule devise. Il manquait une chose : une API de facturation n'est pas toujours la meilleure lecture d'une facture, et parfois ce n'est pas une lecture du tout. `QueryBillOverview` d'Alibaba Cloud ne remonte Model Studio (百炼) que comme un seul chiffre par mois. L'API de DeepSeek remonte un solde et rien sur ce à quoi l'argent a servi. Volcengine, OpenAI et Anthropic ont une API d'administration dont vous n'avez peut-être pas la clé.

Mais chacune de ces consoles a un bouton Télécharger. La 0.3.0 fait de ce qui en sort une voie d'accès au grand livre à part entière.

## Un second canal, pas un second schéma

Un export importé devient les mêmes lignes `fct_charge` que celles que produit une récupération. En aval — le tableau de bord, les alertes, le Sankey — un mois importé est indiscernable d'un mois récupéré. Ce qui diffère est enregistré plutôt que masqué : `ingest_batch.channel` indique si une période est arrivée par récupération ou par import, et un mois importé n'est jamais écrasé par une récupération automatique, **y compris avec Forcer le rafraîchissement**. L'export est la lecture la plus fine ; « forcer » signifie « ne pas faire confiance à la fenêtre de fraîcheur », pas « jeter ce que j'ai importé ». Pour mettre à jour un mois importé, importez-en un export corrigé.

Un import **remplace** chaque mois couvert par le fichier. Il le doit : l'export est la facture du fournisseur lui-même, donc l'ajouter à une lecture API du même mois compterait le mois deux fois.

Cinq sources s'importent aujourd'hui : le détail de facture d'Alibaba Cloud et de Volcengine (账单明细), les exports de coûts ou d'usage d'OpenAI et d'Anthropic, et DeepSeek.

## Les jetons ne sont pas de l'argent

Un export d'usage contient des nombres de jetons et aucun montant. Ces lignes sont stockées avec `billed_cost` NULL et `cost_basis = absent` — les tarifer au prix catalogue mettrait dans `billed_cost` un chiffre que personne n'a jamais payé.

La console de DeepSeek fait la même démonstration de façon plus frappante. Son téléchargement est un zip de deux CSV : `cost-*.csv`, dont la colonne monétaire s'appelle `cost`, et `amount-*.csv`, dont la colonne nommée `amount` est un *nombre de jetons*. Lisez la seconde comme de l'argent et une journée de 10 787 jetons d'entrée en cache se comptabilise à 10 787 ¥. CloudBridge ouvre donc le zip, lit la moitié des coûts et refuse l'autre moitié par son nom. Vous importez le zip exactement tel que téléchargé.

Les noms de colonnes, quant à eux, sont mis en correspondance via des listes d'alias couvrant la console chinoise, la console anglaise et les noms de champs d'API de chaque fournisseur — aucun de ces exports n'est un format de fichier documenté. Une colonne qui ne correspond à rien produit une erreur qui nomme les colonnes réellement présentes dans votre fichier. Un fichier non UTF-8 est refusé avec l'instruction qui le corrige, plutôt que décodé sur une supposition qui abîmerait tous les noms de produits de la facture.

## Ce qu'un crédit dissimule

Un total net de crédits est le bon titre : c'est ce que vous avez payé. C'est la mauvaise base pour une tendance. Un compte dont l'usage est entièrement couvert par des crédits tombe à environ 0 $, et un pourcentage d'un mois sur l'autre calculé là-dessus n'est que du bruit — un vrai compte a produit −318,9 %.

La Vue d'ensemble sépare donc les deux. Le titre reste net, avec l'usage brut et les crédits qui l'ont fait baisser affichés à côté. Tout ce qui est en tendance ou classé — le graphique, le pourcentage de variation, « Où est passé l'argent », les plus gros écarts — tourne sur l'usage brut. Ce que vous avez consommé et ce qui vous a été facturé sont deux questions différentes, et la page répond maintenant aux deux au lieu de les moyenner.

L'en-tête porte aussi un contrôle de plage : mois en cours, 30 derniers jours glissants, ou 12 derniers mois calendaires. Chaque chiffre de la page est calculé sur la fenêtre que vous avez choisie.

## Densité de bureau

L'interface passe à [GPUI Kit](https://crates.io/crates/gpui-kit) 0.6 — une dépendance au lieu de trois, avec les grammaires tree-sitter désactivées, parce qu'un tableau de bord de coûts n'a aucune raison de compiler une pile de coloration syntaxique.

Avec cela est venue une décision que le framework laisse ouverte : c'est un outil de données dense, pas une page web. Une police de base de 13 px et un rayon de carte de 6 px sont appliqués au niveau de l'application, par-dessus ce que livre un fichier de thème. La carte de synchronisation de la barre latérale est devenue une barre d'état en bas de la fenêtre, comme une application de bureau rend compte de son état. Les tailles dérivent de l'échelle rem, donc toute l'interface zoome encore avec la police de base.

Et les montants ont cessé d'arrondir les dépenses inférieures au dollar à `$0` : des unités entières à partir de 100, deux décimales à partir d'un centime, et `<$0.01` en dessous d'un centime — un petit nombre est désormais lisible comme un petit nombre plutôt que comme rien.

## Aussi dans la 0.3.0

- **Données de démonstration**, dans les Réglages : trois comptes et douze mois d'un grand livre factice aux formes réalistes, chargés et effacés d'un bouton. Tout ce qui est de la démonstration est indexé sous le préfixe `demo-`, ne contient aucun identifiant et est ignoré par le rafraîchissement, donc aucune ligne de démo n'atteint jamais l'API d'un fournisseur.
- **Un seul élément de trousseau par compte, pas deux.** Sur macOS, chaque lecture du trousseau peut déclencher une demande de mot de passe — le contrôle d'accès de l'élément nomme le binaire qui l'a stocké, donc une recompilation est un nouveau binaire. Un rafraîchissement récupérant plusieurs périodes payait ce coût par période et par clé. La paire est désormais un seul élément, lu une fois par session ; une paire encore sous l'ancienne forme à deux entrées migre à la première lecture.
- **L'intervalle de rafraîchissement est de 24 heures, et configurable** (6, 12, 24 ou 48). Il était fixé à 6. La facture d'un fournisseur ne bouge pas plus vite qu'en un jour d'une manière qui vaille le coût.
- **« Résolu ce mois-ci »** sur la page Alertes se base sur le moment où une alerte a été résolue plutôt que sur celui où elle a été levée.
- Les écritures des Réglages et le changement de devise s'exécutent hors du fil de l'interface, et un enregistrement raté est affiché dans sa propre couleur pour qu'il ne puisse pas être pris pour un enregistrement réussi.

## La suite

La [feuille de route](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) contient le reste de la priorité P1 : un canal d'*export* de fichiers de factures (S3 / OSS + Parquet) pour les factures qui arrivent selon un calendrier plutôt que par un navigateur, et une allocation par tags avec un nœud non alloué explicite. Les API de facturation de Volcengine, OpenAI et Anthropic restent à faire — ces sources figurent dans le registre avec, déjà nommé, l'identifiant que chacune voudra.
