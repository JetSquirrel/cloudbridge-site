---
title: "Importer les exports de facture OpenAI, Anthropic et cloud"
description: "Importez dans CloudBridge les exports de facture d’Alibaba Cloud, Volcengine, OpenAI, Anthropic et DeepSeek : d’où vient chacun et ce qu’il apporte."
---

# Importer un fichier de facture

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[日本語](../ja/bill-import.md)**&emsp;**[한국어](../ko/bill-import.md)**&emsp;[Documentation](index.md)

Un export de facture téléchargé depuis la console d’un fournisseur se
décompose en lignes de registre identiques à celles d’une récupération. En aval —
totaux, graphiques, alertes, imputation — un mois importé est
indiscernable d’un mois récupéré. C’est souvent la lecture plus fine : l’API
de facturation d’Alibaba Cloud rapporte Model Studio (百炼) en un seul
chiffre par mois, tandis que son export le rapporte par modèle, avec les
nombres de tokens.

Volcengine, OpenAI et Anthropic sont réservés à l’import pour l’instant :
ajoutez le compte avec un nom, sans identifiants, et importez.

| Source | D’où vient l’export | Ce qu’il apporte |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) par modèle ; le détail au niveau de l’instance pour tout le reste |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) par point de terminaison et par type de token |
| OpenAI | Usage → Export | Coût ou usage de tokens, par projet et par modèle |
| Anthropic (Claude) | Usage or Cost → Export | Coût ou usage de tokens, par espace de travail et par modèle |
| DeepSeek | Usage → Download | Dépenses par jour et par modèle — son API ne rapporte qu’un solde |

## Importer {#import}

1. Téléchargez l’export depuis la console du fournisseur.
2. Allez dans **Accounts** et cliquez sur **Import** sur la ligne du compte.
3. Choisissez le fichier. CloudBridge indique combien de frais il a écrits et
   quels mois il a remplacés.

::: warning Un mois est remplacé, pas complété
Un import remplace tous les mois que couvre le fichier pour le compte
sélectionné : importer deux fois ne double donc jamais un frais. Exportez la
facture complète : un fichier filtré sur un produit remplace les données de
ce mois par ce produit uniquement. Pour mettre à jour un mois importé,
réimportez un export complet et corrigé. Refresh n’écrase jamais un mois
importé, Force Refresh compris.
:::

## Les exports d’utilisation ne contiennent pas d’argent {#usage-exports}

Un export d’**utilisation**, avec des nombres de tokens mais aucun montant,
est enregistré sans coût facturé et avec une base de coût *absent*.
CloudBridge ne convertit pas les nombres de tokens en dépense estimée aux
prix catalogue. Un export de **coûts** ne conserve une quantité que si une
seule colonne de tokens est renseignée : les tokens d’entrée et de sortie ont
des prix différents et ne peuvent pas former une seule quantité valorisée.

## Encodages {#encoding}

Les exports texte doivent être en UTF-8. Les consoles Alibaba Cloud et
Volcengine peuvent produire des fichiers GBK ; réexportez en UTF-8 ou
enregistrez d’abord en *CSV UTF-8*. Plus de détails dans
[Dépannage](troubleshooting.md#import-errors).
