---
title: "FOCUS 1.5 y datos de tokens de LLM"
description: "Cómo registra CloudBridge el uso de tokens de los modelos de IA con los términos de FOCUS 1.5: ConsumedQuantity, SkuMeter y las propiedades ModelId, TokenDirection y TokenCacheAction de SkuPriceDetails."
---

# FOCUS y datos de tokens

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[日本語](../ja/focus.md)**&emsp;**[한국어](../ko/focus.md)**&emsp;**[Français](../fr/focus.md)**&emsp;**[Deutsch](../de/focus.md)**&emsp;**[Português](../pt/focus.md)**&emsp;[Documentación](index.md)

El registro de CloudBridge toma sus nombres de [FOCUS](https://focus.finops.org/),
la especificación abierta de la FinOps Foundation para datos de coste y uso.
FOCUS 1.5 describe la factura de una API de modelos de IA. No añade ninguna
columna de tokens; usa las columnas que FOCUS ya tiene, y CloudBridge registra los
tokens de la misma manera.

## Qué contiene una fila de tokens {#columns}

| Columna de FOCUS | Columna del registro | Contiene |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | El recuento bruto de tokens |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | El nombre que da el proveedor al medidor, como *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | Un objeto JSON con el modelo y las propiedades de los tokens |

`SkuPriceDetails` lleva cuatro propiedades definidas por FOCUS:

| Propiedad | Valores |
| --- | --- |
| `ModelDeveloper` | Quién hizo el modelo: *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | El modelo tal como lo nombra la factura |
| `TokenDirection` | `Input` para los tokens enviados al modelo, `Output` para los que generó |
| `TokenCacheAction` | En los tokens de entrada: `Read` desde una caché de prompts, `Write` hacia una, `Uncached` para ninguno de los dos |

Una propiedad que la factura no puede responder se omite en lugar de adivinarse.
Alibaba Cloud Model Studio y Volcengine Ark facturan un único recuento de `Tokens`
para entrada y salida juntas, así que sus filas no tienen `TokenDirection`. Los
tokens de salida no tienen `TokenCacheAction`.

## Quién lo gastó {#requester}

FOCUS 1.5 también registra el solicitante detrás de un cargo. `PrincipalId` es el
usuario, `CredentialId` es el id publicado de la clave de API (nunca la clave en
sí), y `RequesterDetails` es un array JSON que los describe, con el nombre visible
de la clave. CloudBridge los rellena en las columnas `principal_id`,
`credential_id` y `requester_details` del registro a partir de estos exports:

- un export de OpenAI agrupado por usuario o por clave de API;
- un export de Anthropic agrupado por clave de API.

El export de DeepSeek solo tiene la clave enmascarada y su nombre, que FOCUS no
permite como identificador, así que sus filas no tienen ninguno.

## De dónde vienen los valores {#sources}

- **Importaciones de OpenAI, Anthropic, DeepSeek, Model Studio y Ark.**
  CloudBridge rellena las columnas a partir del tipo de token que informa cada
  export. Cada token se cuenta en una sola fila, como exige FOCUS: el total de
  entrada de OpenAI incluye sus tokens en caché, así que se restan de la fila de
  entrada. Los registros de versiones anteriores se rellenan la primera vez que se
  abren. Los meses importados antes de este cambio conservan los recuentos de
  entrada antiguos de OpenAI hasta que los vuelvas a procesar (**Accounts →
  Replay normalization**).
- **Data Exports de AWS.** Las columnas propias de un export de FOCUS se
  conservan tal como las escribió AWS. Un export escrito antes de FOCUS 1.5 no
  tiene `TokenDirection`. Cuando el nombre del medidor de una fila de tokens dice
  qué tokens cuenta, como *cache-read-input-token-count* u *output-tokens*, la
  dirección y la acción de caché se leen del nombre. En caso contrario, se
  omiten.

La página [Modelos](models.md) lee estas propiedades: una lectura de caché es
`TokenCacheAction` `Read`, sea cual sea el nombre que el proveedor dé a su
medidor.

## Consúltalo {#query}

La página [Consulta](query.md) lee las propiedades con las funciones JSON de
DuckDB:

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

## Expórtalo {#export}

**Settings → Data → Export as FOCUS** escribe cada cargo en un CSV con nombres de
columna de FOCUS, incluidas las columnas de tokens, para otra herramienta de
FinOps. Los importes se mantienen en la moneda en la que se facturó cada cargo.
Las columnas que añade CloudBridge empiezan por `x_`, como `x_CostBasis`. El
archivo no es un conjunto de datos FOCUS conforme. Las columnas que ninguna
fuente informa, como `ChargeClass` y `PricingCategory`, se omiten, y una fila sin
importe informado mantiene `BilledCost` vacío. La exportación es solo para el
escritorio.
