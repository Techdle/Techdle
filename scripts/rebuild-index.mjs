#!/usr/bin/env node

/**
 * Rebuild: synchronizes index.json from individual {date}.json files.
 *
 * Usage:
 *   node scripts/rebuild-index.mjs
 *
 * This reads every YYYY-MM-DD.json file in src/data/puzzles/,
 * sorts them by date, and writes index.json.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUZZLES_DIR = join(__dirname, '..', 'src', 'data', 'puzzles');
const INDEX_PATH = join(PUZZLES_DIR, 'index.json');

// Read all .json files that match YYYY-MM-DD (not index.json itself)
const files = readdirSync(PUZZLES_DIR)
  .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
  .sort();

const puzzles = [];
for (const file of files) {
  const filePath = join(PUZZLES_DIR, file);
  try {
    const content = readFileSync(filePath, 'utf-8');
    const puzzle = JSON.parse(content);
    // Basic validation
    if (!puzzle.date || !puzzle.id || !puzzle.answer || !puzzle.clues) {
      console.warn(`  ⚠️  ${file}: missing required fields, skipping`);
      continue;
    }
    puzzles.push(puzzle);
  } catch (err) {
    console.warn(`  ⚠️  ${file}: ${err.message}, skipping`);
  }
}

puzzles.sort((a, b) => a.date.localeCompare(b.date));
writeFileSync(INDEX_PATH, JSON.stringify(puzzles, null, 2) + '\n');

console.log(`Rebuilt ${INDEX_PATH} — ${puzzles.length} puzzles`);
console.log(`Date range: ${puzzles[0]?.date || '—'} to ${puzzles[puzzles.length - 1]?.date || '—'}`);
