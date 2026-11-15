---
title: "Costes de Google Cloud desde el export de facturación de BigQuery"
description: "Conecta Google Cloud a CloudBridge a través del export a BigQuery de la cuenta de facturación: coste diario por servicio, SKU, proyecto y región, con los créditos aparte."
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[日本語](../ja/google-cloud.md)**&emsp;**[한국어](../ko/google-cloud.md)**&emsp;**[Français](../fr/google-cloud.md)**&emsp;**[Deutsch](../de/google-cloud.md)**&emsp;**[Português](../pt/google-cloud.md)**&emsp;[Documentación](index.md)

Google Cloud no tiene ninguna API que responda «cuánto ha costado este mes». Su
factura es el export que una cuenta de facturación escribe en un conjunto de
datos de BigQuery, así que eso es lo que lee CloudBridge: una consulta por mes,
que da el coste **por día** por servicio, SKU, proyecto y región. Los créditos
—nivel gratuito, uso comprometido, promociones— vuelven como filas propias, así
que el uso sigue siendo lo que costó antes de ellos.

## Activa el export {#export}

El export contiene datos desde el día en que se activa, así que hazlo primero,
incluso antes de instalar CloudBridge.

1. En la consola de Google Cloud, abre **Billing → Billing export → BigQuery
   export**.
2. En **Standard usage cost**, haz clic en **Edit settings**, elige un proyecto
   y crea un conjunto de datos para él (por ejemplo `billing`), y guarda.
3. Cuando lleguen las primeras filas —en un plazo de un día—, el conjunto de
   datos contendrá una tabla llamada `gcp_billing_export_v1_` seguida del ID de
   la cuenta de facturación. En BigQuery, ábrela y usa **Copy ID**: esa es la
   *Billing export table* que pide CloudBridge, por ejemplo
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`.

## Dale una clave a CloudBridge {#connect}

1. En el proyecto del conjunto de datos del export, abre **IAM & Admin →
   Service accounts** y crea una, por ejemplo `cloudbridge`.
2. Concédele **BigQuery Job User** en el proyecto, para que pueda ejecutar una
   consulta, y **BigQuery Data Viewer** en el conjunto de datos del export,
   para que la consulta pueda leer la tabla.
3. Abre la cuenta de servicio y luego **Keys → Add key → Create new key →
   JSON**. Guarda el archivo descargado en un lugar privado.
4. En CloudBridge, añade una cuenta para **Google Cloud** con la **ruta** del
   archivo de clave y la tabla del export de facturación.

CloudBridge guarda la ruta, no la clave: el archivo se lee en cada obtención,
así que rotar la clave es cuestión de reemplazar el archivo. El archivo de
credenciales que escribe `gcloud auth application-default login` sirve en su
lugar, y también `GOOGLE_APPLICATION_CREDENTIALS` con **Use this machine's
credentials**.

## Qué muestra la factura {#detail}

| Columna | Procedencia |
| --- | --- |
| Servicio | `service.description` — *Compute Engine*, *Cloud Storage* |
| Descripción | El SKU — *N2 Instance Core running in Americas* |
| Proyecto | `project.id` y `project.name` |
| Región | `location.region` |
| Día | El día de uso |
| Categoría | Usage, Tax o Adjustment, según `cost_type`; los créditos como Credit |

Un mes es el **mes de facturación**, como en la factura de Google Cloud. El uso
facturado con retraso cae en el mes en que se facturó, aunque se ejecutara el
mes anterior.

La consulta lee toda la tabla del export. Se aplica el precio bajo demanda de
BigQuery a partir del nivel gratuito mensual; un export de facturación suele ser
mucho más pequeño que eso, pero crece mientras el export esté activo.
[Análisis](insights.md) no escanea recursos de Google Cloud.

Consulta [Permisos de los proveedores](permissions.md#google-cloud) para saber
exactamente qué endpoints llama CloudBridge.
