---
title: "0.3.1: uno de cada cosa"
description: "Una pasada de coherencia por toda la interfaz —un conjunto compartido de tarjetas, botones, píldoras y cabeceras de tabla—, más una compilación de macOS firmada y notarizada."
date: 2026-09-12
tag: Versión
---

# 0.3.1: uno de cada cosa

<p class="post-meta">2026-09-12&emsp;Versión&emsp;<a href="./">Todos los artículos</a></p>

La 0.3.0 reconstruyó la interfaz sobre GPUI Kit, pero la reconstruyó página por página. Cada página recibió el aspecto nuevo; cada página también conservó su propia copia de qué es una tarjeta, un botón primario o una cabecera de tabla. Las copias se desvían: la página de Ajustes seguía con los estilos previos a la reconstrucción, y en otros lugares el mismo control de «elige uno de tres» aparecía en cuatro formas distintas. La 0.3.1 es la pasada que hace real el sistema de diseño: una definición por elemento, en el tema, con cada página bebiendo de ella.

## La gravedad decide la prominencia

La pasada sacó a la luz lugares donde la jerarquía visual discutía con la información. En la página de Cuentas, **Saludable** —el único estado que no te pide nada— llevaba la insignia más brillante, mientras que Anomalía y Saldo bajo se mostraban como texto plano. En la página de Alertas, una alerta Crítica era menos prominente que una Advertencia. Ambas ahora están invertidas en el sentido correcto: cuanto más fuerte el estado, más fuerte el estilo, y el rojo de alerta y el amarillo de advertencia se reservan para alertas reales en lugar de etiquetas neutras.

La misma lógica se aplicó a las acciones. Actualizar, la operación barata del día a día, es ahora el botón primario de la Vista general; Forzar actualización, la cara, es secundario. Los botones de eliminar y las confirmaciones de borrado usan el estilo de peligro. Y los botones de acción de una alerta se estilan por lo que hacen, no por dónde acaban en una lista, así que Descartar nunca puede terminar como el gran botón primario solo porque venía primero.

## Errores que no desalojan el contenido

Un interruptor fallido en la página de Reglas solía reemplazar toda la lista de reglas por un cartel rojo. Ahora los errores se muestran en línea encima de la lista, la lista se queda quieta y cada error ofrece Reintentar.

## Correcciones menores

- **«Mayores movimientos»** ahora ordena por el tamaño del cambio, no por el tamaño del gasto: un servicio grande pero plano ya no retiene la lista para siempre.
- El punto de frescura de la barra de estado refleja si toca la siguiente consulta, en lugar de quedarse verde para siempre tras la primera sincronización.
- **«Resueltas este mes»** muestra la fecha en que se resolvió una alerta, no la fecha en que se generó.
- Los importes en yenes ya no muestran decimales sin sentido.
- La página de detalle de cuenta fusiona sus tarjetas GASTO / USO / CRÉDITOS en una tarjeta GASTO que desglosa el total en una línea.
- El sitio de documentación recibió el mismo trato: un encabezado duplicado renombrado, explicaciones repetidas deduplicadas, colores codificados a mano movidos a los tokens de diseño.

## Una compilación de macOS firmada

Las compilaciones de publicación para macOS ahora se firman y notarizan en CI. El rodeo de Gatekeeper en las notas de instalación —Control-clic, «Abrir de todos modos», la línea de `xattr`— deja de formar parte de instalar CloudBridge; descarga el DMG y arrástralo a Aplicaciones.

## Lo que viene

Sin cambios desde la 0.3.0: la [hoja de ruta](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) todavía debe un canal de *exportación* de archivos de factura (S3 / OSS + Parquet), asignación por etiquetas con un nodo explícito de no asignado, y las API de facturación de Volcengine, OpenAI y Anthropic.
