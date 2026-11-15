---
title: "Häufige CloudBridge-Probleme beheben"
description: "Lösungen für häufige CloudBridge-Probleme: Keychain-Abfragen, AWS AccessDenied, eine leere Übersicht, SmartScreen, ein Konsolenfenster unter Windows, Importfehler und Warnungen, die nicht ausgelöst wurden."
---

# Fehlerbehebung

**[English](../troubleshooting.md)**&emsp;**[中文](../zh/troubleshooting.md)**&emsp;**[日本語](../ja/troubleshooting.md)**&emsp;**[한국어](../ko/troubleshooting.md)**&emsp;**[Français](../fr/troubleshooting.md)**&emsp;**[Español](../es/troubleshooting.md)**&emsp;**[Português](../pt/troubleshooting.md)**&emsp;[Dokumentation](index.md)

## macOS fragt nach dem Keychain-Zugriff {#keychain}

Gespeicherte Zugangsdaten liegen im Schlüsselbund des Betriebssystems, nicht in
den eigenen Dateien von CloudBridge, daher fragt macOS möglicherweise, ob
CloudBridge seinen Keychain-Eintrag verwenden darf, wenn die App einen Zugang
liest. Klicken Sie auf **Immer erlauben**, damit nicht bei jeder Aktualisierung
gefragt wird, oder auf **Erlauben**, um jedes Mal gefragt zu werden. Wenn Sie
**Ablehnen** wählen, kann die App den Zugang nicht lesen, und der Abruf dieses
Kontos schlägt fehl, bis Sie den Zugriff erlauben.

## AWS meldet AccessDenied {#aws-access-denied}

Der Schlüssel wurde authentifiziert, aber seinem Benutzer fehlt
`ce:GetCostAndUsage`. Hängen Sie die
[Cost-Explorer-Richtlinie](aws.md#cost-explorer) an den IAM-Benutzer, dem der
Schlüssel gehört. Eine Service-Control-Richtlinie einer Organisation kann Cost
Explorer ebenfalls verweigern; und in einer AWS-Organisation sehen
Mitgliedskonten Cost-Explorer-Daten nur, wenn das Verwaltungskonto es erlaubt.

## Die Übersicht ist nach dem Hinzufügen eines Kontos leer {#empty-overview}

- **Es wurde noch nichts abgerufen.** Klicken Sie in der Übersicht auf
  **Aktualisieren**. Eine Quelle mit Dateiimport (Volcengine, OpenAI,
  Anthropic) hat nichts abzurufen: Verwenden Sie stattdessen **Importieren** in
  ihrer Zeile.
- **Der Anbieter hat noch nichts gemeldet.** Anbieter veröffentlichen Kosten
  mit Verzögerung; AWS Cost Explorer kann bis zu etwa 24 Stunden
  hinterherhinken, daher erscheinen ein ganz neues Konto oder die heutigen
  Ausgaben möglicherweise nicht sofort. Versuchen Sie es später erneut, statt
  **Aktualisierung erzwingen** zu verwenden, das Gebühren für
  Cost-Explorer-Anfragen verursachen kann.
- **Das Zeitfenster ist zu schmal.** Früh im Monat enthält **MTD**
  möglicherweise wenig oder nichts; wechseln Sie zu **30d** oder **12m**.
- **Es ist eine reine Guthabenquelle.** Die API von DeepSeek meldet ein
  Guthaben, keine Ausgaben. Importieren Sie ihren Nutzungsdownload für
  Ausgabendetails.

## Ein Konto lässt sich immer wieder nicht aktualisieren {#refresh-failing}

Das Menüleisten-Panel und die Übersicht nennen die Konten, die fehlgeschlagen
sind, und den Grund. Ein Konto, das scheitert, wird nach 15 Minuten erneut
versucht, dann nach 30, jeweils verdoppelt bis zum Aktualisierungsintervall,
und eine Benachrichtigung sagt, wenn es zu scheitern beginnt. Hat ein Anbieter
geantwortet, CloudBridge das Ergebnis aber nicht speichern können — etwa bei
voller Festplatte —, ruft es diesen Monat innerhalb des Aktualisierungsintervalls
nicht erneut ab, damit dieselben Daten nicht doppelt bezahlt werden;
**Aktualisierung erzwingen** versucht es sofort erneut. Siehe [Menüleiste und
Hintergrund](background.md#failures).

## Windows SmartScreen blockiert die App {#smartscreen}

Der Windows-Build ist nicht codesigniert, daher zeigt SmartScreen *Windows hat
Ihren PC geschützt*. Nachdem Sie geprüft haben, dass die Datei von der
offiziellen
[Releases](https://github.com/JetSquirrel/cloudbridge/releases)-Seite stammt,
klicken Sie auf **Weitere Informationen** und dann auf **Trotzdem ausführen**.

## Unter Windows öffnet sich mit der App ein Konsolenfenster {#windows-console}

Windows-Releases bis 0.7.1 öffnen neben CloudBridge ein schwarzes
Konsolenfenster, und die `.exe` zeigt ein generisches Symbol statt des
CloudBridge-Symbols. Das Schließen dieser Konsole beendet CloudBridge samt
Symbol im Benachrichtigungsbereich, minimieren Sie sie daher statt sie zu
schließen. Spätere Releases öffnen keine Konsole und tragen ihr Symbol in der
`.exe`, der Titelleiste und der Taskleiste.

## Unter Windows schlägt jede Abfrage fehl {#windows-query}

In 0.8.0 unter Windows bricht jede Abfrage auf der Seite Abfrage mit einem
E/A-Fehler ab, weil die Seite die Hauptbuchdatei ein zweites Mal öffnet.
CloudBridge 0.9.0 behebt das. Ihre Daten sind nicht betroffen.

## Die Installation des Scanners bleibt stehen {#scanner-install}

Der Einblicke-Scanner ist ein Download von etwa 45 MB. In 0.8.0 beendet eine
mittendrin abgebrochene Verbindung die Installation mit *io: unexpected end of
file*: Klicken Sie erneut auf **Einrichten und scannen**. Ab 0.9.0 wiederholt
CloudBridge einen abgebrochenen oder abgelaufenen Download oder einen
Serverfehler von selbst bis zu dreimal.

## Importfehler {#import-errors}

- **„not UTF-8 text“** — Die Konsolen von Alibaba Cloud und Volcengine können
  GBK-Exporte erzeugen. Exportieren Sie erneut als UTF-8 oder speichern Sie die
  Datei vor dem Import als CSV UTF-8.
- **Unbekannte Spalten** — Parser erkennen bekannte Aliase für chinesische und
  englische Exporte sowie Anbieterfeldnamen. Hat sich ein Format geändert,
  melden Sie den Fehler und die Spaltenüberschriften in einem Issue. Schwärzen
  Sie sensible Werte; hängen Sie keine ungeschwärzte Rechnung an.
- **Ein Monat ist nach dem Import geschrumpft** — Ein Import ersetzt jeden
  Monat, den die Datei für dieses Konto abdeckt, daher bleibt bei einem
  produktgefilterten Export nur dieses Produkt übrig. Importieren Sie die
  vollständige, ungefilterte Rechnung erneut.
- **Token-Zahlen, aber keine Ausgaben** — Ein Nutzungsexport enthält kein Geld;
  importieren Sie stattdessen den Kostenexport. Importieren Sie bei DeepSeek
  die ZIP so, wie sie heruntergeladen wurde, und nicht ihre `amount-*.csv`.

## Ein Cloudflare-Scan wird abgelehnt {#cloudflare-scan}

Der Scan nennt, welcher von zwei Fällen eingetreten ist. *Cloudflare hat das
API-Token dieses Kontos nicht akzeptiert* bedeutet, dass das Token falsch oder
abgelaufen ist: Prüfen Sie es auf der Seite Konten. *Das Token kann … nicht
lesen* bedeutet, dass das Token gültig ist, ihm aber die Leseberechtigung für
einen Dienst fehlt; fügen Sie die unter [Cloudflare](cloudflare.md#insights)
aufgeführten Berechtigungen hinzu. Ein Token ohne diese liest die Rechnung
trotzdem.

## Eine Warnung wurde nicht ausgelöst {#alert-silent}

- **Die Regel „Kontobudget“ hat kein Budget, an dem sie sich messen kann.** Die
  Regel bewirkt nichts für ein Konto ohne **Monatsbudget**, unabhängig von
  ihrem Schwellenwerttyp. Legen Sie eines auf der Seite Regeln fest.
- **Die Ausgaben begannen bei null.** Die Kostenwachstumsanomalie vergleicht
  einen Dienst mit seinen eigenen letzten sieben Tagen, daher hat ein Dienst,
  der nichts gekostet hat, keine Basislinie und löst sie nie aus. Eine
  Budgetregel auf die Prognose zum Monatsende deckt diesen Fall ab: siehe
  [Einen Ausreißer erkennen](cloudflare.md#runaway).
- **Der Tag ist noch nicht im Hauptbuch.** Regeln laufen auf dem, was abgerufen
  wurde. Die Hintergrundaktualisierung ruft ein Konto einmal pro
  Aktualisierungsintervall ab, und nur solange CloudBridge läuft; siehe
  [Menüleiste und Hintergrund](background.md).
- **Benachrichtigungen sind aus,** oder die Warnung war beim Start der App
  bereits offen. Offene Warnungen werden so oder so auf der Seite Warnungen
  aufgeführt.

## Weiterhin blockiert {#help}

Fragen, die die Dokumentation nicht beantwortet?
[Öffnen Sie ein Issue](https://github.com/JetSquirrel/cloudbridge/issues).
