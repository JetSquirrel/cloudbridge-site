---
title: "0.3.0: Bringen Sie Ihre eigene Rechnung mit"
description: "Eine aus einer Konsole heruntergeladene Rechnung lässt sich jetzt in dasselbe Hauptbuch importieren, das die APIs speisen, die Übersicht verwechselt eine abgedeckte Belastung nicht länger mit einer günstigen, und die Oberfläche ist auf die Dichte einer Desktop-Anwendung umgebaut."
date: 2026-09-11
tag: Version
---

# 0.3.0: Bringen Sie Ihre eigene Rechnung mit

<p class="post-meta">2026-09-11&emsp;Version&emsp;<a href="./">Alle Beiträge</a></p>

0.2.0 gab CloudBridge eine einzige Faktentabelle und eine einzige Währung. Eines ließ sie aus: Eine Abrechnungs-API ist nicht immer die beste Lesart einer Rechnung, und manchmal ist sie gar keine. `QueryBillOverview` von Alibaba Cloud meldet Model Studio (百炼) als eine einzige Zahl pro Monat. Die API von DeepSeek meldet einen Saldo und nichts darüber, wofür das Geld ausgegeben wurde. Volcengine, OpenAI und Anthropic haben eine Admin-API, für die Sie möglicherweise keinen Schlüssel besitzen.

Aber jede dieser Konsolen hat eine Schaltfläche zum Herunterladen. 0.3.0 macht das, was dabei herauskommt, zu einem vollwertigen Weg ins Hauptbuch.

## Ein zweiter Kanal, kein zweites Schema

Ein importierter Export wird zu denselben `fct_charge`-Zeilen, die ein Abruf erzeugt. Stromabwärts – im Dashboard, in den Warnungen, im Sankey – ist ein importierter Monat nicht von einem abgerufenen zu unterscheiden. Was sich unterscheidet, wird festgehalten statt verborgen: `ingest_batch.channel` sagt, ob ein Zeitraum per Abruf oder per Import ankam, und ein importierter Monat wird nie von einem automatischen Abruf überschrieben, **auch nicht bei „Aktualisierung erzwingen“**. Der Export ist die feinere Lesart; „erzwingen“ heißt „dem Frischefenster nicht trauen“, nicht „wegwerfen, was ich importiert habe“. Um einen importierten Monat zu aktualisieren, importieren Sie einen korrigierten Export davon.

Ein Import **ersetzt** jeden Monat, den die Datei abdeckt. Das muss so sein: Der Export ist die Rechnung des Anbieters selbst, ihn zu einer API-Lesart desselben Monats hinzuzufügen würde den Monat doppelt zählen.

Fünf Quellen lassen sich heute importieren: die Rechnungsdetails von Alibaba Cloud und Volcengine (账单明细), die Kosten- oder Nutzungsexporte von OpenAI und Anthropic sowie DeepSeek.

## Token-Zahlen sind kein Geld

Ein Nutzungsexport enthält Token-Zahlen und keine Beträge. Diese Zeilen werden mit `billed_cost` NULL und `cost_basis = absent` gespeichert – sie zum Listenpreis zu bepreisen würde eine Zahl in `billed_cost` setzen, die niemand je bezahlt hat.

Die Konsole von DeepSeek macht denselben Punkt auf schärfere Weise. Ihr Download ist ein Zip aus zwei CSVs: `cost-*.csv`, deren Geldspalte `cost` heißt, und `amount-*.csv`, deren Spalte `amount` eine *Token-Zahl* ist. Liest man die zweite als Geld, bucht ein Tag mit 10.787 gecachten Eingabe-Tokens als ¥10.787. CloudBridge öffnet also das Zip, liest die Kostenseite und lehnt die andere Seite namentlich ab. Sie importieren das Zip genau so, wie es heruntergeladen wurde.

Spaltennamen werden unterdessen über Aliaslisten abgeglichen, die die chinesische Konsole, die englische Konsole und die API-Feldnamen der einzelnen Anbieter abdecken – keiner dieser Exporte ist ein dokumentiertes Dateiformat. Eine Spalte, die auf nichts passt, ist ein Fehler, der die Spalten nennt, die Ihre Datei tatsächlich hat. Eine Datei, die nicht UTF-8 ist, wird mit der Anweisung abgelehnt, die das behebt, statt mit einer Vermutung dekodiert zu werden, die jeden Produktnamen in der Rechnung verstümmeln würde.

## Was ein Guthaben verdeckt

Eine um Guthaben bereinigte Summe ist die richtige Schlagzeile: Sie ist das, was Sie bezahlt haben. Als Grundlage für einen Trend ist sie falsch. Ein Konto, dessen Verbrauch vollständig durch Guthaben gedeckt ist, ergibt netto etwa 0 $, und eine darauf berechnete prozentuale Veränderung von Monat zu Monat ist Rauschen – ein echtes Konto ergab −318,9 %.

Die Übersicht trennt die beiden nun also. Die Schlagzeile bleibt netto, mit dem Bruttoverbrauch und den Guthaben, die ihn gesenkt haben, daneben. Alles, was als Trend oder als Rangliste dargestellt wird – das Diagramm, die Veränderung in Prozent, „Wohin es ging“, die größten Veränderungen – läuft auf dem Bruttoverbrauch. Was Sie verbraucht haben und was Ihnen berechnet wurde, sind zwei verschiedene Fragen, und die Seite beantwortet jetzt beide, statt sie zu mitteln.

Der Kopfbereich trägt außerdem eine Zeitraumsteuerung: Monat bis heute, die letzten rollierenden 30 Tage oder die letzten 12 Kalendermonate. Jede Zahl auf der Seite wird für den gewählten Zeitraum berechnet.

## Desktop-Dichte

Die Oberfläche wechselt auf [GPUI Kit](https://crates.io/crates/gpui-kit) 0.6 – eine Abhängigkeit statt drei, mit abgeschalteten tree-sitter-Grammatiken, weil ein Kosten-Dashboard keinen Syntax-Highlighting-Stack zu kompilieren braucht.

Damit kam eine Entscheidung, die das Framework offenlässt: Dies ist ein dichtes Datenwerkzeug, keine Webseite. Eine Grundschrift von 13px und ein Kartenradius von 6px werden auf Anwendungsebene über das gelegt, was eine Theme-Datei mitbringt. Die Sync-Karte der Seitenleiste wurde zu einer Statusleiste am unteren Fensterrand, so wie eine Desktop-App ihren Zustand meldet. Größen leiten sich aus der rem-Skala ab, sodass die ganze Oberfläche weiterhin mit der Grundschrift zoomt.

Und Beträge runden Ausgaben unter einem Dollar nicht mehr auf `$0`: ganze Einheiten ab 100, zwei Nachkommastellen ab einem Cent und `<$0.01` unter einem Cent – eine kleine Zahl ist jetzt als kleine Zahl lesbar und nicht als nichts.

## Außerdem in 0.3.0

- **Demodaten**, in den Einstellungen: drei Konten und zwölf Monate realistisch geformtes fiktives Hauptbuch, mit einer Schaltfläche geladen und gelöscht. Alles Demo liegt unter einem Präfix `demo-`, enthält keine Zugangsdaten und wird beim Aktualisieren übersprungen, sodass keine Demo-Zeile je eine Anbieter-API erreicht.
- **Ein Schlüsselbund-Eintrag pro Konto, nicht zwei.** Unter macOS kann jedes Lesen aus dem Schlüsselbund eine Passwortabfrage auslösen – die Zugriffskontrolle des Eintrags nennt das Binary, das ihn gespeichert hat, also ist ein Neubau ein neues Binary. Eine Aktualisierung, die mehrere Zeiträume abrief, zahlte diesen Preis pro Zeitraum und Schlüssel. Das Paar liegt jetzt in einem einzigen Eintrag, einmal pro Sitzung gelesen; ein Paar in der alten Form mit zwei Einträgen migriert beim ersten Lesen.
- **Das Aktualisierungsintervall beträgt 24 Stunden und ist konfigurierbar** (6, 12, 24 oder 48). Es war fest auf 6. Die Rechnung eines Anbieters bewegt sich nicht schneller als einen Tag, auf eine Weise, für die es sich zu zahlen lohnt.
- **„Diesen Monat gelöst“** auf der Seite für Warnungen richtet sich danach, wann eine Warnung gelöst wurde, statt danach, wann sie ausgelöst wurde.
- Schreibvorgänge in den Einstellungen und der Währungswechsel laufen außerhalb des UI-Threads, und ein fehlgeschlagenes Speichern wird in einer eigenen Farbe angezeigt, damit es nicht für ein gespeichertes gehalten werden kann.

## Wie es weitergeht

Die [Roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) enthält den Rest von P1: einen *Export*-Kanal für Rechnungsdateien (S3 / OSS + Parquet) für die Rechnungen, die nach Zeitplan eintreffen statt über einen Browser, und tagbasierte Zuordnung mit einem expliziten Knoten für nicht zugeordnete Kosten. Die Abrechnungs-APIs für Volcengine, OpenAI und Anthropic stehen noch aus – diese Quellen liegen in der Registry, mit den Zugangsdaten, die jede brauchen wird, bereits benannt.
