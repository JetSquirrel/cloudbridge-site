---
title: "Abrechnungs-API und Rechnungsimport von Alibaba Cloud"
description: "Verbinden Sie Alibaba Cloud (阿里云) über einen schreibgeschützten RAM-Benutzer mit CloudBridge oder importieren Sie Rechnungsdetails für Kosten pro Modell in Model Studio (百炼)."
---

# Alibaba Cloud

**[English](../alibaba-cloud.md)**&emsp;**[中文](../zh/alibaba-cloud.md)**&emsp;**[日本語](../ja/alibaba-cloud.md)**&emsp;**[한국어](../ko/alibaba-cloud.md)**&emsp;**[Français](../fr/alibaba-cloud.md)**&emsp;**[Español](../es/alibaba-cloud.md)**&emsp;**[Português](../pt/alibaba-cloud.md)**&emsp;[Dokumentation](index.md)

Alibaba Cloud bietet beide Kanäle. Die **Abrechnungs-API** liefert die Summe
jedes Produkts für den Monat; der **Rechnungsdetail-Export** liefert Zeilen auf
Instanzebene, einschließlich Model Studio (百炼) pro Modell mit Token-Zahlen.
Verwenden Sie die API für ein Konto, das sich selbst aktuell hält, und
importieren Sie den Export, wenn Sie die genauere Lesart möchten — ein
importierter Monat wird nie von einer Aktualisierung überschrieben.

## Abrechnungs-API {#api}

1. Öffnen Sie die [RAM-Konsole](https://ram.console.aliyun.com/) und erstellen
   Sie einen RAM-Benutzer für den API-Zugriff.
2. Hängen Sie die integrierte Systemrichtlinie `AliyunBSSReadOnlyAccess` an.
3. Erstellen Sie einen AccessKey für den Benutzer.
4. Fügen Sie das Konto in CloudBridge mit der AccessKey ID und dem Secret hinzu.

Verwenden Sie nicht den AccessKey des Hauptkontos. Für die Abrechnungs-API ist
hier keine Gebühr pro Abfrage dokumentiert; prüfen Sie die aktuellen Bedingungen
von Alibaba Cloud. Siehe [Berechtigungen der
Anbieter](permissions.md#alibaba-cloud).

## Rechnungsdetail-Export {#export}

Gehen Sie in der Konsole zu **Expenses and Costs → Bill Details → Export**,
laden Sie die vollständige Rechnung herunter und klicken Sie in der Zeile des
Kontos auf **Importieren**. Ein Import braucht keine Zugangsdaten. Siehe
[Rechnungsdatei importieren](bill-import.md).
