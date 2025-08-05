import * as React from "react";

export type Cell = 0 | 1 | -1; // 0 empty, 1 black (player), -1 white (cpu)

const SIZE = 8;
const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export type GameState = {
  board: Cell[][];
  currentPlayer: Cell;
};

export function initialBoard(): Cell[][] {
  const b: Cell[][] = Array.from({ length: SIZE }, () =>
    Array<Cell>(SIZE).fill(0)
  );
  const mid = SIZE / 2;
  b[mid - 1][mid - 1] = -1;
  b[mid][mid] = -1;
  b[mid - 1][mid] = 1;
  b[mid][mid - 1] = 1;
  return b;
}

export function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => [...row]);
}

export function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

export function getValidMoves(board: Cell[][], player: Cell): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== 0) continue;
      if (wouldFlip(board, r, c, player)) moves.push([r, c]);
    }
  }
  return moves;
}

function wouldFlip(board: Cell[][], r: number, c: number, player: Cell): boolean {
  const opp = -player as Cell;
  for (const [dr, dc] of DIRS) {
    let rr = r + dr;
    let cc = c + dc;
    let seenOpp = false;
    while (inBounds(rr, cc) && board[rr][cc] === opp) {
      seenOpp = true;
      rr += dr;
      cc += dc;
    }
    if (seenOpp && inBounds(rr, cc) && board[rr][cc] === player) return true;
  }
  return false;
}

export function applyMove(board: Cell[][], r: number, c: number, player: Cell): Cell[][] {
  const newB = cloneBoard(board);
  newB[r][c] = player;
  const opp = -player as Cell;

  for (const [dr, dc] of DIRS) {
    let rr = r + dr;
    let cc = c + dc;
    const toFlip: [number, number][] = [];
    while (inBounds(rr, cc) && board[rr][cc] === opp) {
      toFlip.push([rr, cc]);
      rr += dr;
      cc += dc;
    }
    if (inBounds(rr, cc) && board[rr][cc] === player && toFlip.length > 0) {
      for (const [fr, fc] of toFlip) newB[fr][fc] = player;
    }
  }
  return newB;
}

export function countPieces(board: Cell[][]): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 1) black++;
      if (board[r][c] === -1) white++;
    }
  }
  return { black, white };
}

// Positional weights
const WEIGHTS: number[][] = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120],
];

export function evaluate(board: Cell[][]): number {
  let whiteScore = 0;
  let blackScore = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === -1) whiteScore += WEIGHTS[r][c];
      else if (board[r][c] === 1) blackScore += WEIGHTS[r][c];
    }
  }
  return whiteScore - blackScore;
}

export type Level = 1 | 2 | 3 | 4;

export type UseReversiReturn = {
  board: Cell[][];
  setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  currentPlayer: Cell;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Cell>>;
  isCpuThinking: boolean;
  setIsCpuThinking: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  score: { black: number; white: number };
  gameOver: boolean;
  winnerLabel: string | null;
};

export function useReversi(_level: Level, lang: "en" | "ja"): UseReversiReturn {
  const [board, setBoard] = React.useState<Cell[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = React.useState<Cell>(1);
  const [isCpuThinking, setIsCpuThinking] = React.useState(false);

  const reset = React.useCallback(() => {
    setBoard(initialBoard());
    setCurrentPlayer(1);
    setIsCpuThinking(false);
  }, []);

  const score = React.useMemo(() => countPieces(board), [board]);

  const gameOver = React.useMemo(() => {
    const hasBlack = getValidMoves(board, 1).length > 0;
    const hasWhite = getValidMoves(board, -1).length > 0;
    const anyEmpty = board.some((r) => r.some((c) => c === 0));
    return (!hasBlack && !hasWhite) || !anyEmpty;
  }, [board]);

  const winnerLabel = React.useMemo(() => {
    if (!gameOver) return null;
    const { black, white } = score;
    if (black === white) return lang === "ja" ? "引き分け" : "Draw";
    const blackWin = black > white;
    return lang === "ja" ? (blackWin ? "勝者: 黒" : "勝者: 白") : blackWin ? "Winner: Black" : "Winner: White";
  }, [gameOver, score, lang]);

  return {
    board,
    setBoard,
    currentPlayer,
    setCurrentPlayer,
    isCpuThinking,
    setIsCpuThinking,
    reset,
    score,
    gameOver,
    winnerLabel,
  };
}