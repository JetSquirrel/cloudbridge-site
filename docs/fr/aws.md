---
title: "Suivre les coûts AWS avec Cost Explorer ou FOCUS"
description: "Connectez un compte AWS à CloudBridge via Cost Explorer avec une politique IAM à une seule action, ou via un Data Export FOCUS dans S3 pour des lignes au niveau des ressources."
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[日本語](../ja/aws.md)**&emsp;**[한국어](../ko/aws.md)**&emsp;[Documentation](index.md)

Un compte AWS arrive au registre de deux façons. **Cost Explorer** est la
plus rapide : une clé d’accès et une politique à une seule action, et la
facture arrive sous forme de coûts par service et par jour. Un **Data
Export** dans S3 est la plus détaillée : ID de ressources, étiquettes et
compte lié de chaque ligne — ce dont [Analyses](insights.md) a besoin pour
valoriser une ressource.

## Cost Explorer {#cost-explorer}

1. Ouvrez la [console IAM](https://console.aws.amazon.com/iam/), allez dans
   **Users** et **Create user**. Aucun accès à la console n’est nécessaire.
2. Sur le nouvel utilisateur, choisissez **Add permissions → Create inline
   policy**, passez à l’éditeur JSON et collez la politique ci-dessous
   (également disponible sous
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)).
3. Ouvrez l’onglet **Security credentials** de l’utilisateur et cliquez sur
   **Create access key**. Copiez l’Access Key ID et la Secret Access Key ;
   AWS n’affiche le secret qu’une fois.
4. Ajoutez le compte dans CloudBridge avec cette paire de clés.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Elle n’accorde que `ce:GetCostAndUsage`, la seule action Cost Explorer que
CloudBridge appelle. La validation de la clé utilise `GetCallerIdentity` de
STS, qui n’a besoin d’aucune autorisation. Les identifiants temporaires qui
demandent un jeton de session ne sont pas pris en charge.
[Autorisations des fournisseurs](permissions.md#aws) explique le
raisonnement et comment la restreindre.

### Ce que cela coûte {#cost}

Cost Explorer facture à la requête. Une actualisation demande deux mois par
compte — le mois dernier et celui-ci — une requête chacun, et davantage pour
un mois si volumineux que Cost Explorer le renvoie paginé (20 pages au
maximum). L’intervalle d’actualisation limite la planification en
arrière-plan à une actualisation par intervalle : avec les 24 heures par
défaut, un compte coûte environ deux requêtes par jour. Une récupération
qu’AWS a servie mais que CloudBridge n’a pas pu stocker n’est pas répétée
dans l’intervalle. **Force Refresh** contourne tout cela ; c’est le seul
moyen de dépenser davantage. Vérifiez la tarification AWS pour les tarifs en
vigueur.

## Data Exports depuis S3 {#data-exports}

CloudBridge peut lire les AWS Data Exports (CUR 2.0, au format *FOCUS 1.2
with AWS columns*) depuis le bucket S3 où ils sont livrés. Placez l’URI de
l’export — `s3://bucket/prefix` — dans le champ **Data export S3 URI** du
formulaire de compte, et Refresh lit à cet endroit au lieu de Cost Explorer.

- **Parquet ou CSV gzippé**, selon ce que l’export a été configuré à livrer.
- **Un mois ne compte qu’une fois.** Seuls les fichiers nommés par le
  manifeste de la période sont lus : un export qui conserve chaque livraison
  compte quand même un mois une seule fois.
- **Non livré ne vaut pas zéro.** Une période que l’export n’a pas encore
  écrite est ignorée, jamais stockée comme un mois vide.
- **Inchangé ne veut pas dire retéléchargé.** Les clés, tailles et ETags des
  fichiers sont d’abord comparés à la dernière récupération ; un mois
  qu’AWS a fini de livrer coûte un listage et la lecture d’un manifeste par
  actualisation.
- **L’export d’un payeur se découpe par compte membre.** Chaque ligne
  conserve le compte lié sous lequel elle a été facturée.

La politique Cost Explorer n’accorde **pas** l’accès à S3 : voir
[Autorisations des fournisseurs](permissions.md#aws-s3). Les frais de
stockage et de requêtes S3 s’appliquent toujours.

## Scanner les ressources {#insights}

[Analyses](insights.md) scanne un compte AWS avec la même clé d’accès, et
ne fait que lire. Pour cela, la clé a besoin d’un accès en lecture aux
ressources, par exemple la politique gérée `ReadOnlyAccess` d’AWS.
