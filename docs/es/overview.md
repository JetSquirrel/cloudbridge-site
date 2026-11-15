---
title: "Resumen: gasto neto, previsión y cuentas"
description: "Cómo lee el gasto el Resumen de CloudBridge: neto y bruto, créditos, la previsión, los mayores cambios y el uso no asignado, además de las cuentas y la salud de los datos."
---

# Resumen y cuentas

**[English](../overview.md)**&emsp;**[中文](../zh/overview.md)**&emsp;**[日本語](../ja/overview.md)**&emsp;**[한국어](../ko/overview.md)**&emsp;**[Français](../fr/overview.md)**&emsp;**[Deutsch](../de/overview.md)**&emsp;**[Português](../pt/overview.md)**&emsp;[Documentación](index.md)

## El Resumen {#overview}

La cabecera incluye un control de rango —**MTD**, **30d** o **12m**— y cada
cifra de la página se calcula para la ventana que elijas.

- El **gasto** destacado es neto de créditos: lo que realmente se te facturó. El
  uso bruto y los créditos que lo redujeron se muestran al lado.
- El **gráfico**, el porcentaje de cambio, **Where it went** y los **biggest
  movers** se basan en el uso bruto. Una cuenta cuyos créditos de uso lo cubren
  todo da un neto cercano a cero, y una tendencia dibujada sobre esa base es
  ruido.
- Para **MTD**, una segunda tarjeta prevé el cierre del mes a partir del ritmo de
  gasto, con una banda optimista y otra pesimista.
- **Unallocated** es la parte del uso que no llega a ninguna línea de negocio:
  la parte de la factura que aún no puedes explicar. Consulta
  [Atribución](attribution.md).
- Si hay cargos del rango sin tipo de cambio, un aviso indica que no se cuentan
  en los totales.

Al pasar el ratón por el gráfico, se ajusta al punto más cercano y muestra la
fecha y el importe de ese intervalo. **Refresh** obtiene las cuentas cuyos datos
son más antiguos que el intervalo de actualización; **Force Refresh** las
obtiene todas: consulta [lo que cuesta](aws.md#cost).

## Una cuenta cada vez {#account}

Haz clic en el nombre de una cuenta en la página **Accounts** para entrar en
ella: el mismo control de rango, una fila de neto / bruto / créditos, la
tendencia de uso de esa cuenta y una tabla por servicio con la parte y el cambio
de cada uno. También está ahí el mismo desglose por dimensiones que en
[Atribución](attribution.md).

## Exporta una revisión mensual de costes {#report}

**Export report** en el Resumen guarda un mes como un único archivo HTML, listo
para imprimir o compartir. Elige un mes; el selector empieza por el más reciente
que ya haya terminado, y luego **Choose file and export** y dónde guardarlo. El archivo
no carga nada de fuera y no se sube nada. Requiere CloudBridge 0.9.0 o posterior
en el escritorio: la demo en el navegador no tiene exportación.

El informe cubre todas las cuentas en la moneda de informe, y no hay filtros por
proveedor ni por cuenta. Contiene:

- el coste neto, el uso y los créditos, y el cambio respecto al mes anterior;
- **Cost by service**, **Net cost by region** y **Usage by business line**;
- **Forecast and budgets**, para un mes aún en curso;
- **Data health**, los principales **Insights** y **Sources**, que indica de
  dónde vienen los datos de cada fuente y cuándo se ingirieron por última vez;
- **What these figures leave out**, como cargos sin tipo de cambio, filas de uso
  sin importe, o un inventario que nunca se escaneó o solo se escaneó en parte.

Un mes aún en curso muestra cifras del mes hasta la fecha y ningún cambio,
porque la columna del mes anterior es un mes completo. El informe nombra cuentas,
servicios y recursos, así que léelo antes de enviarlo fuera de tu equipo.

## Congela un mes {#snapshots}

El registro no deja de cambiar: una actualización o una importación puede
reescribir un mes, y los proveedores corrigen las facturas después de que el mes
termine. **Month-end snapshots** en la página de una cuenta guarda una copia que
no cambia, para cerrar el mes contra ella más adelante. Requiere CloudBridge
0.9.0 o posterior. Para comparar una copia con la factura del proveedor, consulta
[Conciliación](reconciliation.md#snapshot).

Elige el mes y haz clic en **Freeze period**. Un diálogo indica cuántos cargos
contendrá la copia y cuánto suman. La copia conserva esos cargos, los totales por
moneda de facturación, los tipos de cambio en uso y de dónde vino la factura, y
ninguna actualización o importación posterior la modifica.

- **Comparar con el registro.** Cada revisión indica **Matches the ledger** o
  **Differs from the ledger**, con tablas por moneda de facturación, servicio y
  categoría de cargo. Haz clic en una fila para ver los cargos que hay detrás.
  Las diferencias se muestran por moneda, así que un tipo de cambio no puede
  ocultar ninguna diferencia.
- **Revisiones.** Una vez que la factura ha cambiado, **Freeze new revision**
  añade otra copia y conserva las anteriores. Si la factura no ha cambiado, no se
  añade ninguna revisión.
- **Un mes aún en curso** se puede congelar, pero el diálogo advierte de que la
  copia estará incompleta, y la instantánea lo seguirá indicando después.
- **Importes ausentes.** Un mes cuyos cargos llevan uso pero no importes no tiene
  total, lo que no significa que no costara nada. La tarjeta lo indica y dice
  cuántos cargos no tienen importe o no tienen tipo de cambio.
- **Comprobar una copia.** Cada revisión muestra su ID de instantánea, su lote de
  ingesta y su suma de comprobación. Si los cargos guardados ya no coinciden con
  la suma de comprobación, la tarjeta te advierte de que no te fíes de esa
  revisión.

Las instantáneas se guardan en `billing.duckdb`, así que una
[copia de seguridad](settings-and-data.md#backups) de la carpeta de datos las
incluye. Eliminar el historial de facturación de una cuenta también las elimina.

## Añadir y eliminar cuentas {#accounts}

Para añadir una, ve a **Accounts**, elige la fuente, introduce un nombre y —para
una fuente de API— la credencial, y luego **Save**. Una fuente de API obtiene de
inmediato la factura de este mes y la del mes pasado; **Validate** en su fila
comprueba la credencial por separado. Cuando las herramientas propias del
proveedor están configuradas en la máquina, el formulario puede leer la
credencial del entorno o del perfil de la CLI en lugar de guardar una copia.

Eliminar una cuenta siempre quita su fila y sus credenciales del llavero. Si el
registro contiene cargos de ella, el diálogo también ofrece **Also delete its
billing history**, desactivado de forma predeterminada. Si se deja desactivado,
los cargos permanecen y **siguen contando en todos los totales**; si se activa,
se eliminan ellos, las cargas sin procesar que hay detrás y cualquier
[instantánea de fin de mes](#snapshots). Ninguna de las dos acciones se puede
deshacer. El historial que sobrevivió a su cuenta aparece en la página Accounts,
en **Billing history from deleted accounts**, donde **Delete history** lo
elimina.

## Salud de los datos {#data-health}

CloudBridge revisa el registro en busca de cosas que hacen que un total sea menos
fiable de lo que parece:

- cargos cuya moneda no puede convertir la tabla de tipos;
- uso sin etiqueta `business_line`;
- uso sin región;
- ajustes que ningún cargo explica;
- uso de productos que aún no tienen categoría de servicio.

El Resumen los muestra como una franja de **Data quality**, la página Accounts
como una tarjeta de **Data health**, y la página de una cuenta lista los suyos.
**Dismiss** oculta un hallazgo para ese periodo de facturación; el mismo hallazgo
en un periodo posterior vuelve a aparecer.

## Moneda de informe {#currency}

**Settings → Reporting** elige USD o CNY. Los cargos conservan la moneda en la
que se facturaron; una tabla de tipos de cambio integrada y fechada los convierte
para mostrarlos, a un tipo no posterior a la fecha del cargo. Los tipos no son
datos de mercado en vivo. Un tipo ausente se notifica, nunca se trata como 1:1.
