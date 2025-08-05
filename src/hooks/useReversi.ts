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

// Positional weights (favor corners, penalize adjacent to corners)
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
  // Positive means advantage for White(CPU -1) or Black(1)? We'll evaluate from White's perspective negative.
  // Let's define evaluation as (white - black) positional score so higher is better for white(CPU=-1).
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

export function useReversi() {
  const [board, setBoard] = React.useState<Cell[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = React.useState<Cell>(1); // player starts
  const [isCpuThinking, setIsCpuThinking] = React.useState(false);

  const reset = React.useCallback(() => {
    setBoard(initialBoard());
    setCurrentPlayer(1);
    setIsCpuThinking(false);
  }, []);

  return {
    board,
    setBoard,
    currentPlayer,
    setCurrentPlayer,
    isCpuThinking,
    setIsCpuThinking,
    reset,
  };
}