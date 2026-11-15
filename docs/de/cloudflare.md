---
title: "Cloudflare-Kosten pro R2-Bucket, Worker und D1"
description: "Verbinden Sie Cloudflare über ein API-Token mit CloudBridge: tägliche abrechenbare Nutzung, aufgeteilt auf R2-Buckets, Workers, D1 und Durable Objects."
---

# Cloudflare

**[English](../cloudflare.md)**&emsp;**[中文](../zh/cloudflare.md)**&emsp;**[日本語](../ja/cloudflare.md)**&emsp;**[한국어](../ko/cloudflare.md)**&emsp;**[Français](../fr/cloudflare.md)**&emsp;**[Español](../es/cloudflare.md)**&emsp;**[Português](../pt/cloudflare.md)**&emsp;[Dokumentation](index.md)

CloudBridge liest die abrechenbare Nutzung von Cloudflare: Ausgaben pro Dienst,
**pro Tag**. Das ist der Punkt. Ein Worker oder Durable Object, der in eine
Schleife gerät, steht am nächsten Tag im Hauptbuch, nicht erst auf der Rechnung
am Monatsende — und Nutzung innerhalb des kostenlosen Kontingents wird ebenfalls
erfasst, mit Kosten von null daneben, denn dort beginnt ein Ausreißer.

## Das Konto verbinden {#connect}

1. Gehen Sie im
   [Cloudflare-Dashboard](https://dash.cloudflare.com/profile/api-tokens) zu
   **My Profile → API Tokens → Create Token** und beginnen Sie mit
   **Create Custom Token**.
2. Gewähren Sie **Account → Billing → Read** und beschränken Sie **Account
   Resources** auf das zu überwachende Konto.
3. Kopieren Sie die Konto-ID von der Startseite des Kontos im Dashboard.
4. Fügen Sie das Konto in CloudBridge mit der Konto-ID und dem Token hinzu.

Die API für abrechenbare Nutzung deckt nur Pay-as-you-go-Konten (Self-Serve) ab
und ist eine Alpha-API; ein Enterprise-Konto wird als nicht abgedeckt gemeldet.
Cloudflare rechnet in einem Zyklus ab, der am Beginn des Abonnements verankert
ist; jeder Kalendermonat in CloudBridge enthält die Tage, die in ihn fallen.

## Nach Ressource aufteilen {#split}

Die Rechnung endet beim Dienst — *R2 Class B operations, 734 on 3 October* —,
nicht beim einzelnen Bucket. Fügen Sie dem Token **Account → Account Analytics
→ Read** hinzu, und CloudBridge fragt die GraphQL Analytics API nach der Nutzung
jeder Ressource bei den Zählern, die die Rechnung nennt, und teilt dann die
Tageszeile nach diesen Anteilen auf:

| Rechnung | Aufgeteilt auf |
| --- | --- |
| R2-Operationen der Klassen A und B, Speicher | R2-Buckets |
| Workers-Anfragen und CPU | Workers (nach Anfragen) |
| D1-Zeilen gelesen und geschrieben, Speicher | D1-Datenbanken |
| Durable-Objects-Anfragen, Dauer, Zeilen, Speicher | Durable-Object-Namespaces |

Die Teile ergeben zusammen, was Cloudflare abgerechnet hat, und sind als
Schätzungen gekennzeichnet: Analysen werden gesampelt, und ein kostenloses
Kontingent gehört dem Konto, nicht einer einzelnen Ressource. Ein Zähler, den
die Analyse nicht aufteilen kann — KV, Queues, alles Unbekannte —, oder ein
Token ohne die Berechtigung behält seine Zeile ganz, beim Konto.
[Einblicke](insights.md) zeigt den Anteil jeder Ressource und ihre Nutzung in
dieser Periode.

## Einen Ausreißer erkennen {#runaway}

Nichts stoppt ein Pay-as-you-go-Konto von Cloudflare bei einer Ausgabengrenze,
daher rechnet ein Durable-Object-Alarm oder ein Worker, der in einer Schleife
läuft, ab, solange er läuft. CloudBridge kann ihn auch nicht stoppen; aber es
kann es Ihnen am ersten Tag sagen statt erst auf der Rechnung. Richten Sie das
für jedes Cloudflare-Konto ein, auch für die ruhigen — ein Projekt, das niemand
nutzt, ist genau das, auf das niemand achtet:

1. Geben Sie dem Konto auf der Seite **Regeln** ein **Monatsbudget**: was ein
   normaler Monat kostet, mit etwas Spielraum. Die Regel unten misst daran und
   bewirkt nichts für ein Konto ohne eines.
2. Klicken Sie auf **Neue Regel**, wählen Sie **Kontobudget** für das Konto und
   setzen Sie **Basierend auf** auf **Prognose zum Monatsende**.
3. Verkürzen Sie unter **Einstellungen → Aktualisierung** das
   Aktualisierungsintervall auf 6 Stunden und lassen Sie CloudBridge in der
   [Menüleiste](background.md) laufen, mit aktiviertem
   **Bei der Anmeldung öffnen**.

Die Prognose macht das möglich. Sie mittelt die Ausgaben des Monats ab dem ersten
Tag, an dem es welche gab, sodass der erste Tag einer Schleife auf den Rest des
Monats hochgerechnet wird und die Regel bei der ersten Aktualisierung auslöst,
die diesen Tag liest.

Die **Kostenwachstumsanomalie** erkennt diesen Fall nicht. Sie vergleicht einen
Dienst mit seinen eigenen letzten sieben Tagen, und ein Dienst, der nichts
gekostet hat, hat keine Basislinie, von der aus er wachsen könnte, sodass ein
ruhendes Projekt, das in einer Schleife aufwacht, sie nie auslöst.

Wenn die Warnung auslöst, stoppen Sie den Worker oder das Durable Object im
Cloudflare-Dashboard. Mit **Account Analytics** auf dem Token zeigt
[Einblicke](insights.md) den Anteil jedes Workers und jedes Namespace an der
Rechnung, sodass der dahinter auffällt.

## Ressourcen scannen {#insights}

[Einblicke](insights.md) scannt das Konto mit demselben Token und liest nur.
Fügen Sie dafür diese **Read**-Berechtigungen für dasselbe Konto hinzu:
**Account Settings**, **Zone**, **Workers Scripts**, **Workers R2 Storage**,
**Workers KV Storage**, **Queues** und **D1**. Ein Token ohne sie liest die
Rechnung trotzdem; der Scan sagt, was ihm verweigert wurde.

Siehe [Berechtigungen der Anbieter](permissions.md#cloudflare) für die genauen
Endpunkte, die CloudBridge aufruft.
