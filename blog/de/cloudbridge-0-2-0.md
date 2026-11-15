---
title: "0.2.0: Aus einer Kostenansicht wird ein Hauptbuch"
description: "Belastungen aus allen Quellen landen jetzt in einer einzigen Faktentabelle im FOCUS-Format, die Rohdaten bleiben erhalten, sodass eine Korrektur des Mappings nichts kostet, und eine Summe steht endlich in einer einzigen Währung."
date: 2026-09-01
tag: Version
---

# 0.2.0: Aus einer Kostenansicht wird ein Hauptbuch

<p class="post-meta">2026-09-01&emsp;Version&emsp;<a href="./">Alle Beiträge</a></p>

Version 0.1 zeigte Ihnen eine Zahl pro Anbieter und nannte sie eine Summe. Wenn Sie ein AWS-Konto in Dollar und ein Alibaba-Cloud-Konto in Yuan hatten, addierte die „Summe“ beide. Guthaben wurden als Verbrauch gelesen. Ein Saldo wurde als Ausgabe gelesen. 0.2.0 baut das Fundament neu, auf dem diese Zahlen stehen.

## Eine einzige Faktentabelle

Jede Quelle wird jetzt in eine einzige Faktentabelle normalisiert, `fct_charge`, in einer neuen `billing.duckdb`. Die Spalten sind nach [FOCUS](https://focus.finops.org/) benannt, der offenen Spezifikation für Kosten und Nutzung der FinOps Foundation, sodass ein Guthaben ein `Credit` ist, eine Erstattung eine Erstattung, Steuern und Supportgebühren als solche gekennzeichnet sind und Beträge ihr Vorzeichen behalten. Wenn ein Gutschein von Alibaba Cloud einen Teil einer Belastung abdeckt, erhalten die Bruttobelastung und der Gutschein jeweils eine eigene Zeile, und die Zeilen summieren sich zu dem, was Sie tatsächlich bezahlt haben. Eine Lücke, die sich nicht erklären lässt, wird zu einer `Adjustment`-Zeile, statt zu verschwinden.

Da das Schema bereits FOCUS spricht, kann ein echter Rechnungsexport – ein AWS-CUR oder eine Rechnungsdatei von Alibaba Cloud – später ohne Schemaänderung einfließen.

## Die Rohantworten behalten

Cost Explorer berechnet 0,01 $ pro Anfrage, daher ist zweimal dasselbe zu fragen ein Designfehler, kein Nutzungsmuster. Jede Antwort eines Anbieters wird jetzt unverändert auf die Festplatte geschrieben, als Hive-partitioniertes Parquet unter `raw/` – dasselbe Layout, das ein Bucket für Rechnungsexporte verwendet. Die Normalisierung ist eine reine Funktion von einem gespeicherten Stapel zu Zeilen des Hauptbuchs. Das hat zwei Folgen: Eine Korrektur des Mappings spielt ab, was auf der Festplatte liegt, statt einen weiteren Abruf zu bezahlen, und die Abrechnungslogik ist anhand einer aufgezeichneten Antwort testbar.

## Eine einzige Währung

Belastungen werden in der Währung gespeichert, in der sie abgerechnet wurden, und für die Anzeige umgerechnet, jeweils zu einem Kurs, der nicht später datiert ist als die Belastung selbst. Summen kommen aus einer View, `v_charge_normalized`, sodass das Umschalten der Berichtswährung in den Einstellungen eine View neu aufbaut und nichts neu schreibt. Eine Belastung in einer Währung, die kein Kurs abdeckt, wird im Dashboard gemeldet – nie stillschweigend zum Nennwert mitgezählt.

## Zugangsdaten verlassen die Datenbank

Zugangsdaten liegen jetzt nur noch im Schlüsselbund des Betriebssystems (Windows-Anmeldeinformationsverwaltung, macOS-Schlüsselbund). Die v1-Migration verschiebt alle, die noch in der Datenbank waren, und entfernt die Spalten, die sie enthielten. Die Datenbank lässt sich kopieren, sichern oder inspizieren, ohne dass Ihre Schlüssel mitwandern.

## Abrufen und Normalisieren, getrennt

Eine Abrechnungsquelle war früher eine Enum mit fünf `match`-Zweigen. Jetzt ist sie eine Tabellenzeile mit einem Fähigkeitsdeskriptor, und ihre beiden Methoden sind bewusst getrennt: `fetch` greift auf das Netzwerk zu und interpretiert nichts; `normalize` interpretiert und greift auf nichts zu. Eine Quelle hinzuzufügen heißt, Zeilen und ein Mapping hinzuzufügen, nicht eine Schalttafel zu bearbeiten.

## Außerdem in 0.2.0

- macOS wird als `.dmg` ausgeliefert, das `CloudBridge.app` enthält, statt als gezipptes nacktes Binary, das der Finder für ein Dokument hielt.
- Eine Aktualisierung liest jetzt den aktuellen und den vorherigen Abrechnungszeitraum in zwei Cost-Explorer-Aufrufen ein, wo das Dashboard zuvor drei machte.
- DeepSeek-Salden werden als Momentaufnahmen erfasst; ein Anstieg des aufgeladenen Saldos zwischen zwei Beobachtungen wird als `Purchase` abgeleitet.
- Der Schalter für den Dunkelmodus ändert tatsächlich das Theme.

## Wie es weitergeht

Die [Roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) legt P1 dar: einen Exportkanal für Rechnungsdateien (S3 / OSS + Parquet), tagbasierte Zuordnung mit einem expliziten Knoten „nicht zugeordnet“ und einen Sankey-Kostenfluss. Das Hauptbuch war die Voraussetzung für alle drei – jetzt ist es da.
