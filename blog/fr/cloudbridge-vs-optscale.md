---
title: "CloudBridge face à OptScale"
description: "L'un est un serveur FinOps pour une organisation, l'autre un grand livre de bureau pour les factures d'une personne. Lequel convient dépend moins des fonctionnalités que de qui pose la question."
date: 2026-09-24
tag: Comparaison
---

# CloudBridge face à OptScale

<p class="post-meta">2026-09-24&emsp;Comparaison&emsp;<a href="./">Tous les articles</a></p>

Les deux projets sont open source et les deux lisent des factures cloud. Ils sont conçus pour des personnes différentes. [OptScale](https://github.com/hystax/optscale), de Hystax, est une plateforme FinOps auto-hébergée qu'une organisation fait tourner sur un serveur pour que l'ingénierie et la finance partagent une même vue de la dépense cloud et agissent dessus. CloudBridge est une application de bureau qu'une personne fait tourner sur sa propre machine, en lisant ses propres factures dans un fichier local.

Les faits concernant OptScale ci-dessous sont tirés de son README, de son dépôt et de sa documentation à la date de septembre 2026, et liés à la fin. Si quelque chose ici a vieilli, les sources font foi.

## La réponse courte

Si plusieurs personnes ont besoin d'accéder aux chiffres, si votre dépense est sur Azure, Google Cloud ou Kubernetes, ou si ce que vous voulez est une liste d'instances à redimensionner et d'engagements à acheter, utilisez OptScale. CloudBridge ne fait rien de tout cela.

Si vous êtes un développeur seul, ou une petite équipe avec une personne qui surveille la facture, que votre dépense se répartit entre AWS, Alibaba Cloud, Volcengine et des API de modèles comme OpenAI, Anthropic ou DeepSeek, et que vous préférez ne pas faire tourner un serveur pour savoir ce que vous avez dépensé, CloudBridge est l'outil plus petit pour cela.

## Ce qu'est OptScale

OptScale se décrit comme une plateforme open source de FinOps et d'optimisation des coûts cloud pour AWS, Microsoft Azure, Google Cloud, Alibaba Cloud et les clusters Kubernetes. Elle ingère des données de facturation et d'usage et, au-dessus de tableaux de bord de coûts, détecte les ressources inutilisées et inactives, recommande un redimensionnement, analyse l'usage des Reserved Instances, des Savings Plans et du Spot, et peut arrêter les VM hors production en dehors des heures ouvrées selon un calendrier d'alimentation. La gouvernance est à l'échelle de l'organisation : des pools de ressources avec quotas et budgets, des politiques de détection d'anomalies, des politiques de tags, des environnements partagés et quatre rôles de base (Member, Engineer, Manager, Organization manager). Elle couvre aussi Databricks et l'analyse du stockage S3.

C'est un serveur fait de nombreux services. Son dépôt compte une vingtaine de répertoires de services de premier niveau, parmi lesquels `rest_api`, `auth`, `ngui` pour l'interface web, `risp` pour les engagements, `bumiworker` pour les recommandations, et des intégrations Slack et Jira. Les installations de production vont sur Kubernetes, mises en place par les playbooks Ansible du projet sur Ubuntu 24.04, avec un minimum annoncé de 8 cœurs CPU, 16 Go de RAM et 150 Go de SSD. Un mode Docker Compose existe pour l'évaluation seulement, sur les mêmes 8 cœurs et 16 Go. La licence est Apache 2.0.

## Ce qu'est CloudBridge

CloudBridge est une application de bureau native écrite en Rust avec [GPUI](https://gpui.rs/), publiée pour macOS sur Apple Silicon et Windows x64. Il y a aussi une [démo dans le navigateur](https://cloudbridge.jetsquirrel.cloud/demo/) tournant sur des données d'exemple. Elle récupère les coûts depuis l'API AWS Cost Explorer, l'API de facturation d'Alibaba Cloud et l'API de solde de DeepSeek, et importe des fichiers de factures téléchargés depuis Alibaba Cloud, Volcengine, OpenAI, Anthropic et DeepSeek. Tout atterrit dans un seul grand livre DuckDB local, avec les noms de colonnes de [FOCUS](https://focus.finops.org/). Les identifiants vont dans le trousseau du système. Il n'y a pas de serveur, pas de compte, pas de synchronisation et pas de télémétrie.

Au-dessus du grand livre : une Vue d'ensemble avec des vues mois en cours, 30 jours et 12 mois, une attribution par service, par modèle et par tag avec une part non allouée explicite, des règles d'alerte pour une dépense quotidienne inhabituelle, des soldes prépayés faibles et un coût non alloué, et une devise de reporting construite à partir d'une table de taux de change datés. La branche principale ajoute des règles de budget mensuel, des bandes de confiance autour de la prévision de fin de mois, une console SQL en lecture seule sur le grand livre, et la lecture des exports FOCUS d'AWS directement depuis S3. Rien de tout cela n'est encore dans une version étiquetée ; la 0.3.2 est la plus récente. La licence est MIT.

## Côte à côte

| | OptScale | CloudBridge |
| --- | --- | --- |
| Ce que vous faites tourner | Un serveur : Kubernetes en production, Docker Compose pour évaluer | Une application de bureau sur macOS ou Windows |
| Empreinte annoncée | 8+ cœurs, 16 Go de RAM, 150+ Go de SSD | Votre portable |
| Utilisateurs | Des organisations, avec rôles et pools | Une personne par installation |
| Où vivent les données | Votre serveur OptScale | Un fichier DuckDB dans votre répertoire de données d'application |
| Clouds | AWS, Azure, GCP, Alibaba Cloud, Kubernetes | AWS, Alibaba Cloud, Volcengine |
| Factures d'API de modèles | Non listées dans le README open source | OpenAI, Anthropic, DeepSeek, Alibaba Model Studio (百炼), Volcengine Ark (方舟) |
| Comment les données arrivent | Des comptes connectés | Des API de facturation, ou des fichiers de factures que vous téléchargez |
| Conseils d'optimisation | Ressources inactives, redimensionnement, RI/SP/Spot, calendriers d'alimentation | Aucun |
| Anomalies et alertes | Détection d'anomalies, politiques de quotas et de budgets | Règles de dépense quotidienne, de solde et de coût non alloué ; règles de budget sur main |
| Allocation des coûts | Pools, propriétaires, politiques de tags, espaces de noms et labels Kubernetes | Service, modèle et tag, avec la part non allouée affichée |
| Intégrations | Slack, Jira, Databricks | Aucune |
| Licence | Apache 2.0 | MIT |
| Coût du logiciel | Gratuit à auto-héberger ; vous payez le serveur | Gratuit ; les frais d'API des fournisseurs sont à part |

## Là où OptScale est le meilleur choix

**Plus d'une personne a besoin des chiffres.** OptScale a des utilisateurs, des rôles et un arbre d'organisation, donc la finance et l'ingénierie peuvent voir les mêmes chiffres avec un accès défini par rôle. CloudBridge est un grand livre sur une machine. Son README dit clairement que les déploiements partagés et la collaboration en équipe sont hors périmètre.

**Votre dépense est sur Azure, Google Cloud ou Kubernetes.** CloudBridge ne prend en charge ni Azure ni Google Cloud, et n'a aucune idée de ce que coûte un espace de noms. OptScale couvre les trois, et peut découper le coût d'un cluster par espace de noms, charge de travail et label.

**Vous voulez qu'on vous dise quoi changer.** CloudBridge vous dit où est passé l'argent. Il ne vous dit pas qu'une instance est surdimensionnée, qu'un volume n'est pas attaché, ou qu'un Savings Plan serait rentabilisé. C'est le cœur de la valeur d'OptScale, et CloudBridge n'a pas d'équivalent.

**Vous avez besoin de gouvernance.** Des quotas par pool, des politiques de tags, des calendriers d'alimentation et des alertes envoyées à Slack ou Jira sont des outils d'organisation. Les règles de CloudBridge s'exécutent quand l'application est ouverte et après un rafraîchissement. Rien ne tourne quand elle est fermée.

Une note sur le ML : Hystax a aussi présenté OptScale comme une plateforme MLOps, avec suivi d'expériences, classements et versionnement de modèles. En juin 2025, les services `arcee` et `bulldozer`, l'agent de profilage ML et le lanceur d'expériences en masse, ont été retirés du dépôt, et le README actuel ne liste pas le suivi d'expériences. Si c'est pour cela que vous regardez OptScale, vérifiez ce que la version que vous déployez contient réellement.

## Là où CloudBridge trouve sa place

**Une personne, un jeu de factures.** Téléchargez, ouvrez, puis ajoutez une clé API ou importez un export. Il n'y a pas de cluster à installer et rien à mettre à jour à part l'application. Pour un développeur seul, le serveur que décrivent les exigences minimales d'OptScale est plus de machine que la question n'en demande.

**Des API de modèles à côté du cloud.** Pour beaucoup de petits projets, la plus grosse facture n'est plus le calcul. Ce sont les jetons. CloudBridge lit les exports de coûts d'OpenAI et d'Anthropic, la dépense quotidienne de DeepSeek, les modèles de Model Studio dans une facture Alibaba Cloud et les endpoints Ark dans une facture Volcengine, dans le même grand livre que le compte AWS. Un export d'usage uniquement en jetons reste de l'usage : il n'est pas tarifé dans une facture inventée.

**Des clouds chinois, depuis leurs propres exports.** Le 账单明细 d'Alibaba Cloud et les fichiers de factures de Volcengine s'importent tels qu'ils sortent de la console, avec les noms de colonnes chinois et anglais tous deux reconnus. OptScale prend en charge Alibaba Cloud. Volcengine n'est pas sur sa liste.

**Des données qui restent chez vous.** Le grand livre et les réponses brutes des fournisseurs restent dans votre répertoire de données d'application, et les identifiants restent dans le trousseau du système. Rien ne part chez un tiers, nous compris. Local ne veut pas dire chiffré, pourtant. CloudBridge ne chiffre pas le grand livre, donc le chiffrement du disque reste votre affaire.

## Peut-on utiliser les deux ?

Oui, et ils n'interfèrent pas. Chacun lit les données de facturation du fournisseur de son côté, et aucun n'écrit dans un compte cloud. Une équipe pourrait faire tourner OptScale pour la dépense partagée AWS, Azure et Kubernetes, tandis qu'un ingénieur garde CloudBridge pour les factures d'API de modèles et les comptes de clouds chinois qu'OptScale ne lit pas. Deux choses à surveiller : AWS Cost Explorer facture par requête d'API, donc deux outils qui l'interrogent paient deux fois, et les deux grands livres ne correspondront pas ligne à ligne, parce qu'ils associent et convertissent les frais différemment.

## Liens

- CloudBridge : [démo dans le navigateur](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[documentation](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[code source](https://github.com/JetSquirrel/cloudbridge)
- OptScale : [dépôt et README](https://github.com/hystax/optscale)&emsp;[documentation](https://hystax.com/documentation/optscale/)&emsp;[rôles et permissions](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[détection d'anomalies](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[quotas et budgets](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[démo en ligne](https://my.optscale.com/live-demo)
- Le commit qui a retiré les services ML d'OptScale : [OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
