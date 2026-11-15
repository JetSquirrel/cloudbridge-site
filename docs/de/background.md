---
title: "Ausgaben in der Menüleiste und Hintergrundaktualisierung"
description: "Lassen Sie CloudBridge mit geschlossenem Fenster wachen: Ausgaben in der Menüleiste, eine tägliche Hintergrundaktualisierung, Benachrichtigungen, Start bei der Anmeldung und sichere Wiederholungen."
---

# Menüleiste und Hintergrund

**[English](../background.md)**&emsp;**[中文](../zh/background.md)**&emsp;**[日本語](../ja/background.md)**&emsp;**[한국어](../ko/background.md)**&emsp;**[Français](../fr/background.md)**&emsp;**[Español](../es/background.md)**&emsp;**[Português](../pt/background.md)**&emsp;[Dokumentation](index.md)

Eine Kostenwarnung ist nur etwas wert, solange das Geld noch ausgegeben wird.
Deshalb läuft CloudBridge nach dem Schließen ihres Fensters weiter, aktualisiert
nach einem Zeitplan und sagt Ihnen, wenn eine Warnung auslöst.

## Das Menüleistensymbol {#menu-bar}

Unter macOS und Windows bleibt CloudBridge beim Schließen des Fensters in der
Menüleiste (unter Windows im Benachrichtigungsbereich). Der Titel des Symbols
zeigt die Ausgaben des Monats, `$2.8k`. Das Symbol ist eine Bogenbrücke mit drei
Punkten, und ein Ausrufezeichen ersetzt die Punkte, solange eine Warnung offen
ist.

Klicken Sie darauf für ein Panel mit dem Monat bis heute, der Prognose zum
Monatsende, den offenen Warnungen und den Diensten, die sich am stärksten zum
Vormonat verändert haben, mit **Aktualisieren** und **CloudBridge öffnen**. Ein
Klick auf eine Warnung öffnet sie auf der Seite Warnungen. Rechtsklick auf das
Symbol — oder **Beenden** im Panel — beendet die App; das Schließen des Fensters
tut das nicht mehr. Das Dock-Symbol erscheint und verschwindet mit dem Fenster.

Soll das Schließen des Fensters stattdessen beenden, schalten Sie
**Einstellungen → Hintergrund → In der Menüleiste weiterlaufen** aus. Das Symbol
verschwindet sofort; Zeitplan und Benachrichtigungen laufen dann nur, solange
das Fenster offen ist, und ein Start bei der Anmeldung öffnet das Fenster, statt
versteckt zu starten.

Linux-Builds haben kein Tray-Symbol und beenden sich weiterhin mit ihrem
Fenster; Zeitplan und Benachrichtigungen laufen, solange es offen ist.

## Die Hintergrundaktualisierung {#schedule}

CloudBridge ruft jedes Konto ab, sobald sein Aktualisierungsintervall verstrichen
ist (**Einstellungen → Aktualisierung**, standardmäßig 24 Stunden), führt die
[Warnungsregeln](alerts.md) aus und veröffentlicht eine Benachrichtigung für
jede neue Warnung. Der Zeitplan kostet also, was ein täglicher Klick auf
Aktualisieren kosten würde.

Alle 15 Minuten prüft es, ob ein Konto fällig geworden ist. Diese Prüfung liest
nur das lokale Hauptbuch; sie sendet nichts an einen Anbieter. Die 15 Minuten
entscheiden, wie bald nach dem Aufwachen eines Laptops oder dem Ende eines
Fehlers ein fälliges Konto abgerufen wird — nicht, wie oft eines abgerufen wird.
Schalten Sie den Zeitplan unter **Einstellungen → Hintergrund → Im Hintergrund
aktualisieren** aus.

## Bei der Anmeldung öffnen {#login}

**Einstellungen → Hintergrund → Bei der Anmeldung öffnen** startet CloudBridge,
wenn Sie sich anmelden, in der Menüleiste und ohne Fenster, sodass Warnungen auch
nach einem Neustart ankommen. Es ist aus, bis Sie es einschalten; macOS listet es
unter **Systemeinstellungen → Allgemein → Anmeldeobjekte**.

## Wenn eine Aktualisierung fehlschlägt {#failures}

- **Ein Konto, das immer wieder fehlschlägt,** wird nach 15 Minuten erneut
  versucht, dann nach 30, jeweils verdoppelt bis zum Aktualisierungsintervall,
  sodass ein widerrufener Schlüssel oder ein Ausfall eines Anbieters ein paar
  Versuche pro Tag kostet statt einen bei jedem Takt. Eine Benachrichtigung
  sagt, wenn ein Konto zu scheitern beginnt — seine Ausgaben werden nicht mehr
  beobachtet —, und das Panel nennt es, bis es sich erholt.
- **Ein Abruf, den der Anbieter beantwortet hat, den CloudBridge aber nicht
  speichern konnte** — etwa bei voller Festplatte —, wird innerhalb des
  Aktualisierungsintervalls nicht wiederholt, damit dieselben
  Cost-Explorer-Anfragen oder S3-Downloads nicht doppelt bezahlt werden.
  **Aktualisierung erzwingen** versucht es sofort erneut.
- **Ein fehlschlagender Monat stoppt den anderen nicht**: Ärger im Vormonat lässt
  diesen Monat, in dem ein Ausreißer sichtbar wird, nicht unabgerufen.
