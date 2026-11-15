---
title: "Una alarma de Durable Object de 10.811 $"
description: "Un proyecto de Cloudflare inactivo entró en bucle con seis billones de lecturas y escrituras y facturó 10.811,41 $ antes de que nadie lo supiera. Qué pasó, por qué nada avisó a nadie y cómo asegurarte de que algo te avise."
date: 2026-10-10
tag: Incidente
---

# Una alarma de Durable Object de 10.811 $

<p class="post-meta">2026-10-10&emsp;Incidente&emsp;<a href="./">Todos los artículos</a></p>

El 6 de octubre, un desarrollador que publica como [浮世绘 (@shmily7)](https://x.com/shmily7) compartió una factura de Cloudflare por **10.811,41 $**. La causa, en sus palabras: una alarma de Durable Object atrapada en un bucle infinito, dando vueltas a unas seis billones de lecturas y escrituras. El proyecto en sí era solo un prototipo de investigación inactivo que nadie usaba. [El hilo](https://x.com/shmily7/status/2108060782302990699) atrajo cientos de miles de visitas, y bastantes desarrolladores fueron en silencio a mirar sus propios paneles.

![La factura de Cloudflare: 10.811,41 USD, emitida y con vencimiento el 6 de octubre de 2026](../images/cloudflare-invoice.jpg)

<p class="caption">La factura, publicada por <a href="https://x.com/shmily7">@shmily7</a>, con los datos de facturación difuminados por su autor.</p>

La historia terminó bien, así que esa parte primero: Cloudflare ha aceptado reembolsar los cargos. Aun así, la forma en que pasó es bastante común, así que vale la pena desmontarla.

## Qué pasó

- **El bug estuvo 23 días ahí.** Entró durante el desarrollo y luego quedó inactivo, justo hasta que la alarma empezó a reprogramarse a sí misma. Como nada fallaba, no había error ni aviso: cada ejecución tenía éxito y se facturaba.
- **La factura fue la primera señal.** Cloudflare la emitió el 6 de octubre, con vencimiento el mismo día.
- **La pagaron.** Una solicitud de soporte para una exención única chocó con respuestas automáticas, y seguían llegando correos que avisaban de que se suspenderían los servicios de la cuenta, así que el 8 de octubre pagaron el total. Preguntados en las respuestas por qué no simplemente se marchaban, contestaron (en nuestra traducción): *cometes un error, es tuyo: lo asumes de pie.*
- **Luego Cloudflare intervino.** Ashley Peacock lo llevó internamente, el CTO de Cloudflare lo escaló, y el 9 de octubre Cloudflare decidió reembolsar todo lo facturado durante el bug, acompañado de un relato detallado de qué había ido mal.

![La página de pago de Cloudflare con el saldo pendiente de 10.811,41 $ a pagar hoy, en medio del pago](../images/cloudflare-payment.jpg){.portrait}

<p class="caption">Pagando el saldo el 8 de octubre. Publicado por <a href="https://x.com/shmily7">@shmily7</a>; eliminamos el número de factura y los cuatro últimos dígitos de la tarjeta.</p>

No estaban solos. Otros desarrolladores en las respuestas mencionaron facturas de entre 1.000 y 10.000 $, cada una provocada por un bucle o una rutina de sondeo que nadie notó.

## Por qué nada avisó a nadie

Tres cosas se alinearon aquí.

**La facturación no tiene freno.** En un plan de pago, un Durable Object factura por solicitud, por unidad de duración y por fila leída y escrita. Un bucle no se cae; simplemente sigue facturando, y nada detiene una cuenta de pago por uso al llegar a un límite de gasto. Una respuesta señalaba que Cloudflare ha anunciado topes de gasto, con una vista previa prevista para fin de año. Hasta que eso llegue, el techo es lo que la tarjeta aguante.

**Una alarma puede programarse a sí misma.** La forma estándar de manejar trabajo periódico en un Durable Object es un manejador `alarm()` que ejecuta su tarea y llama a `setAlarm()` para la siguiente ejecución. Si el cálculo de esa próxima hora cae en el pasado o justo ahora, el manejador se dispara otra vez de inmediato y sigue, leyendo y escribiendo almacenamiento en cada pasada.

**Nadie estaba mirando.** Un proyecto sin usuarios no tiene gráficos de tráfico que nadie consulte ni registros de errores que revisar, y este bucle nunca lanzó un error. Sin ojos humanos encima, un uso alto nunca se convierte por sí solo en un aviso.

Las dos primeras son cosa de Cloudflare cambiarlas y del desarrollador protegerse. La tercera es donde las herramientas pueden ayudar.

## Lo que un registro diario habría mostrado

CloudBridge trae cada día el uso facturable de Cloudflare y, cuando recibe Account Analytics en el token, divide las líneas de Durable Objects entre espacios de nombres. Vale la pena ser preciso sobre lo que eso habría y no habría hecho en este caso.

- **Habría tenido el bucle al día siguiente.** Las filas de lecturas y escrituras del espacio de nombres llegan al registro a diario, incluida la parte cubierta por la asignación gratuita a costo cero, que es donde empieza un bucle.
- **La regla de anomalía se habría quedado callada.** Evalúa cada servicio contra sus propios siete días previos, y un proyecto que no costaba nada tiene una línea base de cero. Evitamos a propósito marcar una primera aparición como «crecimiento»: la mayor parte del gasto nuevo es simplemente una carga de trabajo nueva, no un desbocado. Aquí ese fue el resultado equivocado, y es un hueco conocido de nuestra lógica.
- **Una regla de presupuesto con previsión se habría disparado en la primera actualización.** La previsión de fin de mes promedia el gasto empezando por el primer día que tuvo cargos, proyectando ese ritmo por el resto del mes. Para poner números: un bucle que factura 300 $ el primer día, con 20 días por delante, se proyecta a más de 6.000 $. Contra un presupuesto mensual modesto de 20 $, esa regla se dispara en la primera actualización que lee el día.
- **No habría detenido nada.** CloudBridge lee facturas con un token de solo lectura. No puede pausar un Worker, y no debería tener el poder de hacerlo. Lo que cambia es tu línea de tiempo: te enteras dentro de un intervalo de actualización (de hasta seis horas) desde que Cloudflare reporta el día, en lugar de esperar a que llegue la factura.

La configuración lleva alrededor de un minuto por cuenta: define un presupuesto mensual, añade una regla de Presupuesto de cuenta basada en la previsión de fin de mes, elige un intervalo de actualización de 6 horas y mantén la app corriendo en la barra de menús. [Atrapa un desbocado](https://cloudbridge.jetsquirrel.cloud/docs/cloudflare#runaway) recorre los pasos. Vale la pena hacerlo también para cuentas tranquilas, porque son precisamente las que nadie está mirando.

## Proteger la propia alarma

Un aviso acorta un desbocado; no lo previene. Dentro del propio Durable Object:

- **Rearma a propósito.** Haz que `alarm()` llame a `setAlarm()` solo cuando haya más trabajo que hacer, y calcula la próxima hora desde ahora con un mínimo, para que nunca pueda programarse en el pasado.
- **Cuenta las ejecuciones.** Mantén un contador en almacenamiento por hora o por día. Cuando pase un techo que ninguna carga de trabajo real debería alcanzar, deja de rearmar y regístralo a gritos.
- **Limpia las alarmas cuando esté inactivo.** Llama a `deleteAlarm()` siempre que un objeto no tenga nada más que hacer.
- **Baja lo que nadie usa.** Un prototipo desplegado sigue atado a una cuenta de facturación viva. Si no hace falta este mes, borra el Worker.

## Lo que viene

Las notas de la versión 0.5.0 decían que los hallazgos de Cloudflare empezarían por los espacios de nombres de Durable Object cuyos objetos mantienen alarmas configuradas. Este es exactamente el caso que está pensado para atrapar. El punto ciego de la regla de anomalía para gasto que empieza en cero es un hueco conocido; hasta que se cierre, la regla de presupuesto lo cubre.

Gracias al autor del hilo por contar toda la historia en público, reembolso incluido.
