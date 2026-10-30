# Retrieval Metrics Evaluation

## Project Overview

This project compares two search systems:
1. Keyword Search
2. Semantic Search

The evaluation uses two metrics:
- Mean Reciprocal Rank (MRR)
- Recall@10

## Evaluation Results

| Query | Keyword rank | Semantic rank |
|---|---|---|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |

## Interpretation

Semantic search performs better overall, achieving an MRR of 0.67 and Recall@10 of 1.00, compared to keyword search with an MRR of 0.30 and Recall@10 of 0.60. Keyword search wins on the queries about Redis or Memcached for caching and choosing SQL or NoSQL for a new product. These queries contain specific technical terms that keyword matching can identify effectively. Semantic search wins on the remaining eight queries because it understands the meaning and context of questions, even when different words are used. A team would still keep keyword search because it performs well on certain exact-term queries, and combining both systems can improve search results.