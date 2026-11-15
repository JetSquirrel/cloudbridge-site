---
title: "Instala CloudBridge y lee tu primera factura"
description: "Instala CloudBridge en macOS o Windows, explora con la factura de demostración, añade tu primera cuenta y lee tu primera factura en unos minutos."
---

# Primeros pasos

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[日本語](../ja/getting-started.md)**&emsp;**[한국어](../ko/getting-started.md)**&emsp;**[Français](../fr/getting-started.md)**&emsp;**[Deutsch](../de/getting-started.md)**&emsp;**[Português](../pt/getting-started.md)**&emsp;[Documentación](index.md)

CloudBridge lee las facturas de tus proveedores de nube y de modelos en un
único registro en tu máquina — desde una API de facturación o desde el export
que hayas descargado — y dibuja las tendencias. No hay que registrarse, ni hay
sincronización ni telemetría. Esta página te lleva desde la descarga hasta
tu primera factura.

## 1. Instalar {#install}

Descarga la última compilación desde la página de
[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest):

| Plataforma | Archivo |
| --- | --- |
| macOS (Apple silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** Abre el `.dmg`, arrastra **CloudBridge** a **Applications** y
ábrela desde ahí. Las versiones están firmadas con Developer ID y
notarizadas, así que se abren sin ningún rodeo. Si macOS bloquea una versión
actual, [informa del aviso exacto](https://github.com/JetSquirrel/cloudbridge/issues)
y de tu versión de macOS; no desactives la protección de cuarentena como paso
habitual de instalación.

**Windows.** El `.exe` no está firmado con código, así que es probable que
SmartScreen lo detenga con *Windows protected your PC*. Comprueba que el
archivo procede de la página oficial de Releases y, a continuación, haz clic
en **More info** y en **Run anyway**. Windows recuerda la elección para ese
archivo; una versión nueva vuelve a preguntar.

Los binarios de Linux y de Mac con Intel no se publican. Compilar desde el
código fuente requiere Rust 1.95 o posterior — consulta la
[configuración de desarrollo](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup):

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. Echa un vistazo primero, si quieres {#demo}

[La demo en el navegador](https://cloudbridge.jetsquirrel.cloud/demo/) ejecuta
las mismas páginas sobre una factura de ejemplo. No guarda credenciales ni se
conecta a ningún proveedor, así que la importación, la actualización desde una
API de facturación y la consola SQL son exclusivas de la aplicación de
escritorio.

En la aplicación, un Resumen vacío ofrece **Load demo data**, o abre
**Settings → Demo data**. Las cuentas de demostración no llevan credenciales y
las actualizaciones las omiten; **Clear demo data** en la misma página las
elimina.

## 3. Añade una cuenta {#account}

Abre **Accounts**, haz clic en **Add account**, elige la fuente e introduce un
nombre.

| Fuente | Cómo llega la factura | Qué necesita |
| --- | --- | --- |
| Amazon Web Services | API de facturación | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | API de Cost Management | Client ID + secret + ID de suscripción — [Azure](azure.md) |
| Google Cloud | Export de facturación de BigQuery | Archivo de clave de cuenta de servicio + tabla de export — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | API de facturación o un export de factura | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | API de facturación | ID de cuenta + token de API — [Cloudflare](cloudflare.md) |
| DeepSeek | API de saldo o un export de factura | Clave de API — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | Export de factura | Nada |
| OpenAI | Export de factura | Nada |
| Anthropic (Claude) | Export de factura | Nada |

Haz clic en **Save**. Una fuente de API obtiene enseguida la factura de este
mes y la del mes pasado, así que una clave incorrecta se manifiesta como un
fallo de esa obtención.

## 4. Haz entrar la factura {#bill}

- **Una fuente de API** ya obtuvo su factura al guardarla. **Refresh** en el
  Resumen vuelve a obtenerla una vez transcurrido el intervalo de
  actualización.
- **Una fuente de archivo** — Volcengine, OpenAI, Anthropic, o Alibaba Cloud y
  DeepSeek cuando quieres más detalle — necesita su export: descárgalo desde
  la consola del proveedor y haz clic en **Import** en la fila de la cuenta.
  Consulta [Importar un archivo de factura](bill-import.md).

## 5. Léela {#read}

El **Overview** muestra la ventana que elijas: **MTD**, **30d** o **12m**.
Elige USD o CNY en **Settings → Reporting**. A partir de ahí:

- [Resumen y cuentas](overview.md) explica las cifras.
- [Alertas, reglas y presupuestos](alerts.md) te avisa cuando el gasto se
  dispara.
- [Barra de menús y segundo plano](background.md) mantiene todo eso en marcha
  con la ventana cerrada.

¿Algo no aparece? Consulta [Solución de problemas](troubleshooting.md).
