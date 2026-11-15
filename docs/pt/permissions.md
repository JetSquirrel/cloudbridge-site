---
title: "Permissões de cobrança com privilégio mínimo por provedor"
description: "As credenciais de privilégio mínimo de que o CloudBridge precisa para o Cost Explorer e o S3 da AWS, o Cost Management do Azure, o BigQuery do Google Cloud, o RAM do Alibaba Cloud, os tokens de API da Cloudflare e as chaves do DeepSeek."
---

# Permissões dos provedores

**[English](../permissions.md)**&emsp;**[中文](../zh/permissions.md)**&emsp;**[日本語](../ja/permissions.md)**&emsp;**[한국어](../ko/permissions.md)**&emsp;**[Français](../fr/permissions.md)**&emsp;**[Español](../es/permissions.md)**&emsp;**[Deutsch](../de/permissions.md)**&emsp;[Documentação](index.md)

Use credenciais dedicadas, com o menor privilégio que o canal precisa. O
comportamento somente leitura dentro do aplicativo não torna uma chave
irrestrita somente leitura: as políticas anexadas no provedor é que decidem o
que uma chave pode fazer. Não use credenciais de conta raiz, nem conceda
acesso de administrador, só para ler uma fatura.

O CloudBridge guarda credenciais no chaveiro do sistema operacional e as usa
apenas para autenticar requisições ao provedor a que pertencem. Não existe
serviço de sincronização do CloudBridge nem telemetria. Nunca publique
chaves reais, arquivos de credenciais ou exportações de fatura sem ocultação
em issues públicas, logs, capturas de tela ou pull requests, e revogue
qualquer chave que tenha sido exposta.

<!-- The old permissions page, linked from CloudBridge 0.5.0 and earlier, called this section aws-cost-explorer. -->
<a id="aws-cost-explorer"></a>

## AWS Cost Explorer {#aws}

[`aws-cost-explorer-policy.json`](https://cloudbridge.jetsquirrel.cloud/aws-cost-explorer-policy.json)
concede apenas `ce:GetCostAndUsage`, a ação do Cost Explorer que o CloudBridge
usa. Validar uma chave sem uma URI de exportação usa `GetCallerIdentity` do
STS, que [não precisa de concessão](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetCallerIdentity.html).
A política mantém `Resource: "*"` para leituras do Cost Explorer; ela não
concede acesso a nenhum outro serviço.

1. No [console do IAM](https://console.aws.amazon.com/iam/), crie uma
   política gerenciada pelo cliente a partir do modelo, ou adicione-a ao
   usuário como política inline.
2. Anexe-a a um usuário do IAM dedicado, sem permissões amplas não
   relacionadas.
3. Crie uma chave de acesso para esse usuário e informe-a no CloudBridge.
4. Faça a rotação da chave conforme a política da sua organização.

Só é aceito um par de Access Key ID e secret; credenciais temporárias que
exigem um token de sessão não são. Políticas de organização e configurações
de cobrança no nível da conta ainda podem restringir o acesso. Requisições ao
Cost Explorer podem gerar cobranças — veja
[quanto custa](aws.md#cost).

## AWS Data Exports a partir do S3 {#aws-s3}

A política do Cost Explorer **não** concede acesso a um bucket de exportação.
Restrinja `s3:ListBucket` ao bucket e ao prefixo da exportação, e
`s3:GetObject` aos objetos sob esse prefixo. Objetos criptografados com uma
chave KMS gerenciada pelo cliente podem exigir também `kms:Decrypt` e uma
política de chave correspondente, e as políticas de bucket e as restrições da
organização precisam permitir as leituras. O CloudBridge lê uma exportação
existente; ele não precisa de permissão para criar exportações ou gravar
objetos. Taxas de armazenamento e de requisição do S3 continuam valendo.

## Verificações de recursos da AWS {#aws-scan}

O [Insights](insights.md) verifica com a mesma chave e apenas lista e descreve
recursos. Dê à chave acesso de leitura a eles, como a política gerenciada
`ReadOnlyAccess`, ou uma política somente leitura mais restrita que cubra os
serviços que você quer verificar.

## Alibaba Cloud {#alibaba-cloud}

Para a API de cobrança, `AliyunBSSReadOnlyAccess` é a política de cobrança
somente leitura embutida. Ela é mais ampla que uma política personalizada
específica para um endpoint; revise o escopo dela em relação às suas
necessidades.

1. No [console do RAM](https://ram.console.aliyun.com/), crie um usuário RAM
   dedicado.
2. Anexe `AliyunBSSReadOnlyAccess`, ou uma política personalizada com escopo
   limitado às operações de cobrança que você usa.
3. Crie um AccessKey e informe-o no CloudBridge.

Não use o AccessKey da conta principal. Importar uma exportação de fatura não
precisa de credencial.

## Microsoft Azure {#azure}

Um service principal — um registro de aplicativo com um segredo de cliente —
com a função embutida **Cost Management Reader** na assinatura. Essa função
lê dados de custo e uso e nada mais; não dê ao aplicativo as funções Reader,
Contributor ou Owner para fazê-lo funcionar.

| Requisição | Para que serve |
| --- | --- |
| `GET https://management.azure.com/subscriptions/{id}`, sem autenticação | Descobrir o tenant da assinatura a partir do desafio `401`. Ignorada quando a assinatura é informada como `tenant-id/subscription-id` |
| `POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` | Um token para o Azure Resource Manager, pela concessão de credenciais do cliente |
| `POST /subscriptions/{id}/providers/Microsoft.CostManagement/query` | O custo real do mês, diário, por serviço e tipo de cobrança |

O client ID e o subscription ID não são segredos. O segredo do cliente é, e
fica no chaveiro do sistema operacional; dê a ele a validade mais curta que
sua organização permitir e substitua-o no CloudBridge quando for trocado.

## Google Cloud {#google-cloud}

Uma conta de serviço no projeto da exportação de cobrança, com **BigQuery Job
User** no projeto e **BigQuery Data Viewer** somente no conjunto de dados da
exportação — não no projeto, onde ela leria todos os outros conjuntos de
dados também.

| Requisição | Para que serve |
| --- | --- |
| `POST https://oauth2.googleapis.com/token` | Um token, a partir de uma asserção assinada com a chave da conta de serviço |
| `POST https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries` | Um job de consulta por mês sobre a tabela de exportação |
| `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project}/queries/{job}` | O restante das páginas de resultado do job |

O job de consulta roda no projeto da tabela e é cobrado nele pela tarifa sob
demanda do BigQuery depois do nível gratuito. O CloudBridge guarda o caminho
do arquivo de chave, não a chave; proteja o arquivo como faria com qualquer
chave de conta de serviço, e exclua a chave no console quando ela não for
mais usada. Um arquivo de credenciais de usuário gerado por
`gcloud auth application-default login` também funciona, e faz as consultas
com o acesso daquele usuário.

## Cloudflare {#cloudflare}

Crie um token de API personalizado, com escopo em **Account Resources**
limitado à única conta que o CloudBridge deve ler. Não use a Global API Key:
ela carrega todas as permissões do usuário.

| Permissão | Para que serve | Chamadas |
| --- | --- | --- |
| Account → Billing → Read | A fatura | `GET /accounts/{id}/billable-usage/info`, `GET /accounts/{id}/billable-usage` |
| Account → Account Analytics → Read | Dividir a fatura por recurso | `POST /graphql` |
| Read em Account Settings, Zone, Workers Scripts, Workers R2 Storage, Workers KV Storage, Queues, D1 | A verificação do Insights | A API da conta, por meio do verificador |

Só a primeira é obrigatória. O ID da conta não é um segredo — ele faz parte do
caminho da requisição; o token é, e fica no chaveiro do sistema operacional
como qualquer outra credencial.

## DeepSeek {#deepseek}

A integração com a API usa uma chave de plataforma de
[platform.deepseek.com](https://platform.deepseek.com/) para chamar
`GET /user/balance`. Isso é uma leitura, mas **a chave em si não é
necessariamente somente leitura**: ela também pode autorizar requisições de
modelos e gerar gasto se usada em outro lugar. Trate-a como uma credencial de
gasto, use quaisquer restrições que o DeepSeek ofereça e não a compartilhe.
Importar o download de uso não precisa de chave.

## Volcengine, OpenAI e Anthropic {#file-sources}

Essas fontes usam apenas exportações de fatura locais. O CloudBridge não pede
credenciais para elas, e uma importação não faz requisição a nenhum provedor.
Não crie uma chave de administrador ou de organização para elas enquanto um
canal de API realmente não precisar de uma.
