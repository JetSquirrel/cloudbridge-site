---
title: "CloudBridge im Vergleich zu OptScale"
description: "Das eine ist ein FinOps-Server für eine Organisation, das andere ein Desktop-Hauptbuch für die Rechnungen einer einzelnen Person. Welches passt, hängt weniger vom Funktionsumfang ab als davon, wer fragt."
date: 2026-09-24
tag: Vergleich
---

# CloudBridge im Vergleich zu OptScale

<p class="post-meta">2026-09-24&emsp;Vergleich&emsp;<a href="./">Alle Beiträge</a></p>

Beide Projekte sind Open Source, und beide lesen Cloud-Rechnungen. Sie sind für unterschiedliche Menschen gebaut. [OptScale](https://github.com/hystax/optscale), von Hystax, ist eine selbst gehostete FinOps-Plattform, die eine Organisation auf einem Server betreibt, damit Engineering und Finanzen eine gemeinsame Sicht auf die Cloud-Ausgaben teilen und darauf reagieren können. CloudBridge ist eine Desktop-App, die eine Person auf dem eigenen Rechner betreibt und die eigenen Rechnungen in eine lokale Datei liest.

Die folgenden Angaben zu OptScale stammen aus seinem README, seinem Repository und seiner Dokumentation mit Stand September 2026 und sind am Ende verlinkt. Sollte etwas hier veraltet sein, gewinnen die Quellen.

## Die kurze Antwort

Wenn mehrere Personen Zugriff brauchen, wenn Ihre Ausgaben auf Azure, Google Cloud oder Kubernetes liegen, oder wenn Sie eine Liste von Instanzen zum Anpassen und von Commitments zum Kaufen wollen, verwenden Sie OptScale. CloudBridge tut nichts davon.

Wenn Sie ein Entwickler oder ein kleines Team mit einer Person sind, die die Rechnung im Blick behält, Ihre Ausgaben sich über AWS, Alibaba Cloud, Volcengine und Modell-APIs wie OpenAI, Anthropic oder DeepSeek verteilen und Sie lieber keinen Server betreiben wollen, um herauszufinden, was Sie ausgegeben haben, dann ist CloudBridge das kleinere Werkzeug dafür.

## Was OptScale ist

OptScale beschreibt sich selbst als Open-Source-Plattform für FinOps und Cloud-Kostenoptimierung für AWS, Microsoft Azure, Google Cloud, Alibaba Cloud und Kubernetes-Cluster. Sie liest Abrechnungs- und Nutzungsdaten ein und erkennt über Kosten-Dashboards hinaus ungenutzte und im Leerlauf befindliche Ressourcen, empfiehlt Rightsizing, analysiert die Nutzung von Reserved Instances, Savings Plans und Spot und kann Nicht-Produktions-VMs außerhalb der Arbeitszeiten nach einem Stromplan stoppen. Governance ist organisationsförmig: Pools von Ressourcen mit Quotas und Budgets, Richtlinien zur Anomalieerkennung, Tagging-Richtlinien, geteilte Umgebungen und vier Basisrollen (Member, Engineer, Manager, Organization manager). Außerdem deckt es Databricks und die Analyse von S3-Speicher ab.

Es ist ein Server aus vielen Diensten. Sein Repository hat rund zwanzig Verzeichnisse für Dienste auf oberster Ebene, darunter `rest_api`, `auth`, `ngui` für die Weboberfläche, `risp` für Commitments, `bumiworker` für Empfehlungen sowie Slack- und Jira-Integrationen. Produktionsinstallationen laufen auf Kubernetes, eingerichtet durch die Ansible-Playbooks des Projekts auf Ubuntu 24.04, mit einem angegebenen Minimum von 8 CPU-Kernen, 16 GB RAM und 150 GB SSD. Ein Docker-Compose-Modus existiert nur zur Evaluierung, auf denselben 8 Kernen und 16 GB. Es steht unter der Apache-2.0-Lizenz.

## Was CloudBridge ist

CloudBridge ist eine native Desktop-App, geschrieben in Rust mit [GPUI](https://gpui.rs/), veröffentlicht für macOS auf Apple Silicon und Windows x64. Es gibt außerdem eine [Browser-Demo](https://cloudbridge.jetsquirrel.cloud/demo/), die mit Beispieldaten läuft. Sie zieht Kosten aus der AWS-Cost-Explorer-API, der Abrechnungs-API von Alibaba Cloud und der Saldo-API von DeepSeek und importiert Rechnungsdateien, die aus Alibaba Cloud, Volcengine, OpenAI, Anthropic und DeepSeek heruntergeladen wurden. Alles landet in einem lokalen DuckDB-Hauptbuch mit Spaltennamen aus [FOCUS](https://focus.finops.org/). Zugangsdaten gehen in den Schlüsselbund des Betriebssystems. Es gibt keinen Server, kein Konto, keine Synchronisierung und keine Telemetrie.

Auf dem Hauptbuch aufbauend: eine Übersicht mit Ansichten für den Monat bis heute, für 30 Tage und für 12 Monate, Zuordnung nach Dienst, Modell und Tag mit einem expliziten Anteil nicht zugeordneter Kosten, Warnungsregeln für ungewöhnliche Tagesausgaben, niedrige vorausbezahlte Salden und nicht zugeordnete Kosten sowie eine Berichtswährung, gebildet aus einer datierten Wechselkurstabelle. Der Hauptzweig ergänzt monatliche Budgetregeln, Konfidenzbänder um die Prognose zum Monatsende, eine schreibgeschützte SQL-Konsole über das Hauptbuch und das Lesen von AWS-FOCUS-Exporten direkt aus S3. Nichts davon ist in einem getaggten Release; 0.3.2 ist das neueste. Die Lizenz ist MIT.

## Direkter Vergleich

| | OptScale | CloudBridge |
| --- | --- | --- |
| Was Sie betreiben | Einen Server: Kubernetes in der Produktion, Docker Compose zur Evaluierung | Eine Desktop-App unter macOS oder Windows |
| Angegebener Ressourcenbedarf | 8+ Kerne, 16 GB RAM, 150+ GB SSD | Ihr Notebook |
| Nutzer | Organisationen, mit Rollen und Pools | Eine Person pro Installation |
| Wo die Daten liegen | Ihr OptScale-Server | Eine DuckDB-Datei in Ihrem App-Datenverzeichnis |
| Clouds | AWS, Azure, GCP, Alibaba Cloud, Kubernetes | AWS, Alibaba Cloud, Volcengine |
| Rechnungen von Modell-APIs | Im Open-Source-README nicht aufgeführt | OpenAI, Anthropic, DeepSeek, Alibaba Model Studio (百炼), Volcengine Ark (方舟) |
| Wie die Daten hereinkommen | Verbundene Konten | Abrechnungs-APIs oder Rechnungsdateien, die Sie herunterladen |
| Optimierungsempfehlungen | Ressourcen im Leerlauf, Rightsizing, RI/SP/Spot, Strompläne | Keine |
| Anomalien und Warnungen | Anomalieerkennung, Quota- und Budgetrichtlinien | Regeln für Tagesausgaben, Salden und nicht zugeordnete Kosten; Budgetregeln im Hauptzweig |
| Kostenzuordnung | Pools, Eigentümer, Tagging-Richtlinien, Kubernetes-Namespaces und -Labels | Dienst, Modell und Tag, mit angezeigtem Anteil nicht zugeordneter Kosten |
| Integrationen | Slack, Jira, Databricks | Keine |
| Lizenz | Apache 2.0 | MIT |
| Kosten der Software | Selbst hosten kostenlos; Sie zahlen für den Server | Kostenlos; Anbieter-API-Gebühren kommen separat hinzu |

## Wo OptScale die bessere Wahl ist

**Mehr als eine Person braucht die Zahlen.** OptScale hat Benutzer, Rollen und einen Organisationsbaum, sodass Finanzen und Engineering dieselben Zahlen sehen können, mit rollenbasiertem Zugriff. CloudBridge ist ein Hauptbuch auf einer Maschine. Sein README sagt ausdrücklich, dass geteilte Installationen und Teamzusammenarbeit außerhalb des Rahmens liegen.

**Ihre Ausgaben liegen auf Azure, Google Cloud oder Kubernetes.** CloudBridge unterstützt weder Azure noch Google Cloud und hat keine Ahnung, was ein Namespace kostet. OptScale deckt alle drei ab und kann die Kosten eines Clusters nach Namespace, Workload und Label aufteilen.

**Sie wollen gesagt bekommen, was Sie ändern sollen.** CloudBridge sagt Ihnen, wohin das Geld gegangen ist. Es sagt Ihnen nicht, dass eine Instanz überdimensioniert ist, ein Volume nicht angehängt ist oder ein Savings Plan sich selbst bezahlen würde. Das ist der Kern des Werts von OptScale, und CloudBridge hat nichts Entsprechendes.

**Sie brauchen Governance.** Quotas pro Pool, Tagging-Richtlinien, Strompläne und Warnungen an Slack oder Jira sind Organisationswerkzeuge. Die Regeln von CloudBridge laufen, wenn die App offen ist, und nach einer Aktualisierung. Solange sie geschlossen ist, läuft nichts.

Ein Hinweis zu ML: Hystax hat OptScale auch als MLOps-Plattform präsentiert, mit Experiment-Tracking, Bestenlisten und Modellversionierung. Im Juni 2025 wurden die Dienste `arcee` und `bulldozer`, der ML-Profiling-Agent und der Bulk-Experiment-Runner, aus dem Repository entfernt, und das aktuelle README führt kein Experiment-Tracking auf. Wenn das der Grund ist, warum Sie OptScale ansehen, prüfen Sie, was die Version, die Sie einsetzen, tatsächlich enthält.

## Wo CloudBridge passt

**Eine Person, ein Satz Rechnungen.** Herunterladen, öffnen und entweder einen API-Schlüssel hinzufügen oder einen Export importieren. Es gibt keinen Cluster zu installieren und nichts zu aktualisieren außer der App. Für einen Entwickler ist der Server, den die Mindestanforderungen von OptScale beschreiben, mehr Maschine, als die Frage braucht.

**Modell-APIs neben der Cloud.** Für viele kleine Projekte ist die größte Rechnung nicht mehr Rechenleistung. Es sind Tokens. CloudBridge liest die Kostenexporte von OpenAI und Anthropic, die Tagesausgaben von DeepSeek, Model-Studio-Modelle innerhalb einer Alibaba-Cloud-Rechnung und Ark-Endpunkte innerhalb einer Volcengine-Rechnung in dasselbe Hauptbuch wie das AWS-Konto. Ein Nutzungsexport, der nur Tokens enthält, bleibt Nutzung: Er wird nicht in eine erfundene Rechnung bepreist.

**Chinesische Clouds, aus ihren eigenen Exporten.** Die 账单明细 von Alibaba Cloud und die Rechnungsdateien von Volcengine werden so importiert, wie sie aus der Konsole kommen, mit erkannten chinesischen und englischen Spaltennamen. OptScale unterstützt Alibaba Cloud. Volcengine steht nicht auf seiner Liste.

**Daten, die bleiben, wo sie sind.** Das Hauptbuch und die Rohantworten der Anbieter bleiben in Ihrem App-Datenverzeichnis, und Zugangsdaten bleiben im Schlüsselbund des Betriebssystems. Nichts geht an Dritte, uns eingeschlossen. Lokal ist allerdings nicht dasselbe wie verschlüsselt. CloudBridge verschlüsselt das Hauptbuch nicht, Festplattenverschlüsselung bleibt also Ihre Aufgabe.

## Kann man beides verwenden?

Ja, und sie stören sich nicht. Jedes liest die Abrechnungsdaten des Anbieters für sich, und keines schreibt in ein Cloud-Konto. Ein Team könnte OptScale für geteilte AWS-, Azure- und Kubernetes-Ausgaben betreiben, während ein Entwickler CloudBridge für die Rechnungen von Modell-APIs und chinesischen Clouds behält, die OptScale nicht liest. Zwei Dinge sind zu beachten: AWS Cost Explorer berechnet pro API-Anfrage, zwei Werkzeuge, die ihn abfragen, zahlen also doppelt, und die beiden Hauptbücher werden nicht Zeile für Zeile übereinstimmen, weil sie Belastungen unterschiedlich abbilden und umrechnen.

## Links

- CloudBridge: [Browser-Demo](https://cloudbridge.jetsquirrel.cloud/demo/)&emsp;[Dokumentation](https://cloudbridge.jetsquirrel.cloud/docs/)&emsp;[Quellcode](https://github.com/JetSquirrel/cloudbridge)
- OptScale: [Repository und README](https://github.com/hystax/optscale)&emsp;[Dokumentation](https://hystax.com/documentation/optscale/)&emsp;[Rollen und Berechtigungen](https://hystax.com/documentation/optscale/roles-and-permissions.html)&emsp;[Anomalieerkennung](https://hystax.com/documentation/optscale/anomaly-detection.html)&emsp;[Quotas und Budgets](https://hystax.com/documentation/optscale/quotas-and-budgets.html)&emsp;[Live-Demo](https://my.optscale.com/live-demo)
- Der Commit, der die ML-Dienste von OptScale entfernt hat: [OSN-943](https://github.com/hystax/optscale/commit/a20a22259582bda9181956618f05f2f2072a871d)
