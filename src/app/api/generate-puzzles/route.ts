import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Puzzle } from '@/types/game';

const PUZZLES_DIR = join(process.cwd(), 'src', 'data', 'puzzles');
const TOPICS_PATH = join(process.cwd(), 'src', 'data', 'generated-topics.json');
const INDEX_PATH = join(PUZZLES_DIR, 'index.json');

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Security', 'Peripheral'] as const;

interface GenerateRequest {
  count: number;
  categories: string[];
  difficulty: string;
}

interface GeneratedTopic {
  id: string;
  category: string;
  difficulty: string;
  answerHash: string;
}

interface GenerateResponse {
  success: boolean;
  puzzles: Array<{
    date: string;
    id: string;
    category: string;
    difficulty: string;
  }>;
  errors: string[];
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextDateString(existingDates: Set<string>): string {
  const today = getTodayDateString();
  let date = new Date(today + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + 1);

  let attempts = 0;
  while (attempts < 365) {
    const dateStr = date.toISOString().slice(0, 10);
    if (!existingDates.has(dateStr)) return dateStr;
    date.setUTCDate(date.getUTCDate() + 1);
    attempts++;
  }
  return date.toISOString().slice(0, 10);
}

function loadGeneratedTopics(): GeneratedTopic[] {
  try {
    const raw = readFileSync(TOPICS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveGeneratedTopics(topics: GeneratedTopic[]): void {
  writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 2) + '\n');
}

function getExistingDates(): Set<string> {
  try {
    const raw = readFileSync(INDEX_PATH, 'utf-8');
    const puzzles: Puzzle[] = JSON.parse(raw);
    return new Set(puzzles.filter(p => p.date).map((p) => p.date));
  } catch {
    return new Set();
  }
}

function loadIndex(): Puzzle[] {
  try {
    const raw = readFileSync(INDEX_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveIndex(index: Puzzle[]): void {
  index.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
}

function ensurePuzzlesDir(): void {
  if (!existsSync(PUZZLES_DIR)) {
    mkdirSync(PUZZLES_DIR, { recursive: true });
  }
}

async function hashAnswer(answer: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(answer.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, puzzles: [], errors: ['DEEPSEEK_API_KEY is not configured in .env.local'] },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await request.json();
    const count = Math.max(1, Math.min(20, body.count || 5));
    const categories = body.categories?.length ? body.categories : [...CATEGORIES];
    const difficulty = body.difficulty || 'Any';

    const validCategories = categories.filter((c) => (CATEGORIES as readonly string[]).includes(c));
    if (validCategories.length === 0) {
      return NextResponse.json(
        { success: false, puzzles: [], errors: ['No valid categories selected'] },
        { status: 400 }
      );
    }

    const existingTopics = loadGeneratedTopics();
    const existingIds = existingTopics.map((t) => t.id);
    const existingDates = getExistingDates();

    const systemPrompt = `You are a professional IT support technician creating troubleshooting puzzles for a game called Techdle. Each puzzle describes a common IT issue through 5 clues, and the player must identify the root cause.

You MUST respond with ONLY a valid JSON array. No markdown, no code fences, no explanation — just the raw JSON array.

Rules:
1. Each puzzle must be a unique IT troubleshooting scenario — no duplicate or similar topics
2. The answer should be DESCRIPTIVE (e.g., "failing power supply", "DNS misconfiguration", "phishing-compromised account") rather than a single word
3. Include 3-6 relevant aliases per puzzle so players with different terminology can still guess correctly
4. Clues should start obvious and get more specific (clue 1 is subtle, clue 5 is almost a giveaway)
5. Fix steps should be 2-5 actionable remediation steps
6. The "explanation" field should concisely explain why those clues point to that root cause
7. Avoid repeating any of these already-used puzzle IDs: ${existingIds.join(', ')}
8. Each puzzle ID must be kebab-case ending with a 3-digit number, e.g. "bad-router-config-001"
9. Ensure puzzles are across different IT domains — don't use all hardware or all software

Required JSON schema — an array of objects with these fields:
{
  "date": "YYYY-MM-DD", // leave as empty string "", we will assign dates server-side
  "id": "kebab-case-id-001",
  "category": "${validCategories.join(' | ')}",
  "difficulty": "Easy" | "Medium" | "Hard",
  "clues": ["clue 1", "clue 2", "clue 3", "clue 4", "clue 5"],
  "answer": "descriptive root cause",
  "aliases": ["alias 1", "alias 2", "alias 3"],
  "explanation": "Concise diagnostic explanation",
  "fixSteps": ["step 1", "step 2"]
}`;

    const userPrompt = `Generate ${count} IT troubleshooting puzzles.
    ${difficulty !== 'Any' ? `All puzzles should be ${difficulty} difficulty.` : 'Mix of Easy, Medium, and Hard difficulties.'}
    Categories to use: ${validCategories.join(', ')}
    Do NOT use any of these existing puzzle IDs: ${existingIds.join(', ')}
    Ensure each puzzle has a unique root cause answer.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, puzzles: [], errors: [`DeepSeek API error (${response.status}): ${errorText}`] },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, puzzles: [], errors: ['DeepSeek returned an empty response'] },
        { status: 502 }
      );
    }

    let generatedPuzzles: Partial<Puzzle>[];
    try {
      const cleaned = content
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();
      generatedPuzzles = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          success: false,
          puzzles: [],
          errors: ['Failed to parse DeepSeek response as JSON.'],
          _debug: content.slice(0, 2000),
        },
        { status: 502 }
      );
    }

    if (!Array.isArray(generatedPuzzles) || generatedPuzzles.length === 0) {
      return NextResponse.json(
        { success: false, puzzles: [], errors: ['DeepSeek did not return a valid array of puzzles'] },
        { status: 502 }
      );
    }

    ensurePuzzlesDir();
    const results: Array<{ date: string; id: string; category: string; difficulty: string }> = [];
    const errors: string[] = [];
    const newTopics: GeneratedTopic[] = [];
    const puzzlesToAdd: Puzzle[] = [];

    for (let i = 0; i < generatedPuzzles.length; i++) {
      const p = generatedPuzzles[i];

      if (!p.id || !p.category || !p.difficulty || !p.answer || !p.clues || !p.explanation) {
        errors.push(`Puzzle #${i + 1}: Missing required fields, skipped`);
        continue;
      }

      if (existingIds.includes(p.id)) {
        errors.push(`Puzzle #${i + 1}: ID "${p.id}" already exists, skipped`);
        continue;
      }

      const date = getNextDateString(existingDates);
      existingDates.add(date);

      const puzzle: Puzzle = {
        date,
        id: p.id,
        category: p.category,
        difficulty: p.difficulty,
        clues: p.clues.slice(0, 5),
        answer: p.answer,
        aliases: (p.aliases || []).slice(0, 10),
        explanation: p.explanation,
        fixSteps: (p.fixSteps || []).slice(0, 5),
      };

      const filePath = join(PUZZLES_DIR, `${p.id}.json`);
      writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + '\n');

      puzzlesToAdd.push(puzzle);

      const answerHash = await hashAnswer(p.answer);
      newTopics.push({
        id: p.id,
        category: p.category,
        difficulty: p.difficulty,
        answerHash,
      });

      results.push({ date, id: p.id, category: p.category, difficulty: p.difficulty });
    }

    const index = loadIndex();
    puzzlesToAdd.forEach((p) => {
      const existingIdx = index.findIndex((x) => x.id === p.id);
      if (existingIdx >= 0) {
        index[existingIdx] = p;
      } else {
        index.push(p);
      }
    });
    saveIndex(index);

    const updatedTopics = [...existingTopics, ...newTopics];
    saveGeneratedTopics(updatedTopics);

    return NextResponse.json({
      success: true,
      puzzles: results,
      errors,
    } satisfies GenerateResponse);
  } catch (err) {
    console.error('Puzzle generation failed:', err);
    return NextResponse.json(
      {
        success: false,
        puzzles: [],
        errors: [err instanceof Error ? err.message : 'Unknown error'],
      },
      { status: 500 }
    );
  }
}
