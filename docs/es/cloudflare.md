---
title: "Costes de Cloudflare por bucket de R2, Worker y D1"
description: "Conecta Cloudflare a CloudBridge con un token de API: uso facturable diario repartido entre buckets de R2, Workers, D1 y Durable Objects."
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[日本語](../ja/cloudflare.md)**&emsp;**[한국어](../ko/cloudflare.md)**&emsp;**[Français](../fr/cloudflare.md)**&emsp;**[Deutsch](../de/cloudflare.md)**&emsp;**[Português](../pt/cloudflare.md)**&emsp;[Documentación](index.md)

CloudBridge lee el uso facturable de Cloudflare: gasto por servicio, **por
día**. Ese es el punto. Un Worker o un Durable Object que empieza a repetirse
en bucle está en el registro al día siguiente, no en la factura a final de mes,
y el uso dentro de la asignación gratuita también se guarda, con un coste de
cero al lado, porque ahí es donde empieza un gasto desbocado.

## Conecta la cuenta {#connect}

1. En el [panel de Cloudflare](https://dash.cloudflare.com/profile/api-tokens),
   ve a **My Profile → API Tokens → Create Token** y empieza por **Create
   Custom Token**.
2. Concede **Account → Billing → Read** y limita **Account Resources** a la
   cuenta que quieres vigilar.
3. Copia el ID de la cuenta desde la página de inicio de la cuenta en el panel.
4. Añade la cuenta en CloudBridge con el ID de cuenta y el token.

La API de uso facturable solo cubre cuentas de pago por uso (autoservicio) y es
una API alfa; una cuenta Enterprise se informa como no cubierta. Cloudflare
factura en un ciclo anclado al inicio de la suscripción; cada mes natural en
CloudBridge contiene los días que caen dentro de él.

## Divide por recurso {#split}

La factura se detiene en el servicio —*R2 Class B operations, 734 on 3
October*—, no en qué bucket. Añade **Account → Account Analytics → Read** al
token y CloudBridge pedirá a la API de GraphQL Analytics el uso de cada recurso
de los medidores que nombra la factura, y luego repartirá la fila de cada día
según esas proporciones:

| Factura | Se reparte entre |
| --- | --- |
| R2 Class A y B operations, storage | Buckets de R2 |
| Workers requests y CPU | Workers (por solicitudes) |
| D1 rows read y written, storage | Bases de datos D1 |
| Durable Objects requests, duration, rows, storage | Espacios de nombres de Durable Object |

Las partes suman lo que Cloudflare facturó y se marcan como estimaciones: los
datos analíticos son muestreados, y una asignación gratuita pertenece a la
cuenta, no a un recurso concreto. Un medidor que los datos analíticos no pueden
dividir —KV, Queues, cualquier cosa no reconocida— o un token sin el permiso
conserva su fila entera, en la cuenta. [Análisis](insights.md) muestra la parte
de cada recurso y su uso en este periodo.

## Detecta un gasto desbocado {#runaway}

Nada detiene una cuenta de Cloudflare de pago por uso al alcanzar un límite de
gasto, así que una alarma de Durable Object o un Worker en bucle factura
mientras siga ejecutándose. CloudBridge tampoco puede detenerlo; lo que puede
hacer es avisarte el primer día en vez de en la factura. Configura esto para
cada cuenta de Cloudflare, incluidas las tranquilas: un proyecto que nadie usa
es el que nadie está vigilando:

1. En la página **Rules**, asigna a la cuenta un **Monthly budget**: lo que
   cuesta un mes normal, con algo de margen. La regla de abajo se mide contra
   él y no hace nada para una cuenta sin presupuesto.
2. Haz clic en **New rule**, elige **Account budget** para la cuenta y define
   **Based on** como **Month-end forecast**.
3. En **Settings → Refreshing**, acorta el intervalo de actualización a 6 horas
   y mantén CloudBridge en marcha en la [barra de menús](background.md) con
   **Open at login** activado.

La previsión es lo que hace que esto funcione. Calcula el promedio del gasto del
mes desde el primer día que tuvo alguno, así que el primer día de un bucle se
proyecta al resto del mes, y la regla se dispara en la primera actualización que
lee ese día.

La regla de **anomalía de crecimiento de coste** no cubre este caso. Compara un
servicio con sus propios últimos siete días, y un servicio que no costaba nada
no tiene línea base desde la que crecer, así que un proyecto inactivo que se
despierta en bucle nunca la activa.

Cuando se dispare la alerta, detén el Worker o el Durable Object en el panel de
Cloudflare. Con Account Analytics en el token, [Análisis](insights.md) muestra
la parte de la factura de cada Worker y de cada espacio de nombres, para que el
culpable destaque.

## Escanear recursos {#insights}

[Análisis](insights.md) escanea la cuenta con el mismo token y solo lee. Para
ello, añade estos permisos **Read** en la misma cuenta: **Account Settings**,
**Zone**, **Workers Scripts**, **Workers R2 Storage**, **Workers KV Storage**,
**Queues** y **D1**. Un token sin ellos sigue leyendo la factura; el escaneo
indica qué se le rechazó.

Consulta [Permisos de los proveedores](permissions.md#cloudflare) para saber
exactamente qué endpoints llama CloudBridge.
