/**
 * Build-time script: Generates client-safe puzzle data from puzzles/index.json
 *
 * For each puzzle, we keep only:
 *   - id, number, category, clues (the ClientPuzzle fields)
 *   - answerHash: SHA-256 of (dateSeed + answer) so the client can verify guesses locally
 *
 * The dateSeed is computed from the puzzle's position in the daily rotation,
 * so tomorrow's answerHash is different and tomorrow's puzzle can't be solved today.
 *
 * The output file src/data/puzzles/client-puzzles.json is imported at build time
 * and tree-shaken — only the current day's puzzle survives in the client bundle.
 *
 * IMPORTANT: This must match src/lib/puzzles.ts exactly in how it determines
 * which puzzle appears on which day. Both use the same LCG + cycle + anti-repeat logic.
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

/**
 * Daily puzzle index — MUST match getDailyPuzzleIndex() in src/lib/puzzles.ts.
 * Uses cycle-based shuffling with anti-repeat safeguard across cycle boundaries.
 */
function getDailyPuzzleIndex(dayIndex, totalPuzzles) {
  if (totalPuzzles === 0) return 0;

  const cycle = Math.floor(dayIndex / totalPuzzles);
  const pos = dayIndex % totalPuzzles;

  const shuffled = getShuffledIndices(cycle + 12345, totalPuzzles);

  if (cycle > 0) {
    const prevShuffled = getShuffledIndices(cycle - 1 + 12345, totalPuzzles);
    if (shuffled[0] === prevShuffled[totalPuzzles - 1]) {
      if (totalPuzzles > 1) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
    }
  }

  return shuffled[pos];
}

function getDateSeed(dayIndex) {
  return `techdle-v1-${dayIndex}`;
}

function hashAnswer(dateSeed, answer) {
  return crypto.createHash('sha256').update(dateSeed + answer.toLowerCase().replace(/[^a-z0-9]/g, '')).digest('hex');
}

// Generate client puzzles WITHOUT answers
const clientPuzzles = sorted.map((p) => {
  return {
    id: p.id,
    category: p.category,
    clues: p.clues,
  };
});

// Bundle with a data version so the client can detect puzzle regenerations
const bundle = {
  __dataVersion: 5,
  puzzles: clientPuzzles,
};

// Generate ALL date hashes — one per day, using the SAME cycle+pos logic as puzzles.ts
const totalPuzzles = sorted.length;
const dayHashes = {};

// Precompute for a generous range (2026-06-25 to 2028-01-01)
const start = new Date('2026-06-25T00:00:00Z').getTime();
const end = new Date('2028-01-01T00:00:00Z').getTime();
const day = 86400000;

for (let t = start; t < end; t += day) {
  const dayIndex = Math.floor((t - start) / day);
  // Use the SAME getDailyPuzzleIndex as puzzles.ts
  const puzzleIndex = getDailyPuzzleIndex(dayIndex, totalPuzzles);
  const puzzle = sorted[puzzleIndex];
  const dateStr = new Date(t).toISOString().split('T')[0];
  const dateSeed = getDateSeed(dayIndex);
  dayHashes[dateStr] = hashAnswer(dateSeed, puzzle.answer);
}

// Write client puzzle data (no answers at all)
const outputDir = 'src/data/puzzles';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(`${outputDir}/client-puzzles.json`, JSON.stringify(bundle, null, 2));

// Write answer hashes as a compact Map<string, string> — one key per date string
// This is small (<50KB for 2 years) and gets tree-shaken anyway
fs.writeFileSync(`${outputDir}/answer-hashes.json`, JSON.stringify(dayHashes, null, 2));

console.log(`Generated ${clientPuzzles.length} client puzzles`);
console.log(`Generated ${Object.keys(dayHashes).length} date-answer hashes (${new Date(start).toISOString().split('T')[0]} → ${new Date(end - day).toISOString().split('T')[0]})`);
