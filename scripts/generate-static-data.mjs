/**
 * Build-time script: Generates static chunks from puzzles/index.json
 *
 * It generates:
 * 1. public/dictionary.json: All valid guesses for the dropdown
 * 2. public/puzzles/metadata.json: Lightweight array of puzzle IDs/categories
 * 3. public/puzzles/[id].json: One chunk per puzzle containing only client-safe fields
 */

import fs from 'fs';
import path from 'path';

const puzzlesPath = path.join(process.cwd(), 'src', 'data', 'puzzles', 'index.json');
const publicPuzzlesDir = path.join(process.cwd(), 'public', 'puzzles');
const publicDir = path.join(process.cwd(), 'public');

// Ensure directories exist
if (!fs.existsSync(publicPuzzlesDir)) {
  fs.mkdirSync(publicPuzzlesDir, { recursive: true });
}

// Read index.json
const puzzles = JSON.parse(fs.readFileSync(puzzlesPath, 'utf8'));

// 1. Generate dictionary.json
const aliasSet = new Set();
puzzles.forEach((p) => {
  aliasSet.add(p.answer.toLowerCase());
  if (p.aliases) {
    p.aliases.forEach((a) => aliasSet.add(a.toLowerCase()));
  }
});
const dictionary = Array.from(aliasSet).sort();
fs.writeFileSync(
  path.join(publicDir, 'dictionary.json'),
  JSON.stringify(dictionary, null, 2)
);
console.log(`Generated public/dictionary.json with ${dictionary.length} entries`);

// 2. Generate metadata.json
const metadata = puzzles.map((p) => ({
  id: p.id,
  category: p.category,
  difficulty: p.difficulty || 'Medium',
}));
fs.writeFileSync(
  path.join(publicPuzzlesDir, 'metadata.json'),
  JSON.stringify(metadata, null, 2)
);
console.log(`Generated public/puzzles/metadata.json with ${metadata.length} entries`);

// 3. Generate individual static chunks
let chunkCount = 0;
puzzles.forEach((p) => {
  const clientSafePuzzle = {
    id: p.id,
    number: p.number,
    category: p.category,
    clues: p.clues,
    rawLogs: p.rawLogs,
  };
  fs.writeFileSync(
    path.join(publicPuzzlesDir, `${p.id}.json`),
    JSON.stringify(clientSafePuzzle, null, 2)
  );
  chunkCount++;
});
console.log(`Generated ${chunkCount} static puzzle chunks in public/puzzles/`);
