---
title: "0.3.0: trae tu propia factura"
description: "Una factura descargada de una consola ahora se importa en el mismo registro que alimentan las API, la Vista general deja de tomar un costo cubierto por uno barato, y la interfaz se reconstruye con la densidad de una aplicación de escritorio."
date: 2026-09-11
tag: Versión
---

# 0.3.0: trae tu propia factura

<p class="post-meta">2026-09-11&emsp;Versión&emsp;<a href="./">Todos los artículos</a></p>

La 0.2.0 le dio a CloudBridge una tabla de hechos y una moneda. Dejó algo fuera: una API de facturación no siempre es la mejor lectura de una factura, y a veces no es lectura alguna. `QueryBillOverview` de Alibaba Cloud informa Model Studio (百炼) como una sola cifra al mes. La API de DeepSeek informa un saldo y nada sobre en qué se fue el dinero. Volcengine, OpenAI y Anthropic tienen una API de administración para la que quizá no tengas clave.

Pero cada una de esas consolas tiene un botón de Descargar. La 0.3.0 convierte lo que sale de ahí en una vía de primera clase hacia el registro.

## Un segundo canal, no un segundo esquema

Una exportación importada se convierte en las mismas filas de `fct_charge` que produce una consulta. Aguas abajo —el panel, las alertas, el Sankey— un mes importado es indistinguible de uno consultado. Lo que difiere se registra en lugar de ocultarse: `ingest_batch.channel` dice si un periodo llegó por consulta o por importación, y un mes importado nunca se sobrescribe con una consulta automática, **incluso con Forzar actualización**. La exportación es la lectura más fina; «forzar» significa «no confíes en la ventana de frescura», no «tira lo que importé». Para actualizar un mes importado, importa una exportación corregida de ese mes.

Una importación **reemplaza** todos los meses que cubre el archivo. Tiene que hacerlo: la exportación es la factura del propio proveedor, así que añadirla a una lectura por API del mismo mes contaría el mes dos veces.

Cinco fuentes se pueden importar hoy: el detalle de factura de Alibaba Cloud y Volcengine (账单明细), las exportaciones de costos o uso de OpenAI y Anthropic, y DeepSeek.

## Los recuentos de tokens no son dinero

Una exportación de uso trae recuentos de tokens y ningún importe. Esas filas se guardan con `billed_cost` NULL y `cost_basis = absent`; ponerles precio de lista metería en `billed_cost` un número que nadie pagó nunca.

La consola de DeepSeek plantea lo mismo de forma más afilada. Su descarga es un zip con dos CSV: `cost-*.csv`, cuya columna de dinero se llama `cost`, y `amount-*.csv`, cuya columna llamada `amount` es un *recuento de tokens*. Lee el segundo como dinero y un día de 10.787 tokens de entrada en caché se contabiliza como ¥10.787. Así que CloudBridge abre el zip, lee la mitad de costos y rechaza la otra mitad por su nombre. Importas el zip tal como se descargó.

Los nombres de columna, mientras tanto, se emparejan mediante listas de alias que cubren la consola en chino, la consola en inglés y los nombres de campo de la API de cada proveedor: ninguna de estas exportaciones es un formato de archivo documentado. Una columna que no coincide con nada es un error que nombra las columnas que tu archivo sí tiene. Un archivo que no es UTF-8 se rechaza con la instrucción que lo arregla, en lugar de decodificarse con una suposición que destrozaría cada nombre de producto de la factura.

## Lo que un crédito esconde

Un total neto de créditos es el titular correcto: es lo que pagaste. Es la base equivocada para una tendencia. Una cuenta cuyo uso está totalmente cubierto por créditos da un neto de unos 0 $, y un porcentaje mes a mes calculado sobre eso es ruido: una cuenta real produjo −318,9 %.

Por eso la Vista general ahora separa las dos cosas. El titular sigue siendo neto, con el uso bruto y los créditos que lo bajaron mostrados al lado. Todo lo que va en tendencia o en ranking —el gráfico, el porcentaje de cambio, «A dónde se fue», los mayores movimientos— corre sobre el uso bruto. Lo que consumiste y lo que se te facturó son preguntas distintas, y la página ahora responde a ambas en lugar de promediarlas.

El encabezado también lleva un control de rango: mes hasta la fecha, los últimos 30 días móviles o los últimos 12 meses naturales. Cada número de la página se calcula para la ventana que elijas.

## Densidad de escritorio

La interfaz pasa a [GPUI Kit](https://crates.io/crates/gpui-kit) 0.6: una dependencia en lugar de tres, con las gramáticas de tree-sitter desactivadas, porque un panel de costos no tiene por qué compilar una pila de resaltado de sintaxis.

Con eso vino una decisión que el framework deja abierta: esto es una herramienta de datos densa, no una página web. Una fuente base de 13 px y un radio de tarjeta de 6 px se aplican a nivel de aplicación por encima de lo que traiga un archivo de tema. La tarjeta de sincronización de la barra lateral se convirtió en una barra de estado en la parte inferior de la ventana, como una app de escritorio informa su estado. Los tamaños derivan de la escala rem, así que toda la interfaz sigue haciendo zoom con la fuente base.

Y los importes dejaron de redondear el gasto por debajo del dólar a `$0`: unidades enteras a partir de 100, dos decimales a partir de un centavo, y `<$0.01` por debajo de un centavo. Un número pequeño ahora se lee como un número pequeño en lugar de como nada.

## También en 0.3.0

- **Datos de demostración**, en Ajustes: tres cuentas y doce meses de un registro falso con forma realista, cargados y borrados con un botón. Todo lo de demo va bajo un prefijo `demo-`, no guarda credenciales y se salta en la actualización, así que ninguna fila de demo llega jamás a la API de un proveedor.
- **Un elemento de llavero por cuenta, no dos.** En macOS cada lectura del llavero puede abrir un aviso de contraseña: el control de acceso del elemento nombra el binario que lo guardó, así que una recompilación es un binario nuevo. Una actualización que traía varios periodos pagaba ese costo por periodo y por clave. El par ahora es un solo elemento, leído una vez por sesión; un par que aún esté en la antigua forma de dos entradas se migra en la primera lectura.
- **El intervalo de actualización es de 24 horas, y configurable** (6, 12, 24 o 48). Antes era fijo de 6. La factura de un proveedor no se mueve más rápido que un día de ninguna forma que valga la pena pagar.
- **«Resueltas este mes»** en la página de Alertas se basa en cuándo se resolvió una alerta, no en cuándo se generó.
- Las escrituras de Ajustes y el cambio de moneda corren fuera del hilo de UI, y un guardado fallido se muestra en su propio color para que no se confunda con uno guardado.

## Lo que viene

La [hoja de ruta](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) tiene el resto de P1: un canal de *exportación* de archivos de factura (S3 / OSS + Parquet) para las facturas que llegan según un calendario en lugar de por un navegador, y asignación por etiquetas con un nodo explícito de no asignado. Las API de facturación de Volcengine, OpenAI y Anthropic siguen pendientes: esas fuentes están en el registro con la credencial que cada una querrá ya nombrada.
