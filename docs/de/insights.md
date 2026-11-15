---
title: "Ungenutzte AWS- und Cloudflare-Ressourcen finden"
description: "CloudBridge Einblicke stellt der Rechnung einen schreibgeschützten Scan von AWS und Cloudflare gegenüber: gestoppte Instanzen, ungenutzte Adressen, Ressourcen ohne Eigentümer und ihre Kosten."
---

# Einblicke

**[English](../insights.md)**&emsp;**[中文](../zh/insights.md)**&emsp;**[日本語](../ja/insights.md)**&emsp;**[한국어](../ko/insights.md)**&emsp;**[Français](../fr/insights.md)**&emsp;**[Español](../es/insights.md)**&emsp;**[Português](../pt/insights.md)**&emsp;[Dokumentation](index.md)

Einblicke vergleicht die Rechnung mit dem, was tatsächlich läuft, und listet,
was einen Blick wert ist, jeweils bepreist aus der Rechnung dieser Periode.

## Einrichten und scannen {#scan}

Klicken Sie auf **Einrichten und scannen**. Beim ersten Mal fragt CloudBridge
vor der Installation seines Ressourcenscanners,
[corkscrew](https://github.com/JetSquirrel/corkscrew/tree/cloudbridge-dist),
nach — Open Source, unser gepflegter Fork, etwa 45 MB, im eigenen Datenordner
von CloudBridge aufbewahrt und gegen eine in die App eingebaute Prüfsumme
geprüft. Danach scannt er:

- jedes **AWS**-Konto mit seinem Zugriffsschlüssel, in jeder Region, die AWS
  standardmäßig aktiviert, oder nur in den von Ihnen gewählten;
- jedes **Cloudflare**-Konto mit seinem API-Token.

Der Scan liest nur — er listet Ressourcen und ändert nichts —, aber die
Zugangsdaten brauchen Lesezugriff darauf: siehe [AWS](aws.md#insights) und
[Cloudflare](cloudflare.md#insights). **Erneut scannen** aktualisiert den
Bestand. Das Scannen erfordert die Desktop-App unter macOS (Apple Silicon) oder
Windows.

## Was er findet {#findings}

Für AWS:

- **Gestoppte Instanzen**, deren Volumes weiterhin berechnet werden;
- **Ungenutzte öffentliche Adressen** — IPv4-Adressen, die zugewiesen, aber an
  nichts angehängt sind;
- **Ressourcen ohne Eigentümer** — kein Eigentümer-Tag (`owner`, `team`,
  `project`, `cost-center`, `business_line`) und kein Stack oder keine App, die
  sie verwaltet;
- **Berechnet, aber nicht im Scan** — in einer Region, die der Scan abdeckte.

Preise brauchen eine Rechnung auf Ressourcenebene: ein AWS-Konto, das auf seinen
[Data Export](aws.md#data-exports) zeigt. Ohne einen werden die Befunde
aufgelistet, nicht bepreist.

Für Cloudflare listet eine Karte, was der Scan nach Typ gefunden hat — Workers,
R2-Buckets, D1-Datenbanken, KV-Namespaces, Zonen, Durable Objects —, mit dem
Anteil jedes Typs und jeder Ressource an der Rechnung und ihrer Nutzung in dieser
Periode, das Teuerste zuerst. Mit [nach Ressource aufgeteilter
Rechnung](cloudflare.md#split) zeigt sich dort ein ausreißender Namespace oder
Bucket mit Namen.

## Sicherheitskonfiguration {#security}

Ab CloudBridge 0.9.0 kennzeichnet ein eigener Abschnitt AWS-Sicherheitsgruppen,
die SSH oder RDP ins ganze Internet öffnen (`0.0.0.0/0` oder `::/0`). Er liest
den Scan, ändert nichts in Ihrer Cloud und braucht keinen zusätzlichen
Datenstrom. Es ist keine Compliance-Prüfung oder vollständige
Sicherheitsüberprüfung, und seine Befunde werden nie mit Kostenbefunden
summiert.

Jede Gruppe zeigt **Befund**, **Nicht bewertet** oder **Bewertet, kein Befund**.
Öffnen Sie eine Zeile für die erkannte Regel, warum sie wichtig ist und was Sie
von Hand prüfen sollten. Eine öffentliche Regel ist kein Beweis für eine
Exposition: Bestätigen Sie, dass die Gruppe an etwas angehängt ist.

**Nicht bewertet** bedeutet, dass die eingehenden Regeln nicht gelesen werden
konnten, nicht dass die Gruppe sicher ist. Ohne Scan, mit einem teilweisen Scan
oder einem Scan, der keine Gruppen aufgelistet hat, sagt der Abschnitt das,
statt sauber zu wirken.

## Zusammenfassung zuerst {#summary}

Jede Karte öffnet sich mit ihren Ressourcentypen, mit Anzahlen und Kosten.
Klicken Sie auf einen Typ, um seine Ressourcen aufzulisten, fünfzig auf einmal
mit **Mehr anzeigen**; klicken Sie erneut, um ihn zu schließen. Ein großes Konto
bleibt eine Zeile pro Typ, bis Sie mehr verlangen.

Jeder Befund zeigt seine vollständige ID mit Kopierknopf, sein Konto und einen
Link zu seinen Kostenpositionen, sodass Sie ihn gegen die Rechnung prüfen
können.
