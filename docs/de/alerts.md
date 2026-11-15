---
title: "Warnungen bei Kostenanomalien, Regeln und Budgets"
description: "Warnungsregeln in CloudBridge für Kostenanomalien, Guthabenuntergrenzen, Ausgaben ohne Tags und Budgets: wann sie laufen, was sie messen und wie sich Warnungen auflösen."
---

# Warnungen, Regeln und Budgets

**[English](../alerts.md)**&emsp;**[中文](../zh/alerts.md)**&emsp;**[日本語](../ja/alerts.md)**&emsp;**[한국어](../ko/alerts.md)**&emsp;**[Français](../fr/alerts.md)**&emsp;**[Español](../es/alerts.md)**&emsp;**[Português](../pt/alerts.md)**&emsp;[Dokumentation](index.md)

Regeln werden gegen das Hauptbuch ausgewertet, wenn die App geöffnet wird und
nach jeder Aktualisierung — einschließlich der
[Hintergrundaktualisierung](background.md), die jedes Konto abruft, sobald sein
Aktualisierungsintervall verstrichen ist, solange CloudBridge läuft, unter macOS
und Windows auch mit geschlossenem Fenster. Jede neue Warnung löst eine
Systembenachrichtigung aus. Das Öffnen der Seite Warnungen prüft erneut, ob
offene Warnungen aufgelöst sind.

## Die Regeln {#rules}

Drei Regeln sind aktiviert; prüfen Sie sie auf der Seite **Regeln** und
deaktivieren Sie die, die Sie nicht brauchen.

| Regel | Löst aus, wenn | Standard |
| --- | --- | --- |
| Modell-Kostenwachstumsanomalie | Die Tagesausgaben eines Paars aus Quelle und Dienst überschreiten an aufeinanderfolgenden Tagen ihre gleitende 7-Tage-Basislinie | Über dem 2,5-Fachen an 2 aufeinanderfolgenden Tagen |
| Guthabenuntergrenze | Ein vorausbezahltes Guthaben fällt unter den Monatsbudgetbetrag des Kontos oder ohne Budget unter die Standarduntergrenze | 200, in der Währung des Guthabens |
| Anteil nicht getaggter Ausgaben | Der Anteil nicht zugeordneter Nutzung des Monats den Schwellenwert überschreitet und höher ist als im Vormonat | Über 15 % und steigend |

Die Anomalie-Regel braucht eine Basislinie: Ein Dienst, der in den letzten sieben
Tagen nichts gekostet hat, löst sie nie aus, egal wie viel er danach ausgibt.
Eine Arbeitslast, die von null in einen Ausreißer übergeht — ein vergessenes
Projekt, das in einer Schleife zu laufen beginnt —, wird stattdessen von einer
Regel vom Typ [Kontobudget](#budgets) auf Basis der Prognose zum Monatsende
erkannt; [Cloudflare](cloudflare.md#runaway) führt es durch.

**Neue Regel** auf der Seite Regeln erstellt weitere: Wählen Sie eine Art,
passen Sie ihre Einstellungen an und klicken Sie auf **Regel erstellen**. Eine
neue Regel ist sofort aktiv, und eine Anomalie-Regel kann auf ein Konto
beschränkt werden.

## Budgets {#budgets}

Die Karte **Monatsbudgets** auf der Seite Regeln legt fest, was ein Konto in
einem Monat kosten darf. Wählen Sie das Konto, geben Sie ein **Monatsbudget**
und ein **Warnen bei (% des Budgets)** ein und klicken Sie auf
**Budget speichern**; **Entfernen** löscht es. Jedes Konto mit Budget zeigt dann,
wie viel seines Budgets dieser Monat verbraucht hat, in der Berichtswährung.

Ein Budget allein zieht nur diese Linie. Um gewarnt zu werden, erstellen Sie eine
Regel **Kontobudget** für das Konto und wählen:

- **Basierend auf** — *Kosten bis heute* für den bisherigen Monat oder
  *Prognose zum Monatsende* für die Hochrechnung der aktuellen Rate;
- **Schwellenwerttyp** — *% des Budgets* oder einen festen *Betrag*.

Es funktioniert auch umgekehrt: Die Regel misst am Budget, daher löst eine Regel
**Kontobudget** für ein Konto ohne Budget nie aus, selbst mit einem
*Betrag*-Schwellenwert. Legen Sie zuerst das Budget fest.

Das Budget eines Kontos dient auch als seine Untergrenze in der Regel zur
Guthabenuntergrenze.

## Eine Warnung lesen {#alerts}

Eine Warnung trägt die Messwerte, auf denen sie beruht: Ausgaben und Basislinie,
Guthaben und Untergrenze oder den Anteil nicht zugeordneter Nutzung. Prognosen
sind Schätzungen aus aktuellen Daten, keine garantierten Kosten zum Monatsende.
**Zurückstellen** verbirgt eine Warnung eine Zeit lang; **Verwerfen** schließt
sie. Eine offene Warnung wird als **aufgelöst** markiert, wenn eine spätere
Auswertung findet, dass ihre Bedingung nicht mehr gilt.

**Die Kostenpositionen ansehen** öffnet den Dienst der Warnung in der
[Abfrage](query.md), über Monate hinweg.

Ein niedriges Guthaben ist eine Warnung und nicht jeden Tag eine neue Karte. Sie
behält die neuesten Zahlen, bis sich das Guthaben erholt oder Sie sie verwerfen,
und ältere Karten für dasselbe Guthaben gehen bei der nächsten Prüfung darin
auf.

## Benachrichtigungen {#notifications}

Jede Warnung, die auslöst, während CloudBridge läuft, wird einmal als
Systembenachrichtigung angekündigt; Warnungen, die beim Start der App bereits
offen waren, werden nicht wiederholt. Schalten Sie sie unter **Einstellungen →
Hintergrund → Warnungsbenachrichtigungen** aus.
