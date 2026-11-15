---
title: "Saldo de DeepSeek y gasto por modelo en la API"
description: "Conecta DeepSeek a CloudBridge con una clave de API para el saldo de prepago, e importa su descarga de uso para ver el gasto por día y por modelo."
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[日本語](../ja/deepseek.md)**&emsp;**[한국어](../ko/deepseek.md)**&emsp;**[Français](../fr/deepseek.md)**&emsp;**[Deutsch](../de/deepseek.md)**&emsp;**[Português](../pt/deepseek.md)**&emsp;[Documentación](index.md)

La API de DeepSeek informa de un **saldo** —concedido y recargado—, no de un
desglose del gasto. Para ver el detalle del gasto, importa la descarga de la
consola.

## API de saldo {#api}

1. Abre [platform.deepseek.com](https://platform.deepseek.com/) y crea una
   clave de API.
2. Añade la cuenta en CloudBridge usando esa clave.

El saldo alimenta la regla **Balance floor** (consulta
[Alertas, reglas y presupuestos](alerts.md)). Una clave usada para consultar el
saldo también puede autorizar solicitudes de modelo de pago, así que protégela
y revisa sus permisos: consulta
[Permisos de los proveedores](permissions.md#deepseek).

## Descarga de uso {#export}

En la consola, ve a **Usage → Download** e importa el ZIP exactamente como se
descargó: CloudBridge lee el `cost-*.csv` que contiene e ignora el
`amount-*.csv`, cuya columna `amount` contiene recuentos de tokens, no dinero.
Consulta [Importar un archivo de factura](bill-import.md).
