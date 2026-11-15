---
title: "Autorisations de facturation au moindre privilège, par fournisseur"
description: "Les identifiants au moindre privilège dont CloudBridge a besoin pour AWS Cost Explorer et S3, Azure Cost Management, Google Cloud BigQuery, Alibaba Cloud RAM, les jetons d’API Cloudflare et les clés DeepSeek."
---

# Autorisations des fournisseurs

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[日本語](../ja/permissions.md)**&emsp;**[한국어](../ko/permissions.md)**&emsp;[Documentation](index.md)

Utilisez des identifiants dédiés, avec le minimum de privilèges dont le
canal a besoin. Un comportement en lecture seule dans l’application ne rend
pas une clé sans restriction en lecture seule : ce sont les politiques
attachées chez le fournisseur qui décident de ce qu’une clé peut faire.
N’utilisez pas les identifiants du compte racine, et n’accordez pas un accès
administrateur, juste pour lire une facture.

CloudBridge stocke les identifiants dans le trousseau du système et ne les
utilise que pour authentifier les requêtes adressées au fournisseur dont ils
relèvent. Il n’y a pas de service de synchronisation CloudBridge ni de
télémétrie. Ne publiez jamais de vraies clés, de fichiers d’identifiants ou
d’exports de facturation non expurgés dans des tickets publics, des
journaux, des captures d’écran ou des pull requests, et révoquez toute clé
qui a été exposée.

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
n’accorde que `ce:GetCostAndUsage`, l’action Cost Explorer que CloudBridge
utilise. Valider une clé sans URI d’export utilise `GetCallerIdentity` de
STS, qui [n’a besoin d’aucune autorisation](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html).
La politique conserve `Resource: "*"` pour les lectures Cost Explorer ; elle
n’accorde l’accès à aucun autre service.

1. Dans la [console IAM](https://console.aws.amazon.com/iam/), créez une
   politique gérée par le client à partir du modèle, ou ajoutez-la en ligne
   à l’utilisateur.
2. Attachez-la à un utilisateur IAM dédié, sans y ajouter de permissions
   étendues hors sujet.
3. Créez une clé d’accès pour cet utilisateur et saisissez-la dans
   CloudBridge.
4. Renouvelez la clé selon la politique de votre organisation.

Seule une paire ID de clé d’accès et secret est acceptée ; les identifiants
temporaires qui demandent un jeton de session ne le sont pas. Les politiques
d’organisation et les réglages de facturation au niveau du compte peuvent
encore restreindre l’accès. Les requêtes Cost Explorer peuvent entraîner des
frais — voir [ce que cela coûte](aws.md#cost).

## AWS Data Exports depuis S3 {#aws-s3}

La politique Cost Explorer n’accorde **pas** l’accès à un bucket d’export.
Limitez `s3:ListBucket` au bucket et au préfixe de l’export, et
`s3:GetObject` aux objets sous ce préfixe. Les objets chiffrés avec une clé
KMS gérée par le client peuvent aussi demander `kms:Decrypt` et une
politique de clé correspondante, et les politiques de bucket comme les
restrictions d’organisation doivent autoriser les lectures. CloudBridge lit
un export existant ; il n’a besoin d’aucune permission pour créer des
exports ou écrire des objets. Les frais de stockage et de requêtes S3
s’appliquent toujours.

## Scans de ressources AWS {#aws-scan}

[Analyses](insights.md) scanne avec la même clé et ne fait que lister et
décrire des ressources. Donnez à la clé un accès en lecture à celles-ci, par
exemple la politique gérée `ReadOnlyAccess`, ou une politique en lecture
seule plus étroite couvrant les services à scanner.

## Alibaba Cloud {#alibaba-cloud}

Pour l’API de facturation, `AliyunBSSReadOnlyAccess` est la politique de
facturation en lecture seule intégrée. Elle est plus large qu’une politique
personnalisée limitée à certains points de terminaison ; vérifiez son
périmètre au regard de vos exigences.

1. Dans la [console RAM](https://ram.console.aliyun.com/), créez un
   utilisateur RAM dédié.
2. Attachez `AliyunBSSReadOnlyAccess`, ou une politique personnalisée
   restreinte aux opérations de facturation que vous utilisez.
3. Créez un AccessKey et saisissez-le dans CloudBridge.

N’utilisez pas l’AccessKey du compte principal. L’import d’un export de
facture ne demande aucun identifiant.

## Microsoft Azure {#azure}

Un principal de service — une inscription d’application avec un secret
client — avec le rôle intégré **Cost Management Reader** sur l’abonnement.
Ce rôle lit les données de coût et d’usage et rien d’autre ; ne donnez pas
Reader, Contributor ou Owner à l’application pour la faire fonctionner.

| Requête | À quoi elle sert |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`, non authentifiée | Trouver le locataire de l’abonnement à partir du défi `401`. Ignorée quand l’abonnement est saisi sous la forme `tenant-id/subscription-id` |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | Un jeton pour Azure Resource Manager, par l’octroi des identifiants client |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | Le coût réel du mois, quotidien, par service et par type de frais |

L’ID client et l’ID d’abonnement ne sont pas des secrets. Le secret client
en est un, et il est conservé dans le trousseau du système ; donnez-lui la
durée de vie la plus courte que votre organisation autorise et remplacez-le
dans CloudBridge lors de son renouvellement.

## Google Cloud {#google-cloud}

Un compte de service dans le projet de l’export de facturation, avec
**BigQuery Job User** sur le projet et **BigQuery Data Viewer** sur le jeu de
données d’export uniquement — pas sur le projet, où il lirait aussi tous les
autres jeux de données.

| Requête | À quoi elle sert |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | Un jeton, à partir d’une assertion signée avec la clé du compte de service |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | Une tâche de requête par mois sur la table d’export |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | Le reste des pages de résultat de la tâche |

La tâche de requête s’exécute dans le projet de la table et lui est facturée
au tarif à la demande de BigQuery au-delà du niveau gratuit. CloudBridge
conserve le chemin du fichier de clé, pas la clé ; protégez le fichier comme
n’importe quelle clé de compte de service, et supprimez la clé dans la
console dès qu’elle n’est plus utilisée. Un fichier d’identifiants
utilisateur issu de `gcloud auth application-default login` fonctionne
aussi, et interroge avec les accès de cet utilisateur.

## Cloudflare {#cloudflare}

Créez un jeton d’API personnalisé, limité sous **Account Resources** au seul
compte que CloudBridge doit lire. N’utilisez pas la Global API Key : elle
porte toutes les permissions de l’utilisateur.

| Permission | À quoi elle sert | Appels |
| --- | --- | --- |
| Account → Billing → Read | La facture | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | La découpe par ressource | `POST /graphql` |
| Read sur Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1 | Le scan d’Insights | L’API de compte, via le scanner |

Seule la première est obligatoire. L’ID de compte n’est pas un secret — il
fait partie du chemin de la requête ; le jeton en est un, et il est conservé
dans le trousseau du système comme tout autre identifiant.

## DeepSeek {#deepseek}

L’intégration API utilise une clé de plateforme de
[platform.deepseek.com](https://platform.deepseek.com/) pour appeler
`GET /user/balance`. C’est une lecture, mais **la clé elle-même n’est pas
forcément en lecture seule** : elle peut aussi autoriser des requêtes de
modèles et entraîner des dépenses si elle est utilisée ailleurs. Traitez-la
comme un identifiant de dépense, appliquez les restrictions que DeepSeek
propose, et ne la partagez pas. Importer l’export d’utilisation ne demande
aucune clé.

## Volcengine, OpenAI et Anthropic {#file-sources}

Ces sources n’utilisent que des exports de facture locaux. CloudBridge ne
demande aucun identifiant pour elles, et un import ne fait aucune requête au
fournisseur. Ne créez pas de clé d’administrateur ou d’organisation pour
elles tant qu’un canal API n’en a pas réellement besoin.
