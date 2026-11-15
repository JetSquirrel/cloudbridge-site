---
title: "Encuentra recursos inactivos de AWS y Cloudflare"
description: "Análisis de CloudBridge pone un escaneo de solo lectura de AWS y Cloudflare junto a la factura: instancias detenidas, direcciones inactivas, recursos sin reclamar y su coste."
---

# Análisis

**[English](../insights.md)**&emsp;**[中文](../zh/insights.md)**&emsp;**[日本語](../ja/insights.md)**&emsp;**[한국어](../ko/insights.md)**&emsp;**[Français](../fr/insights.md)**&emsp;**[Deutsch](../de/insights.md)**&emsp;**[Português](../pt/insights.md)**&emsp;[Documentación](index.md)

Análisis compara la factura con lo que realmente se está ejecutando y lista lo
que merece la pena revisar, con el precio tomado de la factura de este periodo.

## Configurar y escanear {#scan}

Haz clic en **Set up and scan**. La primera vez, CloudBridge pregunta antes de
instalar su escáner de recursos,
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist):
código abierto, nuestro fork mantenido, unos 45 MB, guardado en la propia
carpeta de datos de CloudBridge y verificado con una suma de comprobación
integrada en la aplicación. Después, escanea:

- cada cuenta de **AWS** con su clave de acceso, en todas las regiones que AWS
  habilita de forma predeterminada o solo en las que elijas;
- cada cuenta de **Cloudflare** con su token de API.

El escaneo solo lee —lista recursos y no cambia nada—, pero la credencial
necesita acceso de lectura a ellos: consulta [AWS](aws.md#insights) y
[Cloudflare](cloudflare.md#insights). **Scan again** actualiza el inventario.
Escanear requiere la aplicación de escritorio en macOS (Apple silicon) o
Windows.

## Qué encuentra {#findings}

Para AWS:

- **Instancias detenidas** cuyos volúmenes siguen facturando;
- **Direcciones públicas inactivas**: direcciones IPv4 asignadas pero asociadas
  a nada;
- **Recursos sin reclamar**: sin etiqueta de propietario (`owner`, `team`,
  `project`, `cost-center`, `business_line`) y sin una pila o aplicación que los
  gestione;
- **Facturado pero no en el escaneo**, en una región que el escaneo cubrió.

Los precios necesitan una factura a nivel de recurso: una cuenta de AWS apuntada
a su [Data Export](aws.md#data-exports). Sin ella, los hallazgos se listan, pero
sin precio.

Para Cloudflare, una tarjeta lista lo que encontró el escaneo por tipo —Workers,
buckets de R2, bases de datos D1, espacios de nombres de KV, zonas, Durable
Objects— con la parte de la factura y el uso de este periodo de cada tipo y de
cada recurso, de más caro a menos. Con
[la factura dividida por recurso](cloudflare.md#split), es donde un espacio de
nombres o un bucket desbocado aparece por su nombre.

## Configuración de seguridad {#security}

Desde CloudBridge 0.9.0, una sección aparte señala los grupos de seguridad de AWS
que abren SSH o RDP a todo internet (`0.0.0.0/0` o `::/0`). Lee el escaneo, no
cambia nada en tu nube y no necesita ninguna fuente adicional. No es una
auditoría de cumplimiento ni una revisión de seguridad completa, y sus hallazgos
nunca se suman con los de coste.

Cada grupo aparece como **Finding**, **Not evaluated** o **Evaluated, no
finding**. Abre una fila para ver la regla que detectó, por qué importa y qué
comprobar a mano. Una regla pública no es prueba de exposición: confirma que el
grupo está asociado a algo.

**Not evaluated** significa que no se pudieron leer las reglas de entrada, no que
el grupo sea seguro. Sin escaneo, con un escaneo parcial o con un escaneo que no
listó ningún grupo, la sección lo indica en lugar de parecer limpia.

## Primero el resumen {#summary}

Cada tarjeta se abre en sus tipos de recurso, con recuentos y coste. Haz clic en
un tipo para listar sus recursos, de cincuenta en cincuenta con **Show more**;
haz clic de nuevo para cerrarlo. Una cuenta grande sigue siendo una fila por tipo
hasta que lo pidas.

Cada hallazgo muestra su ID completo con un botón de copia, su cuenta y un enlace
a sus cargos, para que puedas comprobarlo contra la factura.
