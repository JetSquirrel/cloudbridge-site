---
title: "Solde DeepSeek et dépenses d’API par modèle"
description: "Connectez DeepSeek à CloudBridge avec une clé d’API pour le solde prépayé, et importez son export d’utilisation pour les dépenses par jour et par modèle."
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[日本語](../ja/deepseek.md)**&emsp;**[한국어](../ko/deepseek.md)**&emsp;**[Español](../es/deepseek.md)**&emsp;**[Deutsch](../de/deepseek.md)**&emsp;**[Português](../pt/deepseek.md)**&emsp;[Documentation](index.md)

L’API de DeepSeek renvoie un **solde** — crédité et rechargé —, pas une
répartition des dépenses. Pour le détail des dépenses, importez l’export de
la console.

## API de solde {#api}

1. Ouvrez [platform.deepseek.com](https://platform.deepseek.com/) et créez
   une clé d’API.
2. Ajoutez le compte dans CloudBridge avec cette clé.

Le solde alimente la règle **Balance floor** (voir
[Alertes, règles et budgets](alerts.md)). Une clé utilisée pour interroger le
solde peut aussi autoriser des requêtes de modèles payantes : protégez-la et
vérifiez ses permissions — voir
[Autorisations des fournisseurs](permissions.md#deepseek).

## Export d’utilisation {#export}

Dans la console, allez dans **Usage → Download** et importez le ZIP
exactement tel que téléchargé : CloudBridge lit le `cost-*.csv` qu’il
contient et ignore `amount-*.csv`, dont la colonne `amount` contient des
nombres de tokens, pas de l’argent. Voir
[Importer un fichier de facture](bill-import.md).
