---
title: "Minimal nötige Abrechnungsberechtigungen pro Anbieter"
description: "Die Berechtigungen mit minimalem Umfang, die CloudBridge für AWS Cost Explorer und S3, Azure Cost Management, Google Cloud BigQuery, Alibaba Cloud RAM, Cloudflare-API-Token und DeepSeek-Schlüssel braucht."
---

# Berechtigungen der Anbieter

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[日本語](../ja/permissions.md)**&emsp;**[한국어](../ko/permissions.md)**&emsp;**[Français](../fr/permissions.md)**&emsp;**[Español](../es/permissions.md)**&emsp;**[Português](../pt/permissions.md)**&emsp;[Dokumentation](index.md)

Verwenden Sie eigene Zugangsdaten mit dem geringsten Umfang, den der jeweilige
Kanal braucht. Schreibgeschütztes Verhalten in der App macht einen
uneingeschränkten Schlüssel nicht schreibgeschützt: Die beim Anbieter
angehängten Richtlinien entscheiden, was ein Schlüssel tun kann. Verwenden Sie
keine Zugangsdaten des Root-Kontos und gewähren Sie keinen Administratorzugriff,
nur um eine Rechnung zu lesen.

CloudBridge speichert Zugangsdaten im Schlüsselbund des Betriebssystems und
verwendet sie nur, um Anfragen an den Anbieter zu authentifizieren, zu dem sie
gehören. Es gibt keinen CloudBridge-Synchronisierungsdienst und keine
Telemetrie. Veröffentlichen Sie niemals echte Schlüssel, Zugangsdatendateien
oder ungeschwärzte Abrechnungsexporte in öffentlichen Issues, Protokollen,
Screenshots oder Pull Requests, und widerrufen Sie jeden Schlüssel, der
offengelegt wurde.

<!-- Die alte Seite zu den Berechtigungen, auf die aus CloudBridge 0.5.0 und früher verlinkt wurde, nannte diesen Abschnitt aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
gewährt nur `ce:GetCostAndUsage`, die Cost-Explorer-Aktion, die CloudBridge
verwendet. Die Validierung eines Schlüssels ohne Export-URI verwendet STS
`GetCallerIdentity`, das [keine
Berechtigung braucht](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html).
Die Richtlinie behält `Resource: "*"` für Cost-Explorer-Lesevorgänge; sie
gewährt keinen Zugriff auf andere Dienste.

1. Erstellen Sie in der [IAM-Konsole](https://console.aws.amazon.com/iam/) eine
   kundenverwaltete Richtlinie aus der Vorlage oder fügen Sie sie dem Benutzer
   inline hinzu.
2. Hängen Sie sie an einen dedizierten IAM-Benutzer ohne unzusammenhängende
   weitreichende Berechtigungen.
3. Erstellen Sie einen Zugriffsschlüssel für diesen Benutzer und geben Sie ihn in
   CloudBridge ein.
4. Rotieren Sie den Schlüssel gemäß der Richtlinie Ihrer Organisation.

Nur ein Paar aus Access-Key-ID und Secret wird akzeptiert; temporäre
Anmeldedaten, die ein Sitzungstoken erfordern, nicht. Organisationsrichtlinien
und Abrechnungseinstellungen auf Kontoebene können den Zugriff dennoch
einschränken. Cost-Explorer-Anfragen können Gebühren verursachen — siehe [was es
kostet](aws.md#cost).

## AWS Data Exports aus S3 {#aws-s3}

Die Cost-Explorer-Richtlinie gewährt **keinen** Zugriff auf einen Export-Bucket.
Begrenzen Sie `s3:ListBucket` auf den Export-Bucket und das Präfix und
`s3:GetObject` auf die Objekte unter diesem Präfix. Mit einem kundenverwalteten
KMS-Schlüssel verschlüsselte Objekte können zusätzlich `kms:Decrypt` und eine
passende Schlüsselrichtlinie erfordern, und Bucket-Richtlinien und
Organisationseinschränkungen müssen die Lesevorgänge erlauben. CloudBridge liest
einen vorhandenen Export; es braucht keine Berechtigung, Exporte zu erstellen
oder Objekte zu schreiben. S3-Speicher- und Anfragegebühren fallen weiterhin an.

## AWS-Ressourcenscans {#aws-scan}

[Einblicke](insights.md) scannt mit demselben Schlüssel und listet und
beschreibt nur Ressourcen. Geben Sie dem Schlüssel Lesezugriff darauf, etwa die
verwaltete Richtlinie `ReadOnlyAccess`, oder eine engere schreibgeschützte
Richtlinie für die Dienste, die gescannt werden sollen.

## Alibaba Cloud {#alibaba-cloud}

Für die Abrechnungs-API ist `AliyunBSSReadOnlyAccess` die integrierte
schreibgeschützte Abrechnungsrichtlinie. Sie ist weiter gefasst als eine
endpunktspezifische benutzerdefinierte Richtlinie; prüfen Sie ihren Umfang
gegen Ihre Anforderungen.

1. Erstellen Sie in der [RAM-Konsole](https://ram.console.aliyun.com/) einen
   dedizierten RAM-Benutzer.
2. Hängen Sie `AliyunBSSReadOnlyAccess` an, oder eine eingegrenzte
   benutzerdefinierte Richtlinie für die Abrechnungsvorgänge, die Sie verwenden.
3. Erstellen Sie einen AccessKey und geben Sie ihn in CloudBridge ein.

Verwenden Sie nicht den AccessKey des Hauptkontos. Das Importieren eines
Rechnungsexports braucht keine Zugangsdaten.

## Microsoft Azure {#azure}

Ein Dienstprinzipal — eine App-Registrierung mit einem Clientgeheimnis — mit der
integrierten Rolle **Cost Management Reader** auf dem Abonnement. Diese Rolle
liest Kosten- und Nutzungsdaten und sonst nichts; geben Sie der App weder
*Reader*, *Contributor* noch *Owner*, damit sie funktioniert.

| Anfrage | Wofür |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`, nicht authentifiziert | Ermitteln des Mandanten des Abonnements aus der `401`-Aufforderung. Wird übersprungen, wenn das Abonnement als `tenant-id/subscription-id` eingegeben wird |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | Ein Token für Azure Resource Manager über den Client-Credentials-Grant |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | Die tatsächlichen Kosten des Monats, täglich, nach Dienst und Kostenart |

Die Client-ID und die Abonnement-ID sind keine Geheimnisse. Das Clientgeheimnis
ist eines und wird im Schlüsselbund des Betriebssystems aufbewahrt; geben Sie ihm
die kürzeste Gültigkeit, die Ihre Organisation erlaubt, und ersetzen Sie es in
CloudBridge, wenn es rotiert wird.

## Google Cloud {#google-cloud}

Ein Dienstkonto im Projekt des Abrechnungsexports, mit **BigQuery Job User** auf
dem Projekt und **BigQuery Data Viewer** nur auf dem Export-Dataset — nicht auf
dem Projekt, wo es auch alle anderen Datasets lesen würde.

| Anfrage | Wofür |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | Ein Token aus einer mit dem Schlüssel des Dienstkontos signierten Assertion |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | Ein Abfragejob pro Monat über die Exporttabelle |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | Die restlichen Ergebnisseiten des Jobs |

Der Abfragejob läuft im Projekt der Tabelle und wird dort zu BigQuery-Preisen
nach Bedarf abgerechnet, sobald das kostenlose Kontingent überschritten ist.
CloudBridge speichert den Pfad der Schlüsseldatei, nicht den Schlüssel; schützen
Sie die Datei wie jeden Dienstkontoschlüssel und löschen Sie den Schlüssel in der
Konsole, sobald er nicht mehr verwendet wird. Eine Datei mit
Benutzeranmeldedaten aus `gcloud auth application-default login` funktioniert
ebenfalls und fragt dann mit dem Zugriff dieses Benutzers ab.

## Cloudflare {#cloudflare}

Erstellen Sie ein benutzerdefiniertes API-Token, das unter **Account Resources**
auf das eine Konto beschränkt ist, das CloudBridge lesen soll. Verwenden Sie
nicht den Global API Key: Er trägt alle Berechtigungen des Benutzers.

| Berechtigung | Wofür | Aufrufe |
| --- | --- | --- |
| Account → Billing → Read | Die Rechnung | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | Sie nach Ressource aufteilen | `POST /graphql` |
| Read auf Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1 | Der Einblicke-Scan | Die Konto-API, über den Scanner |

Nur die erste ist erforderlich. Die Konto-ID ist kein Geheimnis — sie ist Teil
des Anfragepfads; das Token ist eines und wird wie jede andere
Anmeldeinformation im Schlüsselbund des Betriebssystems aufbewahrt.

## DeepSeek {#deepseek}

Die API-Integration verwendet einen Plattformschlüssel von
[platform.deepseek.com](https://platform.deepseek.com/) für `GET /user/balance`.
Das ist ein Lesevorgang, aber **der Schlüssel selbst ist nicht zwingend
schreibgeschützt**: Er kann auch Modellanfragen autorisieren und Ausgaben
verursachen, wenn er anderswo verwendet wird. Behandeln Sie ihn als
Ausgaben-Zugangsdaten, nutzen Sie alle Einschränkungen, die DeepSeek bietet, und
teilen Sie ihn nicht. Das Importieren des Nutzungsdownloads braucht keinen
Schlüssel.

## Volcengine, OpenAI und Anthropic {#file-sources}

Diese Quellen verwenden nur lokale Rechnungsexporte. CloudBridge verlangt für
sie keine Zugangsdaten, und ein Import stellt keine Anfrage an einen Anbieter.
Erstellen Sie keinen Administrator- oder Organisationsschlüssel für sie, solange
nicht tatsächlich ein API-Kanal einen braucht.
