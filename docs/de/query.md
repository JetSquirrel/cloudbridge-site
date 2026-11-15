---
title: "Das Abrechnungshauptbuch mit SQL abfragen"
description: "Die Seite Abfrage in CloudBridge: schreibgeschütztes SQL über das lokale DuckDB-Abrechnungshauptbuch, mit Vorlagen für Ausgaben, Dienste, Geschäftsbereiche und Prognosen."
---

# Abfrage

**[English](../query.md)**&emsp;**[中文](../zh/query.md)**&emsp;**[日本語](../ja/query.md)**&emsp;**[한국어](../ko/query.md)**&emsp;**[Français](../fr/query.md)**&emsp;**[Español](../es/query.md)**&emsp;**[Português](../pt/query.md)**&emsp;[Dokumentation](index.md)

Die Seite **Abfrage** führt SQL über das lokale DuckDB-Hauptbuch aus. Nur in der
Desktop-App.

- Schreiben Sie eine Anweisung und klicken Sie auf **Ausführen**, oder drücken
  Sie **⌘Enter** (**Ctrl+Enter** unter Windows). Die Hauptansicht ist
  `v_charge_normalized`: eine Zeile pro Kostenposition, mit Beträgen in die
  Berichtswährung umgerechnet.
- Die Vorlagenliste füllt den Editor mit einer Startabfrage — monatliche
  Ausgaben, Ausgaben nach Anbieter, Top-Dienste, Geschäftsbereiche, nicht
  zugeordnete Ausgaben, eine Prognose zum Monatsende, Aufteilungen nach Region
  und Dienstkategorie, Top-Ressourcen, Rabatte gegenüber dem Listenpreis,
  aktuelle Übernahmebatches und Guthaben-Snapshots.
- Es laufen nur lesende Anweisungen: Alles, was schreiben könnte, wird
  abgelehnt, bevor es die Datenbank erreicht, und das Hauptbuch wird für die
  Abfrage ohnehin schreibgeschützt geöffnet. Nichts, was hier eingegeben wird,
  kann Ihre Daten ändern.
- Große Ergebnisse enden bei einem Zeilenbudget — höchstens 100.000 Zeilen,
  weniger bei breiten Ergebnissen —, und die Statuszeile sagt, wenn ein Ergebnis
  gekürzt wurde. Fügen Sie ein `LIMIT` hinzu oder aggregieren Sie, um alles zu
  sehen.
- Ein Ergebnis bleibt auf dem Bildschirm, wenn Sie das SQL ändern oder die
  Berichtswährung wechseln, und ist dann als nicht mehr zum Seiteninhalt
  passend markiert.

## Nützliche Spalten {#columns}

Das Hauptbuch ist nach [FOCUS](https://focus.finops.org/)-Spalten benannt:
`billed_cost` und `effective_cost`, `charge_category` (`Usage`, `Purchase`,
`Credit`, `Tax`, `Adjustment`), `service_name`, `service_category`,
`resource_id`, `region_id`, `pricing_quantity` und `pricing_unit`, dazu `x_model`
für das Modell, das eine Zeile eines Modellanbieters berechnet. Token-Zeilen
tragen außerdem `consumed_quantity`, `consumed_unit`, `sku_meter` und
`sku_price_details` aus FOCUS 1.5; siehe [FOCUS und Token-Daten](focus.md#query)
für eine Abfrage darüber. `cost_basis` sagt, wie viel Gewicht ein Betrag trägt:
`authoritative` aus der Rechnung, `estimated` für eine Zuordnung wie Cloudflares
Aufteilung pro Ressource, `absent` für Nutzung ohne Betrag.
