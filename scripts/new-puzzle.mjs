#!/usr/bin/env node

/**
 * Generate: creates a new puzzle JSON file with a template.
 * Usage: node scripts/new-puzzle.mjs
 *
 * It will prompt you interactively for the fields,
 * create the file, and update index.json.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUZZLES_DIR = join(__dirname, '..', 'src', 'data', 'puzzles');
const INDEX_PATH = join(PUZZLES_DIR, 'index.json');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer.trim()));
  });
}

function tomorrow() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function pickFromList(label, items) {
  console.log(`\nAvailable ${label}:`);
  items.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
  const answer = await ask(`Pick ${label} (1-${items.length}) [1]: `);
  const idx = parseInt(answer, 10) - 1;
  return items[isNaN(idx) || idx < 0 || idx >= items.length ? 0 : idx];
}

async function main() {
  const id = await ask('Puzzle ID (e.g. "failing-psu-001"): ');
  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    console.error('Error: ID must be kebab-case (letters, numbers, hyphens only).');
    process.exit(1);
  }

  const category = await pickFromList('category', [
    'Hardware', 'Software', 'Network', 'Security', 'Peripheral',
  ]);

  const difficulty = 'Hard';

  const answer = await ask('Canonical answer (e.g. "failing power supply"): ');
  if (!answer) {
    console.error('Error: Answer is required.');
    process.exit(1);
  }

  console.log('\nEnter 5 clues, one per line (press Enter after each):');
  const clues = [];
  for (let i = 0; i < 5; i++) {
    const clue = await ask(`  Clue ${i + 1}: `);
    if (!clue) {
      console.error('Error: All 5 clues are required.');
      process.exit(1);
    }
    clues.push(clue);
  }

  console.log('\nEnter aliases (comma-separated, e.g. "bad psu, dead psu, faulty psu"):');
  const aliasesRaw = await ask('  Aliases: ');
  const aliases = aliasesRaw
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);

  const explanation = await ask('Explanation (diagnostic notes): ');
  if (!explanation) {
    console.error('Error: Explanation is required.');
    process.exit(1);
  }

  console.log('\nEnter fix steps, one per line (empty line to finish):');
  const fixSteps = [];
  for (let i = 0; i < 5; i++) {
    const step = await ask(`  Step ${i + 1}: `);
    if (!step) break;
    fixSteps.push(step);
  }
  if (fixSteps.length < 2) {
    console.error('Error: At least 2 fix steps are required.');
    process.exit(1);
  }

  const date = await ask(`Date (YYYY-MM-DD) [${tomorrow()}]: `);
  const finalDate = date || tomorrow();

  // Detect if we need to start a new ID series or continue
  const nextId = id.includes('-')
    ? id
    : `${id}-001`;

  const puzzle = {
    date: finalDate,
    id: nextId.includes('-001') ? nextId : id,
    category,
    difficulty,
    clues,
    answer,
    aliases,
    explanation,
    fixSteps,
  };

  // Write individual file
  const filePath = join(PUZZLES_DIR, `${finalDate}.json`);
  if (existsSync(filePath)) {
    const overwrite = await ask(`\n${finalDate}.json already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + '\n');
  console.log(`\nCreated: ${filePath}`);

  // Update index.json
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
  const existingIdx = index.findIndex((p) => p.date === finalDate);
  if (existingIdx >= 0) {
    index[existingIdx] = puzzle;
  } else {
    index.push(puzzle);
  }
  index.sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
  console.log(`Updated: ${INDEX_PATH} (${index.length} puzzles)`);

  rl.close();
  console.log('\nDone! The new puzzle will appear in-game tomorrow (or today if backdated).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
