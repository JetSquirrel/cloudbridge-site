---
title: "LLM token cost per model"
description: "CloudBridge’s Models page: what each LLM costs per token, with spend, input, output and cache tokens, blended cost per million and findings."
---

# Models

**[中文](zh/models.md)**&emsp;[Docs](index.md)

The **Models** page reads the LLM side of the bill per model, over the
range picked in its header. OpenAI, Anthropic and DeepSeek accounts always
appear; another source's rows appear when they carry token-metered usage,
such as Alibaba Cloud Model Studio, Volcengine or Amazon Bedrock rows. The
model is the bill's FOCUS `ModelId`, or the one the import names; a bill
that names none, such as Model Studio's or Ark's, groups by its product.

Tokens are told apart by their FOCUS properties, `TokenDirection` and
`TokenCacheAction`, not by the provider's meter name, so the same kind
of token reads the same on every bill. See [FOCUS and token
data](focus.md).

- The stat row shows **AI spend**, total **tokens**, the **blended $/1M**
  (cost divided by every token, per million) and the **cache share** —
  input tokens read from a prompt cache, as a share of all input tokens,
  cache writes included.
- **Per model** lists each model's cost and its change, its IN, OUT and
  CACHE tokens, its blended $/1M and its share of model spend. CACHE is
  tokens read from the cache. IN is the rest of the input: uncached input,
  tokens written to the cache, and, for a bill that counts input and
  output together, that total. Its tooltip says which of those it holds.
  Rows with tokens but no cost still count toward the token columns.
- **Tokens per day** charts the daily token volume.

## Findings {#findings}

- A model whose cache reads are under 5% of its input side — paying input
  price for what could be cache price. Not raised for a bill that does not
  split input from output.
- One model above 70% of model spend, when two or more cost anything.
- A spend rise the two periods' token counts put on unit price rather than
  usage.
- A model billed with no token metering, whose unit cost cannot be
  computed.

Model names inside Alibaba Cloud and Volcengine billing-item text are not
extracted yet.
