---
title: "Alertas de anomalías de coste, reglas y presupuestos"
description: "Las reglas de alerta de CloudBridge para anomalías de coste, mínimos de saldo, gasto sin etiquetar y presupuestos: cuándo se ejecutan, qué miden y cómo se resuelven las alertas."
---

# Alertas, reglas y presupuestos

**[English](../alerts.md)**&emsp;**[中文](../zh/alerts.md)**&emsp;**[日本語](../ja/alerts.md)**&emsp;**[한국어](../ko/alerts.md)**&emsp;**[Français](../fr/alerts.md)**&emsp;**[Deutsch](../de/alerts.md)**&emsp;**[Português](../pt/alerts.md)**&emsp;[Documentación](index.md)

Las reglas se evalúan contra el registro cuando se abre la aplicación y después
de cada actualización, incluida la
[actualización en segundo plano](background.md), que obtiene cada cuenta una vez
transcurrido su intervalo de actualización mientras CloudBridge se ejecuta, con la
ventana cerrada también en macOS y Windows. Cada alerta nueva publica una
notificación del sistema. Al abrir la página Alerts se vuelve a comprobar si las
alertas abiertas se han resuelto.

## Las reglas {#rules}

Tres reglas vienen activadas; revísalas en la página **Rules** y desactiva las
que no necesites.

| Regla | Se dispara cuando | Predeterminado |
| --- | --- | --- |
| Model cost growth anomaly | El gasto diario de un par fuente/servicio supera su línea base de los 7 días anteriores durante días consecutivos | Por encima de 2,5× durante 2 días consecutivos |
| Balance floor | Un saldo de prepago cae por debajo del importe del presupuesto mensual de la cuenta, o del mínimo predeterminado si no hay presupuesto | 200, en la moneda del propio saldo |
| Untagged spend ratio | La parte del uso no asignado del mes supera el umbral y es mayor que la del mes pasado | Por encima del 15 % y creciendo |

La regla de anomalía necesita una línea base: un servicio que no costó nada
durante los últimos siete días nunca la dispara, por mucho que gaste después. Una
carga de trabajo que pasa de nada a un gasto desbocado —un proyecto olvidado
que empieza a repetirse en bucle— la detecta una regla de [Account budget](#budgets) basada en
la previsión de fin de mes; [Cloudflare](cloudflare.md#runaway) lo explica paso a
paso.

**New rule** en la página Rules crea más: elige un tipo, ajusta sus opciones y haz
clic en **Create rule**. Una regla nueva se activa de inmediato, y una regla de
anomalía puede limitarse a una cuenta.

## Presupuestos {#budgets}

La tarjeta **Monthly budgets** de la página Rules define lo que puede costar una
cuenta en un mes. Elige la cuenta, introduce un **Monthly budget** y un **Alert at
(% of budget)**, y haz clic en **Save budget**; **Remove** lo elimina. Cada cuenta
con presupuesto muestra entonces cuánto de su presupuesto ha usado este mes, en la
moneda de informe.

Un presupuesto por sí solo únicamente traza esa línea. Para recibir alertas, crea
una regla **Account budget** para la cuenta y elige:

- **Based on** — *Cost to date* para lo que va de mes, o *Month-end forecast* para
  la proyección según el ritmo de gasto;
- **Threshold type** — *% of budget*, o un *Amount* fijo.

También funciona al revés: la regla se mide contra el presupuesto, así que una
regla **Account budget** sobre una cuenta sin presupuesto nunca se dispara, ni
siquiera con un umbral de *Amount*. Define primero el presupuesto.

El presupuesto de una cuenta también sirve como su mínimo en la regla Balance
floor.

## Leer una alerta {#alerts}

Una alerta lleva las mediciones que la respaldan: gasto y línea base, saldo y
mínimo, o parte no asignada. Las proyecciones son estimaciones a partir de datos
recientes, no costes de fin de mes garantizados. **Snooze** oculta una alerta
durante un tiempo; **Dismiss** la cierra. Una alerta abierta se marca como
**resolved** cuando una evaluación posterior comprueba que su condición ya no se
cumple.

**See the charges** abre el servicio de la alerta en [Consulta](query.md), a lo
largo de varios meses.

Un saldo bajo es una sola alerta en lugar de una tarjeta nueva cada día. Mantiene
las últimas cifras hasta que el saldo se recupera o la descartas, y las tarjetas
antiguas del mismo saldo se fusionan con ella en la siguiente comprobación.

## Notificaciones {#notifications}

Cada alerta que se dispara mientras CloudBridge se ejecuta se anuncia una vez como
notificación del sistema; las alertas que ya estaban abiertas cuando se inició la
aplicación no se repiten. Desactívalas en **Settings → Background → Alert
notifications**.
