---
title: "API de facturation Alibaba Cloud et import de facture"
description: "Connectez Alibaba Cloud (阿里云) à CloudBridge avec un utilisateur RAM en lecture seule, ou importez le détail de facture pour les coûts par modèle de Model Studio (百炼)."
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[日本語](../ja/alibaba-cloud.md)**&emsp;**[한국어](../ko/alibaba-cloud.md)**&emsp;[Documentation](index.md)

Alibaba Cloud dispose des deux canaux. L’**API de facturation** donne le
total de chaque produit pour le mois ; l’**export du détail de facture**
donne des lignes au niveau de l’instance, y compris Model Studio (百炼) par
modèle avec les nombres de tokens. Utilisez l’API pour un compte tenu à jour
tout seul, et importez l’export quand vous voulez la lecture plus fine — un
mois importé n’est jamais écrasé par une actualisation.

## API de facturation {#api}

1. Ouvrez la [console RAM](https://ram.console.aliyun.com/) et créez un
   utilisateur RAM pour l’accès API.
2. Attachez la politique système intégrée `AliyunBSSReadOnlyAccess`.
3. Créez un AccessKey pour cet utilisateur.
4. Ajoutez le compte dans CloudBridge avec l’AccessKey ID et le Secret.

N’utilisez pas l’AccessKey du compte principal. L’API de facturation n’a pas
de frais par requête documentés ici ; vérifiez les conditions en vigueur
d’Alibaba Cloud. Voir
[Autorisations des fournisseurs](permissions.md#alibaba-cloud).

## Export du détail de facture {#export}

Dans la console, allez dans **Expenses and Costs → Bill Details → Export**,
téléchargez la facture complète et cliquez sur **Import** sur la ligne du
compte. Un import ne demande aucun identifiant. Voir
[Importer un fichier de facture](bill-import.md).
