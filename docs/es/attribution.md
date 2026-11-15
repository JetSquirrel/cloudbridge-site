---
title: "Atribución de costes por línea de negocio, etiqueta y servicio"
description: "Atribución de CloudBridge: un Sankey del origen al servicio o modelo y a la línea de negocio, y desgloses por etiqueta, servicio, región o categoría de FOCUS."
---

# Atribución

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[日本語](../ja/attribution.md)**&emsp;**[한국어](../ko/attribution.md)**&emsp;**[Français](../fr/attribution.md)**&emsp;**[Deutsch](../de/attribution.md)**&emsp;**[Português](../pt/attribution.md)**&emsp;[Documentación](index.md)

La página Atribución dibuja el mes como un Sankey: origen, luego servicio o
modelo, y después línea de negocio, con un nodo **Unallocated** explícito. Los
flujos son uso bruto: un flujo neto puede ser negativo, lo que no significa nada
en un Sankey. Un cargo se asigna a una línea por su etiqueta `business_line`; sin
ella, cae en Unallocated.

## Desglose por dimensión {#dimensions}

Un selector encima del desglose elige **Tag** (la vista por línea de negocio),
**Service**, **Region** o **Category**. Las dimensiones distintas de la etiqueta
se dibujan como un mapa de árbol —**Map**, donde el área de una tesela es su
coste en este periodo y su color el cambio respecto al periodo anterior— o como
barras de proporción bajo **Table**. Los cargos sin valor para la dimensión se
muestran como *Other*. Una tarjeta de **Top resources** lista los recursos más
costosos del periodo.

## Categorías de servicio {#categories}

**Category** usa las categorías de servicio de FOCUS —Compute, Storage,
Databases, Networking, AI and Machine Learning y el resto—, las mismas en cada
nube, así que ECS de Alibaba Cloud, ECS de Volcengine y EC2 de AWS cuentan todos
como *Compute / Virtual Machines*, y Model Studio, Ark y los proveedores de
modelos como *AI and Machine Learning / Generative AI*. Un producto que ningún
mapeo conoce todavía se muestra como *Uncategorized* y aparece como un hallazgo
de [salud de los datos](overview.md#data-health).
