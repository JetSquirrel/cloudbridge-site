---
title: "Cloud-Rechnungen mit dem Abrechnungshauptbuch abgleichen"
description: "Der Abgleich in CloudBridge vergleicht die Schlussrechnung jedes Anbieters mit dem Hauptbuch oder einem eingefrorenen Snapshot, in der Währung der Rechnung, und sagt, was zu prüfen ist."
---

# Abgleich

**[English](../reconciliation.md)**&emsp;**[中文](../zh/reconciliation.md)**&emsp;**[日本語](../ja/reconciliation.md)**&emsp;**[한국어](../ko/reconciliation.md)**&emsp;**[Français](../fr/reconciliation.md)**&emsp;**[Español](../es/reconciliation.md)**&emsp;**[Português](../pt/reconciliation.md)**&emsp;[Dokumentation](index.md)

Die Seite **Abgleich** beantwortet eine Frage: Stimmt die Schlussrechnung jedes
Anbieters mit dem überein, was CloudBridge importiert hat? Dafür ist CloudBridge
0.9.0 oder neuer nötig.

Nur maßgebliche abgerechnete Kosten in der Währung der Rechnung selbst werden
verglichen, sodass ein Wechselkurs keinen Unterschied verbergen kann. Rechnungen
werden getrennt von Ihren Kostenpositionen gespeichert und ändern sie nie.

## Eine Rechnung hinzufügen {#add}

- **Summe eingeben** erfasst eine Rechnung. Die **Summe** ist der Endbetrag der
  Rechnung. Steuer, Gutschriften und Anpassungen sind, was die Rechnung ausweist:
  Sie werden nicht zur Summe addiert und helfen nur, einen Unterschied zu
  erklären. Geben Sie Gutschriften als null oder negativ ein.
- **Rechnung als CSV importieren** liest viele auf einmal, nur in der
  Desktop-App. Ist eine Zeile falsch, wird nichts importiert, und der Fehler
  nennt die Zeile.

Die CSV braucht eine Kopfzeile:

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

Spalten ab `tax` sind optional. `billing_period` ist `YYYY-MM`, `currency` ist
ein dreistelliger Code, und Beträge sind einfache Zahlen ohne
Tausendertrennzeichen. Jede Zeile muss eines Ihrer Konten nennen.

Wenn die Kostenpositionen eines Kontos mehr als ein Abrechnungskonto umfassen,
setzen Sie die Abrechnungskonto-ID der Rechnung, damit sie mit dem richtigen
verglichen wird.

## Das Ergebnis lesen {#status}

| Status | Bedeutung |
| --- | --- |
| Matched | Die Rechnung und das Hauptbuch stimmen innerhalb der Toleranz der Währung überein |
| Difference | Sie stimmen nicht überein. Die Zeile zeigt den Unterschied und was als Nächstes zu prüfen ist |
| Cannot verify | Es gibt noch nichts Vergleichbares, und die Zeile nennt den Grund |
| Missing evidence | Der Monat hat abgerechnete Kostenpositionen, aber keine Rechnung, wurde also nicht geprüft |

Ein Monat zeigt **Cannot verify**, wenn er zum Beispiel noch nicht beendet ist,
das Hauptbuch keine Kostenpositionen in der Währung der Rechnung hat oder jede
Kostenposition Nutzung ohne Betrag ist. Abgeleitete oder geschätzte Beträge
bleiben aus der Hauptbuchzahl heraus.

Öffnen Sie eine Zeile, um die Aufschlüsselung nach Kostenkategorie, die Details
der Rechnung und was zu prüfen ist, zu sehen, etwa Steuer nur auf einer Seite,
eine späte Gutschrift oder Anpassung, einen Export, der nur einen Teil des
Monats abdeckt, oder eine Summe, die zu einem anderen Monat passt.

## Mit einem Snapshot vergleichen {#snapshot}

**Vergleichen mit** wählt das aktuelle Hauptbuch oder einen
[Monatsende-Snapshot](overview.md#snapshots), sodass Sie eine Rechnung gegen den
Monat prüfen können, wie Sie ihn abgeschlossen haben, unabhängig davon, was
spätere Aktualisierungen geändert haben.

Das Löschen einer Rechnung entfernt nur diesen Datensatz. Das Hauptbuch und alle
Snapshots bleiben, wie sie sind.
