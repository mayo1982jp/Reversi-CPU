# Reversi (Othello) – React + TypeScript

A simple, responsive Reversi (Othello) game where you play as Black against a CPU (White) using an alpha–beta pruning AI. Includes difficulty levels (read-ahead depth), language toggle, and a clean UI built with Tailwind and shadcn/ui.

## Features

- Human vs CPU (Black = human, White = CPU)
- CPU AI with alpha–beta pruning
  - Level 1 = depth 1
  - Level 2 = depth 2
  - Level 3 = depth 3
  - Level 4 = depth 4
- Board renders valid moves and enforces rules
- Score panel with winner/draw detection
- Language toggle: English (default) / Japanese
- Choose who starts (First/Second) and apply on Reset
- Responsive layout (1-column on mobile, 2-column on desktop)
- Polished UI using Tailwind CSS + shadcn/ui

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS + shadcn/ui + Radix UI
- @tanstack/react-query (provider included for future data needs)
- Alpha–beta AI (custom utility)

## Project Structure

- src/
  - pages/
    - Index.tsx – Home page mounting the game
  - components/
    - ReversiGame.tsx – Orchestrates layout, language, level, starter toggle
    - ReversiBoard.tsx – Board UI and interactions
    - ReversiControls.tsx – Difficulty selector
    - ReversiScore.tsx – Score and result
    - ui/ – shadcn/ui components (toast, card, button, etc.)
  - hooks/
    - useReversi.ts – Game state, rules, scoring, helpers
  - utils/
    - alphabeta.ts – CPU AI: alpha–beta search
  - App.tsx – Routing and providers
  - main.tsx – App entry
  - globals.css & tailwind.config.ts – Styling

## How to Run

In your environment:
1) Install dependencies
2) Start the dev server
3) Open the shown localhost URL in your browser

Note: If you’re using this inside Dyad, use the action buttons above the chat input (Rebuild/Restart/Refresh) as needed.

## Gameplay Notes

- You are Black (first by default). Toggle First/Second in the left panel to decide the starter, then press Reset to apply.
- Select difficulty Level (1–4) to change the CPU’s search depth.
- Use the language toggle to switch between English/Japanese.

## Future Enhancements

- Move history / undo
- Hints and mobility metrics
- Time controls and per-move analysis
- Theming with system dark/light modes

## License

MIT