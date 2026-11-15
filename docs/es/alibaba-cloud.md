---
title: "API de facturación e importación de facturas de Alibaba Cloud"
description: "Conecta Alibaba Cloud (阿里云) a CloudBridge con un usuario de RAM de solo lectura, o importa los detalles de factura para obtener costes por modelo de Model Studio (百炼)."
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[日本語](../ja/alibaba-cloud.md)**&emsp;**[한국어](../ko/alibaba-cloud.md)**&emsp;**[Français](../fr/alibaba-cloud.md)**&emsp;**[Deutsch](../de/alibaba-cloud.md)**&emsp;**[Português](../pt/alibaba-cloud.md)**&emsp;[Documentación](index.md)

Alibaba Cloud tiene ambos canales. La **API de facturación** da el total de
cada producto para el mes; el **export de detalles de factura** da filas a
nivel de instancia, incluido Model Studio (百炼) por modelo con recuentos de
tokens. Usa la API para una cuenta que se mantiene actualizada sola, e importa
el export cuando quieras la lectura más fina: una actualización nunca
sobrescribe un mes importado.

## API de facturación {#api}

1. Abre la [consola de RAM](https://ram.console.aliyun.com/) y crea un usuario
   de RAM para el acceso por API.
2. Adjunta la política de sistema integrada `AliyunBSSReadOnlyAccess`.
3. Crea un AccessKey para el usuario.
4. Añade la cuenta en CloudBridge con el AccessKey ID y el Secret.

No uses el AccessKey de la cuenta principal. Aquí no se documenta ninguna
tarifa por consulta de la API de facturación; consulta las condiciones
actuales de Alibaba Cloud. Consulta
[Permisos de los proveedores](permissions.md#alibaba-cloud).

## Export de detalles de factura {#export}

En la consola, ve a **Expenses and Costs → Bill Details → Export**, descarga la
factura completa y haz clic en **Import** en la fila de la cuenta. Una
importación no necesita credenciales. Consulta
[Importar un archivo de factura](bill-import.md).
