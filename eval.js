const fs = require('fs');

// 1. Load the inputs
function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split('\n').slice(1);
  return lines.map(line => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}

const testSet = loadTestSet('test-set.csv');

const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

// 2. Reciprocal Rank
function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);

  if (rank === null) {
    return 0;
  }

  return 1 / rank;
}

// Find the rank of the first correct answer
function rankOf(rankedIds, correctIds) {
  const index = rankedIds.findIndex(id => correctIds.includes(id));

  if (index === -1) {
    return null;
  }

  return index + 1;
}

// 3. Run the evaluation loop
let keywordRR = 0;
let semanticRR = 0;

let keywordHits = 0;
let semanticHits = 0;

const rows = [];

for (const item of testSet) {
  const queryResults = results[item.query];

  const keywordRank = rankOf(queryResults.keyword, item.correctIds);
  const semanticRank = rankOf(queryResults.semantic, item.correctIds);

  const keywordScore = reciprocalRank(queryResults.keyword, item.correctIds);
  const semanticScore = reciprocalRank(queryResults.semantic, item.correctIds);

  keywordRR += keywordScore;
  semanticRR += semanticScore;

  if (keywordScore > 0) keywordHits++;
  if (semanticScore > 0) semanticHits++;

  rows.push({
    query: item.query,
    keywordRank: keywordRank ?? 'miss',
    semanticRank: semanticRank ?? 'miss'
  });
}

// Calculate metrics
const totalQueries = testSet.length;

const keywordMRR = keywordRR / totalQueries;
const semanticMRR = semanticRR / totalQueries;

const keywordRecall = keywordHits / totalQueries;
const semanticRecall = semanticHits / totalQueries;

// 4. Print Markdown comparison table
console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');

for (const row of rows) {
  console.log(`| ${row.query} | ${row.keywordRank} | ${row.semanticRank} |`);
}

console.log(
  `| **Summary** | **MRR ${keywordMRR.toFixed(2)} · Recall@10 ${keywordRecall.toFixed(2)}** | **MRR ${semanticMRR.toFixed(2)} · Recall@10 ${semanticRecall.toFixed(2)}** |`
);