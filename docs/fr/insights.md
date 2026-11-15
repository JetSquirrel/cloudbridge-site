---
title: "Trouver les ressources AWS et Cloudflare inactives"
description: "CloudBridge Analyses place un scan de ressources en lecture seule d’AWS et de Cloudflare à côté de la facture : instances arrêtées, adresses inactives, ressources non revendiquées et leur coût."
---

# Analyses

**[English](../insights.md)**&emsp;**[中文](../zh/insights.md)**&emsp;**[日本語](../ja/insights.md)**&emsp;**[한국어](../ko/insights.md)**&emsp;[Documentation](index.md)

Analyses compare la facture à ce qui tourne réellement, et liste ce qui
mérite un coup d’œil, chaque élément valorisé à partir de la facture de la
période.

## Configurer et scanner {#scan}

Cliquez sur **Set up and scan**. La première fois, CloudBridge demande
confirmation avant d’installer son scanner de ressources,
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist)
— open source, notre fork maintenu, environ 30 Mo, conservé dans le dossier
de données propre à CloudBridge et vérifié par rapport à une somme de
contrôle intégrée à l’application. Ensuite, il scanne :

- chaque compte **AWS** avec sa clé d’accès, dans toutes les régions qu’AWS
  active par défaut ou seulement celles que vous choisissez ;
- chaque compte **Cloudflare** avec son jeton d’API.

Le scan ne fait que lire — il liste des ressources et ne change rien — mais
l’identifiant a besoin d’un accès en lecture à celles-ci : voir
[AWS](aws.md#insights) et [Cloudflare](cloudflare.md#insights). **Scan
again** rafraîchit l’inventaire. Le scan demande l’application de bureau sous
macOS (Apple silicon) ou Windows.

## Ce qu’il trouve {#findings}

Pour AWS :

- les **instances arrêtées** dont les volumes continuent d’être facturés ;
- les **adresses publiques inactives** — des adresses IPv4 allouées mais
  rattachées à rien ;
- les **ressources non revendiquées** — aucune étiquette de propriétaire
  (`owner`, `team`, `project`, `cost-center`, `business_line`) et aucune pile
  ni application qui les gère ;
- ce qui est **facturé mais absent du scan** — dans une région couverte par
  le scan.

Les prix demandent une facture au niveau des ressources : un compte AWS
pointé sur son [Data Export](aws.md#data-exports). Sans cela, les constats
sont listés, mais pas valorisés.

Pour Cloudflare, une carte liste ce que le scan a trouvé par type — Workers,
buckets R2, bases D1, espaces de noms KV, zones, Durable Objects — avec la
part de chaque type et de chaque ressource dans la facture et son usage sur
la période, du plus coûteux au moins coûteux. Avec
[la facture découpée par ressource](cloudflare.md#split), c’est là qu’un
espace de noms ou un bucket qui s’emballe apparaît nommément.

## Le résumé d’abord {#summary}

Chaque carte s’ouvre sur ses types de ressources, avec les nombres et le
coût. Cliquez sur un type pour lister ses ressources, cinquante à la fois
avec **Show more** ; cliquez de nouveau dessus pour le refermer. Un gros
compte reste à une ligne par type tant que vous ne demandez pas le détail.
