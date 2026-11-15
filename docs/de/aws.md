---
title: "AWS-Kosten mit Cost Explorer oder FOCUS verfolgen"
description: "Verbinden Sie ein AWS-Konto über Cost Explorer mit einer IAM-Richtlinie für eine einzige Aktion oder über einen FOCUS Data Export in S3 für Zeilen auf Ressourcenebene mit CloudBridge."
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[日本語](../ja/aws.md)**&emsp;**[한국어](../ko/aws.md)**&emsp;**[Français](../fr/aws.md)**&emsp;**[Español](../es/aws.md)**&emsp;**[Português](../pt/aws.md)**&emsp;[Dokumentation](index.md)

Ein AWS-Konto erreicht das Hauptbuch auf zwei Wegen. **Cost Explorer** ist der
schnelle: ein Zugriffsschlüssel und eine Richtlinie mit einer Aktion, und die
Rechnung kommt als Kosten pro Dienst und Tag. Ein **Data Export** in S3 ist der
detaillierte: Ressourcen-IDs, Tags und das verknüpfte Konto jeder Zeile — was
[Einblicke](insights.md) braucht, um eine Ressource zu bepreisen.

## Cost Explorer {#cost-explorer}

1. Öffnen Sie die [IAM-Konsole](https://console.aws.amazon.com/iam/), gehen Sie
   zu **Users** und **Create user**. Konsolenzugriff ist nicht nötig.
2. Wählen Sie beim neuen Benutzer **Add permissions → Create inline policy**,
   wechseln Sie zum JSON-Editor und fügen Sie die folgende Richtlinie ein (auch
   verfügbar als
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)).
3. Öffnen Sie den Tab **Security credentials** des Benutzers und klicken Sie auf
   **Create access key**. Kopieren Sie die Access Key ID und den Secret Access
   Key; AWS zeigt das Secret nur einmal.
4. Fügen Sie das Konto in CloudBridge mit diesem Schlüsselpaar hinzu.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Sie gewährt nur `ce:GetCostAndUsage`, die eine Cost-Explorer-Aktion, die
CloudBridge aufruft. Die Validierung des Schlüssels verwendet STS
`GetCallerIdentity`, das keine Berechtigung benötigt. Temporäre Anmeldedaten,
die ein Sitzungstoken erfordern, werden nicht unterstützt. [Berechtigungen der
Anbieter](permissions.md#aws) erläutert die Begründung und wie Sie sie
eingrenzen.

### Was es kostet {#cost}

Cost Explorer berechnet pro Anfrage. Eine Aktualisierung fragt zwei Monate pro
Konto ab — den letzten Monat und diesen —, je eine Anfrage, und mehr für einen
Monat, der so groß ist, dass Cost Explorer ihn in Seiten zurückgibt (höchstens
20). Das Aktualisierungsintervall hält den Hintergrundplan bei einer
Aktualisierung pro Intervall, sodass ein Konto bei den standardmäßigen 24
Stunden etwa zwei Anfragen pro Tag kostet. Ein Abruf, den AWS beantwortet hat,
den CloudBridge aber nicht speichern konnte, wird innerhalb des Intervalls
nicht wiederholt. **Aktualisierung erzwingen** umgeht all das; es ist der
einzige Weg, mehr auszugeben. Prüfen Sie die aktuelle AWS-Preisliste.

## Data Exports aus S3 {#data-exports}

CloudBridge kann AWS Data Exports (CUR 2.0, im Format *FOCUS 1.2 with AWS
columns*) aus dem S3-Bucket lesen, in den sie geliefert werden. Tragen Sie die
URI des Exports — `s3://bucket/prefix` — in das Feld **Data export S3 URI** des
Kontoformulars ein, und Aktualisieren liest von dort statt aus Cost Explorer.

- **Parquet oder gzip-komprimiertes CSV**, je nachdem, worauf der Export
  eingestellt ist.
- **Ein Monat zählt einmal.** Es werden nur die Dateien gelesen, die das
  Manifest der Periode nennt, daher zählt ein Export, der jede Lieferung
  aufbewahrt, einen Monat trotzdem einmal.
- **Nicht geliefert heißt nicht null.** Eine Periode, die der Export noch nicht
  geschrieben hat, wird übersprungen und nie als leerer Monat gespeichert.
- **Unverändert wird nicht erneut heruntergeladen.** Schlüssel, Größen und
  ETags der Dateien werden zuerst mit dem letzten Abruf verglichen; ein Monat,
  den AWS fertig geliefert hat, kostet pro Aktualisierung ein Listing und das
  Lesen eines Manifests.
- **Der Export eines Zahlers teilt sich nach Mitgliedskonto auf.** Jede Zeile
  behält das verknüpfte Konto, unter dem sie abgerechnet wurde.

Die Cost-Explorer-Richtlinie gewährt **keinen** S3-Zugriff: siehe
[Berechtigungen der Anbieter](permissions.md#aws-s3). S3-Speicher- und
Anfragegebühren fallen weiterhin an.

## Ressourcen scannen {#insights}

[Einblicke](insights.md) scannt ein AWS-Konto mit demselben Zugriffsschlüssel
und liest nur. Dafür braucht der Schlüssel Lesezugriff auf Ressourcen, etwa die
verwaltete AWS-Richtlinie `ReadOnlyAccess`.
