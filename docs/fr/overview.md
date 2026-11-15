---
title: "Vue d’ensemble : dépense nette, prévision et comptes"
description: "Comment la vue d’ensemble de CloudBridge lit les dépenses : net et brut, crédits, la prévision, les plus gros écarts et l’usage non imputé, plus les comptes et la santé des données."
---

# Vue d’ensemble et comptes

**[English](../overview.md)**&emsp;**[中文](../zh/overview.md)**&emsp;**[日本語](../ja/overview.md)**&emsp;**[한국어](../ko/overview.md)**&emsp;[Documentation](index.md)

## La vue d’ensemble {#overview}

L’en-tête porte un sélecteur de période — **MTD**, **30d** ou **12m** — et
chaque chiffre de la page est calculé pour la fenêtre choisie.

- La **dépense** principale est nette des crédits : ce qui vous a réellement
  été facturé. L’usage brut et les crédits qui l’ont fait baisser sont
  affichés à côté.
- Le **graphique**, le pourcentage de variation, **Where it went** et les
  **biggest movers** reposent sur l’usage brut. Un compte dont les crédits
  d’usage couvrent tout revient à environ zéro, et une tendance tracée sur
  cette base n’est que du bruit.
- Pour **MTD**, une seconde carte prévoit la fin du mois à partir du rythme
  de dépense, avec une fourchette optimiste et une pessimiste.
- **Unallocated** est la part de l’usage qui n’atteint aucune ligne métier —
  la partie de la facture que vous ne savez pas encore expliquer. Voir
  [Imputation](attribution.md).

Survoler le graphique s’accroche au point le plus proche et affiche la date
et le montant de ce point. **Refresh** récupère les comptes dont les données
sont plus anciennes que l’intervalle d’actualisation ; **Force Refresh** les
récupère tous — voir [ce que cela coûte](aws.md#cost).

## Un compte à la fois {#account}

Cliquez sur le nom d’un compte sur la page **Accounts** pour l’explorer : le
même sélecteur de période, une ligne net / brut / crédits, la tendance
d’usage de ce compte, et un tableau par service avec la part et la variation
de chacun. La même répartition par dimension qu’[Imputation](attribution.md)
s’y trouve aussi.

## Ajouter et supprimer des comptes {#accounts}

Pour en ajouter un, allez dans **Accounts**, choisissez la source, saisissez
un nom et — pour une source API — l’identifiant, puis **Save**. Une source
API récupère aussitôt la facture de ce mois et celle du mois dernier ;
**Validate** sur sa ligne vérifie l’identifiant de son côté. Là où les outils
du fournisseur sont configurés sur la machine, le formulaire peut lire
l’identifiant depuis l’environnement ou le profil de la CLI au lieu d’en
stocker une copie.

Supprimer un compte retire toujours sa ligne et ses identifiants du
trousseau. Si le registre contient des frais pour lui, la boîte de dialogue
propose aussi **Also delete its billing history**, désactivé par défaut.
Laissé désactivé, les frais restent et **continuent de compter dans tous les
totaux** ; activé, ils sont supprimés, ainsi que les charges utiles brutes
derrière eux. Ni l’un ni l’autre n’est réversible. L’historique qui a survécu
à son compte est listé sur la page Accounts sous **Billing history from
deleted accounts**, où **Delete history** le supprime.

## Santé des données {#data-health}

CloudBridge vérifie dans le registre ce qui rend un total moins fiable qu’il
n’y paraît :

- des frais dont la devise ne peut pas être convertie par la table des taux ;
- de l’usage sans étiquette `business_line` ;
- de l’usage sans région ;
- des ajustements qu’aucun frais n’explique ;
- de l’usage de produits sans catégorie de service pour l’instant.

La vue d’ensemble les affiche sous forme de bandeau **Data quality**, la page
Accounts sous forme de carte **Data health**, et la page d’un compte liste
les siens. **Dismiss** masque un constat pour cette période de facturation ;
le même constat dans une période ultérieure réapparaît.

## Devise de rapport {#currency}

**Settings → Reporting** choisit USD ou CNY. Les frais conservent la devise
dans laquelle ils ont été facturés ; une table de taux de change intégrée et
datée les convertit pour l’affichage, à un taux pas plus tardif que la date
du frais. Les taux ne sont pas des données de marché en direct. Un taux
manquant est signalé, jamais traité comme 1:1.
