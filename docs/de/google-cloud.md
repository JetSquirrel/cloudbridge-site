---
title: "Google-Cloud-Kosten aus dem BigQuery-Abrechnungsexport"
description: "Verbinden Sie Google Cloud über den BigQuery-Export des Abrechnungskontos mit CloudBridge: Tageskosten nach Dienst, SKU, Projekt und Region, Gutschriften separat."
---

# Google Cloud

**[English](../google-cloud.md)**&emsp;**[中文](../zh/google-cloud.md)**&emsp;**[日本語](../ja/google-cloud.md)**&emsp;**[한국어](../ko/google-cloud.md)**&emsp;**[Français](../fr/google-cloud.md)**&emsp;**[Español](../es/google-cloud.md)**&emsp;**[Português](../pt/google-cloud.md)**&emsp;[Dokumentation](index.md)

Google Cloud hat keine API, die „Was hat dieser Monat gekostet“ beantwortet.
Seine Rechnung ist der Export, den ein Abrechnungskonto in ein
BigQuery-Dataset schreibt, und genau den liest CloudBridge: eine Abfrage pro
Monat, die Kosten **pro Tag** nach Dienst, SKU, Projekt und Region liefert.
Gutschriften — kostenloses Kontingent, Committed Use, Aktionen — kommen als
eigene Zeilen zurück, sodass die Nutzung das bleibt, was sie vor ihnen gekostet
hat.

## Den Export einschalten {#export}

Der Export enthält Daten ab dem Tag, an dem er eingeschaltet wird, tun Sie das
also zuerst, noch vor der Installation von CloudBridge.

1. Öffnen Sie in der Google-Cloud-Konsole **Billing → Billing export →
   BigQuery export**.
2. Klicken Sie unter **Standard usage cost** auf **Edit settings**, wählen Sie
   ein Projekt, erstellen Sie ein Dataset dafür (zum Beispiel `billing`) und
   speichern Sie.
3. Sobald die ersten Zeilen eintreffen — innerhalb eines Tages —, enthält das
   Dataset eine Tabelle namens `gcp_billing_export_v1_`, gefolgt von der ID des
   Abrechnungskontos. Öffnen Sie sie in BigQuery und verwenden Sie **Copy ID**:
   Das ist die *Billing export table*, die CloudBridge verlangt, etwa
   `my-project.billing.gcp_billing_export_v1_01AB23_45CD67_89EF01`.

## CloudBridge einen Schlüssel geben {#connect}

1. Öffnen Sie im Projekt des Export-Datasets **IAM & Admin → Service
   accounts** und erstellen Sie eines, etwa `cloudbridge`.
2. Gewähren Sie ihm **BigQuery Job User** auf dem Projekt, damit es eine
   Abfrage ausführen kann, und **BigQuery Data Viewer** auf dem Export-Dataset,
   damit die Abfrage die Tabelle lesen kann.
3. Öffnen Sie das Dienstkonto und dann **Keys → Add key → Create new key →
   JSON**. Bewahren Sie die heruntergeladene Datei an einem privaten Ort auf.
4. Fügen Sie in CloudBridge ein Konto für **Google Cloud** mit dem **Pfad** der
   Schlüsseldatei und der Abrechnungsexporttabelle hinzu.

CloudBridge speichert den Pfad, nicht den Schlüssel: Die Datei wird bei jedem
Abruf gelesen, sodass das Rotieren des Schlüssels nur das Ersetzen der Datei
bedeutet. Die Anmeldedatendatei, die `gcloud auth application-default login`
schreibt, funktioniert an ihrer Stelle, ebenso `GOOGLE_APPLICATION_CREDENTIALS`
mit **Anmeldedaten dieses Rechners verwenden**.

## Was die Rechnung zeigt {#detail}

| Spalte | Quelle |
| --- | --- |
| Dienst | `service.description` — *Compute Engine*, *Cloud Storage* |
| Beschreibung | Die SKU — *N2 Instance Core running in Americas* |
| Projekt | `project.id` und `project.name` |
| Region | `location.region` |
| Tag | Der Nutzungstag |
| Kategorie | Usage, Tax oder Adjustment aus `cost_type`; Gutschriften als Credit |

Ein Monat ist der **Rechnungsmonat**, wie auf der Google-Cloud-Rechnung. Spät
abgerechnete Nutzung landet in dem Monat, in dem sie in Rechnung gestellt
wurde, auch wenn sie im Vormonat lief.

Die Abfrage liest die gesamte Exporttabelle. BigQuery-Preise nach Bedarf gelten
ab dem monatlichen kostenlosen Kontingent; ein Abrechnungsexport ist
normalerweise weit kleiner, wächst aber, solange der Export läuft.
[Einblicke](insights.md) scannt keine Google-Cloud-Ressourcen.

Siehe [Berechtigungen der Anbieter](permissions.md#google-cloud) für die genauen
Endpunkte, die CloudBridge aufruft.
