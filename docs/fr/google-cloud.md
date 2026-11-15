---
title: "Coûts Google Cloud depuis l’export de facturation BigQuery"
description: "Connectez Google Cloud à CloudBridge via l’export BigQuery du compte de facturation : coût quotidien par service, SKU, projet et région, avec les crédits à part."
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[日本語](../ja/google-cloud.md)**&emsp;**[한국어](../ko/google-cloud.md)**&emsp;[Documentation](index.md)

Google Cloud n’a pas d’API qui réponde à « combien a coûté ce mois-ci ». Sa
facture, c’est l’export qu’un compte de facturation écrit dans un jeu de
données BigQuery : c’est donc cela que CloudBridge lit, une requête par mois,
donnant le coût **par jour** par service, SKU, projet et région. Les crédits
— niveau gratuit, engagement d’usage, promotions — reviennent sous forme de
lignes à part, l’usage reste donc ce qu’il a coûté avant eux.

## Activer l’export {#export}

L’export ne contient de données qu’à partir du jour de son activation :
faites-le donc d’abord, avant même d’installer CloudBridge.

1. Dans la console Google Cloud, ouvrez **Billing → Billing export →
   BigQuery export**.
2. Sous **Standard usage cost**, cliquez sur **Edit settings**, choisissez un
   projet, créez-lui un jeu de données (par exemple `billing`) et
   enregistrez.
3. Une fois les premières lignes arrivées — en moins d’une journée — le jeu
   de données contient une table nommée `gcp_billing_export_v1_` suivie de
   l’ID du compte de facturation. Dans BigQuery, ouvrez-la et utilisez **Copy
   ID** : c’est la *Billing export table* que CloudBridge demande, par
   exemple
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`.

## Donner une clé à CloudBridge {#connect}

1. Dans le projet du jeu de données d’export, ouvrez **IAM & Admin →
   Service accounts** et créez-en un, par exemple `cloudbridge`.
2. Accordez-lui **BigQuery Job User** sur le projet, pour qu’il puisse lancer
   une requête, et **BigQuery Data Viewer** sur le jeu de données d’export,
   pour que la requête puisse lire la table.
3. Ouvrez le compte de service, puis **Keys → Add key → Create new key →
   JSON**. Gardez le fichier téléchargé dans un endroit privé.
4. Dans CloudBridge, ajoutez un compte **Google Cloud** avec le **chemin** du
   fichier de clé et la table d’export de facturation.

CloudBridge conserve le chemin, pas la clé : le fichier est lu à chaque
récupération, remplacer la clé revient donc à remplacer le fichier. Le
fichier d’identifiants qu’écrit `gcloud auth application-default login`
fonctionne à sa place, tout comme `GOOGLE_APPLICATION_CREDENTIALS` avec
**Use this machine's credentials**.

## Ce que montre la facture {#detail}

| Colonne | Origine |
| --- | --- |
| Service | `service.description` — *Compute Engine*, *Cloud Storage* |
| Description | Le SKU — *N2 Instance Core running in Americas* |
| Projet | `project.id` et `project.name` |
| Région | `location.region` |
| Jour | Le jour d’utilisation |
| Catégorie | Usage, Tax ou Adjustment, d’après `cost_type` ; les crédits en Credit |

Un mois, c’est le **mois de facturation**, comme sur la facture Google
Cloud. Un usage facturé tard arrive dans le mois où il a été facturé, même
s’il a eu lieu le mois précédent.

La requête lit toute la table d’export. La tarification à la demande de
BigQuery s’applique au-delà du niveau gratuit mensuel ; un export de
facturation est généralement bien plus petit que cela, mais il grossit tant
que l’export tourne. [Analyses](insights.md) ne scanne pas les ressources
Google Cloud.

Voir [Autorisations des fournisseurs](permissions.md#google-cloud) pour
savoir exactement quels points de terminaison CloudBridge appelle.
