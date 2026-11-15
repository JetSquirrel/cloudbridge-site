---
title: "Interroger le registre de facturation en SQL"
description: "La page Requête de CloudBridge : du SQL en lecture seule sur le registre de facturation DuckDB local, avec des modèles pour les dépenses, les services, les lignes métier et les prévisions."
---

# Requête

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[日本語](../ja/query.md)**&emsp;**[한국어](../ko/query.md)**&emsp;[Documentation](index.md)

La page **Query** exécute du SQL sur le registre DuckDB local. Bureau
uniquement.

- Écrivez une instruction et cliquez sur **Run**, ou appuyez sur **⌘Enter**
  (**Ctrl+Enter** sous Windows). La vue principale est
  `v_charge_normalized` : une ligne par frais, avec les montants convertis
  dans la devise de rapport.
- La liste de modèles remplit l’éditeur avec une requête de départ : dépense
  mensuelle, dépense par fournisseur, principaux services, lignes métier,
  dépense non imputée, prévision de fin de mois, répartitions par région et
  par catégorie de service, principales ressources, remises par rapport au
  prix catalogue, lots d’ingestion récents et instantanés de solde.
- Seules les instructions de lecture s’exécutent : tout ce qui pourrait
  écrire est refusé avant d’atteindre la base, et le registre est de toute
  façon ouvert en lecture seule pour la requête. Rien de ce que vous tapez
  ici ne peut modifier vos données.
- Les résultats volumineux s’arrêtent à un budget de lignes — au plus
  100 000 lignes, moins pour les résultats larges — et la ligne d’état
  indique quand un résultat a été tronqué. Ajoutez un `LIMIT` ou une
  agrégation pour tout voir.

## Colonnes utiles {#columns}

Le registre est nommé d’après les colonnes [FOCUS](https://focus.finops.org/) :
`billed_cost` et `effective_cost`, `charge_category` (`Usage`, `Purchase`,
`Credit`, `Tax`, `Adjustment`), `service_name`, `service_category`,
`resource_id`, `region_id`, `pricing_quantity` et `pricing_unit`, plus
`x_model` pour le modèle que facture une ligne de fournisseur de modèles.
Les lignes de tokens portent aussi `consumed_quantity`, `consumed_unit`,
`sku_meter` et `sku_price_details` de FOCUS 1.5 ; voir
[FOCUS et données de tokens](focus.md#query) pour une requête dessus.
`cost_basis` indique quel poids porte un montant : `authoritative` depuis la
facture, `estimated` pour une imputation comme la découpe par ressource de
Cloudflare, `absent` pour un usage sans montant.
