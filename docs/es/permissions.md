---
title: "Permisos de facturación con privilegio mínimo por proveedor"
description: "Las credenciales de privilegio mínimo que CloudBridge necesita para AWS Cost Explorer y S3, Azure Cost Management, Google Cloud BigQuery, Alibaba Cloud RAM, tokens de API de Cloudflare y claves de DeepSeek."
---

# Permisos de los proveedores

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[日本語](../ja/permissions.md)**&emsp;**[한국어](../ko/permissions.md)**&emsp;**[Français](../fr/permissions.md)**&emsp;**[Deutsch](../de/permissions.md)**&emsp;**[Português](../pt/permissions.md)**&emsp;[Documentación](index.md)

Usa credenciales dedicadas con el mínimo privilegio que necesite el canal. Que
la aplicación se comporte como solo lectura no convierte en solo lectura una
clave sin restricciones: las políticas asociadas en el proveedor deciden qué
puede hacer una clave. No uses credenciales de la cuenta raíz ni concedas
acceso de administrador solo para leer una factura.

CloudBridge guarda las credenciales en el llavero del sistema operativo y las
usa únicamente para autenticar solicitudes al proveedor al que pertenecen. No
hay ningún servicio de sincronización de CloudBridge ni telemetría. Nunca
publiques claves reales, archivos de credenciales ni exports de facturación sin
censurar en incidencias públicas, registros, capturas de pantalla o solicitudes
de incorporación de cambios, y revoca cualquier clave que se haya expuesto.

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
solo concede `ce:GetCostAndUsage`, la acción de Cost Explorer que usa
CloudBridge. La validación de una clave sin un URI de export usa
`GetCallerIdentity` de STS, que [no necesita concesión alguna](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html).
La política mantiene `Resource: "*"` para las lecturas de Cost Explorer; no
concede acceso a ningún otro servicio.

1. En la [consola de IAM](https://console.aws.amazon.com/iam/), crea una
   política administrada por el cliente a partir de la plantilla, o añádela al
   usuario en línea.
2. Asígnala a un usuario de IAM dedicado, sin permisos amplios no
   relacionados.
3. Crea una clave de acceso para ese usuario e introdúcela en CloudBridge.
4. Rota la clave según la política de tu organización.

Solo se acepta un par de ID de clave de acceso y secreto; no se admiten
credenciales temporales que necesiten un token de sesión. Las políticas de la
organización y la configuración de facturación a nivel de cuenta también pueden
restringir el acceso. Las solicitudes de Cost Explorer pueden generar cargos;
consulta [lo que cuesta](aws.md#cost).

## AWS Data Exports desde S3 {#aws-s3}

La política de Cost Explorer **no** concede acceso a un bucket de export.
Limita `s3:ListBucket` al bucket y al prefijo del export, y `s3:GetObject` a los
objetos bajo ese prefijo. Los objetos cifrados con una clave KMS administrada
por el cliente también pueden necesitar `kms:Decrypt` y una política de clave
coincidente, y las políticas de bucket y las restricciones de la organización
deben permitir las lecturas. CloudBridge lee un export existente; no necesita
permiso para crear exports ni escribir objetos. Los cargos de almacenamiento y
de solicitudes de S3 siguen aplicándose.

## Escaneos de recursos de AWS {#aws-scan}

[Análisis](insights.md) escanea con la misma clave y solo lista y describe
recursos. Da a la clave acceso de lectura a ellos, como la política administrada
`ReadOnlyAccess`, o una política de solo lectura más limitada que cubra los
servicios que quieras escanear.

## Alibaba Cloud {#alibaba-cloud}

Para la API de facturación, `AliyunBSSReadOnlyAccess` es la política de
facturación de solo lectura integrada. Es más amplia que una política
personalizada específica de un endpoint; revisa su alcance según tus
requisitos.

1. En la [consola de RAM](https://ram.console.aliyun.com/), crea un usuario de
   RAM dedicado.
2. Adjunta `AliyunBSSReadOnlyAccess`, o una política personalizada limitada a
   las operaciones de facturación que uses.
3. Crea un AccessKey e introdúcelo en CloudBridge.

No uses el AccessKey de la cuenta principal. Importar un export de factura no
necesita credenciales.

## Microsoft Azure {#azure}

Una entidad de servicio —un registro de aplicación con un secreto de cliente—
con el rol integrado **Cost Management Reader** en la suscripción. Ese rol lee
datos de coste y uso y nada más; no le des a la aplicación los roles Reader,
Contributor u Owner para que funcione.

| Solicitud | Para qué sirve |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`, sin autenticar | Averiguar el inquilino de la suscripción a partir del desafío `401`. Se omite cuando la suscripción se introduce como `tenant-id/subscription-id` |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | Un token para Azure Resource Manager, mediante la concesión de credenciales de cliente |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | El coste real del mes, diario, por servicio y tipo de cargo |

El ID de cliente y el ID de suscripción no son secretos. El secreto de cliente
sí lo es, y se guarda en el llavero del sistema operativo; dale la caducidad más
corta que permita tu organización y reemplázalo en CloudBridge cuando se rote.

## Google Cloud {#google-cloud}

Una cuenta de servicio en el proyecto del export de facturación, con **BigQuery
Job User** en el proyecto y **BigQuery Data Viewer** solo en el conjunto de
datos del export, no en el proyecto, donde leería todos los demás conjuntos de
datos también.

| Solicitud | Para qué sirve |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | Un token, a partir de una aserción firmada con la clave de la cuenta de servicio |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | Un trabajo de consulta por mes sobre la tabla del export |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | El resto de páginas de resultados del trabajo |

El trabajo de consulta se ejecuta en el proyecto de la tabla y se factura a ese
proyecto a la tarifa bajo demanda de BigQuery a partir del nivel gratuito.
CloudBridge guarda la ruta del archivo de clave, no la clave; protege el archivo
como cualquier clave de cuenta de servicio y elimina la clave en la consola
cuando deje de usarse. Un archivo de credenciales de usuario de
`gcloud auth application-default login` también funciona, y consulta con el
acceso de ese usuario.

## Cloudflare {#cloudflare}

Crea un token de API personalizado, limitado en **Account Resources** a la única
cuenta que CloudBridge debe leer. No uses la Global API Key: lleva todos los
permisos del usuario.

| Permiso | Para qué sirve | Llamadas |
| --- | --- | --- |
| Account → Billing → Read | La factura | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | Dividirla por recurso | `POST /graphql` |
| Read en Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1 | El escaneo de Análisis | La API de la cuenta, a través del escáner |

Solo el primero es obligatorio. El ID de cuenta no es un secreto: forma parte de
la ruta de la solicitud; el token sí lo es, y se guarda en el llavero del sistema
operativo como cualquier otra credencial.

## DeepSeek {#deepseek}

La integración con la API usa una clave de plataforma de
[platform.deepseek.com](https://platform.deepseek.com/) para llamar a
`GET /user/balance`. Eso es una lectura, pero **la clave en sí no es
necesariamente de solo lectura**: también puede autorizar solicitudes de modelo
y generar gasto si se usa en otro sitio. Trátala como una credencial de gasto,
usa las restricciones que ofrezca DeepSeek y no la compartas. Importar la
descarga de uso no necesita clave.

## Volcengine, OpenAI y Anthropic {#file-sources}

Estas fuentes usan únicamente exports de facturas locales. CloudBridge no pide
credenciales para ellas, y una importación no hace ninguna solicitud al
proveedor. No crees una clave de administrador o de organización para ellas
hasta que un canal de API la necesite de verdad.
