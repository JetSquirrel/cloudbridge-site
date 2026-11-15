---
title: "Übersicht: Nettoausgaben, Prognose und Konten"
description: "Wie die Übersicht von CloudBridge Ausgaben liest: netto und brutto, Gutschriften, die Prognose, größte Veränderungen und nicht zugeordnete Nutzung, dazu Konten und Datenzustand."
---

# Übersicht und Konten

**[English](../overview.md)**&emsp;**[中文](../zh/overview.md)**&emsp;**[日本語](../ja/overview.md)**&emsp;**[한국어](../ko/overview.md)**&emsp;**[Français](../fr/overview.md)**&emsp;**[Español](../es/overview.md)**&emsp;**[Português](../pt/overview.md)**&emsp;[Dokumentation](index.md)

## Die Übersicht {#overview}

Die Kopfzeile enthält eine Bereichsauswahl — **MTD**, **30d** oder **12m** —,
und jede Zahl auf der Seite wird für das gewählte Fenster berechnet.

- Die hervorgehobenen **Ausgaben** sind netto nach Gutschriften: was Ihnen
  tatsächlich berechnet wurde. Die Bruttonutzung und die Gutschriften, die sie
  gesenkt haben, stehen daneben.
- Das **Diagramm**, die prozentuale Veränderung, **Wohin es ging** und die
  **größten Veränderungen** beruhen auf der Bruttonutzung. Ein Konto, dessen
  Nutzungsgutschriften alles decken, ergibt netto etwa null, und ein auf dieser
  Basis gezeichneter Trend ist Rauschen.
- Für **MTD** prognostiziert eine zweite Karte das Monatsende aus der aktuellen
  Rate, mit einem optimistischen und einem pessimistischen Band.
- **Nicht zugeordnet** ist der Anteil der Nutzung, der keinen Geschäftsbereich
  erreicht — der Teil der Rechnung, den Sie noch nicht erklären können. Siehe
  [Zuordnung](attribution.md).
- Wenn Kosten im Bereich keinen Wechselkurs haben, weist eine Warnung darauf
  hin, dass sie nicht in die Summen eingehen.

Beim Überfahren eines Diagramms rastet der Zeiger auf den nächsten Punkt ein und
zeigt Datum und Betrag dieses Abschnitts. **Aktualisieren** ruft Konten ab, deren
Daten älter als das Aktualisierungsintervall sind; **Aktualisierung erzwingen**
ruft alle ab — siehe [was es kostet](aws.md#cost).

## Ein Konto im Detail {#account}

Klicken Sie auf der Seite **Konten** auf den Namen eines Kontos, um es zu
öffnen: dieselbe Bereichsauswahl, eine Zeile mit netto / brutto / Gutschriften,
der Nutzungstrend dieses Kontos und eine Tabelle pro Dienst mit Anteil und
Veränderung jedes Dienstes. Auch die Dimensionsaufschlüsselung wie unter
[Zuordnung](attribution.md) ist dort.

## Einen monatlichen Kostenbericht exportieren {#report}

**Bericht exportieren** in der Übersicht speichert einen Monat als einzelne
HTML-Datei, bereit zum Drucken oder Teilen. Wählen Sie einen Monat — die
Auswahl beginnt beim neuesten abgeschlossenen —, dann **Datei wählen und
exportieren**, und wählen Sie den Speicherort. Die Datei lädt nichts von
anderswo, und nichts wird hochgeladen. Dafür ist CloudBridge 0.9.0 oder neuer in
der Desktop-App nötig: Die Browser-Demo hat keinen Export.

Der Bericht umfasst jedes Konto in der Berichtswährung, und es gibt keine
Anbieter- oder Kontofilter. Er enthält:

- Nettokosten, Nutzung und Gutschriften sowie die Veränderung zum Vormonat;
- **Kosten nach Dienst**, **Nettokosten nach Region** und **Nutzung nach
  Geschäftsbereich**;
- **Prognose und Budgets**, für einen noch laufenden Monat;
- **Datenzustand**, die wichtigsten **Einblicke** und **Quellen**, die
  auflisten, woher die Daten jeder Quelle stammen und wann sie zuletzt
  übernommen wurden;
- **Was diese Zahlen auslassen**, etwa Kosten ohne Wechselkurs, Nutzungszeilen
  ohne Betrag oder einen Bestand, der nie oder nur teilweise gescannt wurde.

Ein noch laufender Monat zeigt Zahlen bis heute und keine Veränderung, weil die
Spalte des Vormonats einen ganzen Monat umfasst. Der Bericht nennt Konten,
Dienste und Ressourcen, lesen Sie ihn daher, bevor Sie ihn außerhalb Ihres Teams
weitergeben.

## Einen Monat einfrieren {#snapshots}

Das Hauptbuch ändert sich fortlaufend: Eine Aktualisierung oder ein Import kann
einen Monat umschreiben, und Anbieter korrigieren Rechnungen nach Monatsende.
**Monatsende-Snapshots** auf der Seite eines Kontos bewahren eine unveränderliche
Kopie auf, um den Monat später abzuschließen. Dafür ist CloudBridge 0.9.0 oder
neuer nötig. Um eine Kopie mit der Rechnung des Anbieters zu vergleichen, siehe
[Abgleich](reconciliation.md#snapshot).

Wählen Sie den Monat und klicken Sie auf **Zeitraum einfrieren**. Ein Dialog
sagt, wie viele Kostenpositionen die Kopie enthalten wird und welche Summe sie
ergeben. Die Kopie bewahrt diese Kostenpositionen, die Summen pro
Abrechnungswährung, die verwendeten Wechselkurse und die Herkunft der Rechnung;
keine spätere Aktualisierung oder Import ändert sie.

- **Vergleich mit dem Hauptbuch.** Jede Revision zeigt **Stimmt mit dem
  Hauptbuch überein** oder **Weicht vom Hauptbuch ab**, mit Tabellen nach
  Abrechnungswährung, Dienst und Kostenkategorie. Klicken Sie auf eine Zeile, um
  die dahinterliegenden Kostenpositionen zu sehen. Unterschiede werden pro
  Währung ausgewiesen, sodass ein Wechselkurs keinen verbergen kann.
- **Revisionen.** Hat sich die Rechnung geändert, fügt **Neue Revision
  einfrieren** eine weitere Kopie hinzu und behält die früheren. Hat sie sich
  nicht geändert, wird keine Revision hinzugefügt.
- **Ein noch laufender Monat** kann eingefroren werden, aber der Dialog warnt,
  dass die Kopie unvollständig sein wird, und der Snapshot sagt es danach
  weiterhin.
- **Fehlende Beträge.** Ein Monat, dessen Kostenpositionen Nutzung, aber keine
  Beträge tragen, hat keine Summe, was nicht bedeutet, dass er nichts gekostet
  hat. Die Karte sagt das und nennt, wie viele Kostenpositionen keinen Betrag
  oder keinen Wechselkurs haben.
- **Eine Kopie prüfen.** Jede Revision zeigt ihre Snapshot-ID, ihren
  Übernahmebatch und ihre Prüfsumme. Passen die gespeicherten Kostenpositionen
  nicht mehr zur Prüfsumme, warnt die Karte davor, sich auf diese Revision zu
  verlassen.

Snapshots werden in `billing.duckdb` gespeichert, sodass eine
[Sicherung](settings-and-data.md#backups) des Datenordners sie enthält. Das
Löschen des Abrechnungsverlaufs eines Kontos entfernt sie ebenfalls.

## Konten hinzufügen und entfernen {#accounts}

Um eines hinzuzufügen, gehen Sie zu **Konten**, wählen Sie die Quelle, geben
einen Namen und — bei einer API-Quelle — die Zugangsdaten ein und klicken auf
**Speichern**. Eine API-Quelle ruft sofort die Rechnung dieses und des letzten
Monats ab; **Validieren** in ihrer Zeile prüft die Zugangsdaten für sich. Sind
die Werkzeuge des Anbieters auf dem Rechner eingerichtet, kann das Formular die
Zugangsdaten aus der Umgebung oder dem Profil der CLI lesen, statt eine Kopie zu
speichern.

Das Löschen eines Kontos entfernt immer seine Zeile und seine Zugangsdaten aus
dem Schlüsselbund. Enthält das Hauptbuch Kostenpositionen dafür, bietet der
Dialog zusätzlich **Auch den Abrechnungsverlauf löschen** an, standardmäßig aus.
Bleibt es aus, bleiben die Kostenpositionen und **zählen in jeder Summe weiter**;
ist es an, werden sie, die Rohdaten dahinter und alle
[Monatsende-Snapshots](#snapshots) entfernt. Keines von beidem lässt sich
rückgängig machen. Verlauf, der sein Konto überdauert hat, wird auf der Seite
Konten unter **Abrechnungsverlauf gelöschter Konten** aufgeführt, wo
**Verlauf löschen** ihn entfernt.

## Datenzustand {#data-health}

CloudBridge prüft das Hauptbuch auf Dinge, die eine Summe weniger verlässlich
machen, als sie aussieht:

- Kostenpositionen, deren Währung die Kurstabelle nicht umrechnen kann;
- Nutzung ohne `business_line`-Tag;
- Nutzung ohne Region;
- Anpassungen, die keine Kostenposition erklärt;
- Nutzung von Produkten ohne Dienstkategorie.

Die Übersicht zeigt sie als Leiste **Datenqualität**, die Seite Konten als Karte
**Datenzustand**, und die Seite eines Kontos listet ihre eigenen.
**Ausblenden** verbirgt einen Befund für diesen Abrechnungszeitraum; derselbe
Befund in einem späteren Zeitraum erscheint wieder.

## Berichtswährung {#currency}

**Einstellungen → Berichte** wählt USD oder CNY. Kostenpositionen behalten die
Währung, in der sie abgerechnet wurden; eine datierte, integrierte
Wechselkurstabelle rechnet sie zur Anzeige um, mit einem Kurs, der nicht später
als das Kostenstellungsdatum ist. Kurse sind keine Live-Marktdaten. Ein
fehlender Kurs wird gemeldet und nie als 1:1 behandelt.
