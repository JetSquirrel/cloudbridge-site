---
title: "Résoudre les problèmes courants de CloudBridge"
description: "Solutions aux problèmes courants de CloudBridge : demandes du trousseau macOS, AccessDenied AWS, vue d’ensemble vide, SmartScreen, fenêtre de console sous Windows, erreurs d’import et alertes qui ne se sont pas déclenchées."
---

# Dépannage

**[English](../troubleshooting.md)**&emsp;**[中文](../zh/troubleshooting.md)**&emsp;**[日本語](../ja/troubleshooting.md)**&emsp;**[한국어](../ko/troubleshooting.md)**&emsp;**[Español](../es/troubleshooting.md)**&emsp;**[Deutsch](../de/troubleshooting.md)**&emsp;**[Português](../pt/troubleshooting.md)**&emsp;[Documentation](index.md)

## macOS demande l’accès au trousseau {#keychain}

Les identifiants enregistrés vivent dans le trousseau du système, pas dans
les fichiers propres à CloudBridge : macOS peut donc demander si CloudBridge
peut utiliser son élément de trousseau lorsque l’application lit un
identifiant. Cliquez sur **Always Allow** pour qu’il ne le demande pas à
chaque actualisation, ou sur **Allow** pour être interrogé à chaque fois. Si
vous cliquez sur **Deny**, l’application ne peut pas lire l’identifiant et la
récupération de ce compte échoue jusqu’à ce que vous autorisiez l’accès.

## AWS renvoie AccessDenied {#aws-access-denied}

La clé s’est authentifiée, mais son utilisateur n’a pas
`ce:GetCostAndUsage`. Attachez la
[stratégie Cost Explorer](aws.md#cost-explorer) à l’utilisateur IAM
propriétaire de la clé. Une politique de contrôle de service d’organisation
peut aussi refuser Cost Explorer ; et dans une organisation AWS, les comptes
membres ne voient les données Cost Explorer que si le compte de gestion
l’autorise.

## La vue d’ensemble est vide après l’ajout d’un compte {#empty-overview}

- **Rien n’a encore été récupéré.** Cliquez sur **Refresh** dans la vue
  d’ensemble. Une source par import de fichier (Volcengine, OpenAI,
  Anthropic) n’a rien à récupérer : utilisez **Import** sur sa ligne.
- **Le fournisseur n’a pas encore publié.** Les fournisseurs publient les
  frais avec un délai ; AWS Cost Explorer peut accuser jusqu’à environ
  24 heures de retard, un compte tout neuf ou les dépenses du jour peuvent
  donc ne pas apparaître immédiatement. Réessayez plus tard plutôt que
  d’utiliser Force Refresh, qui peut entraîner des frais de requête Cost
  Explorer.
- **La fenêtre est trop étroite.** En début de mois, **MTD** peut contenir
  peu de choses ou rien ; passez à **30d** ou **12m**.
- **C’est une source de solde uniquement.** L’API de DeepSeek renvoie un
  solde, pas des dépenses. Importez son export d’utilisation pour le détail
  des dépenses.

## Un compte n’arrête pas d’échouer à l’actualisation {#refresh-failing}

Le panneau de la barre des menus et la vue d’ensemble nomment les comptes en
échec et en donnent la raison. Un compte en échec est réessayé au bout de
15 minutes, puis 30, en doublant jusqu’à l’intervalle d’actualisation, et une
notification signale le début des échecs. Si un fournisseur a répondu mais
que CloudBridge n’a pas pu stocker le résultat — un disque plein, par
exemple — la récupération de ce mois n’est pas répétée dans l’intervalle
d’actualisation, pour ne pas payer deux fois les mêmes données ; **Force
Refresh** réessaie immédiatement. Voir
[Barre des menus et arrière-plan](background.md#failures).

## Windows SmartScreen bloque l’application {#smartscreen}

La version Windows n’est pas signée, SmartScreen affiche donc *Windows
protected your PC*. Après avoir vérifié que le fichier vient bien de la page
officielle [Releases](https://github.com/JetSquirrel/cloudbridge/releases),
cliquez sur **More info**, puis sur **Run anyway**.

## Une fenêtre de console s’ouvre avec l’application sous Windows {#windows-console}

Les versions Windows jusqu’à 0.7.1 ouvrent une fenêtre de console noire à
côté de CloudBridge, et le `.exe` affiche une icône générique au lieu de
celle de CloudBridge. Fermer cette console quitte CloudBridge, icône de la
zone de notification comprise : réduisez-la plutôt que de la fermer. Les
versions suivantes n’ouvrent aucune console et portent leur icône dans le
`.exe`, la barre de titre et la barre des tâches.

## Toutes les requêtes échouent sous Windows {#windows-query}

Dans la version 0.8.0 sous Windows, chaque requête de la page Query s’arrête
sur une erreur d’E/S, car la page ouvre une seconde fois le fichier du
registre. CloudBridge 0.9.0 corrige cela. Vos données ne sont pas affectées.

## L’installation du scanner s’arrête en cours de route {#scanner-install}

Le scanner d’Insights représente un téléchargement d’environ 45 Mo. Dans la
version 0.8.0, une connexion coupée en cours de route arrête l’installation
avec *io: unexpected end of file* : cliquez de nouveau sur **Set up and
scan**. À partir de 0.9.0, CloudBridge réessaie de lui-même jusqu’à trois fois
un téléchargement interrompu ou expiré, ou une erreur de serveur.

## Erreurs d’import {#import-errors}

- **« not UTF-8 text »** — les consoles Alibaba Cloud et Volcengine peuvent
  produire des exports en GBK. Réexportez en UTF-8 ou enregistrez le fichier
  en CSV UTF-8 avant de l’importer.
- **Colonnes non reconnues** — les analyseurs reconnaissent les alias connus
  des exports en chinois et en anglais et les noms de champs des
  fournisseurs. Si un format a changé, signalez l’erreur et les en-têtes de
  colonnes dans un ticket. Masquez les valeurs sensibles ; ne joignez pas
  une facture non expurgée.
- **Un mois a rétréci après l’import** — un import remplace tous les mois
  couverts par le fichier pour ce compte : un export filtré sur un produit
  ne laisse donc que ce produit. Réimportez la facture complète, non filtrée.
- **Des tokens mais aucune dépense** — un export d’utilisation ne contient
  pas d’argent ; importez plutôt l’export de coûts. Pour DeepSeek, importez
  le ZIP tel que téléchargé, et non son `amount-*.csv`.

## Un scan Cloudflare est refusé {#cloudflare-scan}

Le scan indique laquelle de deux choses s’est produite. *Cloudflare n’a pas
accepté le jeton d’API de ce compte* signifie que le jeton est erroné ou
expiré : vérifiez-le sur la page Accounts. *Le jeton ne peut pas lire …*
signifie que le jeton est valide mais qu’il lui manque la permission Read
d’un service ; ajoutez les permissions listées sous
[Cloudflare](cloudflare.md#insights). Un jeton sans elles lit quand même la
facture.

## Une alerte ne s’est pas déclenchée {#alert-silent}

- **La règle Account budget n’a aucun budget pour se mesurer.** La règle ne
  fait rien pour un compte sans **Monthly budget**, quel que soit son type de
  seuil. Définissez-en un sur la page Rules.
- **La dépense est partie de rien.** La règle d’anomalie de croissance des
  coûts compare un service à ses sept derniers jours ; un service qui n’a
  rien coûté n’a donc pas de base et ne la déclenche jamais. Une règle de
  budget sur les prévisions de fin de mois couvre ce cas : voir
  [Repérer un emballement](cloudflare.md#runaway).
- **Le jour n’est pas encore dans le registre.** Les règles s’exécutent sur
  ce qui a été récupéré. L’actualisation en arrière-plan récupère un compte
  une fois par intervalle d’actualisation, et seulement pendant que
  CloudBridge tourne ; voir [Barre des menus et arrière-plan](background.md).
- **Les notifications sont désactivées,** ou l’alerte était déjà ouverte au
  démarrage de l’application. Les alertes ouvertes sont de toute façon
  listées sur la page Alerts.

## Toujours bloqué {#help}

Une question à laquelle la documentation ne répond pas ?
[Ouvrez un ticket](https://github.com/JetSquirrel/cloudbridge/issues).
