# Techdle

A daily IT troubleshooting puzzle game, styled like Wordle. 

## Features
- **Daily Puzzles**: A new IT support ticket every day, generated deterministically using date-seeded hashing.
- **Root Cause Analysis**: 6 guesses to identify the failing component (e.g., "DNS", "RAM", "BGP").
- **Practice Mode**: Replay past puzzles in the Archive.
- **Account Sync**: Play anonymously or link your Google/GitHub account via Firebase to save stats across devices.
- **Light/Dark & High Contrast Modes**: Built-in themes optimized for readability and accessibility.
- **PWA Ready**: Fully installable as a Progressive Web App (PWA) with native offline fallback and caching.
- **Smart Validation**: Uses Levenshtein distance and comprehensive alias mapping to generously accept user guesses.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS v4
- Firebase (Auth & Firestore)
- TypeScript

## Project Architecture
Based on the project's knowledge graph, the repository is organized into these core communities:
- **Game Engine & UI**: The core game loop (`useGame`), the visual board (`GameBoard`, `ClueList`, `GuessInput`), and the endgame ticket (`ResolutionTicket`).
- **Data & Sync**: Cross-device state synchronization via `syncLocalDataToFirestore`, encoding/decoding game states, and `useArchiveGame` for past puzzles.
- **Puzzle Subsystem**: 
  - Server actions for verifying answers and fetching aliases securely (`src/app/actions.ts`).
  - A suite of Node.js scripts (`scripts/`) to manage the puzzle lifecycle: creating new puzzles (`new-puzzle.mjs`), checking puzzle validity (`check-puzzles.mjs`), rebuilding the index (`rebuild-index.mjs`), and generating the daily client bundle (`generate-client-puzzles.mjs`).
- **AI Agent Integration**: Houses custom `.agents` skills (e.g., Ponytail) to assist with repository maintenance, debt tracking, and complexity audits.

## Development
```bash
npm install
npm run dev
```

### Useful Scripts
- `npm run dev` - Starts the development server and automatically generates the client puzzle bundle.
- `npm run new-puzzle` - Interactive CLI prompt to write a new puzzle and automatically append it to the master index.
- `npm run rebuild-index` - Scans the `src/data/puzzles/` directory to rebuild `index.json`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
