---
layout: home
title: "Documentation CloudBridge — connectez vos factures, lisez-les, gardez un œil"
titleTemplate: false
description: "Docs CloudBridge : lisez les factures AWS, Azure, Google Cloud, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic et DeepSeek dans un registre local, puis gardez un œil."
hero:
  name: Documentation CloudBridge
  text: Vos factures cloud et IA, dans un seul registre.
  tagline: Connectez chaque fournisseur, voyez où va l’argent, et soyez prévenu quand les dépenses s’emballent.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: Pour commencer
      link: /fr/getting-started
    - theme: alt
      text: Essayer la démo
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: À propos de CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/fr/
features:
  - title: Connectez vos factures
    details: AWS, Azure, Alibaba Cloud et Cloudflare via leurs API de facturation, Google Cloud via son export de facturation BigQuery ; Volcengine, OpenAI, Anthropic et DeepSeek via les exports produits par leurs consoles.
    link: /fr/aws
    linkText: Sources
  - title: Voyez où va l’argent
    details: Une vue d’ensemble sur le mois en cours, 30 jours ou 12 mois, l’imputation aux lignes métier, l’économie de tokens par modèle et du SQL sur le registre.
    link: /fr/overview
    linkText: Vue d’ensemble et comptes
  - title: Trouvez quoi couper
    details: Analyses compare la facture à un scan de ressources en lecture seule d’AWS et de Cloudflare, valorisé à partir de la facture, résumé par type.
    link: /fr/insights
    linkText: Analyses
  - title: Gardez un œil
    details: Règles, budgets et notifications, l’application continuant de tourner dans la barre des menus après la fermeture de sa fenêtre et démarrant à l’ouverture de session.
    link: /fr/background
    linkText: Barre des menus et arrière-plan
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ja/">日本語</a>&emsp;<a href="../ko/">한국어</a>&emsp;<a href="../es/">Español</a>&emsp;<a href="../de/">Deutsch</a>&emsp;<a href="../pt/">Português</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/fr/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## Trouver son chemin

| Je veux… | À lire |
| --- | --- |
| Installer CloudBridge et voir une première facture | [Installation et première facture](getting-started.md) |
| Voir à quoi ça ressemble avant d’installer quoi que ce soit | [La démo dans le navigateur](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Connecter AWS avec Cost Explorer ou un Data Export | [AWS](aws.md) |
| Connecter un abonnement Azure | [Microsoft Azure](azure.md) |
| Connecter Google Cloud via son export de facturation BigQuery | [Google Cloud](google-cloud.md) |
| Connecter Alibaba Cloud | [Alibaba Cloud](alibaba-cloud.md) |
| Connecter Cloudflare, et le découper par bucket, Worker et Durable Object | [Cloudflare](cloudflare.md) |
| Connecter DeepSeek | [DeepSeek](deepseek.md) |
| Importer un export Volcengine, OpenAI, Anthropic, Alibaba Cloud ou DeepSeek | [Importer un fichier de facture](bill-import.md) |
| Donner à CloudBridge le minimum d’accès dont il a besoin | [Autorisations des fournisseurs](permissions.md) |
| Comprendre les chiffres de la vue d’ensemble | [Vue d’ensemble et comptes](overview.md) |
| Voir à quelle ligne métier appartient un coût | [Imputation](attribution.md) |
| Voir ce que coûte chaque modèle de LLM par token | [Modèles](models.md) |
| Trouver les instances arrêtées, les adresses inactives et les ressources que personne ne revendique | [Analyses](insights.md) |
| Vérifier la facture d’un fournisseur par rapport au registre | [Rapprochement](reconciliation.md) |
| Poser une question au registre en SQL | [Requête](query.md) |
| Être prévenu quand les dépenses bondissent ou qu’un budget est proche | [Alertes, règles et budgets](alerts.md) |
| Entendre parler d’un Worker ou d’un Durable Object qui boucle dès le premier jour, pas sur la facture | [Repérer un emballement](cloudflare.md#runaway) |
| Garder CloudBridge en marche fenêtre fermée | [Barre des menus et arrière-plan](background.md) |
| Savoir ce que CloudBridge stocke, et le sauvegarder | [Réglages, données et sécurité](settings-and-data.md) |
| Réparer quelque chose qui ne fonctionne pas | [Dépannage](troubleshooting.md) |
