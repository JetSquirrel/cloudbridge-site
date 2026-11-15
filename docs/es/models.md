---
title: "Coste por token de cada modelo de LLM"
description: "La página Modelos de CloudBridge: cuánto cuesta cada LLM por token, con gasto, tokens de entrada, salida y caché, coste combinado por millón y hallazgos."
---

# Modelos

**[English](../models.md)**&emsp;**[中文](../zh/models.md)**&emsp;**[日本語](../ja/models.md)**&emsp;**[한국어](../ko/models.md)**&emsp;**[Français](../fr/models.md)**&emsp;**[Deutsch](../de/models.md)**&emsp;**[Português](../pt/models.md)**&emsp;[Documentación](index.md)

La página **Models** lee el lado de LLM de la factura por modelo, sobre el rango
elegido en su cabecera. Las cuentas de OpenAI, Anthropic y DeepSeek siempre
aparecen; las filas de otra fuente aparecen cuando llevan uso medido en tokens,
como las filas de Alibaba Cloud Model Studio, Volcengine o Amazon Bedrock. El
modelo es el `ModelId` de FOCUS de la factura, o el que nombra la importación; una
factura que no nombra ninguno, como las de Model Studio o Ark, agrupa por su
producto.

Los tokens se distinguen por sus propiedades de FOCUS, `TokenDirection` y
`TokenCacheAction`, no por el nombre del medidor del proveedor, así que el mismo
tipo de token se lee igual en cada factura. Consulta
[FOCUS y datos de tokens](focus.md).

- La fila de estadísticas muestra el **AI spend**, los **tokens** totales, el
  **blended $/1M** (coste dividido entre todos los tokens, por millón) y la
  **cache share**: tokens de entrada leídos de una caché de prompts, como parte
  de todos los tokens de entrada, incluidas las escrituras en caché.
- **Per model** lista el coste de cada modelo y su cambio, sus tokens IN, OUT y
  CACHE, su $/1M combinado y su parte del gasto en modelos. CACHE son los tokens
  leídos de la caché. IN es el resto de la entrada: entrada no cacheada, tokens
  escritos en la caché y, para una factura que cuenta juntos entrada y salida,
  ese total. Su información emergente indica cuál de ellos contiene. Las filas con
  tokens pero sin coste siguen contando para las columnas de tokens. El mes hasta
  la fecha se compara con los mismos días del mes pasado, no con todo el mes.
- **Tokens per day** dibuja el volumen diario de tokens.

## Hallazgos {#findings}

- Un modelo cuyas lecturas de caché están por debajo del 5 % de su lado de
  entrada: se paga precio de entrada por lo que podría ser precio de caché. No se
  plantea para una factura que no separa entrada de salida.
- Un modelo por encima del 70 % del gasto en modelos, cuando dos o más cuestan
  algo.
- Una subida de gasto que los recuentos de tokens de ambos periodos atribuyen al
  precio unitario y no al uso.
- Un modelo facturado sin medición de tokens, cuyo coste unitario no se puede
  calcular.

Los nombres de modelo dentro del texto de los conceptos de facturación de Alibaba
Cloud y Volcengine aún no se extraen.
