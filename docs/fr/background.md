---
title: "Dépense dans la barre des menus et actualisation en arrière-plan"
description: "Gardez CloudBridge en surveillance fenêtre fermée : dépense dans la barre des menus, actualisation quotidienne en arrière-plan, notifications, ouverture à la connexion et reprises sûres."
---

# Barre des menus et arrière-plan

**[English](../background.md)**&emsp;**[中文](../zh/background.md)**&emsp;**[日本語](../ja/background.md)**&emsp;**[한국어](../ko/background.md)**&emsp;**[Español](../es/background.md)**&emsp;**[Deutsch](../de/background.md)**&emsp;**[Português](../pt/background.md)**&emsp;[Documentation](index.md)

Une alerte de coût ne vaut que tant que l’argent est encore dépensé. C’est
pourquoi CloudBridge continue de tourner après la fermeture de sa fenêtre,
s’actualise selon un calendrier, et vous prévient quand quelque chose se
déclenche.

## L’icône de la barre des menus {#menu-bar}

Sous macOS et Windows, fermer la fenêtre laisse CloudBridge dans la barre des
menus (la zone de notification sous Windows). Le titre de l’icône est la
dépense du mois, `$2.8k`. L’icône est un pont en arc à trois points, et un
point d’exclamation remplace les points tant qu’une alerte est ouverte.

Cliquez dessus pour ouvrir un panneau avec le mois en cours, la prévision de
fin de mois, les alertes ouvertes et les services qui ont le plus bougé par
rapport au mois dernier, avec **Refresh** et **Open CloudBridge**. Cliquer
sur une alerte l’ouvre sur la page Alerts. Faites un clic droit sur l’icône —
ou utilisez **Quit** dans le panneau — pour quitter ; fermer la fenêtre ne le
fait plus. L’icône du Dock apparaît et disparaît avec la fenêtre.

Pour que la fermeture de la fenêtre quitte plutôt l’application, désactivez
**Settings → Background → Keep running in the menu bar**. L’icône disparaît
aussitôt ; le calendrier et les notifications ne tournent alors que pendant
que la fenêtre est ouverte, et un lancement à la connexion ouvre la fenêtre
au lieu de démarrer en arrière-plan.

Les versions Linux n’ont pas d’icône de barre d’état et quittent toujours
avec leur fenêtre ; le calendrier et les notifications tournent tant qu’elle
est ouverte.

## L’actualisation en arrière-plan {#schedule}

CloudBridge récupère chaque compte une fois son intervalle d’actualisation
écoulé (**Settings → Refreshing**, 24 heures par défaut), exécute les
[règles d’alerte](alerts.md) et émet une notification pour chaque nouvelle
alerte. Le calendrier coûte donc ce que coûterait un clic sur Refresh une
fois par jour.

Toutes les 15 minutes, il vérifie si un compte est arrivé à échéance. Cette
vérification ne lit que le registre local ; elle n’envoie rien à un
fournisseur. Ces 15 minutes déterminent le délai après le réveil d’un
portable, ou après la fin d’une panne, avant qu’un compte dû soit récupéré —
pas la fréquence des récupérations. Désactivez le calendrier sous
**Settings → Background → Refresh in the background**.

## Ouvrir à la connexion {#login}

**Settings → Background → Open at login** démarre CloudBridge à votre
connexion, dans la barre des menus et sans sa fenêtre, pour que les alertes
continuent d’arriver après un redémarrage. Il est désactivé tant que vous ne
l’activez pas ; macOS le liste sous **System Settings → General → Login
Items**.

## Quand une actualisation échoue {#failures}

- **Un compte qui échoue sans arrêt** est réessayé au bout de 15 minutes,
   puis 30, en doublant jusqu’à l’intervalle d’actualisation : une clé
   révoquée ou une panne de fournisseur coûte donc une poignée d’essais par
   jour plutôt qu’un à chaque tour. Une notification signale le début des
   échecs d’un compte — sa dépense n’est plus surveillée — et le panneau le
   nomme jusqu’à son rétablissement.
- **Une récupération que le fournisseur a servie mais que CloudBridge n’a pas
   pu stocker** — un disque plein, par exemple — n’est pas répétée dans
   l’intervalle d’actualisation, pour ne pas payer deux fois les mêmes
   requêtes Cost Explorer ou téléchargements S3. **Force Refresh** réessaie
   immédiatement.
- **L’échec d’un mois n’empêche pas l’autre** : un problème sur le mois
   dernier ne laisse pas ce mois-ci, où un emballement se voit, non récupéré.
