---
title: "Coût par token de chaque modèle de LLM"
description: "La page Modèles de CloudBridge : ce que coûte chaque LLM par token, avec la dépense, les tokens d’entrée, de sortie et de cache, le coût mixte par million et les constats."
---

# Modèles

**[English](../models.md)**&emsp;**[中文](../zh/models.md)**&emsp;**[日本語](../ja/models.md)**&emsp;**[한국어](../ko/models.md)**&emsp;**[Español](../es/models.md)**&emsp;**[Deutsch](../de/models.md)**&emsp;**[Português](../pt/models.md)**&emsp;[Documentation](index.md)

La page **Models** lit le volet LLM de la facture par modèle, sur la période
choisie dans son en-tête. Les comptes OpenAI, Anthropic et DeepSeek y
apparaissent toujours ; les lignes d’une autre source apparaissent quand
elles portent un usage mesuré en tokens, comme les lignes Alibaba Cloud
Model Studio, Volcengine ou Amazon Bedrock. Le modèle est le `ModelId` FOCUS
de la facture, ou celui que nomme l’import ; une facture qui n’en nomme
aucun, comme celle de Model Studio ou d’Ark, est regroupée par produit.

Les tokens sont distingués par leurs propriétés FOCUS, `TokenDirection` et
`TokenCacheAction`, et non par le nom du compteur chez le fournisseur : le
même type de token se lit donc de la même façon sur toutes les factures.
Voir [FOCUS et données de tokens](focus.md).

- La ligne de statistiques montre la **dépense IA**, le total de **tokens**,
  le **coût mixte $/1M** (coût divisé par tous les tokens, par million) et la
  **part du cache** — les tokens d’entrée lus dans un cache de prompt, en
  part de tous les tokens d’entrée, écritures de cache comprises.
- **Par modèle** liste le coût de chaque modèle et sa variation, ses tokens
  IN, OUT et CACHE, son coût mixte $/1M et sa part de la dépense des
  modèles. CACHE, ce sont les tokens lus dans le cache. IN, c’est le reste de
  l’entrée : entrée non mise en cache, tokens écrits dans le cache, et, pour
  une facture qui compte l’entrée et la sortie ensemble, ce total. Son
  infobulle indique lequel de ces éléments il contient. Les lignes avec des
  tokens mais sans coût comptent quand même dans les colonnes de tokens. Le
  mois en cours se compare aux mêmes jours du mois dernier, pas à tout le
  mois.
- **Tokens par jour** trace le volume quotidien de tokens.

## Constats {#findings}

- Un modèle dont les lectures de cache représentent moins de 5 % de son côté
  entrée — payer le prix de l’entrée pour ce qui pourrait être au prix du
  cache. Non signalé pour une facture qui ne sépare pas l’entrée de la
  sortie.
- Un modèle au-dessus de 70 % de la dépense des modèles, quand au moins deux
  coûtent quelque chose.
- Une hausse de dépense que les nombres de tokens des deux périodes
  attribuent au prix unitaire plutôt qu’à l’usage.
- Un modèle facturé sans mesure de tokens, dont le coût unitaire ne peut pas
  être calculé.

Les noms de modèles présents dans le texte des lignes de facturation
d’Alibaba Cloud et de Volcengine ne sont pas encore extraits.
