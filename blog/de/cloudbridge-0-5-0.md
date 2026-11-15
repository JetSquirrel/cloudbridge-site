---
title: "0.5.0: Es schaut weiter zu"
description: "CloudBridge bleibt in der Menüleiste und aktualisiert nach Zeitplan, Cloudflare kommt hinzu und wird bis zum Bucket und Durable Object aufgeschlüsselt, und Insights durchsucht AWS und Cloudflare danach, was sich kürzen lässt."
date: 2026-10-08
tag: Version
---

# 0.5.0: Es schaut weiter zu

<p class="post-meta">2026-10-08&emsp;Version&emsp;<a href="./">Alle Beiträge</a></p>

Eine Kostenwarnung ist nur etwas wert, solange das Geld noch ausgegeben wird. Bisher holte CloudBridge eine Rechnung, wenn jemand die App öffnete und auf Aktualisieren drückte, sodass eine Warnung ungelesen bleiben konnte, solange das Fenster geschlossen blieb. Diese Version handelt von dieser Lücke: Die App läuft weiter, nachdem ihr Fenster geschlossen wurde, die Rechnung, die sie liest, reicht hinunter bis zur Ressource, die sie verursacht hat, und eine Aktualisierung, die schiefgeht, kostet nichts mehr zweimal.

## Es läuft weiter

Unter macOS und Windows bleibt CloudBridge beim Schließen des Fensters in der Menüleiste (unter Windows im Infobereich). Der Titel des Symbols zeigt die Ausgaben des Monats, mit der Zahl der offenen Warnungen daneben, wenn es welche gibt. Ein Klick öffnet ein Panel mit dem Monat bis heute, der Prognose zum Monatsende, den offenen Warnungen und den Diensten, die sich gegenüber dem Vormonat am stärksten bewegt haben.

Dahinter wacht ein Zeitplan alle 15 Minuten auf, ruft die fälligen Konten ab, führt die Warnungsregeln aus und schickt für jede ausgelöste Warnung eine Systembenachrichtigung. Er wartet weiterhin das Aktualisierungsintervall ab, bevor er einen Anbieter erneut fragt, kostet also so viel wie ein tägliches Aktualisieren. **Beim Anmelden öffnen**, unter Einstellungen → Hintergrund, startet die App nach einem Neustart in der Menüleiste, ohne das Fenster zu öffnen.

Linux-Builds haben kein Tray-Symbol und beenden sich weiterhin mit ihrem Fenster; Zeitplan und Benachrichtigungen laufen, solange es geöffnet ist.

## Cloudflare, bis zur Ressource hinunter

Cloudflare ist die siebte Quelle. Eine Konto-ID und ein API-Token mit Billing → Read lesen die abrechenbare Nutzung: Ausgaben pro Dienst, pro Tag. Täglich ist hier wichtig. Ein Worker oder Durable Object, der in einer Schleife zu laufen beginnt, steht am nächsten Tag im Hauptbuch, nicht erst auf der Rechnung am Monatsende.

Die Rechnung endet aber beim Dienst: „R2 Class B operations, 734 am 3. Oktober“, nicht welcher Bucket. Fügen Sie dem Token Account Analytics → Read hinzu, und CloudBridge fragt die GraphQL Analytics API von Cloudflare nach der Nutzung jeder Ressource bei den Messgrößen, die die Rechnung nennt, und teilt dann die Zeile jedes Tages nach diesen Anteilen auf. R2-Buckets, Workers, D1-Datenbanken und Durable-Object-Namespaces bekommen jeweils ihren Teil, und die Teile summieren sich weiterhin zu dem, was Cloudflare abgerechnet hat. Sie sind als Schätzungen gekennzeichnet, weil Analytics gesampelt sind und ein Freikontingent dem Konto gehört, nicht einer einzelnen Ressource.

Nutzung innerhalb des Freikontingents wird ebenfalls behalten, mit Kosten von null daneben. Dort beginnt ein Ausreißer meist: Die Nutzung steigt tagelang, bevor der erste Cent abgerechnet wird.

## Insights: Was sich kürzen lässt

Insights vergleicht die Rechnung mit dem, was tatsächlich läuft. Es ist optional: **Einrichten und scannen** fragt zuerst, installiert dann einen gepinnten, mit Prüfsumme versehenen Build von [corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist), unserem Fork, der jedes Konto schreibgeschützt scannt.

Für AWS findet es gestoppte Instanzen, deren Volumes weiterhin abgerechnet werden, unnütze öffentliche IPv4-Adressen, Ressourcen ohne Owner-Tag und ohne verwaltenden Stack sowie Ressourcen, die abgerechnet, aber im Scan nicht vorhanden sind. Jede wird aus der Rechnung bepreist, wenn das Konto seinen Data Export liest. Für Cloudflare listet es Workers, R2-Buckets, D1-Datenbanken, KV-Namespaces, Zonen und Durable Objects auf, jeweils mit ihrem Anteil an der Rechnung und ihrer Nutzung in diesem Zeitraum.

Ein großes Konto überschwemmt die Seite nicht mehr. Jede Karte öffnet sich mit einer Zusammenfassung nach Typ, mit Anzahlen und Kosten, und listet Ressourcen erst, wenn Sie einen Typ öffnen, fünfzig auf einmal.

## Nichts doppelt bezahlt

Wir haben geprüft, was CloudBridge Sie selbst kosten kann, jetzt da es von allein aktualisiert:

- **Ein fehlgeschlagener Ingest wird innerhalb des Aktualisierungsintervalls nicht erneut abgerufen.** Wenn AWS eine Anfrage beantwortet hat und das Speichern der Antwort dann fehlschlug (volle Festplatte, Mapping-Fehler), kaufte der Zeitplan dieselben Daten früher alle 15 Minuten erneut. Jetzt wartet er das Intervall ab und sagt, warum; Aktualisierung erzwingen versucht es weiterhin sofort.
- **Ein fehlschlagendes Konto wird seltener und seltener erneut versucht.** Die Wartezeit beginnt bei 15 Minuten und verdoppelt sich bis zum Aktualisierungsintervall, und eine Benachrichtigung meldet, dass das Konto nicht mehr aktualisiert wird.
- **Ein AWS-Data-Export-Monat, der sich nicht geändert hat, wird nicht erneut heruntergeladen.** Zuerst werden die ETags seiner Dateien geprüft.
- **Cost-Explorer-Monate werden ganz gelesen.** Ein großer Monat kommt in Seiten zurück, und früher wurde nur die erste Seite gelesen. Jede weitere Seite ist eine abgerechnete Anfrage, begrenzt auf 20.

## Kleinere Dinge

- **Dienstkategorien bedeuten in jeder Cloud dasselbe.** ECS, EC2 und das ECS von Volcengine sind alle Compute / Virtuelle Maschinen, sodass die Kategorie-Ansicht der Zuordnungsseite Clouds vergleicht. Ein bestehendes Hauptbuch wird beim ersten Öffnen migriert.
- **Eine Startseite, die zeigt, was sie liest.** Die Doku-Website listet jede unterstützte Cloud und Modellplattform mit ihrem Logo auf.

Die vollständige Liste steht im [Changelog](https://github.com/JetSquirrel/cloudbridge/blob/main/CHANGELOG.md).

## Wie es weitergeht

Befunde von Cloudflare selbst, beginnend mit Durable-Object-Namespaces, deren Objekte weiterhin Alarme gesetzt halten, brauchen einen echten Scan, um sie zu beurteilen. Die Abrechnungs-APIs für Volcengine, OpenAI und Anthropic stehen weiterhin aus; bis dahin werden ihre Exporte importiert.
