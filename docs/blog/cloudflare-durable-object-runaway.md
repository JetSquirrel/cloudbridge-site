---
title: "A $10,811 Durable Object alarm"
description: "A dormant Cloudflare project looped through six trillion reads and writes and billed $10,811.41 before anyone knew. What happened, why nothing warned anyone, and how to make sure something warns you."
date: 2026-10-10
tag: Incident
---

# A $10,811 Durable Object alarm

<p class="post-meta">2026-10-10&emsp;Incident&emsp;<a href="./">All posts</a></p>

On 6 October a developer who posts as [浮世绘 (@shmily7)](https://x.com/shmily7) shared a Cloudflare invoice for **$10,811.41**. The cause, in their words: a Durable Object alarm caught in an infinite loop, churning through roughly six trillion reads and writes. The project itself was just an idle research prototype nobody was using. [The thread](https://x.com/shmily7/status/2108060782302990699) drew hundreds of thousands of views, and quite a few developers quietly went to check their own dashboards.

The story ended well, so that part first: Cloudflare has agreed to refund the charges. Still, the way it happened is common enough that it is worth taking apart.

## What happened

- **The bug sat for 23 days.** It went in during development and then sat idle, right until the alarm began rescheduling itself. Because nothing failed, there was no error and no warning: every single execution succeeded and was billed.
- **The invoice was the first signal.** Cloudflare issued it on 6 October, due the same day.
- **They paid it.** A support request for a one-time waiver ran into automated replies, and emails warning that account services would be suspended kept arriving, so on 8 October they paid in full. Asked in the replies why they did not simply walk away, they answered (in our translation): *you make a mistake, you own it — you take the hit standing up.*
- **Then Cloudflare stepped in.** Ashley Peacock took it up internally, Cloudflare's CTO escalated it, and on 9 October Cloudflare decided to refund everything charged during the bug, accompanied by a detailed write-up of what had gone wrong.

They were not alone. Other developers in the replies mentioned bills ranging from $1,000 to $10,000, each triggered by an unnoticed loop or polling routine.

## Why nothing warned anyone

Three things lined up here.

**The billing has no stop.** On a paid plan, a Durable Object bills per request, per unit of duration, and per row read and written. A loop does not crash; it just keeps billing, and nothing halts a pay-as-you-go account at a spending limit. One reply noted that Cloudflare has announced spending caps, with a preview due by the end of the year. Until that lands, the ceiling is whatever the card will clear.

**An alarm can schedule itself.** The standard way to handle periodic work in a Durable Object is an `alarm()` handler that runs its task and calls `setAlarm()` for the next run. If the calculation for that next time lands in the past or right now, the handler fires again immediately and keeps going, reading and writing storage on every single pass.

**Nobody was looking.** A project with no users has no traffic graphs anyone checks and no error logs to review, and this loop never threw an error. Without human eyes on it, high usage never turns into a warning on its own.

The first two are Cloudflare's to change and the developer's to guard against. The third is where tooling can help.

## What a daily ledger would have shown

CloudBridge pulls Cloudflare's billable usage each day and, when given Account Analytics on the token, splits the Durable Objects lines across namespaces. It is worth being precise about what that would and would not have done in this case.

- **It would have had the loop the next day.** The namespace's rows read and written land in the ledger daily, including the portion covered by the free allowance at a cost of zero, which is where a loop starts.
- **The anomaly rule would have stayed silent.** It evaluates each service against its own prior seven days, and a project that cost nothing has a baseline of zero. We deliberately avoid flagging a first appearance as "growth": most new spend is simply a fresh workload rather than a runaway. Here that was the wrong outcome, and it is a known gap in our logic.
- **A forecast budget rule would have fired on the first refresh.** The month-end forecast averages spend starting from the first day that had charges, projecting that rate through the remainder of the month. To put numbers on it: a loop billing $300 on day one, with 20 days left, projects to more than $6,000. Set against a modest $20 monthly budget, that rule fires on the first refresh that reads the day.
- **It would not have stopped anything.** CloudBridge reads bills with a read-only token. It cannot pause a Worker, and it should not have the power to. What changes is your timeline: you find out within one refresh interval (as short as six hours) of Cloudflare reporting the day, instead of waiting for the invoice to arrive.

The setup takes about a minute per account: define a monthly budget, add an Account budget rule based on the month-end forecast, pick a 6-hour refresh interval, and keep the app running in the menu bar. [Catch a runaway](../cloudflare.md#runaway) walks through the steps. It is worth doing for quiet accounts too, because those are precisely the ones nobody is watching.

## Guarding the alarm itself

A warning shortens a runaway; it does not prevent one. Inside the Durable Object itself:

- **Re-arm on purpose.** Have `alarm()` call `setAlarm()` only when there is more work to do, and compute the next time from now with a floor, so it can never be scheduled for the past.
- **Count the runs.** Keep a counter in storage per hour or per day. Once it passes a ceiling no real workload should ever reach, stop re-arming and log it loudly.
- **Clear alarms when idle.** Call `deleteAlarm()` whenever an object has nothing left to do.
- **Take down what nobody uses.** A deployed prototype is still tied to a live billing account. If it is not needed this month, delete the Worker.

## What's next

The 0.5.0 release notes said that Cloudflare findings would start with Durable Object namespaces whose objects keep alarms set. This is exactly the case it is meant to catch. The anomaly rule's blind spot for spend starting from zero is a known gap; until it is closed, the budget rule covers it.

Thanks to the author of the thread for telling the whole story in public, refund and all.