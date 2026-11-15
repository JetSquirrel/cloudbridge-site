---
title: "Coûts Azure par service et par jour"
description: "Connectez un abonnement Microsoft Azure à CloudBridge avec un principal de service : coût réel depuis Cost Management, quotidien, par service et par type de frais."
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[日本語](../ja/azure.md)**&emsp;**[한국어](../ko/azure.md)**&emsp;**[Español](../es/azure.md)**&emsp;**[Deutsch](../de/azure.md)**&emsp;**[Português](../pt/azure.md)**&emsp;[Documentation](index.md)

CloudBridge lit le **coût réel** d’un abonnement depuis Azure Cost
Management : ce que chaque service a coûté **par jour**, réparti par type de
frais. Une réservation achetée, un remboursement ou une taxe sont conservés
pour ce qu’ils sont, sans être ajoutés à l’usage : un mois comportant un
achat ponctuel ne ressemble donc pas à un mois dont l’usage a triplé.

## Connecter l’abonnement {#connect}

CloudBridge se connecte en tant que principal de service — une inscription
d’application avec son propre secret — et non en votre nom.

1. Dans le [portail Azure](https://portal.azure.com/), ouvrez **Microsoft
   Entra ID → App registrations → New registration**. Donnez-lui un nom comme
   `cloudbridge` ; le reste du formulaire n’a pas d’importance.
2. Dans la nouvelle inscription, ouvrez **Certificates & secrets → New
   client secret**, et copiez la **Value** du secret — pas son Secret ID.
   Elle n’est affichée qu’une fois.
3. Ouvrez l’abonnement, puis **Access control (IAM) → Add role
   assignment**. Choisissez **Cost Management Reader** et attribuez-le à
   l’application.
4. Dans CloudBridge, ajoutez un compte **Microsoft Azure** avec
   l’**Application (client) ID** de l’inscription, la valeur du secret et
   l’**Subscription ID**.

Vous n’avez pas besoin de l’ID de locataire : CloudBridge détermine à quel
locataire appartient l’abonnement. Si cette recherche échoue, saisissez
l’abonnement sous la forme `tenant-id/subscription-id`.

Une attribution de rôle peut mettre quelques minutes à s’appliquer. Si la
première récupération est refusée juste après l’avoir faite, attendez et
cliquez de nouveau sur **Validate**.

## Ce que montre la facture {#detail}

| Colonne | Origine |
| --- | --- |
| Service | La catégorie de compteur — *Virtual Machines*, *Storage*, *Bandwidth* |
| Jour | La date d’utilisation |
| Catégorie | Usage, Purchase, Credit (remboursements), Tax ou Adjustment, d’après le type de frais |
| Montant | Coût réel, dans la devise de facturation de l’abonnement |

La requête rapporte par service, pas par ressource ni par région : la
répartition par région dans [Imputation](attribution.md) affiche donc
*Other* pour Azure, et [Analyses](insights.md) ne scanne pas les ressources
Azure.

L’API de requête de Cost Management est limitée en débit par locataire. Un
compte, c’est une requête par mois récupéré ; plusieurs abonnements du même
locataire partagent la limite, et une récupération limitée en débit est
réessayée à l’actualisation suivante.

## Utiliser les identifiants de cette machine {#system}

Sur une machine où `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` et
`AZURE_SUBSCRIPTION_ID` sont définis — les variables que lisent les SDK
Azure — cochez **Use this machine's credentials** et CloudBridge les lit à
chaque récupération au lieu d’en garder une copie. `az login` seul ne suffit
pas : il laisse un utilisateur connecté, pas un secret utilisable par
CloudBridge.

Voir [Autorisations des fournisseurs](permissions.md#azure) pour savoir
exactement quels points de terminaison CloudBridge appelle.
