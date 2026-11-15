---
title: "0.2.0 : un visualiseur de coûts devient un grand livre"
description: "Les frais de toutes les sources arrivent désormais dans une seule table de faits au format FOCUS, les réponses brutes sont conservées pour qu'une correction de mapping ne coûte rien à rejouer, et un total est enfin dans une seule devise."
date: 2026-09-01
tag: Version
---

# 0.2.0 : un visualiseur de coûts devient un grand livre

<p class="post-meta">2026-09-01&emsp;Version&emsp;<a href="./">Tous les articles</a></p>

La version 0.1 vous montrait un chiffre par fournisseur et l'appelait un total. Si vous aviez un compte AWS en dollars et un compte Alibaba Cloud en yuans, le « total » additionnait les deux. Les crédits étaient lus comme de la consommation. Un solde était lu comme une dépense. La 0.2.0 reconstruit le socle sur lequel reposent ces chiffres.

## Une seule table de faits

Chaque source se normalise désormais dans une seule table de faits, `fct_charge`, dans un nouveau `billing.duckdb`. Les colonnes portent les noms de [FOCUS](https://focus.finops.org/), la spécification ouverte de coûts et d'usage de la FinOps Foundation : un crédit est un `Credit`, un remboursement est un remboursement, les taxes et les frais de support sont étiquetés comme tels, et les montants conservent leur signe. Quand un bon Alibaba Cloud couvre une partie d'un frais, le frais brut et le bon ont chacun leur propre ligne, et la somme des lignes correspond à ce que vous avez réellement payé. Un écart inexplicable devient une ligne `Adjustment` au lieu de disparaître.

Comme le schéma parle déjà FOCUS, un véritable export de facture — un CUR AWS ou un fichier de facture Alibaba Cloud — pourra s'y intégrer plus tard sans changement de schéma.

## Conserver les réponses brutes

Cost Explorer facture 0,01 $ par requête, donc demander deux fois la même chose est un défaut de conception, pas un mode de consommation. Chaque réponse d'un fournisseur est désormais écrite sur disque telle quelle, en Parquet partitionné à la Hive sous `raw/` — la même disposition qu'utilise un bucket d'export de factures. La normalisation est une fonction pure qui va d'un lot stocké aux lignes du grand livre. Deux conséquences : une correction de mapping rejoue ce qui est sur disque au lieu de payer une nouvelle récupération, et la logique de facturation devient testable à partir d'une réponse enregistrée.

## Une seule devise

Les frais sont stockés dans la devise dans laquelle ils ont été facturés et convertis pour l'affichage, chacun à un taux dont la date n'est pas postérieure à celle du frais. Les totaux viennent d'une vue, `v_charge_normalized`, donc changer la devise de reporting dans les Réglages reconstruit une vue et ne réécrit rien. Un frais dans une devise qu'aucun taux ne couvre est signalé sur le tableau de bord — jamais compté silencieusement à parité.

## Les identifiants quittent la base de données

Les identifiants ne vivent plus que dans le trousseau du système (Gestionnaire d'identifiants Windows, Trousseau macOS). La migration v1 déplace ceux qui étaient encore dans la base et supprime les colonnes qui les contenaient. La base peut être copiée, sauvegardée ou inspectée sans emporter vos clés avec elle.

## Récupérer et normaliser, séparément

Une source de facturation était autrefois une énumération avec cinq branches de `match`. C'est maintenant une ligne de table avec un descripteur de capacités, et ses deux méthodes sont délibérément séparées : `fetch` touche au réseau et n'interprète rien ; `normalize` interprète et ne touche à rien. Ajouter une source, c'est ajouter des lignes et un mapping, pas modifier un tableau de commutation.

## Aussi dans la 0.2.0

- macOS est livré sous forme d'un `.dmg` contenant `CloudBridge.app` au lieu d'un binaire nu zippé que le Finder prenait pour un document.
- Un rafraîchissement ingère désormais la période de facturation courante et la précédente en deux appels à Cost Explorer, là où le tableau de bord en faisait trois.
- Les soldes DeepSeek sont enregistrés sous forme d'instantanés ; une hausse du solde rechargé entre deux observations est dérivée en `Purchase`.
- L'interrupteur du mode sombre change réellement le thème.

## La suite

La [feuille de route](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) décrit la priorité P1 : un canal d'export de fichiers de factures (S3 / OSS + Parquet), une allocation par tags avec un nœud « non alloué » explicite, et un flux de coûts en Sankey. Le grand livre était le prérequis des trois — il est maintenant en place.
