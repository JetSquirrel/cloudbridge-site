---
title: "Coûts Cloudflare par bucket R2, Worker et D1"
description: "Connectez Cloudflare à CloudBridge avec un jeton d’API : usage facturable quotidien réparti entre les buckets R2, les Workers, D1 et les Durable Objects."
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[日本語](../ja/cloudflare.md)**&emsp;**[한국어](../ko/cloudflare.md)**&emsp;[Documentation](index.md)

CloudBridge lit l’usage facturable de Cloudflare : la dépense par service,
**par jour**. C’est tout l’intérêt. Un Worker ou un Durable Object qui se met
à boucler est dans le registre dès le lendemain, pas sur la facture à la fin
du mois — et l’usage compris dans l’allocation gratuite est conservé lui
aussi, avec un coût nul à côté, parce que c’est là qu’un emballement
commence.

## Connecter le compte {#connect}

1. Dans le [tableau de bord Cloudflare](https://dash.cloudflare.com/profile/api-tokens),
   allez dans **My Profile → API Tokens → Create Token** et partez de
   **Create Custom Token**.
2. Accordez **Account → Billing → Read**, et limitez **Account Resources**
   au compte à surveiller.
3. Copiez l’ID de compte depuis la page d’accueil du compte dans le tableau
   de bord.
4. Ajoutez le compte dans CloudBridge avec l’ID de compte et le jeton.

L’API d’usage facturable ne couvre que les comptes à la consommation
(self-serve), et c’est une API alpha ; un compte Enterprise est signalé
comme non couvert. Cloudflare facture sur un cycle ancré au début de
l’abonnement ; chaque mois calendaire dans CloudBridge contient les jours qui
tombent à l’intérieur.

## Découper par ressource {#split}

La facture s’arrête au service — *R2 Class B operations, 734 on 3 October* —
pas au bucket. Ajoutez **Account → Account Analytics → Read** au jeton et
CloudBridge demande à l’API GraphQL Analytics l’usage de chaque ressource
pour les compteurs que nomme la facture, puis répartit la ligne de chaque
jour selon ces parts :

| Facture | Répartie sur |
| --- | --- |
| Opérations R2 Class A et B, stockage | Les buckets R2 |
| Requêtes et CPU des Workers | Les Workers (par requêtes) |
| Lignes D1 lues et écrites, stockage | Les bases D1 |
| Requêtes, durée, lignes, stockage des Durable Objects | Les espaces de noms de Durable Objects |

Les parts additionnées donnent ce que Cloudflare a facturé et sont marquées
comme des estimations : les analyses sont échantillonnées, et une allocation
gratuite appartient au compte, pas à une ressource en particulier. Un
compteur que les analyses ne savent pas découper — KV, Queues, tout ce qui
n’est pas reconnu — ou un jeton sans la permission garde sa ligne entière,
au niveau du compte. [Analyses](insights.md) montre la part de chaque
ressource et son usage sur la période.

## Repérer un emballement {#runaway}

Aucune limite de dépenses n’arrête un compte Cloudflare à la consommation :
une alarme de Durable Object ou un Worker qui boucle est donc facturé tant
qu’il tourne. CloudBridge ne peut pas l’arrêter non plus ; il
peut vous le dire le premier jour plutôt que sur la facture. Mettez cela en
place pour chaque compte Cloudflare, y compris les plus calmes — un projet
que personne n’utilise est celui que personne ne surveille :

1. Sur la page **Rules**, donnez au compte un **Monthly budget** : ce que
   coûte un mois normal, avec une marge. La règle ci-dessous se mesure
   dessus, et ne fait rien pour un compte qui n’en a pas.
2. Cliquez sur **New rule**, choisissez **Account budget** pour le compte,
   et réglez **Based on** sur **Month-end forecast**.
3. Sous **Settings → Refreshing**, raccourcissez l’intervalle d’actualisation
   à 6 heures, et gardez CloudBridge en marche dans la
   [barre des menus](background.md) avec **Open at login** activé.

La prévision est ce qui fait fonctionner l’ensemble. Elle fait la moyenne des
dépenses du mois depuis le premier jour où il y en a eu, le premier jour d’une
boucle est donc projeté sur le reste du mois, et la règle se déclenche à la
première actualisation qui lit ce jour-là.

La règle **cost growth anomaly** ne couvre pas ce cas. Elle compare un
service à ses sept derniers jours, et un service qui n’a rien coûté n’a
aucune base à partir de laquelle croître : un projet dormant qui se réveille
en bouclant ne la déclenche jamais.

Quand l’alerte se déclenche, arrêtez le Worker ou le Durable Object dans le
tableau de bord Cloudflare. Avec Account Analytics sur le jeton,
[Analyses](insights.md) montre la part de chaque Worker et de chaque espace
de noms dans la facture : celui qui est derrière ressort.

## Scanner les ressources {#insights}

[Analyses](insights.md) scanne le compte avec le même jeton et ne fait que
lire. Pour cela, ajoutez ces permissions **Read** sur le même compte :
**Account Settings**, **Zone**, **Workers Scripts**, **Workers R2
Storage**, **Workers KV Storage**, **Queues** et **D1**. Un jeton sans
elles lit quand même la facture ; le scan indique ce qui lui a été refusé.

Voir [Autorisations des fournisseurs](permissions.md#cloudflare) pour savoir
exactement quels points de terminaison CloudBridge appelle.
