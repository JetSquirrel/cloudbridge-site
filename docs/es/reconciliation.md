---
title: "Cuadra las facturas de la nube con tu registro de facturación"
description: "Conciliación de CloudBridge compara la factura final de cada proveedor con el registro o con una instantánea congelada, en la moneda de la factura, e indica qué comprobar."
---

# Conciliación

**[English](../reconciliation.md)**&emsp;**[中文](../zh/reconciliation.md)**&emsp;**[日本語](../ja/reconciliation.md)**&emsp;**[한국어](../ko/reconciliation.md)**&emsp;**[Français](../fr/reconciliation.md)**&emsp;**[Deutsch](../de/reconciliation.md)**&emsp;**[Português](../pt/reconciliation.md)**&emsp;[Documentación](index.md)

La página **Reconciliation** responde a una pregunta: ¿coincide la factura final
de cada proveedor con lo que importó CloudBridge? Requiere CloudBridge 0.9.0 o
posterior.

Solo se compara el coste facturado autoritativo en la propia moneda de la
factura, así que un tipo de cambio no puede ocultar una diferencia. Las facturas
se guardan aparte de tus cargos y nunca los modifican.

## Añade una factura {#add}

- **Enter total** registra una factura. **Total** es el importe final de la
  factura. Los impuestos, créditos y ajustes son los que declara la factura: no
  se suman al total y solo ayudan a explicar una diferencia. Introduce los
  créditos como cero o negativos.
- **Import invoice CSV** lee muchas a la vez, solo en el escritorio. Si alguna
  línea es incorrecta, no se importa nada y el error indica la línea.

El CSV necesita una fila de cabecera:

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

Las columnas a partir de `tax` son opcionales. `billing_period` es `YYYY-MM`,
`currency` es un código de tres letras, y los importes son números simples sin
separador de miles. Cada fila debe nombrar una de tus cuentas.

Si los cargos de una cuenta abarcan más de una cuenta de facturación, define el
ID de cuenta de facturación de la factura para que se compare con la correcta.

## Lee el resultado {#status}

| Estado | Qué significa |
| --- | --- |
| Matched | La factura y el registro coinciden, dentro de la tolerancia de la moneda |
| Difference | No coinciden. La fila muestra la diferencia y qué comprobar a continuación |
| Cannot verify | Aún no hay nada que comparar de forma justa, y la fila indica por qué |
| Missing evidence | El mes tiene cargos facturados pero ninguna factura, así que no se ha comprobado |

Un mes aparece como **Cannot verify** cuando, por ejemplo, aún no ha terminado,
el registro no tiene cargos en la moneda de la factura, o todos los cargos son
uso sin importe. Los importes derivados o estimados se dejan fuera de la cifra
del registro.

Abre una fila para ver el desglose por categoría de cargo, los detalles de la
factura y qué comprobar, como un impuesto solo en un lado, un crédito o ajuste
tardío, un export que cubre parte del mes, o un total que encaja con otro mes.

## Compara con una instantánea {#snapshot}

**Compare with** elige el registro actual o una
[instantánea de fin de mes](overview.md#snapshots), para que puedas comprobar una
factura contra el mes tal como lo cerraste, sea lo que sea que hayan cambiado las
actualizaciones posteriores.

Eliminar una factura solo quita ese registro. El registro y cualquier instantánea
permanecen como están.
