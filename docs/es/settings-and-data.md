---
title: "Ajustes, almacenamiento de datos y seguridad"
description: "Qué guarda CloudBridge y dónde: el registro DuckDB, las cuentas, las cargas sin procesar y la configuración, además del intervalo de actualización, la moneda, las copias de seguridad y la seguridad."
---

# Ajustes, datos y seguridad

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[日本語](../ja/settings-and-data.md)**&emsp;**[한국어](../ko/settings-and-data.md)**&emsp;**[Français](../fr/settings-and-data.md)**&emsp;**[Deutsch](../de/settings-and-data.md)**&emsp;**[Português](../pt/settings-and-data.md)**&emsp;[Documentación](index.md)

## Ajustes {#settings}

| Ajuste | Qué hace |
| --- | --- |
| Appearance → Theme | Temas claro y oscuro, recordados entre ejecuciones |
| Appearance → Language | [El idioma de la interfaz](#language): System, English o 简体中文 |
| Reporting → Currency | USD o CNY para todos los totales; los cargos conservan su propia moneda |
| Refreshing → Refresh interval | 6, 12, 24 (predeterminado) o 48 horas antes de que un mes se vuelva a obtener |
| Background | [Open at login, actualización en segundo plano, notificaciones de alertas](background.md) |
| Data → Export as FOCUS | Cada cargo como un CSV con nombres de columna de FOCUS, para otra herramienta de FinOps ([detalles](focus.md#export)) |
| Demo data | Carga o borra cinco cuentas de ejemplo (AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic) con doce meses de historial |

**Refresh** obtiene los meses más antiguos que el intervalo de actualización;
**Force Refresh** los obtiene todos y puede generar cargos del proveedor. Ninguno
de los dos sobrescribe un mes importado. Las cuentas de demostración usan el
prefijo `demo-`, no llevan credenciales y las actualizaciones las omiten.

## Idioma de la interfaz {#language}

CloudBridge 0.9.0 y posteriores están traducidos al 简体中文: cada página y
diálogo, el panel de la barra de menús, su menú y las notificaciones del sistema.
Hasta que elijas un idioma en **Settings → Appearance → Language**, la aplicación
sigue el del sistema, y un cambio se aplica al instante. La demo en el navegador
sigue el idioma del navegador y tiene un selector en el pie de su barra lateral.

- El menú de la bandeja adopta un idioma nuevo la próxima vez que se inicia la
  aplicación.
- Una alerta conserva el idioma en el que se disparó. La alerta de saldo bajo es
  la excepción: se reescribe con sus últimas cifras, en el idioma actual.
- Los importes y las monedas se formatean como antes.

## Dónde viven los datos {#storage}

| Plataforma | Ubicación |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux (compilaciones desde el código fuente) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — el registro de facturación, con la moneda original de cada
  cargo, las [instantáneas de fin de mes](overview.md#snapshots) y las
  [facturas](reconciliation.md);
- `cloudbridge.duckdb` — cuentas, presupuestos, reglas y estado de las alertas;
- `raw/` — cada respuesta de proveedor y archivo importado, por fuente, cuenta y
  mes, para que una corrección de mapeo pueda releerlos sin otra solicitud
  (**Accounts → Replay normalization**);
- `inventory/` y `tools/` — los escaneos de Análisis y el escáner, si está
  instalado;
- `config.json` — moneda, tema, intervalo de actualización y ajustes de segundo
  plano.

## Copias de seguridad {#backups}

Cierra CloudBridge antes de copiar o abrir sus bases de datos. Haz una copia de
seguridad de todo el directorio —ambas bases de datos, `raw/` y `config.json`— y
restáuralo con la aplicación cerrada. Las credenciales están en el llavero del
sistema operativo, no en la copia de seguridad; en otra máquina, vuelve a
introducirlas. Para analizar el registro fuera de la aplicación, consulta una
copia en lugar del archivo en uso.

## Seguridad {#security}

- Las credenciales se guardan en el llavero del sistema operativo —el Llavero de
  macOS o el Administrador de credenciales de Windows; Secret Service en las
  compilaciones de Linux desde el código fuente—, separadas de las bases de datos.
- La aplicación usa una credencial solo para solicitudes al proveedor al que
  pertenece. Usar una clave en CloudBridge no la convierte en solo lectura:
  consulta [Permisos de los proveedores](permissions.md).
- No hay ningún servicio de sincronización de CloudBridge ni telemetría. Una
  importación no hace ninguna solicitud al proveedor.
- **Local no significa cifrado.** La aplicación no cifra el registro ni los
  archivos sin procesar. Usa cifrado de disco y protege tus copias de seguridad.
- Antes de compartir registros, capturas de pantalla o exports de ejemplo, oculta
  credenciales, IDs de cuenta, nombres de recursos y etiquetas.
