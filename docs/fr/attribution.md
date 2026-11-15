---
title: "Imputation des coûts par ligne métier, étiquette et service"
description: "Imputation dans CloudBridge : un Sankey de la source au service ou au modèle puis à la ligne métier, et des répartitions par étiquette, service, région ou catégorie FOCUS."
---

# Imputation

**[English](../attribution.md)**&emsp;**[中文](../zh/attribution.md)**&emsp;**[日本語](../ja/attribution.md)**&emsp;**[한국어](../ko/attribution.md)**&emsp;**[Español](../es/attribution.md)**&emsp;**[Deutsch](../de/attribution.md)**&emsp;**[Português](../pt/attribution.md)**&emsp;[Documentation](index.md)

La page Imputation dessine le mois sous forme de Sankey : source, puis
service ou modèle, puis ligne métier, avec un nœud **Unallocated** explicite.
Les flux représentent l’usage brut — un flux net peut être négatif, ce qui ne
veut rien dire dans un Sankey. Un frais est affecté à une ligne par son
étiquette `business_line` ; sans elle, il tombe dans Unallocated.

## Répartition par dimension {#dimensions}

Un sélecteur au-dessus de la répartition choisit **Tag** (la vue par ligne
métier), **Service**, **Region** ou **Category**. Les dimensions autres que
l’étiquette se dessinent en treemap — **Map**, où la surface d’une tuile est
son coût sur la période et sa couleur la variation par rapport à la période
précédente — ou en barres de part sous **Table**. Les frais sans valeur pour
la dimension apparaissent en *Other*. Une carte **Top resources** liste les
ressources les plus coûteuses de la période.

## Catégories de service {#categories}

**Category** utilise les catégories de service FOCUS — Compute, Storage,
Databases, Networking, AI and Machine Learning et les autres — les mêmes sur
tous les clouds : l’ECS d’Alibaba Cloud, l’ECS de Volcengine et l’EC2 d’AWS
comptent donc tous comme *Compute / Virtual Machines*, et Model Studio, Ark
et les fournisseurs de modèles comme *AI and Machine Learning / Generative
AI*. Un produit qu’aucune correspondance ne connaît encore apparaît en
*Uncategorized* et remonte comme constat de
[santé des données](overview.md#data-health).
