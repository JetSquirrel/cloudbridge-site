---
title: "Importa exports de facturas de OpenAI, Anthropic y de la nube"
description: "Importa exports de facturas de Alibaba Cloud, Volcengine, OpenAI, Anthropic y DeepSeek en CloudBridge: de dónde sale cada uno y qué aporta."
---

# Importar un archivo de factura

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[日本語](../ja/bill-import.md)**&emsp;**[한국어](../ko/bill-import.md)**&emsp;**[Français](../fr/bill-import.md)**&emsp;**[Deutsch](../de/bill-import.md)**&emsp;**[Português](../pt/bill-import.md)**&emsp;[Documentación](index.md)

Un export de factura descargado de la consola de un proveedor se convierte en
las mismas filas del registro que produce una obtención. Aguas abajo —totales,
gráficos, alertas, atribución—, un mes importado es indistinguible de uno
obtenido. A menudo es la lectura más fina: la API de facturación de Alibaba
Cloud informa de Model Studio (百炼) como una sola cifra al mes, mientras que su
export lo informa por modelo, con recuentos de tokens.

Volcengine, OpenAI y Anthropic son solo de importación por ahora: añade la
cuenta con un nombre, sin credenciales, e importa.

| Fuente | De dónde sale el export | Qué aporta |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) por modelo; detalle a nivel de instancia para todo lo demás |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) por endpoint y tipo de token |
| OpenAI | Usage → Export | Coste o uso de tokens, por proyecto y modelo |
| Anthropic (Claude) | Usage o Cost → Export | Coste o uso de tokens, por espacio de trabajo y modelo |
| DeepSeek | Usage → Download | Gasto por día y por modelo — su API solo informa de un saldo |

## Importar {#import}

1. Descarga el export desde la consola del proveedor.
2. Ve a **Accounts** y haz clic en **Import** en la fila de la cuenta.
3. Elige el archivo. CloudBridge indica cuántos cargos ha escrito y qué meses
   ha sustituido.

::: warning Un mes se sustituye, no se suma
Una importación sustituye todos los meses que cubre el archivo para la cuenta
seleccionada, así que importar dos veces nunca duplica un cargo. Exporta la
factura completa: un archivo filtrado por producto sustituye los datos de ese
mes por solo ese producto. Para actualizar un mes importado, vuelve a importar
un export completo y corregido. Una actualización nunca sobrescribe un mes
importado, Force Refresh incluido.
:::

## Los exports de uso no llevan dinero {#usage-exports}

Un export de **uso**, con recuentos de tokens pero sin importes, se registra sin
coste facturado y con una base de coste *absent*. CloudBridge no convierte los
recuentos de tokens en gasto estimado a precios de tarifa. Un export de **coste**
conserva una cantidad solo cuando se rellena exactamente una columna de tokens:
los tokens de entrada y de salida tienen precios distintos y no pueden ser una
única cantidad valorada.

## Codificaciones {#encoding}

Los exports de texto deben ser UTF-8. Las consolas de Alibaba Cloud y Volcengine
pueden generar archivos GBK; vuelve a exportar como UTF-8 o guarda primero como
*CSV UTF-8*. Más en
[Solución de problemas](troubleshooting.md#import-errors).
