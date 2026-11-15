---
title: "0.4.0: más formas de entrar, más formas de leerlo"
description: "AWS Data Exports directamente desde S3, una página de Modelos con lo que cuesta cada modelo de LLM por token, una consola SQL de solo lectura, presupuestos mensuales, y toda la app corriendo en un navegador."
date: 2026-10-05
tag: Versión
---

# 0.4.0: más formas de entrar, más formas de leerlo

<p class="post-meta">2026-10-05&emsp;Versión&emsp;<a href="./">Todos los artículos</a></p>

La 0.3.0 metió cada factura en un registro; la 0.3.1 hizo que la interfaz concordara consigo misma. La 0.4.0 trabaja en los dos extremos de ese registro. A la entrada, una cuenta de AWS ahora puede leer su factura desde la exportación que AWS escribe en S3 en lugar de pedírsela a Cost Explorer. A la salida, hay cuatro formas nuevas de leer lo que ya está ahí: por modelo, por dimensión, contra un presupuesto y en SQL. Y la misma aplicación ahora corre en un navegador, así que puedes probarlo todo antes de instalar nada.

## AWS Data Exports, leídos desde S3

Cost Explorer responde con totales, y cada pregunta cuesta una solicitud. Los Data Exports de AWS (CUR 2.0, con la forma «FOCUS 1.2 with AWS columns») escriben la factura completa —IDs de recurso, etiquetas, la cuenta vinculada bajo la que se facturó cada fila— en un bucket de S3 que es tuyo. Dale a una cuenta de AWS el URI `s3://bucket/prefix` de la exportación y Actualizar lee desde ahí: Parquet o CSV comprimido con gzip, según lo que la exportación esté configurada para entregar.

Algunas cosas que hace bien y que es fácil hacer mal:

- **Un mes se cuenta una vez.** Una exportación configurada como «crear nueva» mantiene cada entrega una al lado de otra. CloudBridge lee solo los archivos que nombra el manifiesto del periodo, así que doce actualizaciones de septiembre siguen siendo un solo septiembre.
- **No entregado no es cero.** Un periodo que la exportación aún no ha escrito se omite, nunca se guarda como mes vacío.
- **La exportación de un pagador se divide por cuenta miembro.** Cada fila conserva su `SubAccountId` y su `SubAccountName`.

Las tarifas de almacenamiento y solicitudes de S3 siguen aplicándose, y la política de Cost Explorer no concede acceso a S3: la [página de permisos](https://cloudbridge.jetsquirrel.cloud/docs/permissions#aws-s3) tiene la política estrecha que necesita el canal de exportación. Las cuentas sin URI siguen usando Cost Explorer.

## La página de Modelos

El registro lleva guardando cantidades de tokens junto a los costos de LLM desde la 0.2.0; nada las leía. La nueva página de Modelos sí. Para el rango que elijas, cada modelo recibe su costo y su cambio, sus tokens de entrada, salida y caché, un costo combinado por millón de tokens y su proporción de caché, con un gráfico diario de tokens debajo.

También dice qué destaca. Un modelo cuyas lecturas de caché están por debajo del 5 % de su lado de entrada está pagando precio de entrada por lo que podría ser precio de caché. Un modelo que concentra más del 70 % del gasto de modelos merece saberse. Un modelo facturado sin medición de tokens se marca como tal, porque su costo unitario no se puede calcular. Y una subida de gasto se contrasta con los recuentos de tokens de los dos periodos: cuando los tokens extra explican la subida, es uso, y solo cuando no lo hacen se informa como un precio unitario al alza.

Los nombres de modelo enterrados en el texto de los ítems de facturación de Alibaba Cloud y Volcengine todavía no se extraen; las importaciones de OpenAI, Anthropic y DeepSeek nombran sus modelos directamente.

## Otras formas de leer el registro

- **Consulta.** Una consola SQL de solo lectura sobre el registro local de DuckDB, con plantillas de inicio. Solo se ejecutan sentencias de lectura, y en cualquier caso el registro se abre en solo lectura para ellas. Solo en escritorio.
- **Presupuestos.** La página de Reglas guarda un presupuesto mensual por cuenta, y una regla «Presupuesto de cuenta» alerta sobre un porcentaje o un importe, contra el costo hasta la fecha o la previsión de fin de mes. Las reglas de anomalía ahora también se pueden acotar a una cuenta.
- **Desglose por dimensión.** La atribución alterna entre etiqueta, servicio, región y categoría de servicio, dibujada como un treemap —el área es costo, el color es el cambio— o como barras de participación, con los recursos más caros del periodo al lado. La página de detalle de una cuenta tiene el mismo desglose.
- **Salud de los datos.** Hallazgos sobre lo que hace que un total sea menos fiable de lo que parece: monedas que la tabla de tipos no puede convertir, uso sin etiqueta de atribución o sin región, ajustes que ningún cargo explica. Descarta uno y sigue descartado para ese periodo.

## CloudBridge en un navegador

El crate ahora también compila para WebAssembly. La [demo](https://cloudbridge.jetsquirrel.cloud/demo/) no es una maqueta: las páginas, los modelos de vista y las reglas de alerta son el propio código de escritorio, corriendo sobre un registro en memoria sembrado con la factura de demo en lugar de DuckDB, las API de los proveedores y el llavero. Consulta, Reglas y Ajustes se quedan en el escritorio; todo lo demás, incluida la página de Modelos, está ahí.

Para que siga así, CI compila la versión de navegador como una comprobación obligatoria, y las estadísticas que calculan ambas versiones —previsiones, comparaciones, descomposiciones, hallazgos— viven en un módulo compartido y probado en lugar de una copia por backend.

## Cosas menores

- **Eliminar una cuenta pregunta por su historial.** Antes, los cargos se quedaban atrás en silencio y seguían contando en los totales sin cuenta que los explicara. El diálogo de borrado ahora ofrece eliminarlos, y el historial dejado por un borrado anterior se lista en la página de Cuentas, donde se puede quitar.
- **Una primera ejecución que lleva a algún sitio.** Una Vista general vacía ofrece añadir una cuenta o cargar la factura de demo, y guardar una cuenta de API trae su factura de inmediato.
- **Atajos de teclado.** ⌘1–⌘9 cambian de página, ⌘R recarga.
- **La ventana se abre primero.** Los almacenes se abren y las páginas cargan en segundo plano, cada página en su primera visita.
- **El relleno del gráfico de gasto** ya no corta una cuña diagonal por el gráfico.
- **Seguridad:** rustls y quick-xml se actualizan por encima de tres avisos de RUSTSEC.
- **Rust 1.95** es el mínimo declarado; la declaración anterior nunca fue compilable.

La lista completa está en el [registro de cambios](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## Lo que viene

La [hoja de ruta](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) pasa de las facturas a los recursos que hay detrás: primero el costo por recurso, leído de las filas que la exportación a S3 ya proporciona, y luego las relaciones entre recursos: costo agregado a lo largo de la propiedad, huérfanos que todavía cuestan dinero. Las API de facturación de Volcengine, OpenAI y Anthropic siguen pendientes; hasta entonces, sus exportaciones se importan.
