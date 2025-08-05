import { useEffect, useMemo, useRef, useState } from "react";
import type { Cell } from "./ReversiBoard";

type Level = 0 | 1 | 2; // 0: easy, 1: medium, 2: hard

type UseReversiReturn = {
  board: Cell[][];
  currentPlayer: Cell;
  validMoves: [number, number][];
  isCpuThinking: boolean;
  onPlace: (r: number, c: number) => void;
  resetGame: () => void;
  passTurn: () => void;
  score: { black: number; white: number };
  gameOver: boolean;
  winnerLabel: string | null;
};

const DIRECTIONS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /*self*/ [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const SIZE = 8;

function createInitialBoard(): Cell[][] {
  const b: Cell[][] = Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(0));
  b[3][3] = -1;
  b[3][4] = 1;
  b[4][3] = 1;
  b[4][4] = -1;
  return b;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function getFlips(board: Cell[][], r: number, c: number, player: Cell): [number, number][] {
  if (board[r][c] !== 0) return [];
  const flips: [number, number][] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const line: [number, number][] = [];
    let cr = r + dr;
    let cc = c + dc;
    while (inBounds(cr, cc) && board[cr][cc] === -player) {
      line.push([cr, cc]);
      cr += dr;
      cc += dc;
    }
    if (line.length > 0 && inBounds(cr, cc) && board[cr][cc] === player) {
      flips.push(...line);
    }
  }
  return flips;
}

function computeValidMoves(board: Cell[][], player: Cell): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0 && getFlips(board, r, c, player).length > 0) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

function applyMove(board: Cell[][], r: number, c: number, player: Cell): Cell[][] {
  const flips = getFlips(board, r, c, player);
  if (flips.length === 0) return board;
  const next = board.map(row => row.slice());
  next[r][c] = player;
  for (const [fr, fc] of flips) {
    next[fr][fc] = player;
  }
  return next;
}

function countScore(board: Cell[][]) {
  let black = 0, white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      if (cell === -1) white++;
    }
  }
  return { black, white };
}

type LevelNum = Level;

function pickCpuMove(level: LevelNum, board: Cell[][], moves: [number, number][]): [number, number] | null {
  if (moves.length === 0) return null;
  if (level === 0) {
    return moves[0];
  }
  const corners = new Set(["0,0", "0,7", "7,0", "7,7"]);
  let best: [number, number] = moves[0];
  let bestScore = -1;
  for (const m of moves) {
    const flips = getFlips(board, m[0], m[1], -1).length;
    let s = flips;
    if (level === 2 && corners.has(`${m[0]},${m[1]}`)) s += 10;
    if (s > bestScore) {
      bestScore = s;
      best = m;
    }
  }
  return best;
}

export function useReversi(level: LevelNum, lang: "en" | "ja"): UseReversiReturn {
  const [board, setBoard] = useState<Cell[][]>(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  const validMoves = useMemo(() => computeValidMoves(board, currentPlayer), [board, currentPlayer]);
  const score = useMemo(() => countScore(board), [board]);

  const gameOver = useMemo(() => {
    const movesCurrent = computeValidMoves(board, currentPlayer);
    const movesOther = computeValidMoves(board, (-currentPlayer) as Cell);
    const filled = score.black + score.white === SIZE * SIZE;
    return filled || (movesCurrent.length === 0 && movesOther.length === 0);
  }, [board, currentPlayer, score]);

  const winnerLabel = useMemo(() => {
    if (!gameOver) return null;
    if (score.black === score.white) return lang === "ja" ? "引き分け" : "Draw";
    const blackWin = score.black > score.white;
    return lang === "ja" ? (blackWin ? "勝者: 黒" : "勝者: 白") : blackWin ? "Winner: Black" : "Winner: White";
  }, [gameOver, score, lang]);

  const cpuTimer = useRef<number | null>(null);

  function onPlace(r: number, c: number) {
    if (currentPlayer !== 1 || isCpuThinking || gameOver) return;
    const flips = getFlips(board, r, c, 1);
    if (flips.length === 0) return;
    const next = applyMove(board, r, c, 1);
    setBoard(next);
    setCurrentPlayer(-1);
  }

  function passTurn() {
    if (gameOver) return;
    setCurrentPlayer(p => (-p as Cell));
  }

  function resetGame() {
    setBoard(createInitialBoard());
    setCurrentPlayer(1);
    setIsCpuThinking(false);
  }

  useEffect(() => {
    if (gameOver) return;
    if (currentPlayer !== -1) return;
    const moves = computeValidMoves(board, -1 as Cell);
    if (moves.length === 0) {
      setCurrentPlayer(1);
      return;
    }
    setIsCpuThinking(true);
    cpuTimer.current = window.setTimeout(() => {
      const move = pickCpuMove(level, board, moves);
      if (move) {
        setBoard(b => applyMove(b, move[0], move[1], -1 as Cell));
      }
      setCurrentPlayer(1);
      setIsCpuThinking(false);
    }, 400);
    return () => {
      if (cpuTimer.current) {
        clearTimeout(cpuTimer.current);
        cpuTimer.current = null;
      }
    };
  }, [board, currentPlayer, level, gameOver]);

  return {
    board,
    currentPlayer,
    validMoves,
    isCpuThinking,
    onPlace,
    resetGame,
    passTurn,
    score,
    gameOver,
    winnerLabel,
  };
}