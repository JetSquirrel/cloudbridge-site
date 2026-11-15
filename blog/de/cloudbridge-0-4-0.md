---
title: "0.4.0: Mehr Wege hinein, mehr Wege, es zu lesen"
description: "AWS Data Exports direkt aus S3, eine Seite für Modelle mit den Kosten jedes LLM-Modells pro Token, eine schreibgeschützte SQL-Konsole, monatliche Budgets – und die ganze App in einem Browser."
date: 2026-10-05
tag: Version
---

# 0.4.0: Mehr Wege hinein, mehr Wege, es zu lesen

<p class="post-meta">2026-10-05&emsp;Version&emsp;<a href="./">Alle Beiträge</a></p>

0.3.0 brachte jede Rechnung in ein einziges Hauptbuch; 0.3.1 brachte die Oberfläche mit sich selbst in Einklang. 0.4.0 arbeitet an beiden Enden dieses Hauptbuchs. Hinein: Ein AWS-Konto kann seine Rechnung jetzt aus dem Export lesen, den AWS nach S3 schreibt, statt Cost Explorer danach zu fragen. Hinaus: Es gibt vier neue Arten, das zu lesen, was schon da ist – pro Modell, pro Dimension, gegen ein Budget und in SQL. Und dieselbe Anwendung läuft jetzt in einem Browser, sodass Sie all das ausprobieren können, bevor Sie irgendetwas installieren.

## AWS Data Exports, aus S3 gelesen

Cost Explorer antwortet mit Summen, und jede Frage kostet eine Anfrage. Die Data Exports von AWS (CUR 2.0, in der Form „FOCUS 1.2 with AWS columns“) schreiben die vollständige Rechnung – Ressourcen-IDs, Tags, das verknüpfte Konto, unter dem jede Zeile abgerechnet wurde – in einen S3-Bucket, den Sie besitzen. Geben Sie einem AWS-Konto die URI `s3://bucket/prefix` des Exports, und Aktualisieren liest von dort: Parquet oder gzip-komprimiertes CSV, je nachdem, worauf der Export eingestellt ist.

Ein paar Dinge, die es richtig macht und die leicht falsch zu machen sind:

- **Ein Monat wird einmal gezählt.** Ein Export, der auf „neu erstellen“ eingestellt ist, hält jede Lieferung nebeneinander. CloudBridge liest nur die Dateien, die das Manifest des Zeitraums nennt, sodass zwölf Aktualisierungen des Septembers immer noch ein September sind.
- **Nicht geliefert ist nicht null.** Ein Zeitraum, den der Export noch nicht geschrieben hat, wird übersprungen und nie als leerer Monat gespeichert.
- **Der Export eines Zahlers splittet nach Mitgliedskonto.** Jede Zeile behält ihre `SubAccountId` und `SubAccountName`.

S3-Speicher- und Anfragegebühren fallen weiterhin an, und die Cost-Explorer-Richtlinie gewährt keinen S3-Zugriff – die [Berechtigungsseite](https://cloudbridge.jetsquirrel.cloud/docs/permissions#aws-s3) enthält die enge Richtlinie, die der Exportkanal braucht. Konten ohne URI verwenden weiterhin Cost Explorer.

## Die Seite für Modelle

Das Hauptbuch speichert seit 0.2.0 Token-Mengen neben LLM-Kosten; nichts las sie. Die neue Seite für Modelle tut das. Für den gewählten Zeitraum bekommt jedes Modell seine Kosten und Veränderung, seine Eingabe-, Ausgabe- und Cache-Tokens, gemischte Kosten pro Million Tokens und seinen Cache-Anteil, mit einem täglichen Token-Diagramm darunter.

Sie sagt auch, was auffällt. Ein Modell, dessen Cache-Lesungen unter 5 % seiner Eingabeseite liegen, zahlt Eingabepreis für das, was Cache-Preis sein könnte. Ein Modell, das mehr als 70 % der Modellausgaben trägt, sollte man kennen. Ein Modell, das ohne Token-Messung abgerechnet wird, wird als solches markiert, weil seine Stückkosten nicht berechnet werden können. Und ein Ausgabenanstieg wird gegen die Token-Zahlen der beiden Zeiträume geprüft: Wenn die zusätzlichen Tokens den Anstieg erklären, ist es Nutzung, und nur wenn sie es nicht tun, wird er als steigender Stückpreis gemeldet.

Modellnamen, die im Abrechnungspositionstext von Alibaba Cloud und Volcengine vergraben sind, werden noch nicht extrahiert; Importe von OpenAI, Anthropic und DeepSeek benennen ihre Modelle direkt.

## Weitere Arten, das Hauptbuch zu lesen

- **Abfrage.** Eine schreibgeschützte SQL-Konsole über das lokale DuckDB-Hauptbuch, mit Vorlagen zum Einstieg. Es laufen nur lesende Anweisungen, und das Hauptbuch wird für sie ohnehin schreibgeschützt geöffnet. Nur Desktop.
- **Budgets.** Die Seite für Regeln enthält ein Monatsbudget pro Konto, und eine Regel „Kontobudget“ warnt bei einem Prozentsatz oder einem Betrag, gegen die bisher aufgelaufenen Kosten oder die Prognose zum Monatsende. Auch Anomalie-Regeln lassen sich jetzt auf ein Konto beschränken.
- **Aufschlüsselung nach Dimension.** Die Zuordnung wechselt zwischen Tag, Dienst, Region und Dienstkategorie, gezeichnet als Treemap – Fläche sind die Kosten, Farbe ist die Veränderung – oder als Anteilsbalken, mit den teuersten Ressourcen des Zeitraums daneben. Die Detailseite eines Kontos hat denselben Drill-down.
- **Datenqualität.** Befunde dazu, was eine Summe weniger verlässlich macht, als sie aussieht: Währungen, die die Kurstabelle nicht umrechnen kann, Nutzung ohne Zuordnungs-Tag oder ohne Region, Anpassungen, die keine Belastung erklärt. Verwerfen Sie einen, bleibt er für diesen Zeitraum verworfen.

## CloudBridge in einem Browser

Das Crate baut jetzt auch für WebAssembly. Die [Demo](https://cloudbridge.jetsquirrel.cloud/demo/) ist kein Mock-up: Die Seiten, View-Models und Warnungsregeln sind der Code der Desktop-App selbst, laufen über einem Hauptbuch im Arbeitsspeicher, das mit der Demo-Rechnung anstelle von DuckDB, den Anbieter-APIs und dem Schlüsselbund bestückt ist. Abfrage, Regeln und Einstellungen bleiben auf dem Desktop; alles andere, die Seite für Modelle eingeschlossen, ist da.

Damit das so bleibt, baut CI die Browserversion als erforderliche Prüfung, und die Statistiken, die beide Builds berechnen – Prognosen, Vergleiche, Zerlegungen, Befunde – liegen in einem gemeinsamen, getesteten Modul statt in einer Kopie pro Backend.

## Kleinere Dinge

- **Das Löschen eines Kontos fragt nach seinem Verlauf.** Vorher blieben die Belastungen still zurück und zählten in Summen weiter, ohne dass ein Konto sie erklärte. Der Löschdialog bietet jetzt an, sie zu entfernen, und ein Verlauf, der von einem früheren Löschen übrig blieb, wird auf der Kontenseite aufgeführt, wo er entfernt werden kann.
- **Ein erster Start, der irgendwohin führt.** Eine leere Übersicht bietet an, ein Konto hinzuzufügen oder die Demo-Rechnung zu laden, und das Speichern eines API-Kontos ruft seine Rechnung sofort ab.
- **Tastenkürzel.** ⌘1–⌘9 wechseln die Seite, ⌘R lädt neu.
- **Das Fenster öffnet zuerst.** Stores öffnen und Seiten laden im Hintergrund, jede Seite bei ihrem ersten Besuch.
- **Die Füllung des Ausgabendiagramms** schneidet keinen diagonalen Keil mehr durch das Diagramm.
- **Sicherheit:** rustls und quick-xml sind über drei RUSTSEC-Hinweise hinaus aktualisiert.
- **Rust 1.95** ist das erklärte Minimum; die alte Angabe war nie baubar.

Die vollständige Liste steht im [Changelog](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## Wie es weitergeht

Die [Roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) wendet sich von den Rechnungen zu den Ressourcen dahinter: zuerst Kosten pro Ressource, gelesen aus den Zeilen, die der S3-Export bereits liefert, und dann die Beziehungen zwischen Ressourcen – Kosten, entlang der Eigentümerschaft zusammengefasst, Waisen, die noch Geld kosten. Die Abrechnungs-APIs für Volcengine, OpenAI und Anthropic stehen weiterhin aus; bis dahin werden ihre Exporte importiert.
