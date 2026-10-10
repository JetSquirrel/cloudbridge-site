---
title: "A $10,811 Durable Object alarm"
description: "A dormant Cloudflare project looped through six trillion reads and writes and billed $10,811.41 before anyone knew. What happened, why nothing warned anyone, and how to make sure something warns you."
date: 2026-10-10
tag: Incident
---

# A $10,811 Durable Object alarm

<p class="post-meta">2026-10-10&emsp;Incident&emsp;<a href="./">All posts</a></p>

On 6 October a developer who posts as [浮世绘 (@shmily7)](https://x.com/shmily7) shared a Cloudflare invoice for **$10,811.41**. The cause, in their words: a Durable Object alarm caught in an infinite loop, about six trillion reads and writes. The project was a research prototype that nobody used. [The thread](https://x.com/shmily7/status/2108060782302990699) drew hundreds of thousands of views, and a lot of people went to check their own accounts.

It ended well, so that first: Cloudflare has agreed to refund the charges. But the way it happened is common enough to be worth taking apart.

## What happened

- **The bug sat for 23 days.** It was committed during development and then nothing happened, until the alarm began rescheduling itself. There was no error and no warning, because nothing failed: every run succeeded and billed.
- **The invoice was the first signal.** It was issued on 6 October, due the same day.
- **They paid it.** A request for a one-time waiver got automated replies, and emails warning that the account's services would be suspended kept coming, so on 8 October they paid in full. Asked in the replies why not just walk away, they answered (in our translation): *you make a mistake, you own it — you take the hit standing up.*
- **Then Cloudflare stepped in.** Ashley Peacock took it up internally, Cloudflare's CTO escalated it, and on 9 October Cloudflare decided to refund everything charged during the bug, with a detailed write-up of what had gone wrong.

They were not the only one. Others in the replies described bills from $1,000 to $10,000, each from a loop or a poll nobody had noticed.

## Why nothing warned anyone

Three things lined up.

**The billing has no stop.** A paid Durable Object is billed per request, per unit of duration and per row read and written. A loop does not fail; it just bills, and nothing halts a pay-as-you-go account at a spending limit. One reply said Cloudflare has announced spending caps, with a preview due by the end of the year. Until then, the limit is whatever the card allows.

**An alarm can schedule itself.** The usual way to do periodic work in a Durable Object is an `alarm()` handler that does the work and calls `setAlarm()` for the next run. If the next time is computed wrong, so that it lands now or in the past, the handler runs again at once and keeps going, reading and writing storage on every pass.

**Nobody was looking.** A project with no users has no traffic graph anyone opens and no error rate anyone reads, and this loop produced no errors to read. Without someone looking, nothing turns usage into a warning.

The first two are Cloudflare's to change and the developer's to guard against. The third is what tooling can fix.

## What a daily ledger would have shown

CloudBridge reads Cloudflare's billable usage per day and, with Account Analytics on the token, splits the Durable Objects lines across namespaces. It is worth being precise about what that would and would not have done here.

- **It would have had the loop the next day.** The namespace's rows read and written land in the ledger by day, including the part inside the free allowance at a cost of zero, because that is where a loop starts.
- **The anomaly rule would have stayed silent.** It compares each service with its own last seven days, and a project that cost nothing has a baseline of zero. We deliberately do not call a first appearance "growth": most new spend is a new workload, not a runaway. For this case that is the wrong answer, and it is a gap we know about.
- **A forecast budget rule would have fired on the first refresh.** The month-end forecast averages the month's spend from the first day that had any, so a dormant project's first expensive day is projected across the rest of the month. As an illustration: a loop that bills $300 on its first day, with 20 days left, forecasts more than $6,000. Against a monthly budget of $20, that alert fires on the first refresh that reads the day.
- **It would not have stopped anything.** CloudBridge reads bills with a read-only token. It cannot pause a Worker, and it should not be able to. What it changes is when you find out: within one refresh interval (six hours at the shortest) of Cloudflare reporting the day, instead of at the invoice.

The setup takes a minute per account: a monthly budget, an Account budget rule on the month-end forecast, a 6-hour refresh interval, and the app left running in the menu bar. [Catch a runaway](../cloudflare.md#runaway) has the steps. Do it for the quiet accounts too. They are the ones nobody is watching.

## Guarding the alarm itself

A warning shortens a runaway; it does not prevent one. In the Durable Object itself:

- **Re-arm on purpose.** Have `alarm()` call `setAlarm()` only when there is more work, and compute the next time from now with a floor, so it can never be scheduled for the past.
- **Count the runs.** Keep a counter in storage per hour or per day. Past a ceiling no real workload reaches, stop re-arming and log it loudly.
- **Clear alarms when idle.** Call `deleteAlarm()` when an object has nothing left to do.
- **Take down what nobody uses.** A deployed prototype is still a live billing account. If it is not needed this month, delete the Worker.

## What's next

The 0.5.0 release notes said that Cloudflare findings would start with Durable Object namespaces whose objects keep alarms set. This incident is the reason. The anomaly rule's blind spot for spend that starts from zero is a known gap; until it is closed, the budget rule covers it.

Thanks to the author of the thread for telling the whole story in public, refund and all.
