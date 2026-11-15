---
title: "CloudBridge vs OptScale"
description: "Uno es un servidor FinOps para una organización, el otro un registro de escritorio para las facturas de una persona. Cuál encaja depende menos de las funciones que de quién pregunta."
date: 2026-09-24
tag: Comparación
---

# CloudBridge vs OptScale

<p class="post-meta">2026-09-24&emsp;Comparación&emsp;<a href="./">Todos los artículos</a></p>

Ambos proyectos son de código abierto y ambos leen facturas de nube. Están construidos para personas distintas. [OptScale](https://github.com/hystax/optscale), de Hystax, es una plataforma FinOps autohospedada que una organización corre en un servidor para que ingeniería y finanzas compartan una sola vista del gasto en nube y actúen sobre ella. CloudBridge es una app de escritorio que una persona corre en su propia máquina, leyendo sus propias facturas en un archivo local.

Los datos sobre OptScale a continuación están tomados de su README, su repositorio y su documentación a fecha de septiembre de 2026, y se enlazan al final. Si algo de aquí ha quedado desfasado, ganan las fuentes.

## La respuesta corta

Si varias personas necesitan acceso, si tu gasto está en Azure, Google Cloud o Kubernetes, o si lo que quieres es una lista de instancias que redimensionar y compromisos que comprar, usa OptScale. CloudBridge no hace nada de eso.

Si eres un solo desarrollador o un equipo pequeño con una persona mirando la factura, tu gasto se reparte entre AWS, Alibaba Cloud, Volcengine y API de modelos como OpenAI, Anthropic o DeepSeek, y prefieres no correr un servidor para saber cuánto gastaste, CloudBridge es la herramienta más pequeña para eso.

## Qué es OptScale

OptScale se describe a sí mismo como una plataforma de código abierto de FinOps y optimización de costos en nube para AWS, Microsoft Azure, Google Cloud, Alibaba Cloud y clústeres de Kubernetes. Ingiere datos de facturación y uso y, sobre paneles de costos, detecta recursos sin usar e inactivos, recomienda redimensionar, analiza el uso de Reserved Instance, Savings Plan y Spot, y puede detener VM que no son de producción fuera del horario laboral según un calendario de encendido. La gobernanza tiene forma de organización: grupos de recursos con cuotas y presupuestos, políticas de detección de anomalías, políticas de etiquetado, entornos compartidos y cuatro roles base (Member, Engineer, Manager, Organization manager). También cubre Databricks y el análisis de almacenamiento S3.

Es un servidor hecho de muchos servicios. Su repositorio tiene alrededor de veinte directorios de servicio de primer nivel, entre ellos `rest_api`, `auth`, `ngui` para la interfaz web, `risp` para compromisos, `bumiworker` para recomendaciones, y las integraciones con Slack y Jira. Las instalaciones de producción van sobre Kubernetes, montado por los playbooks de Ansible del proyecto en Ubuntu 24.04, con un mínimo declarado de 8 núcleos de CPU, 16 GB de RAM y 150 GB de SSD. Existe un modo Docker Compose solo para evaluación, sobre los mismos 8 núcleos y 16 GB. Su licencia es Apache 2.0.

## Qué es CloudBridge

CloudBridge es una app de escritorio nativa escrita en Rust con [GPUI](https://gpui.rs/), publicada para macOS en Apple Silicon y Windows x64. También hay una [demo en el navegador](https://cloudbridge.jetsquirrel.cloud/demo/) sobre datos de ejemplo. Trae costos de la API de AWS Cost Explorer, la API de facturación de Alibaba Cloud y la API de saldo de DeepSeek, e importa archivos de factura descargados de Alibaba Cloud, Volcengine, OpenAI, Anthropic y DeepSeek. Todo llega a un único registro local de DuckDB, con nombres de columna de [FOCUS](https://focus.finops.org/). Las credenciales van al llavero del sistema operativo. No hay servidor, ni cuenta, ni sincronización, ni telemetría.

Sobre el registro: una Vista general con rangos de mes hasta la fecha, 30 días y 12 meses, atribución por servicio, modelo y etiqueta con una porción no asignada explícita, reglas de alerta para gasto diario inusual, saldos prepagos bajos y costo no asignado, y una moneda de informe construida a partir de una tabla de tipos de cambio con fechas. La rama principal añade reglas de presupuesto mensual, bandas de confianza alrededor de la previsión de fin de mes, una consola SQL de solo lectura sobre el registro y la lectura de exportaciones FOCUS de AWS directamente desde S3. Nada de esto está en una versión etiquetada todavía; la 0.3.2 es la última. La licencia es MIT.

## Lado a lado

| | OptScale | CloudBridge |
| --- | --- | --- |
| Qué corres | Un servidor: Kubernetes en producción, Docker Compose para evaluar | Una app de escritorio en macOS o Windows |
| Huella declarada | 8+ núcleos, 16 GB de RAM, 150+ GB de SSD | Tu portátil |
| Usuarios | Organizaciones, con roles y grupos | Una persona por instalación |
| Dónde viven los datos | Tu servidor de OptScale | Un archivo DuckDB en tu directorio de datos de la app |
| Nubes | AWS, Azure, GCP, Alibaba Cloud, Kubernetes | AWS, Alibaba Cloud, Volcengine |
| Facturas de API de modelos | No figuran en el README de código abierto | OpenAI, Anthropic, DeepSeek, Alibaba Model Studio (百炼), Volcengine Ark (方舟) |
| Cómo entran los datos | Cuentas conectadas | API de facturación, o archivos de factura que descargas |
| Asesoría de optimización | Recursos inactivos, redimensionado, RI/SP/Spot, calendarios de encendido | Ninguna |
| Anomalías y alertas | Detección de anomalías, políticas de cuota y presupuesto | Reglas de gasto diario, saldo y costo no asignado; reglas de presupuesto en main |
| Asignación de costos | Grupos, propietarios, políticas de etiquetado, espacios de nombres y etiquetas de Kubernetes | Servicio, modelo y etiqueta, con la parte no asignada visible |
| Integraciones | Slack, Jira, Databricks | Ninguna |
| Licencia | Apache 2.0 | MIT |
| Costo del software | Gratis para autohospedar; pagas el servidor | Gratis; las tarifas de API del proveedor van aparte |

## Dónde OptScale es la mejor opción

**Más de una persona necesita los números.** OptScale tiene usuarios, roles y un árbol de organización, así que finanzas e ingeniería pueden ver las mismas cifras con el acceso fijado por rol. CloudBridge es un registro en una máquina. Su README dice directamente que los despliegues compartidos y la colaboración en equipo quedan fuera de alcance.

**Tu gasto está en Azure, Google Cloud o Kubernetes.** CloudBridge no soporta ni Azure ni Google Cloud, y no tiene idea de lo que cuesta un espacio de nombres. OptScale cubre los tres, y puede dividir el costo de un clúster por espacio de nombres, carga de trabajo y etiqueta.

**Quieres que te digan qué cambiar.** CloudBridge te dice a dónde se fue el dinero. No te dice que una instancia está sobredimensionada, que un volumen está sin adjuntar o que un Savings Plan se pagaría solo. Eso es el núcleo del valor de OptScale, y CloudBridge no tiene contrapartida.

**Necesitas gobernanza.** Cuotas por grupo, políticas de etiquetado, calendarios de encendido y alertas enviadas a Slack o Jira son herramientas de organización. Las reglas de CloudBridge corren cuando la app está abierta y tras una actualización. Nada corre mientras está cerrada.

Una nota sobre ML: Hystax también ha presentado OptScale como plataforma MLOps, con seguimiento de experimentos, tablas de clasificación y versionado de modelos. En junio de 2025 los servicios `arcee` y `bulldozer`, el agente de perfilado ML y el corredor masivo de experimentos, se eliminaron del repositorio, y el README actual no lista seguimiento de experimentos. Si por eso estás mirando OptScale, comprueba qué incluye realmente la versión que despliegas.

## Dónde encaja CloudBridge

**Una persona, un conjunto de facturas.** Descargar, abrir y ya sea añadir una clave de API o importar una exportación. No hay clúster que instalar ni nada que actualizar salvo la app. Para un desarrollador, el servidor que describen los requisitos mínimos de OptScale es más máquina de la que la pregunta necesita.

**API de modelos junto a la nube.** Para muchos proyectos pequeños la factura más grande ya no es el cómputo. Son los tokens. CloudBridge lee las exportaciones de costos de OpenAI y Anthropic, el gasto diario de DeepSeek, los modelos de Model Studio dentro de una factura de Alibaba Cloud y los endpoints de Ark dentro de una factura de Volcengine, en el mismo registro que la cuenta de AWS. Una exportación de solo uso de tokens sigue siendo uso: no se le pone precio en una factura inventada.

**Nubes chinas, desde sus propias exportaciones.** El 账单明细 de Alibaba Cloud y los archivos de factura de Volcengine se importan tal como salen de la consola, con nombres de columna en chino e inglés reconocidos ambos. OptScale soporta Alibaba Cloud. Volcengine no está en su lista.

**Datos que se quedan donde están.** El registro y las respuestas en bruto de los proveedores se quedan en tu directorio de datos de la app, y las credenciales en el llavero del sistema operativo. Nada va a un tercero, nosotros incluidos. Local no es lo mismo que cifrado, eso sí. CloudBridge no cifra el registro, así que el cifrado del disco sigue siendo cosa tuya.

## ¿Puedes usar los dos?

Sí, y no interfieren. Cada uno lee los datos de facturación del proveedor por su cuenta, y ninguno escribe en una cuenta de nube. Un equipo podría correr OptScale para el gasto compartido de AWS, Azure y Kubernetes, mientras un ingeniero mantiene CloudBridge para las facturas de API de modelos y las cuentas de nubes chinas que OptScale no lee. Dos cosas a vigilar: AWS Cost Explorer cobra por solicitud de API, así que dos herramientas que lo consultan pagan dos veces, y los dos registros no coincidirán línea por línea, porque mapean y convierten los cargos de forma distinta.

## Enlaces

- CloudBridge: [demo en el navegador](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[documentación](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[código fuente](https://github.com/JetSquirrel/cloudbridge)
- OptScale: [repositorio y README](https://github.com/hystax/optscale)&emsp;[documentación](https://hystax.com/documentation/optscale/)&emsp;[roles y permisos](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[detección de anomalías](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[cuotas y presupuestos](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[demo en vivo](https://my.optscale.com/live-demo)
- El commit que eliminó los servicios de ML de OptScale: [OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
