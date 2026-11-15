---
title: "Custos da AWS com o Cost Explorer ou FOCUS"
description: "Conecte uma conta da AWS ao CloudBridge pelo Cost Explorer com uma política do IAM de uma única ação, ou por um Data Export em FOCUS no S3 para linhas em nível de recurso."
---

# AWS

**[English](../aws.md)**&emsp;**[中文](../zh/aws.md)**&emsp;**[日本語](../ja/aws.md)**&emsp;**[한국어](../ko/aws.md)**&emsp;**[Français](../fr/aws.md)**&emsp;**[Español](../es/aws.md)**&emsp;**[Deutsch](../de/aws.md)**&emsp;[Documentação](index.md)

Uma conta da AWS chega ao registro de uma de duas formas. O **Cost
Explorer** é a mais rápida: uma chave de acesso e uma política de uma única
ação, e a fatura chega como custos por serviço por dia. Um **Data Export** no
S3 é o detalhado: IDs de recurso, tags e a conta vinculada de cada linha — o
que o [Insights](insights.md) precisa para atribuir preço a um recurso.

## Cost Explorer {#cost-explorer}

1. Abra o [console do IAM](https://console.aws.amazon.com/iam/), vá em
   **Users** e **Create user**. Ele não precisa de acesso ao console.
2. No novo usuário, escolha **Add permissions → Create inline policy**,
   mude para o editor JSON e cole a política abaixo (também disponível como
   [aws-cost-explorer-policy.json](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)).
3. Abra a aba **Security credentials** do usuário e clique em **Create access
   key**. Copie o Access Key ID e o Secret Access Key; a AWS mostra o segredo
   uma única vez.
4. Adicione a conta no CloudBridge com esse par de chaves.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Ela concede apenas `ce:GetCostAndUsage`, a única ação do Cost Explorer que o
CloudBridge chama. Validar a chave usa `GetCallerIdentity` do STS, que não
precisa de concessão. Credenciais temporárias que exigem um token de sessão
não são suportadas. [Permissões dos provedores](permissions.md#aws) traz o
raciocínio e como restringir o escopo.

### Quanto custa {#cost}

O Cost Explorer cobra por requisição. Uma atualização pede dois meses por
conta — o mês passado e este — uma requisição cada, e mais para um mês tão
grande que o Cost Explorer o devolve em páginas (no máximo 20). O intervalo
de atualização mantém a agenda em segundo plano em uma atualização por
intervalo, então, com o padrão de 24 horas, uma conta custa cerca de duas
requisições por dia. Uma busca que a AWS respondeu mas que o CloudBridge não
conseguiu armazenar não é repetida dentro do intervalo. **Forçar
atualização** passa por cima de tudo isso; é a única forma de gastar mais.
Consulte a tabela de preços da AWS para os valores atuais.

## Data Exports a partir do S3 {#data-exports}

O CloudBridge consegue ler os Data Exports da AWS (CUR 2.0, no formato
*FOCUS 1.2 with AWS columns*) a partir do bucket do S3 em que são entregues.
Coloque a URI da exportação — `s3://bucket/prefix` — no campo **URI de
exportação de dados no S3** do formulário de conta, e Atualizar passa a ler
de lá em vez do Cost Explorer.

- **Parquet ou CSV gzipado**, conforme a exportação foi configurada para
  entregar.
- **Um mês conta uma vez.** Só os arquivos que o manifesto do período nomeia
  são lidos, então uma exportação que mantém todas as entregas ainda conta um
  mês uma única vez.
- **Não entregue não é zero.** Um período que a exportação ainda não gravou é
  ignorado, nunca armazenado como um mês vazio.
- **O que não mudou não é baixado de novo.** As chaves, os tamanhos e os
  ETags dos arquivos são comparados com a última busca primeiro; um mês que a
  AWS terminou de entregar custa uma listagem e a leitura de um manifesto por
  atualização.
- **A exportação de um pagador é dividida por conta membro.** Cada linha
  mantém a conta vinculada sob a qual foi cobrada.

A política do Cost Explorer **não** concede acesso ao S3: veja
[Permissões dos provedores](permissions.md#aws-s3). Taxas de armazenamento e
de requisição do S3 continuam valendo.

## Verificar recursos {#insights}

O [Insights](insights.md) verifica uma conta da AWS com a mesma chave de
acesso, e só lê. Para isso, a chave precisa de acesso de leitura aos
recursos, como a política gerenciada `ReadOnlyAccess` da AWS.
