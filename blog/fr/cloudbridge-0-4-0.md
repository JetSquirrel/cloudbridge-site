---
title: "0.4.0 : plus d'entrées, plus de façons de lire"
description: "AWS Data Exports directement depuis S3, une page Modèles pour ce que coûte chaque modèle de LLM par jeton, une console SQL en lecture seule, des budgets mensuels — et toute l'application qui tourne dans un navigateur."
date: 2026-10-05
tag: Version
---

# 0.4.0 : plus d'entrées, plus de façons de lire

<p class="post-meta">2026-10-05&emsp;Version&emsp;<a href="./">Tous les articles</a></p>

La 0.3.0 a mis chaque facture dans un seul grand livre ; la 0.3.1 a fait en sorte que l'interface soit d'accord avec elle-même. La 0.4.0 travaille aux deux extrémités de ce grand livre. À l'entrée, un compte AWS peut désormais lire sa facture depuis l'export qu'AWS écrit dans S3 au lieu de la demander à Cost Explorer. À la sortie, il y a quatre nouvelles façons de lire ce qui est déjà là : par modèle, par dimension, face à un budget, et en SQL. Et la même application tourne maintenant dans un navigateur, pour que vous puissiez tout essayer avant d'installer quoi que ce soit.

## AWS Data Exports, lu depuis S3

Cost Explorer répond par des totaux, et chaque question coûte une requête. Les Data Exports d'AWS (CUR 2.0, dans la forme « FOCUS 1.2 with AWS columns ») écrivent la facture complète — identifiants de ressources, tags, le compte lié sous lequel chaque ligne a été facturée — dans un bucket S3 qui vous appartient. Donnez à un compte AWS l'URI `s3://bucket/prefix` de l'export et Rafraîchir lit depuis là : Parquet ou CSV gzippé, selon ce que l'export a été configuré à livrer.

Quelques points qu'il traite bien et qui sont faciles à rater :

- **Un mois n'est compté qu'une fois.** Un export configuré sur « créer un nouveau » conserve chaque livraison côte à côte. CloudBridge ne lit que les fichiers que nomme le manifeste de la période, donc douze rafraîchissements de septembre restent un seul septembre.
- **Non livré n'est pas zéro.** Une période que l'export n'a pas encore écrite est ignorée, jamais stockée comme un mois vide.
- **L'export d'un payeur se découpe par compte membre.** Chaque ligne conserve son `SubAccountId` et son `SubAccountName`.

Les frais de stockage et de requêtes S3 s'appliquent toujours, et la politique Cost Explorer n'accorde pas l'accès à S3 — la [page des permissions](https://cloudbridge.jetsquirrel.cloud/docs/permissions#aws-s3) contient la politique étroite dont le canal d'export a besoin. Les comptes sans URI continuent d'utiliser Cost Explorer.

## La page Modèles

Le grand livre stocke des quantités de jetons à côté des coûts de LLM depuis la 0.2.0 ; rien ne les lisait. La nouvelle page Modèles le fait. Pour la plage que vous choisissez, chaque modèle a son coût et sa variation, ses jetons d'entrée, de sortie et de cache, un coût mixte par million de jetons et sa part de cache, avec un graphique quotidien des jetons en dessous.

Elle dit aussi ce qui ressort. Un modèle dont les lectures de cache représentent moins de 5 % de son côté entrée paie le prix de l'entrée pour ce qui pourrait être au prix du cache. Un modèle qui porte plus de 70 % de la dépense de modèles mérite d'être connu. Un modèle facturé sans mesure de jetons est signalé comme tel, parce que son coût unitaire ne peut pas être calculé. Et une hausse de dépense est confrontée aux nombres de jetons des deux périodes : quand les jetons supplémentaires expliquent la hausse, c'est de l'usage, et c'est seulement quand ils ne l'expliquent pas qu'elle est signalée comme une hausse du prix unitaire.

Les noms de modèles enfouis dans le texte des lignes de facturation d'Alibaba Cloud et de Volcengine ne sont pas encore extraits ; les imports OpenAI, Anthropic et DeepSeek nomment leurs modèles directement.

## D'autres façons de lire le grand livre

- **Requête.** Une console SQL en lecture seule sur le grand livre DuckDB local, avec des modèles de départ. Seules les instructions de lecture s'exécutent, et le grand livre est de toute façon ouvert en lecture seule pour elles. Bureau uniquement.
- **Budgets.** La page Règles contient un budget mensuel par compte, et une règle « Budget de compte » alerte sur un pourcentage ou un montant, par rapport au coût à date ou à la prévision de fin de mois. Les règles d'anomalie peuvent désormais aussi être limitées à un compte.
- **Répartition par dimension.** L'attribution bascule entre tag, service, région et catégorie de service, dessinée en treemap — l'aire est le coût, la couleur est la variation — ou en barres de part, avec les ressources les plus coûteuses de la période à côté. La page de détail d'un compte a la même exploration.
- **Santé des données.** Des constats sur ce qui rend un total moins fiable qu'il n'y paraît : des devises que la table des taux ne peut pas convertir, de l'usage sans tag d'attribution ou sans région, des ajustements qu'aucun frais n'explique. Ignorez-en un et il reste ignoré pour cette période.

## CloudBridge dans un navigateur

Le crate se compile désormais aussi pour WebAssembly. La [démo](https://cloudbridge.jetsquirrel.cloud/demo/) n'est pas une maquette : les pages, les modèles de vue et les règles d'alerte sont le code du bureau lui-même, tournant sur un grand livre en mémoire amorcé avec la facture de démonstration à la place de DuckDB, des API des fournisseurs et du trousseau. Requête, Règles et Réglages restent sur le bureau ; tout le reste, page Modèles comprise, est là.

Pour que cela le reste, la CI construit la version navigateur comme une vérification obligatoire, et les statistiques que les deux versions calculent — prévisions, comparaisons, décompositions, constats — vivent dans un module partagé et testé plutôt que dans une copie par backend.

## Plus petits changements

- **Supprimer un compte pose la question de son historique.** Avant, les frais restaient derrière en silence et continuaient de compter dans les totaux sans qu'aucun compte ne les explique. La boîte de dialogue de suppression propose désormais de les supprimer, et l'historique laissé par une suppression antérieure est listé sur la page Comptes, où il peut être supprimé.
- **Un premier lancement qui mène quelque part.** Une Vue d'ensemble vide propose d'ajouter un compte ou de charger la facture de démonstration, et l'enregistrement d'un compte API récupère sa facture immédiatement.
- **Raccourcis clavier.** ⌘1–⌘9 changent de page, ⌘R recharge.
- **La fenêtre s'ouvre en premier.** Les magasins de données s'ouvrent et les pages se chargent en arrière-plan, chacune à sa première visite.
- **Le remplissage du graphique de dépenses** ne découpe plus un coin diagonal en travers du graphique.
- **Sécurité :** rustls et quick-xml sont mis à niveau au-delà de trois avis RUSTSEC.
- **Rust 1.95** est le minimum déclaré ; l'ancienne déclaration n'était de toute façon pas compilable.

La liste complète est dans le [journal des modifications](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## La suite

La [feuille de route](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) passe des factures aux ressources qui les produisent : d'abord le coût par ressource, lu dans les lignes que l'export S3 fournit déjà, puis les relations entre ressources — coût agrégé le long de la propriété, orphelins qui coûtent encore de l'argent. Les API de facturation de Volcengine, OpenAI et Anthropic restent à faire ; en attendant, leurs exports s'importent.
