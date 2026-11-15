---
title: "Einstellungen, Datenspeicherung und Sicherheit"
description: "Was CloudBridge speichert und wo: das DuckDB-Hauptbuch, Konten, Rohdaten und Konfiguration, dazu Aktualisierungsintervall, Währung, Sicherungen und Sicherheit."
---

# Einstellungen, Daten und Sicherheit

**[English](../settings-and-data.md)**&emsp;**[中文](../zh/settings-and-data.md)**&emsp;**[日本語](../ja/settings-and-data.md)**&emsp;**[한국어](../ko/settings-and-data.md)**&emsp;**[Français](../fr/settings-and-data.md)**&emsp;**[Español](../es/settings-and-data.md)**&emsp;**[Português](../pt/settings-and-data.md)**&emsp;[Dokumentation](index.md)

## Einstellungen {#settings}

| Einstellung | Was sie bewirkt |
| --- | --- |
| Darstellung → Design | Helles und dunkles Design, über Neustarts hinweg gemerkt |
| Darstellung → Sprache | [Die Sprache der Oberfläche](#language): System, English oder 简体中文 |
| Berichte → Währung | USD oder CNY für jede Summe; Kostenpositionen behalten ihre eigene Währung |
| Aktualisierung → Aktualisierungsintervall | 6, 12, 24 (Standard) oder 48 Stunden, bevor ein Monat erneut abgerufen wird |
| Hintergrund | [Start bei der Anmeldung, Hintergrundaktualisierung, Warnungsbenachrichtigungen](background.md) |
| Daten → Als FOCUS exportieren | Jede Kostenposition als CSV mit FOCUS-Spaltennamen, für ein anderes FinOps-Tool ([Details](focus.md#export)) |
| Demodaten | Fünf Beispielkonten (AWS, Alibaba Cloud, DeepSeek, OpenAI, Anthropic) mit zwölf Monaten Verlauf laden oder löschen |

**Aktualisieren** ruft Monate ab, die älter als das Aktualisierungsintervall
sind; **Aktualisierung erzwingen** ruft alle ab und kann Gebühren beim Anbieter
verursachen. Keines von beiden überschreibt einen importierten Monat. Demo-Konten
verwenden das Präfix `demo-`, tragen keine Zugangsdaten und werden von
Aktualisierungen übersprungen.

## Sprache der Oberfläche {#language}

CloudBridge 0.9.0 und neuer ist ins vereinfachte Chinesisch (简体中文)
übersetzt: jede Seite und jeder Dialog, das Menüleisten-Panel, sein Menü und die
Systembenachrichtigungen. Bis Sie unter **Einstellungen → Darstellung → Sprache**
eine Sprache wählen, folgt die App der des Systems, und eine Änderung wirkt
sofort. Die Browser-Demo folgt der Sprache des Browsers und hat einen Umschalter
in der Fußzeile ihrer Seitenleiste.

- Das Menü der Menüleiste übernimmt eine neue Sprache beim nächsten Start der
  App.
- Eine Warnung behält die Sprache, in der sie ausgelöst wurde. Eine Warnung zur
  Guthabenuntergrenze ist die Ausnahme: Sie wird mit ihren neuesten Zahlen in der
  aktuellen Sprache neu geschrieben.
- Beträge und Währungen werden wie bisher formatiert.

## Wo die Daten liegen {#storage}

| Plattform | Ort |
| --- | --- |
| macOS | `~/Library/Application Support/CloudBridge/` |
| Windows | `%APPDATA%\CloudBridge\data\` |
| Linux (Builds aus dem Quellcode) | `~/.local/share/CloudBridge/` |

- `billing.duckdb` — das Abrechnungshauptbuch mit der ursprünglichen Währung
  jeder Kostenposition, [Monatsende-Snapshots](overview.md#snapshots) und
  [Rechnungen](reconciliation.md);
- `cloudbridge.duckdb` — Konten, Budgets, Regeln und Warnungszustand;
- `raw/` — jede Antwort eines Anbieters und jede importierte Datei, nach Quelle,
  Konto und Monat, damit eine Korrektur der Zuordnung sie ohne neue Anfrage
  erneut lesen kann (**Konten → Normalisierung erneut anwenden**);
- `inventory/` und `tools/` — Einblicke-Scans und der Scanner, falls installiert;
- `config.json` — Währung, Design, Aktualisierungsintervall und
  Hintergrundeinstellungen.

## Sicherungen {#backups}

Beenden Sie CloudBridge, bevor Sie seine Datenbanken kopieren oder öffnen.
Sichern Sie das ganze Verzeichnis — beide Datenbanken, `raw/` und `config.json` —
und stellen Sie es mit geschlossener App wieder her. Zugangsdaten liegen im
Schlüsselbund des Betriebssystems, nicht in der Sicherung; geben Sie sie auf
einem anderen Rechner erneut ein. Um das Hauptbuch außerhalb der App zu
analysieren, fragen Sie eine Kopie ab statt die aktive Datei.

## Sicherheit {#security}

- Zugangsdaten werden im Schlüsselbund des Betriebssystems gehalten — macOS
  Keychain oder Windows Credential Manager; Secret Service bei Linux-Builds aus
  dem Quellcode —, getrennt von den Datenbanken.
- Die App verwendet Zugangsdaten nur für Anfragen an den Anbieter, zu dem sie
  gehören. Einen Schlüssel in CloudBridge zu verwenden macht ihn nicht
  schreibgeschützt: siehe [Berechtigungen der Anbieter](permissions.md).
- Es gibt keinen CloudBridge-Synchronisierungsdienst und keine Telemetrie. Ein
  Import stellt keine Anfrage an einen Anbieter.
- **Lokal heißt nicht verschlüsselt.** Die App verschlüsselt weder das Hauptbuch
  noch Rohdateien. Verwenden Sie Festplattenverschlüsselung und schützen Sie Ihre
  Sicherungen.
- Bevor Sie Protokolle, Screenshots oder Beispielexporte teilen, schwärzen Sie
  Zugangsdaten, Konto-IDs, Ressourcennamen und Tags.
