---
title: "Rechnungsexporte von OpenAI, Anthropic und aus der Cloud importieren"
description: "Importieren Sie Rechnungsexporte von Alibaba Cloud, Volcengine, OpenAI, Anthropic und DeepSeek in CloudBridge: woher jeder stammt und was er hinzufügt."
---

# Rechnungsdatei importieren

**[English](../bill-import.md)**&emsp;**[中文](../zh/bill-import.md)**&emsp;**[日本語](../ja/bill-import.md)**&emsp;**[한국어](../ko/bill-import.md)**&emsp;**[Français](../fr/bill-import.md)**&emsp;**[Español](../es/bill-import.md)**&emsp;**[Português](../pt/bill-import.md)**&emsp;[Dokumentation](index.md)

Ein aus der Konsole eines Anbieters heruntergeladener Rechnungsexport wird zu
denselben Hauptbuchzeilen, die ein Abruf erzeugt. Nachgelagert — Summen,
Diagramme, Warnungen, Zuordnung — ist ein importierter Monat nicht von einem
abgerufenen zu unterscheiden. Oft ist er die genauere Lesart: Die
Abrechnungs-API von Alibaba Cloud meldet Model Studio (百炼) als eine Zahl pro
Monat, während ihr Export es pro Modell meldet, mit Token-Zahlen.

Volcengine, OpenAI und Anthropic sind vorerst nur per Import verfügbar: Fügen
Sie das Konto mit einem Namen und ohne Zugangsdaten hinzu und importieren Sie.

| Quelle | Woher der Export kommt | Was er hinzufügt |
| --- | --- | --- |
| Alibaba Cloud | Expenses and Costs → Bill Details → Export | Model Studio (百炼) pro Modell; Details auf Instanzebene für alles andere |
| Volcengine | Billing → Bill Details → Export | Ark (火山方舟) pro Endpoint und Token-Typ |
| OpenAI | Usage → Export | Kosten- oder Token-Nutzung, pro Projekt und Modell |
| Anthropic (Claude) | Usage oder Cost → Export | Kosten- oder Token-Nutzung, pro Workspace und Modell |
| DeepSeek | Usage → Download | Ausgaben pro Tag und Modell — seine API meldet nur ein Guthaben |

## Importieren {#import}

1. Laden Sie den Export aus der Konsole des Anbieters herunter.
2. Gehen Sie zu **Konten** und klicken Sie in der Zeile des Kontos auf
   **Importieren**.
3. Wählen Sie die Datei. CloudBridge meldet, wie viele Kostenpositionen
   geschrieben wurden und welche Monate ersetzt wurden.

::: warning Ein Monat wird ersetzt, nicht ergänzt
Ein Import ersetzt jeden Monat, den die Datei für das ausgewählte Konto
abdeckt, sodass ein zweifacher Import eine Kostenposition nie verdoppelt.
Exportieren Sie die vollständige Rechnung: Eine produktgefilterte Datei ersetzt
die Daten des Monats durch nur dieses Produkt. Um einen importierten Monat zu
aktualisieren, importieren Sie erneut einen vollständigen, korrigierten Export.
Aktualisieren überschreibt einen importierten Monat nie, auch Aktualisierung
erzwingen nicht.
:::

## Nutzungsexporte enthalten kein Geld {#usage-exports}

Ein **Nutzungs**export mit Token-Zahlen, aber ohne Beträge, wird ohne
abgerechnete Kosten und mit der Kostenbasis *absent* erfasst. CloudBridge rechnet
Token-Zahlen nicht zu geschätzten Ausgaben zu Listenpreisen um. Ein
**Kosten**export behält nur dann eine Menge, wenn genau eine Token-Spalte
gefüllt ist: Eingabe- und Ausgabetokens haben unterschiedliche Preise und können
keine einzelne bepreiste Menge sein.

## Kodierungen {#encoding}

Textexporte müssen UTF-8 sein. Die Konsolen von Alibaba Cloud und Volcengine
können GBK-Dateien erzeugen; exportieren Sie erneut als UTF-8 oder speichern Sie
zuerst als *CSV UTF-8*. Mehr in
[Fehlerbehebung](troubleshooting.md#import-errors).
