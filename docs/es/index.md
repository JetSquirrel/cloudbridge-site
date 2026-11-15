---
layout: home
title: "Documentación de CloudBridge — conecta tus facturas, léelas, mantén la vigilancia"
titleTemplate: false
description: "Documentación de CloudBridge: lee las facturas de AWS, Azure, Google Cloud, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic y DeepSeek en un único registro local y mantén la vigilancia."
hero:
  name: Documentación de CloudBridge
  text: Tus facturas de nube e IA, en un solo registro.
  tagline: Conecta cada proveedor, lee adónde fue el dinero y entérate cuando empiece a descontrolarse.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: Empezar
      link: /es/getting-started
    - theme: alt
      text: Probar la demo
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: Acerca de CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/es/
features:
  - title: Conecta tus facturas
    details: AWS, Azure, Alibaba Cloud y Cloudflare a través de sus API de facturación; Google Cloud a través de su export de facturación de BigQuery; Volcengine, OpenAI, Anthropic y DeepSeek a través de los exports que generan sus consolas.
    link: /es/aws
    linkText: Fuentes
  - title: Lee adónde fue
    details: Un Resumen sobre el mes en curso, 30 días o 12 meses, la atribución a líneas de negocio, la economía de tokens por modelo y SQL sobre el registro.
    link: /es/overview
    linkText: Resumen y cuentas
  - title: Encuentra qué recortar
    details: Análisis compara la factura con un escaneo de recursos de solo lectura de AWS y Cloudflare, valorado a partir de la factura y resumido por tipo.
    link: /es/insights
    linkText: Análisis
  - title: Mantén la vigilancia
    details: Reglas, presupuestos y notificaciones, con la aplicación ejecutándose en la barra de menús después de cerrar su ventana y arrancando al iniciar sesión.
    link: /es/background
    linkText: Barra de menús y segundo plano
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ja/">日本語</a>&emsp;<a href="../ko/">한국어</a>&emsp;<a href="../fr/">Français</a>&emsp;<a href="../de/">Deutsch</a>&emsp;<a href="../pt/">Português</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/es/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## Encuentra tu camino

| Quiero… | Lee |
| --- | --- |
| Instalar CloudBridge y ver una primera factura | [Primeros pasos](getting-started.md) |
| Verlo antes de instalar nada | [La demo en el navegador](https://cloudbridge.jetsquirrel.cloud/demo/) |
| Conectar AWS con Cost Explorer o un Data Export | [AWS](aws.md) |
| Conectar una suscripción de Azure | [Microsoft Azure](azure.md) |
| Conectar Google Cloud a través de su export de facturación de BigQuery | [Google Cloud](google-cloud.md) |
| Conectar Alibaba Cloud | [Alibaba Cloud](alibaba-cloud.md) |
| Conectar Cloudflare y dividirlo por bucket, Worker y Durable Object | [Cloudflare](cloudflare.md) |
| Conectar DeepSeek | [DeepSeek](deepseek.md) |
| Importar un export de Volcengine, OpenAI, Anthropic, Alibaba Cloud o DeepSeek | [Importar un archivo de factura](bill-import.md) |
| Dar a CloudBridge el mínimo acceso que necesita | [Permisos de los proveedores](permissions.md) |
| Entender las cifras del Resumen | [Resumen y cuentas](overview.md) |
| Ver a qué línea de negocio pertenece un coste | [Atribución](attribution.md) |
| Ver cuánto cuesta cada modelo de LLM por token | [Modelos](models.md) |
| Encontrar instancias detenidas, direcciones inactivas y recursos sin dueño | [Análisis](insights.md) |
| Cuadrar la factura de un proveedor con el registro | [Conciliación](reconciliation.md) |
| Hacer una pregunta al registro en SQL | [Consulta](query.md) |
| Que te avisen cuando el gasto se dispare o un presupuesto esté cerca | [Alertas, reglas y presupuestos](alerts.md) |
| Enterarte de un Worker o un Durable Object en bucle el primer día, no en la factura | [Detectar un gasto desbocado](cloudflare.md#runaway) |
| Mantener CloudBridge en marcha con la ventana cerrada | [Barra de menús y segundo plano](background.md) |
| Saber qué guarda CloudBridge y hacer copias de seguridad | [Ajustes, datos y seguridad](settings-and-data.md) |
| Arreglar algo que no funciona | [Solución de problemas](troubleshooting.md) |
