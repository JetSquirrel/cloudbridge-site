---
title: "FOCUS 1.5 et données de tokens des LLM"
description: "Comment CloudBridge enregistre l’usage de tokens des modèles d’IA dans les termes de FOCUS 1.5 : ConsumedQuantity, SkuMeter et les propriétés ModelId, TokenDirection et TokenCacheAction de SkuPriceDetails."
---

# FOCUS et données de tokens

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[日本語](../ja/focus.md)**&emsp;**[한국어](../ko/focus.md)**&emsp;**[Español](../es/focus.md)**&emsp;**[Deutsch](../de/focus.md)**&emsp;**[Português](../pt/focus.md)**&emsp;[Documentation](index.md)

Le registre de CloudBridge est nommé d’après [FOCUS](https://focus.finops.org/),
la spécification ouverte de la FinOps Foundation pour les données de coût et
d’usage. FOCUS 1.5 décrit la facture d’une API de modèle d’IA. Elle n’ajoute
aucune colonne de tokens ; elle utilise les colonnes que FOCUS possède déjà,
et CloudBridge enregistre les tokens de la même façon.

## Ce que contient une ligne de tokens {#columns}

| Colonne FOCUS | Colonne du registre | Contenu |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | Le nombre brut de tokens |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | Le nom du compteur chez le fournisseur, comme *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | Un objet JSON avec le modèle et les propriétés des tokens |

`SkuPriceDetails` porte quatre propriétés définies par FOCUS :

| Propriété | Valeurs |
| --- | --- |
| `ModelDeveloper` | Qui a créé le modèle : *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | Le modèle tel que la facture le nomme |
| `TokenDirection` | `Input` pour les tokens envoyés au modèle, `Output` pour ceux qu’il a générés |
| `TokenCacheAction` | Sur les tokens d’entrée : `Read` depuis un cache de prompt, `Write` dans un cache, `Uncached` pour ni l’un ni l’autre |

Une propriété à laquelle la facture ne peut pas répondre est omise plutôt que
devinée. Alibaba Cloud Model Studio et Volcengine Ark facturent un seul
décompte `Tokens` pour l’entrée et la sortie réunies : leurs lignes n’ont
donc pas de `TokenDirection`. Les tokens de sortie n’ont pas de
`TokenCacheAction`.

## Qui a dépensé {#requester}

FOCUS 1.5 enregistre aussi le demandeur derrière un frais. `PrincipalId` est
l’utilisateur, `CredentialId` est l’ID publié de la clé d’API (jamais la clé
elle-même), et `RequesterDetails` est un tableau JSON qui les décrit, avec le
nom d’affichage de la clé. CloudBridge les renseigne dans les colonnes
`principal_id`, `credential_id` et `requester_details` du registre à partir
de ces exports :

- un export OpenAI groupé par utilisateur ou par clé d’API ;
- un export Anthropic groupé par clé d’API.

L’export de DeepSeek ne contient que la clé masquée et son nom, ce que FOCUS
n’autorise pas comme identifiant : ses lignes n’en ont donc aucune.

## D’où viennent les valeurs {#sources}

- **Imports OpenAI, Anthropic, DeepSeek, Model Studio et Ark.**
  CloudBridge remplit les colonnes à partir du type de token que rapporte
  chaque export. Chaque token est compté sur une seule ligne, comme FOCUS
  l’exige : le total d’entrée d’OpenAI inclut ses tokens mis en cache, ils
  sont donc retirés de la ligne d’entrée. Les registres des versions
  antérieures sont complétés à leur première ouverture. Les mois importés
  avant ce changement conservent les anciens décomptes d’entrée d’OpenAI
  jusqu’à ce que vous les rejouiez (**Accounts → Replay normalization**).
- **AWS Data Exports.** Les colonnes propres à un export FOCUS sont
  conservées telles qu’AWS les a écrites. Un export écrit avant FOCUS 1.5 n’a
  pas de `TokenDirection`. Quand le nom du compteur d’une ligne de tokens
  indique quels tokens il compte, comme *cache-read-input-token-count* ou
  *output-tokens*, la direction et l’action de cache sont lues dans le nom.
  Sinon, elles sont omises.

La page [Modèles](models.md) lit ces propriétés : une lecture de cache est
`TokenCacheAction` `Read`, quel que soit le nom que le fournisseur donne à
son compteur.

## L’interroger {#query}

La page [Requête](query.md) lit les propriétés avec les fonctions JSON de
DuckDB :

```sql
SELECT json_extract_string(sku_price_details, '$.ModelId') AS model,
       json_extract_string(sku_price_details, '$.TokenCacheAction') AS cache,
       sum(consumed_quantity) AS tokens,
       sum(billed_cost) AS cost
FROM v_charge_normalized
WHERE consumed_unit = 'Tokens'
  AND json_extract_string(sku_price_details, '$.TokenDirection') = 'Input'
GROUP BY ALL
ORDER BY tokens DESC;
```

## L’exporter {#export}

**Settings → Data → Export as FOCUS** écrit chaque frais dans un CSV avec les
noms de colonnes FOCUS, colonnes de tokens comprises, pour un autre outil
FinOps. Les montants restent dans la devise de facturation de chaque frais.
Les colonnes que CloudBridge ajoute commencent par `x_`, comme
`x_CostBasis`. Le fichier n’est pas un jeu de données FOCUS conforme. Les
colonnes qu’aucune source ne rapporte, comme `ChargeClass` et
`PricingCategory`, sont omises, et une ligne sans montant rapporté laisse
`BilledCost` vide. L’export est réservé à l’application de bureau.
