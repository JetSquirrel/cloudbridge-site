---
title: "DeepSeek-Guthaben und API-Ausgaben pro Modell"
description: "Verbinden Sie DeepSeek über einen API-Schlüssel mit CloudBridge für das vorausbezahlte Guthaben und importieren Sie den Nutzungsdownload für Ausgaben pro Tag und Modell."
---

# DeepSeek

**[English](../deepseek.md)**&emsp;**[中文](../zh/deepseek.md)**&emsp;**[日本語](../ja/deepseek.md)**&emsp;**[한국어](../ko/deepseek.md)**&emsp;**[Français](../fr/deepseek.md)**&emsp;**[Español](../es/deepseek.md)**&emsp;**[Português](../pt/deepseek.md)**&emsp;[Dokumentation](index.md)

Die API von DeepSeek meldet ein **Guthaben** — gewährt und aufgeladen —, keine
Aufschlüsselung der Ausgaben. Für Ausgabendetails importieren Sie den Download
der Konsole.

## Guthaben-API {#api}

1. Öffnen Sie [platform.deepseek.com](https://platform.deepseek.com/) und
   erstellen Sie einen API-Schlüssel.
2. Fügen Sie das Konto in CloudBridge mit diesem Schlüssel hinzu.

Das Guthaben speist die Regel **Guthabenuntergrenze** (siehe [Warnungen, Regeln
und Budgets](alerts.md)). Ein Schlüssel, der für Guthabenabfragen verwendet
wird, kann auch bezahlte Modellanfragen autorisieren, schützen Sie ihn daher
und prüfen Sie seine Berechtigungen — siehe [Berechtigungen der
Anbieter](permissions.md#deepseek).

## Nutzungsdownload {#export}

Gehen Sie in der Konsole zu **Usage → Download** und importieren Sie die ZIP
genau so, wie sie heruntergeladen wurde: CloudBridge liest die darin enthaltene
`cost-*.csv` und ignoriert `amount-*.csv`, deren Spalte `amount` Token-Zahlen
enthält, kein Geld. Siehe [Rechnungsdatei importieren](bill-import.md).
