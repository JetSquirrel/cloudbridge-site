---
title: "Costes de Azure por servicio y por día"
description: "Conecta una suscripción de Microsoft Azure a CloudBridge con una entidad de servicio: coste real de Cost Management, diario, por servicio y tipo de cargo."
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[日本語](../ja/azure.md)**&emsp;**[한국어](../ko/azure.md)**&emsp;**[Français](../fr/azure.md)**&emsp;**[Deutsch](../de/azure.md)**&emsp;**[Português](../pt/azure.md)**&emsp;[Documentación](index.md)

CloudBridge lee el **coste real** de una suscripción desde Azure Cost
Management: lo que costó cada servicio **por día**, desglosado por tipo de
cargo. Una reserva comprada, un reembolso o un impuesto se conservan como lo
que son, sin sumarse al uso, para que un mes con una compra puntual no parezca
un mes cuyo uso se triplicó.

## Conecta la suscripción {#connect}

CloudBridge inicia sesión como una entidad de servicio —un registro de
aplicación con su propio secreto— en lugar de hacerlo como tú.

1. En el [portal de Azure](https://portal.azure.com/), abre **Microsoft Entra
   ID → App registrations → New registration**. Dale un nombre como
   `cloudbridge`; nada más del formulario importa.
2. En el nuevo registro, abre **Certificates & secrets → New client secret** y
   copia el **Value** del secreto, no su Secret ID. Se muestra una sola vez.
3. Abre la suscripción y luego **Access control (IAM) → Add role assignment**.
   Elige **Cost Management Reader** y asígnalo a la aplicación.
4. En CloudBridge, añade una cuenta para **Microsoft Azure** con el
   **Application (client) ID** del registro, el valor del secreto y el
   **Subscription ID**.

No necesitas el ID de inquilino: CloudBridge averigua a qué inquilino
pertenece la suscripción. Si esa consulta falla, introduce la suscripción como
`tenant-id/subscription-id`.

Una asignación de rol puede tardar unos minutos en aplicarse. Si la primera
obtención se rechaza justo después de crearla, espera y haz clic de nuevo en
**Validate**.

## Qué muestra la factura {#detail}

| Columna | Procedencia |
| --- | --- |
| Servicio | La categoría del medidor — *Virtual Machines*, *Storage*, *Bandwidth* |
| Día | La fecha de uso |
| Categoría | Usage, Purchase, Credit (reembolsos), Tax o Adjustment, según el tipo de cargo |
| Importe | Coste real, en la moneda de facturación de la suscripción |

La consulta informa por servicio, no por recurso ni por región, así que el
desglose por región de [Atribución](attribution.md) muestra *Other* para Azure,
y [Análisis](insights.md) no escanea recursos de Azure.

La API de consulta de Cost Management tiene un límite de velocidad por
inquilino. Una cuenta es una consulta por mes obtenido; varias suscripciones
del mismo inquilino comparten el límite, y una obtención limitada se reintenta
en la siguiente actualización.

## Usa las credenciales de esta máquina {#system}

En una máquina donde estén definidas `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` y
`AZURE_SUBSCRIPTION_ID` —las variables que leen los SDK de Azure—, marca
**Use this machine's credentials** y CloudBridge las leerá en cada obtención en
lugar de guardar una copia. `az login` por sí solo no basta: deja un usuario
con sesión iniciada, no un secreto que CloudBridge pueda usar.

Consulta [Permisos de los proveedores](permissions.md#azure) para saber
exactamente qué endpoints llama CloudBridge.
