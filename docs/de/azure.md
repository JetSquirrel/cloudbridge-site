---
title: "Azure-Kosten pro Dienst und Tag"
description: "Verbinden Sie ein Microsoft-Azure-Abonnement über einen Dienstprinzipal mit CloudBridge: tatsächliche Kosten aus Cost Management, täglich, nach Dienst und Kostenart."
---

# Microsoft Azure

**[English](../azure.md)**&emsp;**[中文](../zh/azure.md)**&emsp;**[日本語](../ja/azure.md)**&emsp;**[한국어](../ko/azure.md)**&emsp;**[Français](../fr/azure.md)**&emsp;**[Español](../es/azure.md)**&emsp;**[Português](../pt/azure.md)**&emsp;[Dokumentation](index.md)

CloudBridge liest die **tatsächlichen Kosten** eines Abonnements aus Azure Cost
Management: was jeder Dienst **pro Tag** gekostet hat, aufgeteilt nach
Kostenart. Eine gekaufte Reservierung, eine Gutschrift oder eine Steuer bleibt,
was sie ist, und wird nicht zur Nutzung addiert, sodass ein Monat mit einem
Einmalkauf nicht wie ein Monat aussieht, in dem sich die Nutzung verdreifacht
hat.

## Das Abonnement verbinden {#connect}

CloudBridge meldet sich als Dienstprinzipal an — eine App-Registrierung mit
eigenem Secret — und nicht als Sie.

1. Öffnen Sie im [Azure-Portal](https://portal.azure.com/) **Microsoft Entra
   ID → App registrations → New registration**. Geben Sie einen Namen wie
   `cloudbridge` an; alles andere im Formular ist unwichtig.
2. Öffnen Sie in der neuen Registrierung **Certificates & secrets → New client
   secret** und kopieren Sie den **Wert** des Geheimnisses — nicht seine
   Secret-ID. Er wird nur einmal angezeigt.
3. Öffnen Sie das Abonnement und dann **Access control (IAM) → Add role
   assignment**. Wählen Sie **Cost Management Reader** und weisen Sie die Rolle
   der App zu.
4. Fügen Sie in CloudBridge ein Konto für **Microsoft Azure** mit der
   **Application (client) ID** der Registrierung, dem Wert des Geheimnisses und
   der **Abonnement-ID** hinzu.

Sie brauchen die Mandanten-ID nicht: CloudBridge ermittelt, zu welchem Mandanten
das Abonnement gehört. Schlägt diese Ermittlung fehl, geben Sie das Abonnement
als `tenant-id/subscription-id` ein.

Eine Rollenzuweisung kann einige Minuten brauchen, bis sie wirkt. Wird der
erste Abruf direkt nach dem Anlegen abgelehnt, warten Sie und klicken Sie erneut
auf **Validieren**.

## Was die Rechnung zeigt {#detail}

| Spalte | Quelle |
| --- | --- |
| Dienst | Die Zählerkategorie — *Virtual Machines*, *Storage*, *Bandwidth* |
| Tag | Das Nutzungsdatum |
| Kategorie | Usage, Purchase, Credit (Gutschriften), Tax oder Adjustment, aus der Kostenart |
| Betrag | Tatsächliche Kosten in der Abrechnungswährung des Abonnements |

Die Abfrage berichtet nach Dienst, nicht nach Ressource oder Region, daher zeigt
die Aufschlüsselung nach Region unter [Zuordnung](attribution.md) für Azure
*Other*, und [Einblicke](insights.md) scannt keine Azure-Ressourcen.

Die Abfrage-API von Cost Management ist pro Mandant begrenzt. Ein Konto ist eine
Abfrage pro abgerufenem Monat; mehrere Abonnements im selben Mandanten teilen
sich das Limit, und ein gedrosselter Abruf wird bei der nächsten Aktualisierung
wiederholt.

## Anmeldedaten dieses Rechners verwenden {#system}

Auf einem Rechner, auf dem `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` und
`AZURE_SUBSCRIPTION_ID` gesetzt sind — die Variablen, die die Azure-SDKs lesen
—, aktivieren Sie **Anmeldedaten dieses Rechners verwenden**, und CloudBridge
liest sie bei jedem Abruf, statt eine Kopie zu speichern. `az login` allein
genügt nicht: Es hinterlässt einen angemeldeten Benutzer, nicht ein Secret, das
CloudBridge verwenden kann.

Siehe [Berechtigungen der Anbieter](permissions.md#azure) für die genauen
Endpunkte, die CloudBridge aufruft.
