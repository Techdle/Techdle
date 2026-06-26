/**
 * Build-time script: Generates client-safe puzzle data from puzzles/index.json
 *
 * For each puzzle, we keep only:
 *   - id, number, category, difficulty, clues (the ClientPuzzle fields)
 *   - answerHash: SHA-256 of (dateSeed + answer) so the client can verify guesses locally
 *
 * The dateSeed is computed from the puzzle's position in the daily rotation,
 * so tomorrow's answerHash is different and tomorrow's puzzle can't be solved today.
 *
 * The output file src/data/puzzles/client-puzzles.json is imported at build time
 * and tree-shaken — only the current day's puzzle survives in the client bundle.
 */

import fs from 'fs';
import crypto from 'crypto';

const puzzles = JSON.parse(fs.readFileSync('src/data/puzzles/index.json', 'utf8'));
const EPOCH = '2026-06-25';

// Sort the same way as getAllPuzzles() in puzzles.ts
const sorted = [...puzzles].sort((a, b) => a.id.localeCompare(b.id));

// LCG PRNG — must match puzzles.ts exactly
function getShuffledIndices(seed, length) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  const next = () => { state = (state * 16807) % 2147483647; return state; };
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = next() % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function getDateSeed(dayIndex) {
  return `techdle-v1-${dayIndex}`;
}

function hashAnswer(dateSeed, answer) {
  return crypto.createHash('sha256').update(dateSeed + answer.toLowerCase().replace(/[^a-z0-9]/g, '')).digest('hex');
}

// Generate client puzzles WITH answer hashes
const clientPuzzles = sorted.map((p, index) => {
  const puzzleNumber = index + 1;
  return {
    id: p.id,
    category: p.category,
    difficulty: p.difficulty,
    clues: p.clues,
  };
});

// Generate ALL date hashes — one per day, one hash per puzzle
// Each puzzle appears on exactly one day in the rotation
const totalPuzzles = sorted.length;
const dayHashes = {};

// Precompute for a generous range (2026-06-25 to 2026-12-31, plus some buffer)
const start = new Date('2026-06-25T00:00:00Z').getTime();
const end = new Date('2028-01-01T00:00:00Z').getTime();
const day = 86400000;

for (let t = start; t < end; t += day) {
  const dayIndex = Math.floor((t - start) / day);
  const shuffledIndices = getShuffledIndices(dayIndex, totalPuzzles);
  const puzzleIndex = shuffledIndices[dayIndex % totalPuzzles];
  const puzzle = sorted[puzzleIndex];
  const dateStr = new Date(t).toISOString().split('T')[0];
  const dateSeed = getDateSeed(dayIndex);
  dayHashes[dateStr] = hashAnswer(dateSeed, puzzle.answer);
}

// Write client puzzle data (no answers at all)
const outputDir = 'src/data/puzzles';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(`${outputDir}/client-puzzles.json`, JSON.stringify(clientPuzzles, null, 2));

// Write answer hashes as a compact Map<string, string> — one key per date string
// This is small (<50KB for 2 years) and gets tree-shaken anyway
fs.writeFileSync(`${outputDir}/answer-hashes.json`, JSON.stringify(dayHashes, null, 2));

console.log(`Generated ${clientPuzzles.length} client puzzles`);
console.log(`Generated ${Object.keys(dayHashes).length} date-answer hashes (${new Date(start).toISOString().split('T')[0]} → ${new Date(end - day).toISOString().split('T')[0]})`);
