---
title: "0.5.0 : il continue de veiller"
description: "CloudBridge reste dans la barre des menus et se rafraîchit selon un calendrier, Cloudflare rejoint le grand livre en descendant jusqu'au bucket et au Durable Object, et Insights scanne AWS et Cloudflare pour trouver quoi couper."
date: 2026-10-08
tag: Version
---

# 0.5.0 : il continue de veiller

<p class="post-meta">2026-10-08&emsp;Version&emsp;<a href="./">Tous les articles</a></p>

Une alerte de coût ne vaut quelque chose que tant que l'argent est encore dépensé. Jusqu'ici, CloudBridge récupérait une facture quand quelqu'un l'ouvrait et appuyait sur Rafraîchir, donc une alerte pouvait rester non lue aussi longtemps que la fenêtre restait fermée. Cette version porte sur cet écart : l'application continue de tourner après la fermeture de sa fenêtre, la facture qu'elle lit descend jusqu'à la ressource qui l'a dépensée, et un rafraîchissement qui se passe mal ne coûte plus rien deux fois.

## Il continue de tourner

Sur macOS et Windows, fermer la fenêtre laisse CloudBridge dans la barre des menus (la zone de notification sous Windows). Le titre de l'icône est la dépense du mois, avec le nombre d'alertes ouvertes à côté quand il y en a. Un clic ouvre un panneau avec le mois en cours, la prévision de fin de mois, les alertes ouvertes et les services qui ont le plus bougé par rapport au mois dernier.

Derrière, un calendrier se réveille toutes les 15 minutes, récupère les comptes qui sont dus, exécute les règles d'alerte et publie une notification système pour chaque alerte qui se déclenche. Il attend toujours la fin de l'intervalle de rafraîchissement avant de redemander à un fournisseur, donc cela coûte ce que coûterait un Rafraîchir quotidien. **Ouvrir à la connexion**, dans Réglages → Arrière-plan, le démarre dans la barre des menus après un redémarrage sans ouvrir la fenêtre.

Les versions Linux n'ont pas d'icône de barre d'état et quittent toujours avec leur fenêtre ; le calendrier et les notifications fonctionnent tant qu'elle est ouverte.

## Cloudflare, jusqu'à la ressource

Cloudflare est la septième source. Un ID de compte et un jeton API disposant de Billing → Read suffisent à lire son usage facturable : la dépense par service, par jour. Le quotidien compte ici. Un Worker ou un Durable Object qui se met à boucler est dans le grand livre le lendemain, pas sur la facture à la fin du mois.

La facture s'arrête au service, en revanche : « opérations R2 classe B, 734 le 3 octobre », pas quel bucket. Ajoutez Account Analytics → Read au jeton et CloudBridge demande à l'API GraphQL Analytics de Cloudflare l'usage de chaque ressource pour les compteurs que la facture nomme, puis répartit la ligne de chaque jour selon ces parts. Les buckets R2, les Workers, les bases D1 et les espaces de noms Durable Object reçoivent chacun leur part, et les parts additionnées correspondent toujours à ce que Cloudflare a facturé. Elles sont marquées comme des estimations, parce que les analytics sont échantillonnées et qu'une franchise gratuite appartient au compte, pas à une ressource en particulier.

L'usage à l'intérieur de la franchise gratuite est conservé aussi, avec un coût de zéro à côté. C'est généralement là qu'un emballement commence : l'usage grimpe pendant des jours avant que le premier centime ne soit facturé.

## Insights : quoi couper

Insights compare la facture avec ce qui tourne réellement. C'est optionnel : **Configurer et scanner** demande d'abord, puis installe un build figé et vérifié par somme de contrôle de [corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist), notre fork, qui scanne chaque compte en lecture seule.

Pour AWS, il trouve les instances arrêtées dont les volumes sont encore facturés, les adresses IPv4 publiques inactives, les ressources sans tag de propriétaire et sans stack qui les gère, et les ressources facturées mais absentes du scan. Chacune est tarifée à partir de la facture quand le compte lit son Data Export. Pour Cloudflare, il liste les Workers, les buckets R2, les bases D1, les espaces de noms KV, les zones et les Durable Objects, chacun avec sa part de la facture et son usage de la période.

Un gros compte n'inonde plus la page. Chaque carte s'ouvre sur un résumé par type, avec des nombres et un coût, et ne liste les ressources que lorsque vous ouvrez un type, cinquante à la fois.

## Rien de payé deux fois

Nous avons audité ce que CloudBridge lui-même peut vous coûter, maintenant qu'il se rafraîchit tout seul :

- **Une ingestion ratée n'est pas récupérée à nouveau dans l'intervalle de rafraîchissement.** Si AWS a répondu à une requête et que le stockage de la réponse a ensuite échoué (disque plein, bug de mapping), le calendrier rachetait auparavant les mêmes données toutes les 15 minutes. Il attend désormais la fin de l'intervalle et dit pourquoi ; Forcer le rafraîchissement réessaie toujours immédiatement.
- **Un compte en échec est réessayé de moins en moins souvent.** L'attente commence à 15 minutes et double jusqu'à l'intervalle de rafraîchissement, et une notification indique que le compte a cessé de se rafraîchir.
- **Un mois d'AWS Data Export qui n'a pas changé n'est pas téléchargé à nouveau.** Les ETags de ses fichiers sont vérifiés d'abord.
- **Les mois de Cost Explorer sont lus en entier.** Un gros mois revient en pages, et seule la première page était lue auparavant. Chaque page supplémentaire est une requête facturée, plafonnée à 20.

## Plus petits changements

- **Les catégories de service signifient la même chose sur chaque cloud.** ECS, EC2 et l'ECS de Volcengine sont tous Compute / Virtual Machines, donc la vue Catégorie de la page Attribution compare les clouds. Un grand livre existant est migré à la première ouverture.
- **Une page d'accueil qui montre ce qu'elle lit.** Le site de documentation liste chaque cloud et chaque plateforme de modèles pris en charge avec son logo.

La liste complète est dans le [journal des modifications](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## La suite

Des constats propres à Cloudflare, en commençant par les espaces de noms Durable Object dont les objets gardent des alarmes programmées, demandent un vrai scan pour être jugés. Les API de facturation de Volcengine, OpenAI et Anthropic restent à faire ; en attendant, leurs exports s'importent.
