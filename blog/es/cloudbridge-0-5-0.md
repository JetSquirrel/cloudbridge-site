---
title: "0.5.0: sigue vigilando"
description: "CloudBridge se queda en la barra de menús y se actualiza según un calendario, Cloudflare se suma con desglose hasta el bucket y el Durable Object, e Insights escanea AWS y Cloudflare para encontrar qué recortar."
date: 2026-10-08
tag: Versión
---

# 0.5.0: sigue vigilando

<p class="post-meta">2026-10-08&emsp;Versión&emsp;<a href="./">Todos los artículos</a></p>

Una alerta de costo vale algo solo mientras el dinero todavía se está gastando. Hasta ahora CloudBridge traía una factura cuando alguien la abría y pulsaba Actualizar, así que una alerta podía quedarse sin leer todo el tiempo que la ventana siguiera cerrada. Esta versión trata de ese hueco: la app sigue corriendo tras cerrar su ventana, la factura que lee baja hasta el recurso que la gastó, y una actualización que sale mal ya no cuesta nada dos veces.

## Sigue corriendo

En macOS y Windows, cerrar la ventana deja CloudBridge en la barra de menús (el área de notificación en Windows). El título del icono es el gasto del mes, con el número de alertas abiertas al lado cuando las hay. Al hacer clic se abre un panel con el mes hasta la fecha, la previsión de fin de mes, las alertas abiertas y los servicios que más se movieron respecto al mes pasado.

Detrás, un calendario despierta cada 15 minutos, trae las cuentas que tocan, ejecuta las reglas de alerta y publica una notificación del sistema por cada alerta que se dispara. Sigue esperando el intervalo de actualización antes de volver a preguntar a un proveedor, así que cuesta lo que costaría un Actualizar diario. **Abrir al iniciar sesión**, en Ajustes → Segundo plano, lo arranca en la barra de menús tras un reinicio sin abrir la ventana.

Las compilaciones de Linux no tienen icono de bandeja y siguen saliendo con su ventana; el calendario y las notificaciones corren mientras está abierta.

## Cloudflare, hasta el recurso

Cloudflare es la séptima fuente. Un ID de cuenta y un token de API con Billing → Read leen su uso facturable: gasto por servicio, por día. Lo diario importa aquí. Un Worker o un Durable Object que empieza a dar vueltas está en el registro al día siguiente, no en la factura a fin de mes.

La factura, eso sí, se detiene en el servicio: «operaciones Clase B de R2, 734 el 3 de octubre», no en qué bucket. Añade Account Analytics → Read al token y CloudBridge pide a la API GraphQL Analytics de Cloudflare el uso de cada recurso de los medidores que la factura nombra, y luego divide la fila de cada día por esas proporciones. Los buckets de R2, los Workers, las bases de datos D1 y los espacios de nombres de Durable Object reciben cada uno su parte, y las partes siguen sumando lo que Cloudflare facturó. Se marcan como estimaciones, porque la analítica es muestreada y una asignación gratuita pertenece a la cuenta, no a un recurso concreto.

El uso dentro de la asignación gratuita también se conserva, con un costo de cero al lado. Ahí es normalmente donde empieza un desbocado: el uso sube durante días antes de que se facture el primer centavo.

## Insights: qué recortar

Insights compara la factura con lo que realmente está corriendo. Es opcional: **Configurar y escanear** pregunta primero, luego instala una compilación fijada y verificada con checksum de [corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist), nuestro fork, que escanea cada cuenta en solo lectura.

Para AWS encuentra instancias detenidas cuyos volúmenes siguen facturando, direcciones IPv4 públicas inactivas, recursos sin etiqueta de propietario y sin stack que los gestione, y recursos que se facturan pero faltan en el escaneo. Cada uno se valora a partir de la factura cuando la cuenta lee su Data Export. Para Cloudflare lista Workers, buckets de R2, bases de datos D1, espacios de nombres de KV, zonas y Durable Objects, cada uno con su parte de la factura y su uso de este periodo.

Una cuenta grande ya no inunda la página. Cada tarjeta se abre en un resumen por tipo, con recuentos y costo, y lista recursos solo cuando abres un tipo, de cincuenta en cincuenta.

## Nada pagado dos veces

Auditamos lo que CloudBridge mismo puede costarte, ahora que se actualiza solo:

- **Una ingesta fallida no se vuelve a traer dentro del intervalo de actualización.** Si AWS respondió a una solicitud y luego falló el guardado de la respuesta (un disco lleno, un bug de mapeo), el calendario solía comprar los mismos datos otra vez cada 15 minutos. Ahora espera a que pase el intervalo y dice por qué; Forzar actualización sigue reintentando de inmediato.
- **Una cuenta que falla se reintenta cada vez menos.** La espera empieza en 15 minutos y se duplica hasta el intervalo de actualización, y una notificación dice que la cuenta ha dejado de actualizarse.
- **Un mes de AWS Data Export que no ha cambiado no se descarga de nuevo.** Primero se comprueban los ETags de sus archivos.
- **Los meses de Cost Explorer se leen enteros.** Un mes grande vuelve por páginas, y antes solo se leía la primera. Cada página extra es una solicitud facturada, con un tope de 20.

## Cosas menores

- **Las categorías de servicio significan lo mismo en cada nube.** ECS, EC2 y el ECS de Volcengine son todos Compute / Virtual Machines, así que la vista Categoría de la página de Atribución compara nubes. Un registro existente se migra en la primera apertura.
- **Una página de inicio que muestra lo que lee.** El sitio de documentación lista cada nube y cada plataforma de modelos compatible con su logo.

La lista completa está en el [registro de cambios](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## Lo que viene

Hallazgos propios de Cloudflare, empezando por los espacios de nombres de Durable Object cuyos objetos mantienen alarmas configuradas, necesitan un escaneo real para juzgarlos. Las API de facturación de Volcengine, OpenAI y Anthropic siguen pendientes; hasta entonces, sus exportaciones se importan.
