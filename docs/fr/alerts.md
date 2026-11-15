---
title: "Alertes d’anomalie de coûts cloud, règles et budgets"
description: "Règles d’alerte CloudBridge pour les anomalies de coûts, les seuils de solde, la dépense non étiquetée et les budgets : quand elles s’exécutent, ce qu’elles mesurent, et comment les alertes se résolvent."
---

# Alertes, règles et budgets

**[English](../alerts.md)**&emsp;**[中文](../zh/alerts.md)**&emsp;**[日本語](../ja/alerts.md)**&emsp;**[한국어](../ko/alerts.md)**&emsp;**[Español](../es/alerts.md)**&emsp;**[Deutsch](../de/alerts.md)**&emsp;**[Português](../pt/alerts.md)**&emsp;[Documentation](index.md)

Les règles sont évaluées sur le registre à l’ouverture de l’application et
après chaque actualisation — y compris
[l’actualisation en arrière-plan](background.md), qui récupère chaque compte
une fois son intervalle d’actualisation écoulé pendant que CloudBridge
tourne, fenêtre fermée également sous macOS et Windows. Chaque nouvelle
alerte émet une notification système. Ouvrir la page Alerts revérifie si les
alertes ouvertes se sont résolues.

## Les règles {#rules}

Trois règles sont livrées activées ; examinez-les sur la page **Rules** et
désactivez celles dont vous n’avez pas besoin.

| Règle | Se déclenche quand | Par défaut |
| --- | --- | --- |
| Model cost growth anomaly | La dépense quotidienne d’une paire source/service dépasse sa base des 7 jours précédents plusieurs jours de suite | Au-dessus de 2,5× pendant 2 jours consécutifs |
| Balance floor | Un solde prépayé passe sous le budget mensuel du compte, ou sous le seuil par défaut sans budget | 200, dans la devise du solde |
| Untagged spend ratio | La part d’usage non imputé du mois dépasse le seuil et est supérieure à celle du mois dernier | Au-dessus de 15 % et en hausse |

La règle d’anomalie a besoin d’une base : un service qui n’a rien coûté ces
sept derniers jours ne la déclenche jamais, quelle que soit sa dépense
ensuite. Une charge de travail qui passe de rien à l’emballement — un projet
oublié qui se met à boucler — est détectée par une règle
[Account budget](#budgets) fondée sur la prévision de fin de mois ;
[Cloudflare](cloudflare.md#runaway) en détaille la marche à suivre.

**New rule** sur la page Rules en crée d’autres : choisissez un type,
ajustez ses réglages et cliquez sur **Create rule**. Une nouvelle règle est
activée aussitôt, et une règle d’anomalie peut être limitée à un seul compte.

## Budgets {#budgets}

La carte **Monthly budgets** de la page Rules fixe ce qu’un compte peut
coûter dans un mois. Choisissez le compte, saisissez un **Monthly budget** et
un **Alert at (% of budget)**, puis cliquez sur **Save budget** ; **Remove**
le supprime. Chaque compte budgété affiche ensuite la part de son budget
consommée ce mois-ci, dans la devise de rapport.

Un budget à lui seul ne fait que tracer cette ligne. Pour être alerté, créez
une règle **Account budget** pour le compte et choisissez :

- **Based on** — *Cost to date* pour le mois en cours, ou *Month-end
  forecast* pour la projection au rythme actuel ;
- **Threshold type** — *% of budget*, ou un *Amount* fixe.

Cela fonctionne aussi dans l’autre sens : la règle se mesure au budget, donc
une règle **Account budget** sur un compte sans budget ne se déclenche
jamais, même avec un seuil de type *Amount*. Définissez le budget d’abord.

Le budget d’un compte sert aussi de seuil dans la règle Balance floor.

## Lire une alerte {#alerts}

Une alerte porte les mesures qui la sous-tendent : dépense et base, solde et
seuil, ou part non imputée. Les projections sont des estimations à partir de
données récentes, pas des coûts de fin de mois garantis. **Snooze** masque
une alerte un moment ; **Dismiss** la ferme. Une alerte ouverte est marquée
**resolved** quand une évaluation ultérieure constate que sa condition ne
tient plus.

**See the charges** ouvre le service de l’alerte dans [Requête](query.md),
tous mois confondus.

Un solde bas est une seule alerte plutôt qu’une nouvelle carte chaque jour.
Elle conserve les derniers chiffres jusqu’à ce que le solde se rétablisse ou
que vous la fermiez, et les cartes plus anciennes pour le même solde
fusionnent avec elle à la vérification suivante.

## Notifications {#notifications}

Chaque alerte qui se déclenche pendant que CloudBridge tourne est annoncée
une fois par une notification système ; les alertes déjà ouvertes au
démarrage de l’application ne sont pas répétées. Désactivez-les sous
**Settings → Background → Alert notifications**.
