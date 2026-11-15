---
layout: home
title: "CloudBridge-Dokumentation — Rechnungen verbinden, lesen, im Blick behalten"
titleTemplate: false
description: "CloudBridge-Doku: Lesen Sie Rechnungen von AWS, Azure, Google Cloud, Alibaba Cloud, Cloudflare, Volcengine, OpenAI, Anthropic und DeepSeek in ein lokales Hauptbuch — und behalten Sie die Kosten im Blick."
hero:
  name: CloudBridge-Dokumentation
  text: Ihre Cloud- und KI-Rechnungen, in einem Hauptbuch.
  tagline: Verbinden Sie jeden Anbieter, lesen Sie, wohin das Geld gegangen ist, und lassen Sie sich melden, wenn es aus dem Ruder läuft.
  image:
    src: /assets/logo.png
    alt: CloudBridge
  actions:
    - theme: brand
      text: Erste Schritte
      link: /de/getting-started
    - theme: alt
      text: Die Demo ausprobieren
      link: https://cloudbridge.jetsquirrel.cloud/demo/
    - theme: alt
      text: Über CloudBridge
      link: https://cloudbridge.jetsquirrel.cloud/de/
features:
  - title: Rechnungen verbinden
    details: AWS, Azure, Alibaba Cloud und Cloudflare über ihre Abrechnungs-APIs, Google Cloud über den BigQuery-Abrechnungsexport; Volcengine, OpenAI, Anthropic und DeepSeek über die Exporte, die ihre Konsolen erzeugen.
    link: /de/aws
    linkText: Quellen
  - title: Sehen, wohin es ging
    details: Eine Übersicht über den Monat bis heute, 30 Tage oder 12 Monate, die Zuordnung zu Geschäftsbereichen, Token-Ökonomie pro Modell und SQL über das Hauptbuch.
    link: /de/overview
    linkText: Übersicht und Konten
  - title: Finden, was weg kann
    details: Einblicke stellt der Rechnung einen schreibgeschützten Ressourcenscan von AWS und Cloudflare gegenüber, bepreist aus der Rechnung, zusammengefasst nach Typ.
    link: /de/insights
    linkText: Einblicke
  - title: Den Überblick behalten
    details: Regeln, Budgets und Benachrichtigungen, wobei die App nach dem Schließen ihres Fensters in der Menüleiste weiterläuft und bei der Anmeldung startet.
    link: /de/background
    linkText: Menüleiste und Hintergrund
---

<p align="center"><a href="../">English</a>&emsp;<a href="../zh/">中文</a>&emsp;<a href="../ja/">日本語</a>&emsp;<a href="../ko/">한국어</a>&emsp;<a href="../fr/">Français</a>&emsp;<a href="../es/">Español</a>&emsp;<a href="../pt/">Português</a>&emsp;<a href="https://cloudbridge.jetsquirrel.cloud/de/">cloudbridge.jetsquirrel.cloud</a>&emsp;<a href="https://github.com/JetSquirrel/cloudbridge">GitHub</a></p>

## Finden Sie Ihren Weg

| Ich möchte … | Lesen |
| --- | --- |
| CloudBridge installieren und eine erste Rechnung sehen | [Erste Schritte](getting-started.md) |
| Sehen, wie es aussieht, bevor ich etwas installiere | [Die Browser-Demo](https://cloudbridge.jetsquirrel.cloud/demo/) |
| AWS mit Cost Explorer oder einem Data Export verbinden | [AWS](aws.md) |
| Ein Azure-Abonnement verbinden | [Microsoft Azure](azure.md) |
| Google Cloud über den BigQuery-Abrechnungsexport verbinden | [Google Cloud](google-cloud.md) |
| Alibaba Cloud verbinden | [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare verbinden und nach Bucket, Worker und Durable Object aufteilen | [Cloudflare](cloudflare.md) |
| DeepSeek verbinden | [DeepSeek](deepseek.md) |
| Einen Export von Volcengine, OpenAI, Anthropic, Alibaba Cloud oder DeepSeek importieren | [Rechnungsdatei importieren](bill-import.md) |
| CloudBridge nur den minimal nötigen Zugriff geben | [Berechtigungen der Anbieter](permissions.md) |
| Die Zahlen der Übersicht verstehen | [Übersicht und Konten](overview.md) |
| Sehen, zu welchem Geschäftsbereich ein Kostenposten gehört | [Zuordnung](attribution.md) |
| Sehen, was jedes LLM-Modell pro Token kostet | [Modelle](models.md) |
| Gestoppte Instanzen, ungenutzte Adressen und Ressourcen ohne Eigentümer finden | [Einblicke](insights.md) |
| Die Rechnung eines Anbieters mit dem Hauptbuch abgleichen | [Abgleich](reconciliation.md) |
| Dem Hauptbuch eine Frage in SQL stellen | [Abfrage](query.md) |
| Gemeldet bekommen, wenn die Ausgaben springen oder ein Budget knapp wird | [Warnungen, Regeln und Budgets](alerts.md) |
| Von einem dauerhaft laufenden Worker oder Durable Object am ersten Tag erfahren, nicht erst auf der Rechnung | [Einen Ausreißer erkennen](cloudflare.md#runaway) |
| CloudBridge mit geschlossenem Fenster weiterlaufen lassen | [Menüleiste und Hintergrund](background.md) |
| Wissen, was CloudBridge speichert, und es sichern | [Einstellungen, Daten und Sicherheit](settings-and-data.md) |
| Etwas reparieren, das nicht funktioniert | [Fehlerbehebung](troubleshooting.md) |
