---
title: "0.2.0: un visor de costos se convierte en registro"
description: "Los cargos de todas las fuentes ahora llegan a una única tabla de hechos con forma FOCUS, las respuestas en bruto se conservan para que corregir un mapeo no cueste nada al reproducirse, y por fin un total está en una sola moneda."
date: 2026-09-01
tag: Versión
---

# 0.2.0: un visor de costos se convierte en registro

<p class="post-meta">2026-09-01&emsp;Versión&emsp;<a href="./">Todos los artículos</a></p>

La versión 0.1 te mostraba un número por proveedor y lo llamaba total. Si tenías una cuenta de AWS en dólares y una cuenta de Alibaba Cloud en yuanes, el «total» sumaba las dos. Los créditos se leían como consumo. Un saldo se leía como gasto. La 0.2.0 reconstruye el suelo sobre el que se apoyan esos números.

## Una sola tabla de hechos

Cada fuente ahora se normaliza en una única tabla de hechos, `fct_charge`, en un nuevo `billing.duckdb`. Las columnas llevan los nombres de [FOCUS](https://focus.finops.org/), la especificación abierta de costos y uso de la FinOps Foundation, así que un crédito es un `Credit`, un reembolso es un reembolso, los impuestos y las tarifas de soporte se etiquetan como tales, y los importes conservan su signo. Cuando un bono de Alibaba Cloud cubre parte de un cargo, el cargo bruto y el bono reciben cada uno su propia fila, y las filas suman lo que realmente pagaste. Un hueco que no se puede explicar se convierte en una fila `Adjustment` en lugar de desaparecer.

Como el esquema ya habla FOCUS, una exportación real de factura —un CUR de AWS o un archivo de factura de Alibaba Cloud— puede entrar más adelante sin cambiar el esquema.

## Conserva las respuestas originales

Cost Explorer cobra 0,01 $ por solicitud, así que preguntar dos veces lo mismo es un defecto de diseño, no un patrón de uso. Cada respuesta de un proveedor ahora se escribe en disco sin cambios, como Parquet particionado al estilo Hive bajo `raw/`, la misma disposición que usa un bucket de exportación de facturas. La normalización es una función pura de un lote almacenado a filas del registro. Dos consecuencias: corregir un mapeo reproduce lo que está en disco en lugar de pagar otra consulta, y la lógica de facturación se puede probar a partir de una respuesta grabada.

## Una sola moneda

Los cargos se almacenan en la moneda en la que se facturaron y se convierten para mostrarlos, cada uno a un tipo de cambio con fecha no posterior al propio cargo. Los totales vienen de una vista, `v_charge_normalized`, así que cambiar la moneda de informe en Ajustes reconstruye una vista y no reescribe nada. Un cargo en una moneda que ningún tipo de cambio cubre se informa en el panel, nunca se cuenta en silencio a la par.

## Las credenciales salen de la base de datos

Las credenciales ahora viven solo en el llavero del sistema operativo (Administrador de credenciales de Windows, Llavero de macOS). La migración v1 mueve las que aún estaban en la base de datos y elimina las columnas que las contenían. La base de datos se puede copiar, respaldar o inspeccionar sin llevar tus claves consigo.

## Obtener y normalizar, separados

Una fuente de facturación solía ser un enum con cinco brazos de `match`. Ahora es una fila de tabla con un descriptor de capacidades, y sus dos métodos están deliberadamente separados: `fetch` toca la red y no interpreta nada; `normalize` interpreta y no toca nada. Añadir una fuente es añadir filas y un mapeo, no editar un cuadro de conexiones.

## También en 0.2.0

- macOS se distribuye como un `.dmg` que contiene `CloudBridge.app` en lugar de un binario suelto comprimido que Finder tomaba por un documento.
- Una actualización ahora ingiere el periodo de facturación actual y el anterior en dos llamadas a Cost Explorer, donde el panel antes hacía tres.
- Los saldos de DeepSeek se registran como instantáneas; un aumento del saldo recargado entre observaciones se deriva como una `Purchase`.
- El interruptor del modo oscuro ahora sí cambia el tema.

## Lo que viene

La [hoja de ruta](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) traza P1: un canal de exportación de archivos de factura (S3 / OSS + Parquet), asignación por etiquetas con un nodo explícito de «no asignado», y un flujo de costos Sankey. El registro era el requisito previo de los tres, y ya está en su sitio.
