---
title: "FOCUS 1.5 und LLM-Token-Daten"
description: "Wie CloudBridge die Token-Nutzung von KI-Modellen in den Begriffen von FOCUS 1.5 erfasst: ConsumedQuantity, SkuMeter und die Eigenschaften ModelId, TokenDirection und TokenCacheAction von SkuPriceDetails."
---

# FOCUS und Token-Daten

**[English](../focus.md)**&emsp;**[中文](../zh/focus.md)**&emsp;**[日本語](../ja/focus.md)**&emsp;**[한국어](../ko/focus.md)**&emsp;**[Français](../fr/focus.md)**&emsp;**[Español](../es/focus.md)**&emsp;**[Português](../pt/focus.md)**&emsp;[Dokumentation](index.md)

Das Hauptbuch von CloudBridge ist nach [FOCUS](https://focus.finops.org/) benannt,
der offenen Spezifikation der FinOps Foundation für Kosten- und Nutzungsdaten.
FOCUS 1.5 beschreibt die Rechnung einer KI-Modell-API. Es fügt keine Token-Spalte
hinzu; es verwendet die Spalten, die FOCUS bereits hat, und CloudBridge erfasst
Tokens auf dieselbe Weise.

## Was eine Token-Zeile enthält {#columns}

| FOCUS-Spalte | Spalte im Hauptbuch | Enthält |
| --- | --- | --- |
| `ConsumedQuantity` | `consumed_quantity` | Die rohe Token-Zahl |
| `ConsumedUnit` | `consumed_unit` | `Tokens` |
| `SkuMeter` | `sku_meter` | Der Name des Anbieters für den Zähler, etwa *Cache Read Tokens* |
| `SkuPriceDetails` | `sku_price_details` | Ein JSON-Objekt mit dem Modell und den Eigenschaften der Tokens |

`SkuPriceDetails` trägt vier von FOCUS definierte Eigenschaften:

| Eigenschaft | Werte |
| --- | --- |
| `ModelDeveloper` | Wer das Modell gemacht hat: *OpenAI*, *Anthropic*, *DeepSeek* |
| `ModelId` | Das Modell, wie die Rechnung es nennt |
| `TokenDirection` | `Input` für an das Modell gesendete Tokens, `Output` für von ihm erzeugte Tokens |
| `TokenCacheAction` | Bei Eingabetokens: `Read` aus einem Prompt-Cache, `Write` in einen solchen, `Uncached` für keines von beidem |

Eine Eigenschaft, die die Rechnung nicht beantworten kann, bleibt ausgelassen
statt geraten. Alibaba Cloud Model Studio und Volcengine Ark berechnen eine
einzige `Tokens`-Zahl für Eingabe und Ausgabe zusammen, daher haben ihre Zeilen
kein `TokenDirection`. Ausgabetokens haben kein `TokenCacheAction`.

## Wer es ausgegeben hat {#requester}

FOCUS 1.5 erfasst außerdem den Anfragenden hinter einer Kostenposition.
`PrincipalId` ist der Benutzer, `CredentialId` ist die veröffentlichte ID des
API-Schlüssels (nie der Schlüssel selbst), und `RequesterDetails` ist ein
JSON-Array, das diese beschreibt, mit dem Anzeigenamen des Schlüssels.
CloudBridge füllt sie in den Spalten `principal_id`, `credential_id` und
`requester_details` des Hauptbuchs aus diesen Exporten:

- einem OpenAI-Export, gruppiert nach Benutzer oder API-Schlüssel;
- einem Anthropic-Export, gruppiert nach API-Schlüssel.

Der Export von DeepSeek enthält nur den maskierten Schlüssel und seinen Namen,
was FOCUS nicht als Kennung zulässt, daher bleiben diese Spalten in seinen Zeilen
leer.

## Woher die Werte kommen {#sources}

- **Importe von OpenAI, Anthropic, DeepSeek, Model Studio und Ark.** CloudBridge
  füllt die Spalten aus dem Tokentyp, den jeder Export meldet. Jedes Token wird
  in einer Zeile gezählt, wie FOCUS es verlangt: Die Eingabesumme von OpenAI
  enthält ihre gecachten Tokens, daher werden sie aus der Eingabezeile
  herausgenommen. Hauptbücher früherer Versionen werden beim ersten Öffnen
  ergänzt. Monate, die vor dieser Änderung importiert wurden, behalten die alten
  Eingabezahlen von OpenAI, bis Sie sie erneut verarbeiten (**Konten →
  Normalisierung erneut anwenden**).
- **AWS Data Exports.** Die eigenen Spalten eines FOCUS-Exports werden so
  beibehalten, wie AWS sie geschrieben hat. Ein vor FOCUS 1.5 geschriebener
  Export hat kein `TokenDirection`. Wenn der Zählername einer Token-Zeile sagt,
  welche Tokens sie zählt, etwa *cache-read-input-token-count* oder
  *output-tokens*, werden Richtung und Cache-Aktion aus dem Namen gelesen.
  Andernfalls bleiben sie ausgelassen.

Die Seite [Modelle](models.md) liest diese Eigenschaften: Ein Cache-Lesevorgang
ist `TokenCacheAction` `Read`, welchen Namen der Anbieter seinem Zähler auch
gibt.

## Abfragen {#query}

Die Seite [Abfrage](query.md) liest die Eigenschaften mit den JSON-Funktionen von
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

## Exportieren {#export}

**Einstellungen → Daten → Als FOCUS exportieren** schreibt jede Kostenposition
in eine CSV mit FOCUS-Spaltennamen, Token-Spalten eingeschlossen, für ein anderes
FinOps-Tool. Beträge bleiben in der Währung, in der jede Kostenposition
abgerechnet wurde. Von CloudBridge hinzugefügte Spalten beginnen mit `x_`, etwa
`x_CostBasis`. Die Datei ist kein konformer FOCUS-Datensatz. Spalten, die keine
Quelle meldet, etwa `ChargeClass` und `PricingCategory`, bleiben ausgelassen, und
eine Zeile ohne gemeldeten Betrag behält `BilledCost` leer. Der Export ist nur in
der Desktop-App verfügbar.
