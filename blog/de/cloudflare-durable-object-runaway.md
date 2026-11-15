---
title: "Ein Durable-Object-Alarm über 10.811 $"
description: "Ein ruhendes Cloudflare-Projekt durchlief sechs Billionen Lese- und Schreibvorgänge und stellte 10.811,41 $ in Rechnung, bevor irgendjemand davon wusste. Was passiert ist, warum niemand gewarnt wurde und wie Sie dafür sorgen, dass etwas Sie warnt."
date: 2026-10-10
tag: Vorfall
---

# Ein Durable-Object-Alarm über 10.811 $

<p class="post-meta">2026-10-10&emsp;Vorfall&emsp;<a href="./">Alle Beiträge</a></p>

Am 6. Oktober teilte ein Entwickler, der als [浮世绘 (@shmily7)](https://x.com/shmily7) schreibt, eine Cloudflare-Rechnung über **10.811,41 $**. Die Ursache, in seinen Worten: ein Durable-Object-Alarm, der in einer Endlosschleife gefangen war und dabei ungefähr sechs Billionen Lese- und Schreibvorgänge durchlief. Das Projekt selbst war nur ein ruhender Forschungsprototyp, den niemand benutzte. [Der Thread](https://x.com/shmily7/status/2108060782302990699) erreichte Hunderttausende Aufrufe, und so mancher Entwickler ging still seine eigenen Dashboards prüfen.

![Die Cloudflare-Rechnung: 10.811,41 USD, ausgestellt und fällig am 6. Oktober 2026](../images/cloudflare-invoice.jpg)

<p class="caption">Die Rechnung, wie sie von <a href="https://x.com/shmily7">@shmily7</a> gepostet wurde; die Abrechnungsdetails wurden vom Autor unkenntlich gemacht.</p>

Die Geschichte ging gut aus, also zuerst dieser Teil: Cloudflare hat zugestimmt, die Belastungen zu erstatten. Trotzdem ist die Art, wie es dazu kam, verbreitet genug, dass es sich lohnt, sie auseinanderzunehmen.

## Was passiert ist

- **Der Fehler lag 23 Tage lang da.** Er kam während der Entwicklung hinein und lag dann still, bis der Alarm begann, sich selbst neu zu planen. Weil nichts fehlschlug, gab es keinen Fehler und keine Warnung: Jede einzelne Ausführung war erfolgreich und wurde abgerechnet.
- **Die Rechnung war das erste Signal.** Cloudflare stellte sie am 6. Oktober aus, fällig am selben Tag.
- **Sie haben sie bezahlt.** Eine Support-Anfrage auf einen einmaligen Erlass lief in automatische Antworten, und E-Mails mit der Warnung, dass Kontodienste gesperrt würden, trafen weiter ein, also zahlten sie am 8. Oktober vollständig. Auf die Frage in den Antworten, warum sie nicht einfach davongingen, antworteten sie (in unserer Übersetzung): *Du machst einen Fehler, du stehst dazu – du nimmst den Schlag im Stehen hin.*
- **Dann schritt Cloudflare ein.** Ashley Peacock nahm es intern auf, der CTO von Cloudflare eskalierte es, und am 9. Oktober entschied Cloudflare, alles zu erstatten, was während des Fehlers berechnet worden war, begleitet von einer ausführlichen Darstellung dessen, was schiefgelaufen war.

![Die Zahlungsseite von Cloudflare mit dem offenen Saldo von 10.811,41 $, heute fällig, mitten im Zahlungsvorgang](../images/cloudflare-payment.jpg){.portrait}

<p class="caption">Den Saldo am 8. Oktober bezahlen. Gepostet von <a href="https://x.com/shmily7">@shmily7</a>; wir haben die Rechnungsnummer und die letzten vier Ziffern der Karte entfernt.</p>

Sie waren nicht allein. Andere Entwickler in den Antworten nannten Rechnungen zwischen 1.000 $ und 10.000 $, jede ausgelöst von einer unbemerkten Schleife oder einer Polling-Routine.

## Warum niemand gewarnt wurde

Drei Dinge kamen hier zusammen.

**Die Abrechnung hat keinen Stopp.** In einem bezahlten Plan rechnet ein Durable Object pro Anfrage, pro Einheit Dauer und pro gelesener und geschriebener Zeile ab. Eine Schleife stürzt nicht ab; sie rechnet einfach weiter ab, und nichts hält ein Konto mit nutzungsbasierter Abrechnung bei einer Ausgabengrenze an. Eine Antwort merkte an, dass Cloudflare Ausgabenobergrenzen angekündigt hat, mit einer Vorschau bis Ende des Jahres. Bis das kommt, ist die Obergrenze das, was die Karte durchlässt.

**Ein Alarm kann sich selbst planen.** Der übliche Weg, periodische Arbeit in einem Durable Object zu erledigen, ist ein `alarm()`-Handler, der seine Aufgabe ausführt und `setAlarm()` für den nächsten Lauf aufruft. Wenn die Berechnung dieses nächsten Zeitpunkts in der Vergangenheit oder genau jetzt landet, feuert der Handler sofort erneut und läuft weiter, wobei er bei jedem Durchgang den Speicher liest und schreibt.

**Niemand schaute hin.** Ein Projekt ohne Nutzer hat keine Traffic-Diagramme, die jemand prüft, und keine Fehlerprotokolle zum Durchsehen, und diese Schleife warf nie einen Fehler. Ohne menschliche Augen wird hohe Nutzung nie von selbst zur Warnung.

Die ersten beiden liegen bei Cloudflare zu ändern und beim Entwickler abzusichern. Beim dritten kann Werkzeug helfen.

## Was ein tägliches Hauptbuch gezeigt hätte

CloudBridge ruft die abrechenbare Nutzung von Cloudflare jeden Tag ab und teilt, wenn Account Analytics am Token freigegeben ist, die Durable-Objects-Zeilen nach Namespaces auf. Es lohnt sich, genau zu sein, was das in diesem Fall getan hätte und was nicht.

- **Es hätte die Schleife am nächsten Tag gehabt.** Die gelesenen und geschriebenen Zeilen des Namespace landen täglich im Hauptbuch, einschließlich des Anteils, den das Freikontingent abdeckt, zu Kosten von null – und dort beginnt eine Schleife.
- **Die Anomalie-Regel wäre still geblieben.** Sie bewertet jeden Dienst gegen seine eigenen vorangegangenen sieben Tage, und ein Projekt, das nichts kostete, hat eine Basislinie von null. Wir vermeiden es bewusst, ein erstes Auftreten als „Wachstum“ zu markieren: Die meisten neuen Ausgaben sind einfach eine neue Arbeitslast und kein Ausreißer. Hier war das das falsche Ergebnis, und es ist eine bekannte Lücke in unserer Logik.
- **Eine Budgetregel auf Basis der Prognose hätte bei der ersten Aktualisierung ausgelöst.** Die Prognose zum Monatsende mittelt die Ausgaben ab dem ersten Tag mit Belastungen und projiziert diese Rate durch den Rest des Monats. In Zahlen: Eine Schleife, die am ersten Tag 300 $ abrechnet, projiziert bei 20 verbleibenden Tagen auf mehr als 6.000 $. Gegen ein bescheidenes Monatsbudget von 20 $ löst diese Regel bei der ersten Aktualisierung aus, die den Tag liest.
- **Es hätte nichts gestoppt.** CloudBridge liest Rechnungen mit einem schreibgeschützten Token. Es kann einen Worker nicht pausieren, und es sollte die Macht dazu nicht haben. Was sich ändert, ist Ihr Zeitrahmen: Sie erfahren es innerhalb eines Aktualisierungsintervalls (so kurz wie sechs Stunden), nachdem Cloudflare den Tag meldet, statt auf die Rechnung zu warten.

Die Einrichtung dauert etwa eine Minute pro Konto: ein Monatsbudget festlegen, eine Regel für das Kontobudget auf Basis der Prognose zum Monatsende hinzufügen, ein Aktualisierungsintervall von 6 Stunden wählen und die App in der Menüleiste laufen lassen. [Einen Ausreißer fangen](https://cloudbridge.jetsquirrel.cloud/docs/cloudflare#runaway) führt durch die Schritte. Es lohnt sich auch für stille Konten, denn genau die sind es, die niemand beobachtet.

## Den Alarm selbst absichern

Eine Warnung verkürzt einen Ausreißer; sie verhindert keinen. Innerhalb des Durable Object selbst:

- **Bewusst neu scharf schalten.** Lassen Sie `alarm()` nur dann `setAlarm()` aufrufen, wenn noch Arbeit zu tun ist, und berechnen Sie den nächsten Zeitpunkt von jetzt aus mit einer Untergrenze, sodass er nie in der Vergangenheit geplant werden kann.
- **Die Läufe zählen.** Führen Sie einen Zähler im Speicher pro Stunde oder pro Tag. Sobald er eine Obergrenze überschreitet, die keine echte Arbeitslast je erreichen sollte, hören Sie auf, neu scharf zu schalten, und protokollieren Sie es laut.
- **Alarme löschen, wenn nichts zu tun ist.** Rufen Sie `deleteAlarm()` auf, wann immer ein Objekt nichts mehr zu tun hat.
- **Abschaffen, was niemand nutzt.** Ein bereitgestellter Prototyp ist weiterhin an ein aktives Abrechnungskonto gebunden. Wenn er diesen Monat nicht gebraucht wird, löschen Sie den Worker.

## Wie es weitergeht

Die Versionshinweise zu 0.5.0 sagten, dass Cloudflare-Befunde mit Durable-Object-Namespaces beginnen würden, deren Objekte weiterhin Alarme gesetzt halten. Genau das ist der Fall, den sie fangen sollen. Der blinde Fleck der Anomalie-Regel für Ausgaben, die bei null beginnen, ist eine bekannte Lücke; bis sie geschlossen ist, deckt die Budgetregel ihn ab.

Dank an den Autor des Threads, dass er die ganze Geschichte öffentlich erzählt hat, Erstattung inklusive.
