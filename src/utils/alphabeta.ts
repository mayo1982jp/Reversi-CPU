import { applyMove, evaluate, getValidMoves, type Cell } from "@/hooks/useReversi";

type Move = [number, number];

export function bestCpuMove(board: Cell[][], depth: number): Move | null {
  const moves = getValidMoves(board, -1);
  if (moves.length === 0) return null;

  let best: Move | null = null;
  let bestVal = -Infinity;

  for (const m of moves) {
    const nb = applyMove(board, m[0], m[1], -1);
    const v = minValue(nb, depth - 1, -Infinity, Infinity);
    if (v > bestVal) {
      bestVal = v;
      best = m;
    }
  }
  return best;
}

function maxValue(board: Cell[][], depth: number, alpha: number, beta: number): number {
  if (depth === 0) return evaluate(board);

  const moves = getValidMoves(board, 1);
  if (moves.length === 0) {
    // pass
    return minValue(board, depth - 1, alpha, beta);
  }

  let v = -Infinity;
  for (const m of moves) {
    const nb = applyMove(board, m[0], m[1], 1);
    v = Math.max(v, minValue(nb, depth - 1, alpha, beta));
    if (v >= beta) return v;
    alpha = Math.max(alpha, v);
  }
  return v;
}

function minValue(board: Cell[][], depth: number, alpha: number, beta: number): number {
  if (depth === 0) return evaluate(board);

  const moves = getValidMoves(board, -1);
  if (moves.length === 0) {
    // pass
    return maxValue(board, depth - 1, alpha, beta);
  }

  let v = Infinity;
  for (const m of moves) {
    const nb = applyMove(board, m[0], m[1], -1);
    v = Math.min(v, maxValue(nb, depth - 1, alpha, beta));
    if (v <= alpha) return v;
    beta = Math.min(beta, v);
  }
  return v;
}