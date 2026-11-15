---
title: "0.3.1 : un seul de chaque"
description: "Une passe de cohérence sur toute l'interface — un jeu partagé de cartes, de boutons, de pastilles et d'en-têtes de tableau — plus une version macOS signée et notariée."
date: 2026-09-12
tag: Version
---

# 0.3.1 : un seul de chaque

<p class="post-meta">2026-09-12&emsp;Version&emsp;<a href="./">Tous les articles</a></p>

La 0.3.0 a reconstruit l'interface sur GPUI Kit, mais page par page. Chaque page a reçu le nouveau look ; chaque page a aussi gardé sa propre copie de ce qu'est une carte, un bouton principal ou un en-tête de tableau. Les copies divergent : la page Réglages avait encore les styles d'avant la refonte, et ailleurs le même contrôle « choisir parmi trois » apparaissait sous quatre formes différentes. La 0.3.1 est la passe qui rend le système de design réel — une définition par élément, dans le thème, avec chaque page qui y puise.

## La gravité décide de la mise en avant

La passe a révélé des endroits où la hiérarchie visuelle contredisait l'information. Sur la page Comptes, **Sain** — le seul état qui ne vous demande rien — portait le badge le plus vif, tandis qu'Anomalie et Solde faible s'affichaient en texte simple. Sur la page Alertes, une alerte Critique était moins visible qu'un Avertissement. Les deux sont désormais inversés dans le bon sens : plus l'état est fort, plus le style est fort, et le rouge d'alerte et le jaune d'avertissement sont réservés aux vraies alertes plutôt qu'aux libellés neutres.

La même logique s'est appliquée aux actions. Rafraîchir, l'opération quotidienne bon marché, est maintenant le bouton principal de la Vue d'ensemble ; Forcer le rafraîchissement, la coûteuse, est un bouton secondaire. Les boutons de suppression et les confirmations de suppression utilisent le style danger. Et les boutons d'action d'une alerte sont stylés selon ce qu'ils font, pas selon leur place dans une liste — pour qu'Ignorer ne puisse jamais devenir le grand bouton principal simplement parce qu'il vient en premier.

## Des erreurs qui ne délogent pas le contenu

Sur la page Règles, un interrupteur qui échouait remplaçait autrefois toute la liste des règles par une bannière rouge. Les erreurs s'affichent désormais en ligne au-dessus de la liste, la liste reste en place, et chaque erreur propose Réessayer.

## Corrections plus discrètes

- **« Plus gros écarts »** classe désormais selon l'ampleur de la variation, pas selon l'ampleur de la dépense — un service important mais stable n'occupe plus la liste indéfiniment.
- Le point de fraîcheur de la barre d'état reflète si la prochaine récupération est due, au lieu de rester vert pour toujours après la première synchronisation.
- **« Résolu ce mois-ci »** affiche la date à laquelle une alerte a été résolue, pas celle à laquelle elle a été levée.
- Les montants en yens n'affichent plus de décimales dénuées de sens.
- La page de détail d'un compte fusionne ses cartes DÉPENSES / USAGE / CRÉDITS en une seule carte DÉPENSES qui détaille le total sur une ligne.
- Le site de documentation a eu droit au même traitement : un titre dupliqué renommé, des explications répétées dédoublonnées, des couleurs codées en dur déplacées vers les jetons de design.

## Une version macOS signée

Les builds de release pour macOS sont désormais signés et notariés en CI. Le contournement de Gatekeeper dans les notes d'installation — Ctrl-clic, « Ouvrir quand même », la ligne `xattr` — cesse de faire partie de l'installation de CloudBridge ; téléchargez le DMG et glissez-le dans Applications.

## La suite

Inchangé depuis la 0.3.0 : la [feuille de route](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) doit encore un canal d'*export* de fichiers de factures (S3 / OSS + Parquet), une allocation par tags avec un nœud non alloué explicite, et les API de facturation de Volcengine, OpenAI et Anthropic.
