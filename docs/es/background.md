---
title: "Gasto en la barra de menús y actualización en segundo plano"
description: "Mantén CloudBridge vigilando con la ventana cerrada: gasto en la barra de menús, una actualización diaria en segundo plano, notificaciones, Open at login y reintentos seguros."
---

# Barra de menús y segundo plano

**[English](../background.md)**&emsp;**[中文](../zh/background.md)**&emsp;**[日本語](../ja/background.md)**&emsp;**[한국어](../ko/background.md)**&emsp;**[Français](../fr/background.md)**&emsp;**[Deutsch](../de/background.md)**&emsp;**[Português](../pt/background.md)**&emsp;[Documentación](index.md)

Una alerta de coste vale algo solo mientras el dinero se sigue gastando. Por eso
CloudBridge sigue ejecutándose después de cerrar su ventana, se actualiza según una
programación y te avisa cuando algo se dispara.

## El icono de la barra de menús {#menu-bar}

En macOS y Windows, cerrar la ventana deja CloudBridge en la barra de menús (el
área de notificación en Windows). El título del icono es el gasto del mes, `$2.8k`.
El icono es un puente en arco con tres puntos, y un signo de exclamación sustituye
a los puntos mientras hay alguna alerta abierta.

Haz clic en él para ver un panel con el mes hasta la fecha, la previsión de fin de
mes, las alertas abiertas y los servicios que más se movieron respecto al mes
pasado, con **Refresh** y **Open CloudBridge**. Al hacer clic en una alerta, se
abre en la página Alerts. Haz clic con el botón derecho en el icono —o usa
**Quit** en el panel— para salir; cerrar la ventana ya no lo hace. El icono del
Dock aparece y desaparece con la ventana.

Para que cerrar la ventana cierre la aplicación, desactiva **Settings → Background
→ Keep running in the menu bar**. El icono desaparece de inmediato; la
programación y las notificaciones se ejecutan entonces solo mientras la ventana
está abierta, y un arranque al iniciar sesión abre la ventana en lugar de
arrancar oculto.

Las compilaciones para Linux no tienen icono de bandeja y siguen cerrándose con su
ventana; la programación y las notificaciones se ejecutan mientras está abierta.

## La actualización en segundo plano {#schedule}

CloudBridge obtiene cada cuenta una vez transcurrido su intervalo de actualización
(**Settings → Refreshing**, 24 horas de forma predeterminada), ejecuta las
[reglas de alerta](alerts.md) y publica una notificación por cada alerta nueva. Así
que la programación cuesta lo mismo que hacer clic en Refresh una vez al día.

Cada 15 minutos comprueba si alguna cuenta ya toca actualizarse. Esa
comprobación solo lee el registro local; no envía nada a ningún proveedor. Los 15
minutos deciden con qué rapidez se obtiene una cuenta pendiente después de que un
portátil se despierte o de que se resuelva un fallo, no con qué frecuencia se
obtiene. Desactiva la programación en **Settings → Background → Refresh in the
background**.

## Open at login {#login}

**Settings → Background → Open at login** inicia CloudBridge cuando inicias sesión,
en la barra de menús y sin su ventana, para que las alertas sigan llegando tras un
reinicio. Está desactivado hasta que lo actives; macOS lo lista en **System
Settings → General → Login Items**.

## Cuando falla una actualización {#failures}

- **Una cuenta que no deja de fallar** se reintenta a los 15 minutos, luego a los
  30, duplicando hasta el intervalo de actualización, así que una clave revocada o
  una caída del proveedor cuesta unos pocos intentos al día en lugar de uno en
  cada ciclo. Una notificación avisa cuando una cuenta empieza a fallar —su gasto
  ha dejado de vigilarse— y el panel la nombra hasta que se recupera.
- **Una obtención que el proveedor respondió pero que CloudBridge no pudo
  guardar** —un disco lleno, por ejemplo— no se repite dentro del intervalo de
  actualización, para no pagar dos veces por las mismas solicitudes de Cost
  Explorer o descargas de S3. **Force Refresh** lo reintenta de inmediato.
- **Que falle un mes no detiene el otro**: un problema del mes pasado no deja sin
  obtener este mes, donde se manifiesta un gasto desbocado.
