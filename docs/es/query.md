---
title: "Consulta tu registro de facturación con SQL"
description: "La página Consulta de CloudBridge: SQL de solo lectura sobre el registro de facturación local de DuckDB, con plantillas para gasto, servicios, líneas de negocio y previsiones."
---

# Consulta

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[日本語](../ja/query.md)**&emsp;**[한국어](../ko/query.md)**&emsp;**[Français](../fr/query.md)**&emsp;**[Deutsch](../de/query.md)**&emsp;**[Português](../pt/query.md)**&emsp;[Documentación](index.md)

La página **Query** ejecuta SQL sobre el registro local de DuckDB. Solo en el
escritorio.

- Escribe una sentencia y haz clic en **Run**, o pulsa **⌘Enter** (**Ctrl+Enter**
  en Windows). La vista principal es `v_charge_normalized`: una fila por cargo,
  con los importes convertidos a la moneda de informe.
- La lista de plantillas rellena el editor con una consulta inicial: gasto
  mensual, gasto por proveedor, servicios principales, líneas de negocio, gasto
  no asignado, previsión de fin de mes, desgloses por región y categoría de
  servicio, recursos principales, descuentos frente al precio de tarifa, lotes de
  ingesta recientes e instantáneas de saldo.
- Solo se ejecutan sentencias de lectura: cualquier cosa que pueda escribir se
  rechaza antes de llegar a la base de datos, y el registro se abre de todos modos
  en modo de solo lectura para la consulta. Nada de lo que escribas aquí puede
  cambiar tus datos.
- Los resultados grandes se detienen en un presupuesto de filas —como máximo
  100.000 filas, menos para resultados anchos— y la línea de estado indica cuándo
  se ha recortado un resultado. Añade un `LIMIT` o agrega para verlo todo.
- Un resultado permanece en pantalla aunque edites el SQL o cambies la moneda de
  informe, marcado como que ya no coincide con lo que hay en la página.

## Columnas útiles {#columns}

El registro toma sus nombres de las columnas de [FOCUS](https://focus.finops.org/):
`billed_cost` y `effective_cost`, `charge_category` (`Usage`, `Purchase`,
`Credit`, `Tax`, `Adjustment`), `service_name`, `service_category`, `resource_id`,
`region_id`, `pricing_quantity` y `pricing_unit`, además de `x_model` para el
modelo que factura una fila de proveedor de modelos. Las filas de tokens también
llevan `consumed_quantity`, `consumed_unit`, `sku_meter` y `sku_price_details` de
FOCUS 1.5; consulta [FOCUS y datos de tokens](focus.md#query) para ver una
consulta sobre ellos. `cost_basis` indica cuánto peso tiene un importe:
`authoritative` de la factura, `estimated` para una asignación como el reparto por
recurso de Cloudflare, `absent` para uso sin importe.
