---
description: "CloudBridge's Models page: what each LLM model costs per token — spend, input, output and cache tokens, blended cost per million, cache share and findings."
---

# Models

**[中文](zh/models.md)** · [Docs](index.md)

The **Models** page reads the LLM side of the bill per model, over the
range picked in its header. OpenAI, Anthropic and DeepSeek accounts always
appear; another source's rows appear when they carry token-metered usage,
such as Alibaba Cloud Model Studio or Volcengine imports. The model is the
one the bill names; a bill that names none, such as Model Studio's or
Ark's, groups by its product.

- The stat row shows **AI spend**, total **tokens**, the **blended $/1M**
  (cost divided by every token, per million) and the **cache share** —
  cache tokens as a share of the input side.
- **Per model** lists each model's cost and its change, its input, output
  and cache tokens, its blended $/1M and its share of model spend. Rows
  with tokens but no cost still count toward the token columns.
- **Tokens per day** charts the daily token volume.

## Findings {#findings}

- A model whose cache reads are under 5% of its input side — paying input
  price for what could be cache price.
- One model above 70% of model spend, when two or more cost anything.
- A spend rise the two periods' token counts put on unit price rather than
  usage.
- A model billed with no token metering, whose unit cost cannot be
  computed.

Model names inside Alibaba Cloud and Volcengine billing-item text are not
extracted yet.
