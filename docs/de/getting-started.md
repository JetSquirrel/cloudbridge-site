---
title: "CloudBridge installieren und die erste Rechnung lesen"
description: "Installieren Sie CloudBridge unter macOS oder Windows, sehen Sie sich mit der Demo-Rechnung um, fügen Sie Ihr erstes Konto hinzu und lesen Sie in wenigen Minuten Ihre erste Rechnung."
---

# Erste Schritte

**[English](../getting-started.md)**&emsp;**[中文](../zh/getting-started.md)**&emsp;**[日本語](../ja/getting-started.md)**&emsp;**[한국어](../ko/getting-started.md)**&emsp;**[Français](../fr/getting-started.md)**&emsp;**[Español](../es/getting-started.md)**&emsp;**[Português](../pt/getting-started.md)**&emsp;[Dokumentation](index.md)

CloudBridge liest Ihre Rechnungen von Cloud- und Modellanbietern in ein
einziges Hauptbuch auf Ihrem Rechner — aus einer Abrechnungs-API oder aus dem
Export, den Sie heruntergeladen haben — und zeichnet die Trends. Es gibt keine
Registrierung, keine Synchronisierung und keine Telemetrie. Diese Seite führt
Sie vom Download bis zur ersten Rechnung.

## 1. Installieren {#install}

Laden Sie die neueste Version von der
[Releases](https://github.com/JetSquirrel/cloudbridge/releases/latest)-Seite
herunter:

| Plattform | Datei |
| --- | --- |
| macOS (Apple Silicon) | `cloudbridge-macos-arm64.dmg` |
| Windows (x64) | `cloudbridge-windows-x64.exe` |

**macOS.** Öffnen Sie die `.dmg`, ziehen Sie **CloudBridge** in den Ordner
**Programme** und starten Sie die App von dort. Die Releases sind mit einer
Developer ID signiert und notarisiert, sodass sie ohne Umwege starten. Blockiert
macOS ein aktuelles Release, [melden Sie die genaue
Warnung](https://github.com/JetSquirrel/cloudbridge/issues) und Ihre
macOS-Version; entfernen Sie den Quarantäneschutz nicht routinemäßig als
Installationsschritt.

**Windows.** Die `.exe` ist nicht codesigniert, daher wird SmartScreen sie
wahrscheinlich mit *Windows hat den PC geschützt* stoppen. Prüfen Sie, ob die
Datei von der offiziellen Releases-Seite stammt, und klicken Sie dann auf
**Weitere Informationen** und **Trotzdem ausführen**. Windows merkt sich die
Auswahl für diese Datei; ein neues Release fragt erneut.

Linux- und Intel-Mac-Binaries werden nicht veröffentlicht. Der Build aus dem
Quellcode erfordert Rust 1.95 oder neuer — siehe die
[Entwicklungsumgebung](https://github.com/JetSquirrel/cloudbridge/blob/main/CONTRIBUTING.md#development-setup):

```bash
git clone https://github.com/JetSquirrel/cloudbridge.git
cd cloudbridge
cargo run --release
```

## 2. Sehen Sie sich zuerst um, wenn Sie möchten {#demo}

[Die Browser-Demo](https://cloudbridge.jetsquirrel.cloud/demo/) zeigt dieselben
Seiten mit einer Beispielrechnung. Sie speichert keine Zugangsdaten und
erreicht keinen Anbieter, daher sind der Import, das Aktualisieren aus einer
Abrechnungs-API und die SQL-Konsole nur in der Desktop-App verfügbar.

In der App bietet eine leere Übersicht **Demodaten laden** an, oder öffnen Sie
**Einstellungen → Demodaten**. Demo-Konten enthalten keine Zugangsdaten und
werden von Aktualisierungen übersprungen; **Demodaten löschen** auf derselben
Seite entfernt sie.

## 3. Ein Konto hinzufügen {#account}

Öffnen Sie **Konten**, klicken Sie auf **Konto hinzufügen**, wählen Sie die
Quelle und geben Sie einen Namen ein.

| Quelle | Wie die Rechnung ankommt | Was nötig ist |
| --- | --- | --- |
| Amazon Web Services | Abrechnungs-API | Access Key ID + Secret — [AWS](aws.md) |
| Microsoft Azure | Cost Management API | Client-ID + Secret + Abonnement-ID — [Azure](azure.md) |
| Google Cloud | BigQuery-Abrechnungsexport | Schlüsseldatei des Dienstkontos + Exporttabelle — [Google Cloud](google-cloud.md) |
| Alibaba Cloud | Abrechnungs-API oder ein Rechnungsexport | AccessKey ID + Secret — [Alibaba Cloud](alibaba-cloud.md) |
| Cloudflare | Abrechnungs-API | Konto-ID + API-Token — [Cloudflare](cloudflare.md) |
| DeepSeek | Guthaben-API oder ein Rechnungsexport | API-Schlüssel — [DeepSeek](deepseek.md) |
| Volcengine (火山引擎) | Rechnungsexport | Nichts |
| OpenAI | Rechnungsexport | Nichts |
| Anthropic (Claude) | Rechnungsexport | Nichts |

Klicken Sie auf **Speichern**. Eine API-Quelle ruft sofort die Rechnung dieses
und des letzten Monats ab, sodass ein falscher Schlüssel als fehlgeschlagener
Abruf sichtbar wird.

## 4. Die Rechnung hereinholen {#bill}

- **Eine API-Quelle** hat ihre Rechnung beim Speichern abgerufen.
  **Aktualisieren** in der Übersicht ruft erneut ab, sobald das
  Aktualisierungsintervall verstrichen ist.
- **Eine Dateiquelle** — Volcengine, OpenAI, Anthropic oder Alibaba Cloud und
  DeepSeek, wenn Sie es genauer brauchen — benötigt ihren Export: Laden Sie
  ihn aus der Konsole des Anbieters herunter und klicken Sie in der Zeile des
  Kontos auf **Importieren**. Siehe [Rechnungsdatei importieren](bill-import.md).

## 5. Lesen Sie sie {#read}

Die **Übersicht** zeigt das gewählte Zeitfenster: **MTD**, **30d** oder
**12m**. Wählen Sie USD oder CNY unter **Einstellungen → Berichte**. Von dort
aus:

- [Übersicht und Konten](overview.md) erklärt die Zahlen.
- [Warnungen, Regeln und Budgets](alerts.md) sagt Ihnen, wenn die Ausgaben
  springen.
- [Menüleiste und Hintergrund](background.md) hält das am Laufen, auch wenn
  das Fenster geschlossen ist.

Wird etwas nicht angezeigt? Siehe [Fehlerbehebung](troubleshooting.md).
