import React from "react";
import { cn } from "@/lib/utils";

export type Cell = 0 | 1 | -1; // 0 empty, 1 black (player), -1 white (cpu)

type ReversiBoardProps = {
  board: Cell[][];
  validMoves: [number, number][];
  onPlace: (row: number, col: number) => void;
  currentPlayer: Cell;
  isCpuThinking: boolean;
  lang: "en" | "ja";
};

const ReversiBoard: React.FC<ReversiBoardProps> = ({
  board,
  validMoves,
  onPlace,
  currentPlayer,
  isCpuThinking,
  lang,
}) => {
  const size = 8;

  const isValid = (r: number, c: number) =>
    validMoves.some(([vr, vc]) => vr === r && vc === c);

  const labelTurn =
    lang === "ja"
      ? currentPlayer === 1
        ? "あなたの番（黒）"
        : isCpuThinking
          ? "CPU思考中（白）"
          : "CPUの番（白）"
      : currentPlayer === 1
        ? "Your turn (Black)"
        : isCpuThinking
          ? "CPU thinking (White)"
          : "CPU turn (White)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-muted-foreground">{labelTurn}</div>
      <div
        className="grid bg-emerald-700 rounded-md shadow-md"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: "min(92vw, 520px)",
          aspectRatio: "1 / 1",
          padding: "6px",
          gap: "6px",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const valid = isValid(r, c) && currentPlayer === 1 && !isCpuThinking;
            return (
              <button
                key={`${r}-${c}`}
                aria-label={`cell-${r}-${c}`}
                className={cn(
                  "relative rounded-sm bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center aspect-square",
                  valid && "ring-2 ring-yellow-400"
                )}
                onClick={() => valid && onPlace(r, c)}
                disabled={!valid}
              >
                {cell !== 0 ? (
                  <div
                    className={cn(
                      "size-[80%] rounded-full shadow-inner",
                      cell === 1 ? "bg-black" : "bg-white"
                    )}
                  />
                ) : valid ? (
                  <div className="size-3 rounded-full bg-yellow-400/80" />
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReversiBoard;