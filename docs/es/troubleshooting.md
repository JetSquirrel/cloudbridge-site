---
title: "Soluciona problemas habituales de CloudBridge"
description: "Soluciones para problemas habituales de CloudBridge: avisos del Llavero, AccessDenied de AWS, un Resumen vacío, SmartScreen, una ventana de consola en Windows, errores de importación y alertas que no se dispararon."
---

# Solución de problemas

**[English](../troubleshooting.md)**&emsp;**[中文](../zh/troubleshooting.md)**&emsp;**[日本語](../ja/troubleshooting.md)**&emsp;**[한국어](../ko/troubleshooting.md)**&emsp;**[Français](../fr/troubleshooting.md)**&emsp;**[Deutsch](../de/troubleshooting.md)**&emsp;**[Português](../pt/troubleshooting.md)**&emsp;[Documentación](index.md)

## macOS pide acceso al Llavero {#keychain}

Las credenciales guardadas viven en el llavero del sistema operativo, no en
los archivos propios de CloudBridge, así que macOS puede preguntar si
CloudBridge puede usar su elemento del Llavero cuando la aplicación lee una
credencial. Haz clic en **Always Allow** para que no pregunte en cada
actualización, o en **Allow** para que pregunte cada vez. Si haces clic en
**Deny**, la aplicación no puede leer la credencial y la obtención de esa
cuenta falla hasta que permitas el acceso.

## AWS muestra AccessDenied {#aws-access-denied}

La clave se autenticó, pero a su usuario le falta `ce:GetCostAndUsage`. Asocia
la [política de Cost Explorer](aws.md#cost-explorer) al usuario de IAM
propietario de la clave. Una política de control de servicios de la
organización también puede denegar Cost Explorer; y, en una organización de
AWS, las cuentas miembro solo ven los datos de Cost Explorer si la cuenta de
gestión lo permite.

## El Resumen está vacío después de añadir una cuenta {#empty-overview}

- **Todavía no se ha obtenido nada.** Haz clic en **Refresh** en el Resumen.
  Una fuente de importación de archivos (Volcengine, OpenAI, Anthropic) no
  tiene nada que obtener: usa **Import** en su fila.
- **El proveedor aún no ha informado.** Los proveedores publican los cargos
  con retraso; Cost Explorer de AWS puede tardar hasta unas 24 horas, así que
  una cuenta recién creada o el gasto de hoy pueden no aparecer de inmediato.
  Vuelve a intentarlo más tarde en lugar de usar Force Refresh, que puede
  generar cargos por solicitudes de Cost Explorer.
- **La ventana es demasiado estrecha.** A principios de mes, **MTD** puede
  contener poco o nada; cambia a **30d** o **12m**.
- **Es una fuente solo de saldo.** La API de DeepSeek informa de un saldo, no
  de gasto. Importa su descarga de uso para ver el detalle del gasto.

## Una cuenta no deja de fallar al actualizarse {#refresh-failing}

El panel de la barra de menús y el Resumen indican qué cuentas fallaron y por
qué. Una cuenta que falla se reintenta a los 15 minutos, luego a los 30,
duplicando el intervalo hasta llegar al de actualización, y una notificación
avisa cuando empieza a fallar. Si un proveedor respondió pero CloudBridge no
pudo guardar el resultado —un disco lleno, por ejemplo—, no vuelve a obtener
ese mes dentro del intervalo de actualización, para no pagar dos veces por los
mismos datos; **Force Refresh** lo reintenta de inmediato. Consulta
[Barra de menús y segundo plano](background.md#failures).

## SmartScreen de Windows bloquea la aplicación {#smartscreen}

La compilación de Windows no está firmada con código, así que SmartScreen
muestra *Windows protected your PC*. Después de comprobar que el archivo
procede de la página oficial de
[Releases](https://github.com/JetSquirrel/cloudbridge/releases), haz clic en
**More info** y luego en **Run anyway**.

## Se abre una ventana de consola junto a la aplicación en Windows {#windows-console}

Las versiones de Windows hasta la 0.7.1 abren una ventana de consola negra
junto a CloudBridge, y el `.exe` muestra un icono genérico en lugar del de
CloudBridge. Cerrar esa consola cierra CloudBridge, incluido el icono del área
de notificación, así que minimízala en vez de cerrarla. Las versiones
posteriores no abren ninguna consola y llevan su icono en el `.exe`, en la
barra de título y en la barra de tareas.

## Toda consulta falla en Windows {#windows-query}

En la 0.8.0 para Windows, toda consulta de la página Query se detiene con un
error de E/S, porque la página abre el archivo del registro una segunda vez.
CloudBridge 0.9.0 lo corrige. Tus datos no se ven afectados.

## La instalación del escáner se detiene a medias {#scanner-install}

El escáner de Análisis es una descarga de unos 45 MB. En la 0.8.0, un corte de
conexión a mitad de la descarga detiene la instalación con *io: unexpected end
of file*: haz clic de nuevo en **Set up and scan**. A partir de la 0.9.0,
CloudBridge reintenta por su cuenta hasta tres veces una descarga
interrumpida o agotada, o un error del servidor.

## Errores de importación {#import-errors}

- **"not UTF-8 text"** — las consolas de Alibaba Cloud y Volcengine pueden
  generar exports en GBK. Vuelve a exportar como UTF-8 o guarda el archivo
  como CSV UTF-8 antes de importarlo.
- **Columnas no reconocidas** — los analizadores reconocen los alias conocidos
  de los exports en chino e inglés y los nombres de campo de los proveedores.
  Si un formato ha cambiado, informa del error y de las cabeceras de columna
  en una incidencia. Oculta los valores sensibles; no adjuntes una factura sin
  censurar.
- **Un mes se redujo después de importar** — una importación sustituye todos
  los meses que cubre el archivo para esa cuenta, así que un export filtrado
  por producto deja solo ese producto. Vuelve a importar la factura completa y
  sin filtrar.
- **Recuentos de tokens pero ningún gasto** — un export de uso no lleva
  importes; importa el export de costes. Para DeepSeek, importa el ZIP tal como
  se descargó, no su `amount-*.csv`.

## Se rechaza un escaneo de Cloudflare {#cloudflare-scan}

El escaneo indica cuál de las dos cosas ha ocurrido. *Cloudflare did not accept
this account's API token* significa que el token es incorrecto o ha caducado:
compruébalo en la página Accounts. *The token cannot read …* significa que el
token es válido pero le falta el permiso Read de un servicio; añade los
permisos indicados en [Cloudflare](cloudflare.md#insights). Un token sin ellos
sigue leyendo la factura.

## Una alerta no se disparó {#alert-silent}

- **La regla Account budget no tiene presupuesto con el que medirse.** La
  regla no hace nada para una cuenta sin un **Monthly budget**, sea cual sea su
  tipo de umbral. Define uno en la página Rules.
- **El gasto empezó desde cero.** La regla de anomalía de crecimiento de coste
  compara un servicio con sus propios últimos siete días, así que un servicio
  que no costaba nada no tiene línea base y nunca la dispara. Una regla de
  presupuesto basada en la previsión de fin de mes cubre ese caso: consulta
  [Detectar un gasto desbocado](cloudflare.md#runaway).
- **El día aún no está en el registro.** Las reglas se ejecutan sobre lo que se
  ha obtenido. La actualización en segundo plano obtiene una cuenta una vez por
  intervalo de actualización, y solo mientras CloudBridge se ejecuta; consulta
  [Barra de menús y segundo plano](background.md).
- **Las notificaciones están desactivadas**, o la alerta ya estaba abierta
  cuando se inició la aplicación. Las alertas abiertas se listan en la página
  Alerts en cualquier caso.

## Sigues atascado {#help}

¿Tienes preguntas que la documentación no responde?
[Abre una incidencia](https://github.com/JetSquirrel/cloudbridge/issues).
