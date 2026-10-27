---
title: "FOCUS 1.5 and LLM token data"
description: "How CloudBridge records AI model token usage in FOCUS 1.5's terms: ConsumedQuantity, SkuMeter and the ModelId, TokenDirection and TokenCacheAction properties of SkuPriceDetails."
---

# FOCUS and token data

**[中文](zh/focus.md)**&emsp;[Docs](index.md)

CloudBridge's ledger is named after [FOCUS](https://focus.finops.org/), the
FinOps Foundation's open specification for cost and usage data. FOCUS 1.5
describes the bill of an AI model API. It adds no token column; it uses
the columns FOCUS already has, and CloudBridge records tokens the same
way.

## What a token row holds {#columns}

| FOCUS column | Ledger column | Holds |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | The raw token count |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | The provider's name for the meter, such as *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | A JSON object with the model and the tokens' properties |

`SkuPriceDetails` carries four FOCUS-defined properties:

| Property | Values |
| --- | --- |
| `ModelDeveloper` | Who made the model: *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | The model as the bill names it |
| `TokenDirection` | `Input` for tokens sent to the model, `Output` for tokens it generated |
| `TokenCacheAction` | On input tokens: `Read` from a prompt cache, `Write` into one, `Uncached` for neither |

A property the bill cannot answer is left out rather than guessed.
Alibaba Cloud Model Studio and Volcengine Ark bill a single `Tokens`
count for input and output together, so their rows have no
`TokenDirection`. Output tokens have no `TokenCacheAction`.

## Who spent it {#requester}

FOCUS 1.5 also records the requester behind a charge. `PrincipalId` is
the user, `CredentialId` is the published id of the API key (never the key
itself), and `RequesterDetails` is a JSON array describing them, with the
key's display name. CloudBridge fills them in the ledger's `principal_id`,
`credential_id` and `requester_details` columns from these exports:

- an OpenAI export grouped by user or API key;
- an Anthropic export grouped by API key.

DeepSeek's export has only the masked key and its name, which FOCUS does
not allow as an identifier, so its rows have none.

## Where the values come from {#sources}

- **OpenAI, Anthropic, DeepSeek, Model Studio and Ark imports.**
  CloudBridge fills the columns from the token type each export reports.
  Each token is counted on one row, as FOCUS requires: OpenAI's input
  total includes its cached tokens, so they are taken out of the input
  row. Ledgers from earlier versions are filled in when they are first
  opened. Months imported before this change keep OpenAI's old input
  counts until you replay them (**Accounts → Replay normalization**).
- **AWS Data Exports.** A FOCUS export's own columns are kept as AWS
  wrote them. An export written before FOCUS 1.5 has no
  `TokenDirection`. When a token row's meter name says which tokens it
  counts, such as *cache-read-input-token-count* or *output-tokens*, the
  direction and cache action are read from the name. Otherwise they are
  left out.

The [Models](models.md) page reads these properties: a cache read is
`TokenCacheAction` `Read`, whichever name the provider gives its meter.

## Query it {#query}

The [Query](query.md) page reads the properties with DuckDB's JSON
functions:

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

## Export it {#export}

**Settings → Data → Export as FOCUS** writes every charge to a CSV with
FOCUS column names, token columns included, for another FinOps tool.
Amounts stay in the currency each charge was billed in. Columns
CloudBridge adds start with `x_`, such as `x_CostBasis`. The file is not a
conformant FOCUS dataset. Columns no source reports, such as `ChargeClass`
and `PricingCategory`, are left out, and a row with no reported amount
keeps `BilledCost` empty. The export is desktop only.
