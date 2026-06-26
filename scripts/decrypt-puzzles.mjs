#!/usr/bin/env node
/**
 * Decrypt all puzzle files and remove encryption infrastructure.
 * Run this once to revert puzzles to plaintext.
 *
 * Usage: node scripts/decrypt-puzzles.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createDecipheriv } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUZZLES_DIR = join(__dirname, '..', 'src', 'data', 'puzzles');

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx <= 0) continue;
  process.env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

function getSecretBytes() {
  const secret = process.env.PUZZLE_SECRET;
  if (!secret) throw new Error('PUZZLE_SECRET not set');
  if (secret.length === 64 && /^[0-9a-fA-F]+$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  const encoder = new TextEncoder();
  const raw = encoder.encode(secret);
  const key = Buffer.alloc(32);
  raw.copy(key, 0, 0, 32);
  return key;
}

const secretKey = getSecretBytes();

function decrypt(encoded) {
  const combined = Buffer.from(encoded, 'base64');
  const iv = combined.subarray(0, 12);
  const authTag = combined.subarray(combined.length - 16);
  const ciphertext = combined.subarray(12, combined.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', secretKey, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext, 'binary', 'utf-8') + decipher.final('utf-8');
}

function isEncrypted(str) {
  // Encrypted data is base64 — doesn't look like English
  return /^[A-Za-z0-9+/=]{20,}$/.test(str) && !/^[a-z][a-z\s]/i.test(str);
}

// Process individual files
const files = readdirSync(PUZZLES_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .sort();

let decrypted = 0;

for (const file of files) {
  const filePath = join(PUZZLES_DIR, file);
  const raw = readFileSync(filePath, 'utf-8');
  const puzzle = JSON.parse(raw);

  if (puzzle.answer && isEncrypted(puzzle.answer)) {
    puzzle.answer = decrypt(puzzle.answer);
    puzzle.aliases = puzzle.aliases.map(a => isEncrypted(a) ? decrypt(a) : a);
    // Add date from filename if missing
    if (!puzzle.date) {
      // Use the index order to assign dates
    }
    writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + '\n');
    console.log(`  ✅ ${file}: decrypted`);
    decrypted++;
  } else {
    console.log(`  ⏭  ${file}: already plaintext`);
  }
}

// Process index.json
const indexPath = join(PUZZLES_DIR, 'index.json');
const indexRaw = readFileSync(indexPath, 'utf-8');
const index = JSON.parse(indexRaw);

// Rebuild index from individual files (they now have decrypted data + dates)
const rebuiltIndex = files.map(file => {
  const filePath = join(PUZZLES_DIR, file);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
});
rebuiltIndex.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

// Assign dates if missing
const EPOCH = '2026-06-25';
rebuiltIndex.forEach((p, i) => {
  if (!p.date) {
    const d = new Date(EPOCH + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + i);
    p.date = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
  }
});

writeFileSync(indexPath, JSON.stringify(rebuiltIndex, null, 2) + '\n');
console.log(`\n✅ index.json rebuilt with ${rebuiltIndex.length} plaintext puzzles`);
console.log(`   Date range: ${rebuiltIndex[0].date} to ${rebuiltIndex[rebuiltIndex.length-1].date}`);

// Now update the files again with the proper dates
for (const puzzle of rebuiltIndex) {
  const filePath = join(PUZZLES_DIR, `${puzzle.id}.json`);
  if (readFileSync(filePath, 'utf-8')) {
    writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + '\n');
  }
}

console.log(`\nDone! All ${decrypted} puzzle files decrypted, ${rebuiltIndex.length} in index.`);
console.log('Next steps: remove crypto.ts, switch to static imports, delete API puzzle routes.');
