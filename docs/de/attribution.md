---
title: "Kostenzuordnung nach Geschäftsbereich, Tag und Dienst"
description: "Zuordnung in CloudBridge: ein Sankey von Quelle zu Dienst oder Modell zu Geschäftsbereich und Aufschlüsselungen nach Tag, Dienst, Region oder FOCUS-Kategorie."
---

# Zuordnung

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[日本語](../ja/attribution.md)**&emsp;**[한국어](../ko/attribution.md)**&emsp;**[Français](../fr/attribution.md)**&emsp;**[Español](../es/attribution.md)**&emsp;**[Português](../pt/attribution.md)**&emsp;[Dokumentation](index.md)

Die Seite **Zuordnung** zeichnet den Monat als Sankey: Quelle, dann Dienst oder
Modell, dann Geschäftsbereich, mit einem ausdrücklichen Knoten
**Nicht zugeordnet**. Die Flüsse sind Bruttonutzung — ein Nettofluss kann negativ
sein, was in einem Sankey nichts bedeutet. Eine Kostenposition wird über ihr
`business_line`-Tag einer Linie zugeordnet; ohne eines landet sie in Nicht
zugeordnet.

## Aufschlüsselung nach Dimension {#dimensions}

Ein Umschalter über der Aufschlüsselung wählt **Tag** (die Ansicht nach
Geschäftsbereich), **Dienst**, **Region** oder **Kategorie**. Die Dimensionen
außer Tag zeichnen sich als Treemap — **Karte**, wo die Fläche einer Kachel
ihre Kosten in dieser Periode und ihre Farbe die Veränderung zur vorherigen
Periode ist — oder als Anteilsbalken unter **Tabelle**. Kostenpositionen ohne
Wert für die Dimension erscheinen als *Other*. Eine Karte **Top-Ressourcen**
listet die teuersten Ressourcen der Periode.

## Dienstkategorien {#categories}

**Kategorie** verwendet die FOCUS-Dienstkategorien — Compute, Storage,
Databases, Networking, AI and Machine Learning und die übrigen —, dieselben bei
jeder Cloud, sodass Alibaba-Cloud-ECS, Volcengine-ECS und AWS-EC2 alle als
*Compute / Virtual Machines* zählen und Model Studio, Ark und die
Modellanbieter als *AI and Machine Learning / Generative AI*. Ein Produkt, das
noch keine Zuordnung kennt, erscheint als *Uncategorized* und taucht als Befund
im [Datenzustand](overview.md#data-health) auf.
