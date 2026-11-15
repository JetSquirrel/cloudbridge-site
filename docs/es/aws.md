---
title: "Seguimiento de costes de AWS con Cost Explorer o FOCUS"
description: "Conecta una cuenta de AWS a CloudBridge mediante Cost Explorer con una política de IAM de una sola acción, o mediante un Data Export de FOCUS en S3 para obtener filas a nivel de recurso."
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[日本語](../ja/aws.md)**&emsp;**[한국어](../ko/aws.md)**&emsp;**[Français](../fr/aws.md)**&emsp;**[Deutsch](../de/aws.md)**&emsp;**[Português](../pt/aws.md)**&emsp;[Documentación](index.md)

Una cuenta de AWS llega al registro de dos maneras. **Cost Explorer** es la
rápida: una clave de acceso y una política de una sola acción, y la factura
llega como costes por servicio y por día. Un **Data Export** en S3 es la
detallada: IDs de recursos, etiquetas y la cuenta vinculada de cada fila —lo
que [Análisis](insights.md) necesita para valorar un recurso.

## Cost Explorer {#cost-explorer}

1. Abre la [consola de IAM](https://console.aws.amazon.com/iam/), ve a
   **Users** y **Create user**. No necesita acceso a la consola.
2. En el nuevo usuario, elige **Add permissions → Create inline policy**,
   cambia al editor JSON y pega la política de abajo (también disponible como
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)).
3. Abre la pestaña **Security credentials** del usuario y haz clic en **Create
   access key**. Copia el Access Key ID y el Secret Access Key; AWS muestra el
   secreto solo una vez.
4. Añade la cuenta en CloudBridge con ese par de claves.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Solo concede `ce:GetCostAndUsage`, la única acción de Cost Explorer que llama
CloudBridge. La validación de la clave usa `GetCallerIdentity` de STS, que no
necesita concesión alguna. No se admiten credenciales temporales que requieran
un token de sesión. [Permisos de los proveedores](permissions.md#aws) explica
el razonamiento y cómo limitarla.

### Lo que cuesta {#cost}

Cost Explorer cobra por solicitud. Una actualización pide dos meses por
cuenta —el mes pasado y este—, una solicitud por cada uno, y más para un mes
tan grande que Cost Explorer lo devuelva por páginas (como máximo 20). El
intervalo de actualización mantiene la programación en segundo plano en una
actualización por intervalo, así que con las 24 horas predeterminadas una
cuenta cuesta unas dos solicitudes al día. Una obtención que AWS respondió pero
que CloudBridge no pudo guardar no se repite dentro del intervalo. **Force
Refresh** se salta todo esto; es la única forma de gastar más. Consulta los
precios actuales de AWS.

## Data Exports desde S3 {#data-exports}

CloudBridge puede leer los Data Exports de AWS (CUR 2.0, con la forma *FOCUS
1.2 with AWS columns*) desde el bucket de S3 al que se entregan. Pon el URI del
export —`s3://bucket/prefix`— en el campo **Data export S3 URI** del formulario
de la cuenta, y Refresh leerá desde allí en lugar de Cost Explorer.

- **Parquet o CSV comprimido con gzip**, según lo que se haya configurado para
  entregar el export.
- **Un mes cuenta una sola vez.** Solo se leen los archivos que nombra el
  manifiesto del periodo, así que un export que conserva todas las entregas
  sigue contando un mes una sola vez.
- **No entregado no es cero.** Un periodo que el export aún no ha escrito se
  omite y nunca se guarda como un mes vacío.
- **Lo que no ha cambiado no se descarga otra vez.** Las claves, los tamaños y
  los ETags de los archivos se comparan primero con la última obtención; un mes
  que AWS terminó de entregar cuesta un listado y la lectura de un manifiesto
  por actualización.
- **El export de un pagador se divide por cuenta miembro.** Cada fila conserva
  la cuenta vinculada con la que se facturó.

La política de Cost Explorer **no** concede acceso a S3: consulta
[Permisos de los proveedores](permissions.md#aws-s3). Los cargos de
almacenamiento y de solicitudes de S3 siguen aplicándose.

## Escanear recursos {#insights}

[Análisis](insights.md) escanea una cuenta de AWS con la misma clave de acceso,
y solo lee. Para ello, la clave necesita acceso de lectura a los recursos, como
la política administrada `ReadOnlyAccess` de AWS.
