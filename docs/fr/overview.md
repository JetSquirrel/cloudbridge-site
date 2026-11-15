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
- Si des frais de la période n’ont pas de taux de change, un avertissement
  indique qu’ils ne sont pas comptés dans les totaux.

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

## Exporter une revue mensuelle des coûts {#report}

**Export report** dans la vue d’ensemble enregistre un mois dans un seul
fichier HTML, prêt à imprimer ou à partager. Choisissez un mois, en commençant
par le plus récent qui soit terminé, puis **Choose file and export** et
l’emplacement du fichier. Le fichier ne charge rien d’ailleurs, et rien n’est
téléversé. Il faut CloudBridge 0.9.0 ou une version ultérieure sur ordinateur
de bureau : la démo dans le navigateur n’a pas d’export.

Le rapport couvre tous les comptes dans la devise de rapport, sans filtre par
fournisseur ni par compte. Il contient :

- le coût net, l’usage et les crédits, ainsi que la variation par rapport au
  mois précédent ;
- **Cost by service**, **Net cost by region** et **Usage by business line** ;
- **Forecast and budgets**, pour un mois encore en cours ;
- **Data health**, les principaux **Insights** et **Sources**, qui indique d’où
  viennent les données de chaque source et quand elles ont été ingérées pour
  la dernière fois ;
- **What these figures leave out**, comme les frais sans taux de change, les
  lignes d’usage sans montant, ou un inventaire jamais scanné ou seulement en
  partie.

Un mois encore en cours affiche les chiffres du mois en cours et aucune
variation, car la colonne du mois précédent couvre un mois entier. Le rapport
nomme des comptes, des services et des ressources : lisez-le avant de
l’envoyer hors de votre équipe.

## Figer un mois {#snapshots}

Le registre ne cesse de changer : une actualisation ou un import peut
réécrire un mois, et les fournisseurs corrigent les factures après la fin du
mois. **Month-end snapshots**, sur la page d’un compte, conserve une copie
qui ne change pas, pour clôturer le mois par la suite. Il faut CloudBridge
0.9.0 ou une version ultérieure. Pour comparer une copie à la facture du
fournisseur, voir [Rapprochement](reconciliation.md#snapshot).

Choisissez le mois et cliquez sur **Freeze period**. Une boîte de dialogue
indique combien de frais la copie contiendra et leur total. La copie conserve
ces frais, les totaux par devise de facturation, les taux de change utilisés
et l’origine de la facture ; aucune actualisation ni aucun import ultérieur ne
la modifie.

- **Comparaison avec le registre.** Chaque révision affiche **Matches the
  ledger** ou **Differs from the ledger**, avec des tableaux par devise de
  facturation, service et catégorie de frais. Cliquez sur une ligne pour voir
  les frais qui la composent. Les écarts sont présentés par devise, de sorte
  qu’un taux de change ne peut pas en masquer un.
- **Révisions.** Une fois la facture modifiée, **Freeze new revision** ajoute
  une autre copie et conserve les précédentes. Si la facture n’a pas changé,
  aucune révision n’est ajoutée.
- **Un mois encore en cours** peut être figé, mais la boîte de dialogue
  avertit que la copie sera incomplète, et l’instantané continue de l’indiquer
  ensuite.
- **Montants manquants.** Un mois dont les frais portent un usage mais pas de
  montant n’a pas de total, ce qui ne signifie pas qu’il n’a rien coûté. La
  carte le dit, et indique combien de frais n’ont pas de montant ou pas de
  taux de change.
- **Vérifier une copie.** Chaque révision affiche son ID d’instantané, son lot
  d’ingestion et sa somme de contrôle. Si les frais stockés ne correspondent
  plus à la somme de contrôle, la carte vous avertit de ne pas vous fier à
  cette révision.

Les instantanés sont stockés dans `billing.duckdb`, donc une
[sauvegarde](settings-and-data.md#backups) du dossier de données les inclut.
Supprimer l’historique de facturation d’un compte les supprime aussi.

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
derrière eux et tout [instantané de fin de mois](#snapshots). Ni l’un ni
l’autre n’est réversible. L’historique qui a survécu
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
