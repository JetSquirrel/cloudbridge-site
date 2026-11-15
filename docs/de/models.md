---
title: "LLM-Token-Kosten pro Modell"
description: "Die Seite Modelle in CloudBridge: was jedes LLM pro Token kostet, mit Ausgaben, Eingabe-, Ausgabe- und Cache-Tokens, gemischten Kosten pro Million und Befunden."
---

# Modelle

**[English](../models.md)**&emsp;**[中文](../zh/models.md)**&emsp;**[日本語](../ja/models.md)**&emsp;**[한국어](../ko/models.md)**&emsp;**[Français](../fr/models.md)**&emsp;**[Español](../es/models.md)**&emsp;**[Português](../pt/models.md)**&emsp;[Dokumentation](index.md)

Die Seite **Modelle** liest die LLM-Seite der Rechnung pro Modell, über den in
ihrer Kopfzeile gewählten Bereich. Konten von OpenAI, Anthropic und DeepSeek
erscheinen immer; Zeilen einer anderen Quelle erscheinen, wenn sie
token-abgerechnete Nutzung tragen, etwa Zeilen von Alibaba Cloud Model Studio,
Volcengine oder Amazon Bedrock. Das Modell ist die FOCUS-Spalte `ModelId` der
Rechnung oder das, was der Import nennt; eine Rechnung, die keines nennt, etwa
die von Model Studio oder Ark, gruppiert nach ihrem Produkt.

Tokens werden über ihre FOCUS-Eigenschaften `TokenDirection` und
`TokenCacheAction` unterschieden, nicht über den Zählernamen des Anbieters,
sodass dieselbe Token-Art auf jeder Rechnung gleich erscheint. Siehe [FOCUS und
Token-Daten](focus.md).

- Die Statistikzeile zeigt **KI-Ausgaben**, die gesamten **Tokens**, den
  **gemischten $/1M** (Kosten geteilt durch alle Tokens, pro Million) und den
  **Cache-Anteil** — Eingabetokens, die aus einem Prompt-Cache gelesen wurden,
  als Anteil aller Eingabetokens, Cache-Schreibvorgänge eingeschlossen.
- **Pro Modell** listet die Kosten jedes Modells und ihre Veränderung, seine
  IN-, OUT- und CACHE-Tokens, seinen gemischten $/1M und seinen Anteil an den
  Modellausgaben. CACHE sind aus dem Cache gelesene Tokens. IN ist der Rest der
  Eingabe: nicht gecachte Eingabe, in den Cache geschriebene Tokens und, bei
  einer Rechnung, die Ein- und Ausgabe zusammen zählt, diese Summe. Der Tooltip
  nennt, was jeweils enthalten ist. Zeilen mit Tokens, aber ohne Kosten zählen
  weiterhin in den Token-Spalten. Monat bis heute wird mit denselben Tagen des
  Vormonats verglichen, nicht mit dem ganzen Vormonat.
- **Tokens pro Tag** stellt das tägliche Token-Volumen dar.

## Befunde {#findings}

- Ein Modell, dessen Cache-Lesevorgänge unter 5 % seiner Eingabeseite liegen —
  Eingabepreis für das zahlen, was Cache-Preis sein könnte. Bei einer Rechnung,
  die Eingabe und Ausgabe nicht trennt, wird dieser Befund nicht gemeldet.
- Ein Modell über 70 % der Modellausgaben, wenn zwei oder mehr etwas kosten.
- Ein Ausgabenanstieg, den die Token-Zahlen der beiden Perioden dem Stückpreis
  statt der Nutzung zuschreiben.
- Ein Modell, das ohne Token-Abrechnung berechnet wird und dessen Stückkosten
  nicht berechnet werden können.

Modellnamen in den Abrechnungspositionstexten von Alibaba Cloud und Volcengine
werden noch nicht extrahiert.
