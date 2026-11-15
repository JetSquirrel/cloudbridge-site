---
title: "Installer CloudBridge et lire sa première facture"
description: "Installez CloudBridge sous macOS ou Windows, explorez avec la facture de démonstration, ajoutez votre premier compte et lisez votre première facture en quelques minutes."
---

# Pour commencer

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[日本語](../ja/getting-started.md)**&emsp;**[한국어](../ko/getting-started.md)**&emsp;[Documentation](index.md)

CloudBridge lit vos factures cloud et de fournisseurs de modèles dans un
registre unique sur votre machine — depuis une API de facturation, ou depuis
l’export que vous avez téléchargé — et en trace les tendances. Pas
d’inscription, pas de synchronisation, pas de télémétrie. Cette page vous
mène du téléchargement à votre première facture.

## 1. Installer {#install}

Téléchargez la dernière version depuis la page
[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest) :

| Plateforme | Fichier |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** Ouvrez le `.dmg`, faites glisser **CloudBridge** vers
**Applications** et lancez-le depuis cet emplacement. Les versions publiées
sont signées Developer ID et notariées, elles s’ouvrent donc sans
contournement. Si macOS bloque une version actuelle,
[signalez le message exact](https://github.com/JetSquirrel/cloudbridge/issues)
et votre version de macOS ; ne retirez pas la protection de quarantaine
comme une étape d’installation habituelle.

**Windows.** Le `.exe` n’est pas signé, SmartScreen va donc probablement
l’arrêter avec *Windows protected your PC*. Vérifiez que le fichier vient
bien de la page officielle Releases, puis cliquez sur **More info** et
**Run anyway**. Windows retient le choix pour ce fichier ; une nouvelle
version le redemande.

Les binaires Linux et Mac Intel ne sont pas publiés. Construire depuis les
sources demande Rust 1.95 ou plus récent — voir la
[configuration de développement](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup) :

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. Jeter un œil d’abord, si vous voulez {#demo}

[La démo dans le navigateur](https://cloudbridge.jetsquirrel.cloud/demo/)
fait tourner les mêmes pages sur une facture d’exemple. Elle ne conserve
aucun identifiant et ne joint aucun fournisseur : l’import, l’actualisation
depuis une API de facturation et la console SQL sont réservés à
l’application de bureau.

Dans l’application, une vue d’ensemble vide propose **Load demo data**, ou
ouvrez **Settings → Demo data**. Les comptes de démonstration ne portent
aucun identifiant et sont ignorés par les actualisations ; **Clear demo
data** sur la même page les supprime.

## 3. Ajouter un compte {#account}

Ouvrez **Accounts**, cliquez sur **Add account**, choisissez la source et
saisissez un nom.

| Source | Comment arrive la facture | Ce qu’il faut |
| --- | --- | --- |
| Amazon Web Services | API de facturation | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | API Cost Management | Client ID + secret + ID d’abonnement — [Azure](azure.md) |
| Google Cloud | Export de facturation BigQuery | Fichier de clé de compte de service + table d’export — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | API de facturation, ou un export de facture | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | API de facturation | ID de compte + jeton d’API — [Cloudflare](cloudflare.md) |
| DeepSeek | API de solde, ou un export de facture | Clé d’API — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | Export de facture | Rien |
| OpenAI | Export de facture | Rien |
| Anthropic (Claude) | Export de facture | Rien |

Cliquez sur **Save**. Une source API récupère aussitôt la facture du mois en
cours et celle du mois dernier : une clé erronée se voit donc comme un échec
de cette récupération.

## 4. Faire entrer la facture {#bill}

- **Une source API** a récupéré sa facture au moment de l’enregistrement.
  **Refresh** sur la vue d’ensemble récupère à nouveau une fois l’intervalle
  d’actualisation écoulé.
- **Une source fichier** — Volcengine, OpenAI, Anthropic, ou Alibaba Cloud et
  DeepSeek quand vous voulez plus de détail — a besoin de son export :
  téléchargez-le depuis la console du fournisseur et cliquez sur **Import**
  sur la ligne du compte. Voir
  [Importer un fichier de facture](bill-import.md).

## 5. La lire {#read}

La page **Overview** affiche la fenêtre que vous choisissez : **MTD**, **30d** ou
**12m**. Choisissez USD ou CNY sous **Settings → Reporting**. À partir de là :

- [Vue d’ensemble et comptes](overview.md) explique les chiffres.
- [Alertes, règles et budgets](alerts.md) vous dit quand les dépenses
  bondissent.
- [Barre des menus et arrière-plan](background.md) maintient tout cela en
  marche fenêtre fermée.

Quelque chose n’apparaît pas ? Voir [Dépannage](troubleshooting.md).
