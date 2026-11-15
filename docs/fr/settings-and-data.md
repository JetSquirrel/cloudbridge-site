---
title: "Réglages, stockage des données et sécurité"
description: "Ce que CloudBridge stocke et où : le registre DuckDB, les comptes, les charges utiles brutes et la configuration, plus l’intervalle d’actualisation, la devise, les sauvegardes et la sécurité."
---

# Réglages, données et sécurité

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[日本語](../ja/settings-and-data.md)**&emsp;**[한국어](../ko/settings-and-data.md)**&emsp;**[Español](../es/settings-and-data.md)**&emsp;**[Deutsch](../de/settings-and-data.md)**&emsp;**[Português](../pt/settings-and-data.md)**&emsp;[Documentation](index.md)

## Réglages {#settings}

| Réglage | Ce qu’il fait |
| --- | --- |
| Appearance → Theme | Thèmes clair et sombre, mémorisés d’un lancement à l’autre |
| Appearance → Language | [La langue de l’interface](#language) : System, English ou 简体中文 |
| Reporting → Currency | USD ou CNY pour tous les totaux ; les frais gardent leur propre devise |
| Refreshing → Refresh interval | 6, 12, 24 (par défaut) ou 48 heures avant qu’un mois soit récupéré à nouveau |
| Background | [Ouverture à la connexion, actualisation en arrière-plan, notifications d’alerte](background.md) |
| Data → Export as FOCUS | Chaque frais en CSV avec les noms de colonnes FOCUS, pour un autre outil FinOps ([détails](focus.md#export)) |
| Demo data | Charger ou effacer cinq comptes d’exemple (AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic) avec douze mois d’historique |

**Refresh** récupère les mois plus anciens que l’intervalle d’actualisation ;
**Force Refresh** les récupère tous et peut entraîner des frais chez le
fournisseur. Ni l’un ni l’autre n’écrase un mois importé. Les comptes de
démonstration utilisent le préfixe `demo-`, ne portent aucun identifiant et
sont ignorés par les actualisations.

## Langue de l’interface {#language}

CloudBridge 0.9.0 et les versions ultérieures sont traduits en 简体中文 :
chaque page et boîte de dialogue, le panneau de la barre des menus, son menu
et les notifications système. Tant que vous ne choisissez pas de langue sous
**Settings → Appearance → Language**, l’application suit celle du système, et
un changement s’applique aussitôt. La démo dans le navigateur suit la langue
du navigateur et dispose d’un sélecteur en pied de sa barre latérale.

- Le menu de la barre d’état reprend une nouvelle langue au prochain démarrage
  de l’application.
- Une alerte conserve la langue dans laquelle elle s’est déclenchée. L’alerte de
  solde bas fait exception : elle est réécrite avec ses derniers chiffres, dans
  la langue courante.
- Les montants et les devises sont formatés comme avant.

## Où vivent les données {#storage}

| Plateforme | Emplacement |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux (versions compilées depuis les sources) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — le registre de facturation, avec la devise d’origine de
  chaque frais, les [instantanés de fin de mois](overview.md#snapshots) et les
  [factures](reconciliation.md) ;
- `cloudbridge.duckdb` — comptes, budgets, règles et état des alertes ;
- `raw/` — chaque réponse de fournisseur et chaque fichier importé, par
  source, compte et mois, pour qu’une correction de correspondance puisse les
  relire sans nouvelle requête (**Accounts → Replay normalization**) ;
- `inventory/` et `tools/` — les scans d’Insights et le scanner, s’il est
  installé ;
- `config.json` — devise, thème, intervalle d’actualisation et réglages
  d’arrière-plan.

## Sauvegardes {#backups}

Quittez CloudBridge avant de copier ou d’ouvrir ses bases de données.
Sauvegardez le répertoire entier — les deux bases, `raw/` et `config.json` —
et restaurez-le avec l’application fermée. Les identifiants sont dans le
trousseau du système, pas dans la sauvegarde ; sur une autre machine,
saisissez-les de nouveau. Pour analyser le registre hors de l’application,
interrogez une copie plutôt que le fichier actif.

## Sécurité {#security}

- Les identifiants sont conservés dans le trousseau du système — Keychain
  macOS ou Credential Manager Windows ; Secret Service sur les versions Linux
  compilées depuis les sources — séparément des bases de données.
- L’application n’utilise un identifiant que pour les requêtes au fournisseur
  dont il relève. Utiliser une clé dans CloudBridge ne la rend pas en lecture
  seule : voir [Autorisations des fournisseurs](permissions.md).
- Il n’y a pas de service de synchronisation CloudBridge ni de télémétrie. Un
  import ne fait aucune requête au fournisseur.
- **Local ne veut pas dire chiffré.** L’application ne chiffre ni le registre
  ni les fichiers bruts. Utilisez le chiffrement du disque et protégez vos
  sauvegardes.
- Avant de partager des journaux, des captures d’écran ou des exports
  d’exemple, masquez les identifiants, les ID de compte, les noms de
  ressources et les étiquettes.
