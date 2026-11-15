---
title: "0.3.1: Von allem eins"
description: "Ein Konsistenzdurchgang über die gesamte Oberfläche – ein gemeinsamer Satz von Karten, Schaltflächen, Pills und Tabellenköpfen – plus ein signierter, notarisierter macOS-Build."
date: 2026-09-12
tag: Version
---

# 0.3.1: Von allem eins

<p class="post-meta">2026-09-12&emsp;Version&emsp;<a href="./">Alle Beiträge</a></p>

0.3.0 baute die Oberfläche auf GPUI Kit neu, aber Seite für Seite. Jede Seite bekam den neuen Look; jede Seite behielt auch ihre eigene Kopie davon, was eine Karte, eine primäre Schaltfläche oder ein Tabellenkopf ist. Kopien driften: Die Einstellungsseite hatte noch die Stile von vor dem Umbau, und anderswo erschien dasselbe Steuerelement „eines von drei wählen“ in vier verschiedenen Formen. 0.3.1 ist der Durchgang, der das Designsystem real macht – eine Definition pro Element, im Theme, und jede Seite zeichnet daraus.

## Schweregrad entscheidet über die Betonung

Der Durchgang brachte Stellen zutage, an denen die visuelle Hierarchie mit der Information stritt. Auf der Kontenseite trug **Unauffällig** – der einzige Zustand, der nichts von Ihnen verlangt – das hellste Badge, während Anomalie und Niedriger Saldo als einfacher Text erschienen. Auf der Seite für Warnungen war eine Warnung mit dem Schweregrad Kritisch weniger prominent als eine mit dem Schweregrad Warnung. Beides ist jetzt richtig herum: Je lauter der Zustand, desto lauter der Stil, und Alarmrot und Warnungsgelb sind echten Warnungen vorbehalten statt neutralen Bezeichnungen.

Dieselbe Logik galt für Aktionen. Aktualisieren, der günstige Alltagsvorgang, ist jetzt die primäre Schaltfläche der Übersicht; Aktualisierung erzwingen, der teure, eine sekundäre. Löschschaltflächen und Löschbestätigungen verwenden den Gefahrenstil. Und die Aktionsschaltflächen einer Warnung sind danach gestaltet, was sie tun, nicht danach, wo sie zufällig in einer Liste stehen – sodass „Verwerfen“ nie die große primäre Schaltfläche werden kann, nur weil sie zuerst kam.

## Fehler, die den Inhalt nicht verdrängen

Ein fehlgeschlagener Umschalter auf der Seite für Regeln ersetzte früher die gesamte Regelliste durch ein rotes Banner. Fehler stehen jetzt inline über der Liste, die Liste bleibt stehen, und jeder Fehler bietet „Erneut versuchen“.

## Kleinere Korrekturen

- **„Größte Veränderungen“** sortiert jetzt nach der Größe der Veränderung, nicht nach der Größe der Ausgabe – ein großer, aber flacher Dienst hält die Liste nicht mehr ewig.
- Der Frischepunkt in der Statusleiste zeigt an, ob der nächste Abruf fällig ist, statt nach der ersten Synchronisierung für immer grün zu bleiben.
- **„Diesen Monat gelöst“** zeigt das Datum, an dem eine Warnung gelöst wurde, nicht das Datum, an dem sie ausgelöst wurde.
- Yen-Beträge zeigen keine bedeutungslosen Nachkommastellen mehr.
- Die Kontodetailseite führt ihre Karten AUSGABEN / NUTZUNG / GUTHABEN zu einer AUSGABEN-Karte zusammen, die die Summe in einer Zeile aufschlüsselt.
- Die Doku-Website bekam dieselbe Behandlung: eine doppelte Überschrift umbenannt, wiederholte Erklärungen zusammengeführt, hartkodierte Farben in die Design-Tokens verschoben.

## Ein signierter macOS-Build

Release-Builds für macOS werden jetzt in CI signiert und notarisiert. Die Gatekeeper-Umgehung in den Installationshinweisen – Control-Klick, „Trotzdem öffnen“, die `xattr`-Zeile – ist kein Teil der Installation von CloudBridge mehr; laden Sie das DMG herunter und ziehen Sie es in den Ordner „Programme“.

## Wie es weitergeht

Unverändert gegenüber 0.3.0: Die [Roadmap](https://github.com/JetSquirrel/cloudbridge/blob/main/docs/roadmap.md) schuldet weiterhin einen *Export*-Kanal für Rechnungsdateien (S3 / OSS + Parquet), tagbasierte Zuordnung mit einem expliziten Knoten für nicht zugeordnete Kosten und die Abrechnungs-APIs für Volcengine, OpenAI und Anthropic.
