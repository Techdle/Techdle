# Add Puzzle — Skill

Step-by-step procedure for adding a new puzzle to Techdle.

## Puzzle schema

Each puzzle is a JSON object in `src/data/puzzles/` with this structure:

```json
{
  "id": "kebab-case-id",
  "date": "YYYY-MM-DD",
  "category": "Hardware | Software | Network | Security | Peripheral",
  "difficulty": "Hard",
  "clues": [
    "Clue 1 (most vague, the initial symptom)",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5 (most specific)"
  ],
  "answer": "canonical answer — lowercase, the root cause",
  "aliases": [
    "synonym 1",
    "synonym 2",
    "..."
  ],
  "explanation": "Diagnostic notes explaining the reasoning",
  "fixSteps": [
    "Step 1",
    "Step 2",
    "..."
  ]
}
```

## Where files go

- New puzzle files: `src/data/puzzles/<YYYY-MM-DD>.json`
- Index (update after adding): `src/data/puzzles/index.json`

## Using the interactive script

Run `npm run new-puzzle` for an interactive prompt that creates the file and updates the index automatically.

## Manual procedure (if not using the script)

1. Create `src/data/puzzles/<YYYY-MM-DD>.json` with the schema above
2. Add the same object to the array in `src/data/puzzles/index.json` — insert in date order (ascending)
3. Run `npm run generate-puzzles` to regenerate `client-puzzles.json` and `answer-hashes.json`
4. Run `npm run build` to verify everything compiles

## Naming and date conventions

- File name is the puzzle date: `YYYY-MM-DD.json`
- Puzzle IDs are kebab-case: e.g. `failing-psu-001`
- Dates should be in the future. Past dates are allowed for backfilling
- Each date should only have one puzzle file (no duplicates)

## After adding

Run verification:
1. `npm run generate-puzzles`
2. `npm run build`
3. `npx tsc --noEmit`
