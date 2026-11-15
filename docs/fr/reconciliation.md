---
title: "Rapprocher les factures cloud de votre registre de facturation"
description: "Le rapprochement CloudBridge compare la facture finale de chaque fournisseur au registre ou à un instantané figé, dans la devise de la facture, et indique quoi vérifier."
---

# Rapprochement

**[English](../reconciliation.md)**&emsp;**[中文](../zh/reconciliation.md)**&emsp;**[日本語](../ja/reconciliation.md)**&emsp;**[한국어](../ko/reconciliation.md)**&emsp;[Documentation](index.md)

La page **Reconciliation** répond à une seule question : la facture finale de
chaque fournisseur correspond-elle à ce que CloudBridge a importé ? Elle
demande CloudBridge 0.9.0 ou une version ultérieure.

Seul le coût facturé faisant autorité, dans la devise de la facture, est
comparé, de sorte qu’un taux de change ne peut pas masquer un écart. Les
factures sont stockées à part de vos frais et ne les modifient jamais.

## Ajouter une facture {#add}

- **Enter total** enregistre une facture. **Total** est le montant final de la
  facture. La taxe, les crédits et les ajustements sont ceux que la facture
  indique : ils ne s’ajoutent pas au total et servent seulement à expliquer un
  écart. Saisissez les crédits comme zéro ou négatifs.
- **Import invoice CSV** en lit plusieurs d’un coup, uniquement sur
  ordinateur de bureau. Si une ligne est erronée, rien n’est importé et
  l’erreur nomme la ligne.

Le CSV a besoin d’une ligne d’en-tête :

```csv
provider,account_id,billing_period,invoice_id,currency,amount,tax,credits,adjustments,billing_account_id
```

Les colonnes à partir de `tax` sont facultatives. `billing_period` est au
format `YYYY-MM`, `currency` est un code à trois lettres, et les montants sont
des nombres simples sans séparateur de milliers. Chaque ligne doit désigner
l’un de vos comptes.

Si les frais d’un compte s’étendent sur plusieurs comptes de facturation,
renseignez l’ID de compte de facturation de la facture pour qu’elle soit
comparée au bon.

## Lire le résultat {#status}

| Statut | Ce que cela signifie |
| --- | --- |
| Matched | La facture et le registre concordent, dans la tolérance de la devise |
| Difference | Ils divergent. La ligne affiche l’écart et ce qu’il faut vérifier ensuite |
| Cannot verify | Il n’y a encore rien de comparable équitablement, et la ligne en donne la raison |
| Missing evidence | Le mois comporte des frais facturés mais aucune facture : il n’a donc pas été vérifié |

Un mois affiche **Cannot verify** lorsque, par exemple, il n’est pas terminé,
que le registre ne contient aucun frais dans la devise de la facture, ou que
tous les frais sont de l’usage sans montant. Les montants dérivés ou estimés
sont exclus du chiffre du registre.

Ouvrez une ligne pour voir la répartition par catégorie de frais, les détails
de la facture et ce qu’il faut vérifier, comme une taxe d’un seul côté, un
crédit ou un ajustement tardif, un export qui ne couvre qu’une partie du mois,
ou un total qui correspond à un autre mois.

## Comparer avec un instantané {#snapshot}

**Compare with** choisit le registre actuel ou un
[instantané de fin de mois](overview.md#snapshots), pour vérifier une facture
par rapport au mois tel que vous l’avez clôturé, quelles que soient les
modifications apportées par les actualisations ultérieures.

Supprimer une facture ne retire que cet enregistrement. Le registre et les
instantanés restent tels quels.
