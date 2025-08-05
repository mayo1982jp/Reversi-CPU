import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReversiBoard from "./ReversiBoard";
import ReversiControls from "./ReversiControls";
import ReversiScore from "./ReversiScore";
import { useReversi, applyMove, getValidMoves, type Cell } from "@/hooks/useReversi";
import { Button } from "@/components/ui/button";
import { bestCpuMove } from "@/utils/alphabeta";

const ReversiGame: React.FC = () => {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [lang, setLang] = useState<"en" | "ja">("en");

  const {
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
  } = useReversi(level, lang);

  const title = useMemo(() => (lang === "ja" ? "リバーシ" : "Reversi"), [lang]);
  const desc = useMemo(
    () => (lang === "ja" ? "CPU対戦。難易度を選んで遊べます。" : "Play against CPU. Choose difficulty."),
    [lang]
  );

  const resetLabel = lang === "ja" ? "リセット" : "Reset";
  // Toggle label: show the language you will switch to
  const langToggleLabel = lang === "ja" ? "English" : "Japanese";

  const validMoves = useMemo(() => getValidMoves(board, currentPlayer), [board, currentPlayer]);

  // Player move
  const onPlace = (r: number, c: number) => {
    if (currentPlayer !== 1 || isCpuThinking || gameOver) return;
    const moves = getValidMoves(board, 1);
    if (!moves.some(([mr, mc]) => mr === r && mc === c)) return;
    const nb = applyMove(board, r, c, 1);
    setBoard(nb);
    setCurrentPlayer(-1 as Cell);
  };

  // CPU turn using alpha-beta
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (gameOver) return;
    if (currentPlayer !== -1) return;

    const moves = getValidMoves(board, -1);
    if (moves.length === 0) {
      setCurrentPlayer(1 as Cell);
      return;
    }

    setIsCpuThinking(true);
    timerRef.current = window.setTimeout(() => {
      const depth = Math.max(1, Math.min(4, level));
      const move = bestCpuMove(board, depth);
      if (move) {
        const nb = applyMove(board, move[0], move[1], -1);
        setBoard(nb);
      }
      setCurrentPlayer(1 as Cell);
      setIsCpuThinking(false);
    }, 250);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [board, currentPlayer, level, gameOver, setBoard, setCurrentPlayer, setIsCpuThinking]);

  return (
    <Card className="w-full max-w-6xl">
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-[320px_1fr] bg-black text-white rounded-md overflow-hidden">
          {/* Left: header + controls */}
          <div className="space-y-4 md:pr-2 p-6">
            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <ReversiControls
                level={level}
                onLevelChange={(lv: number) => setLevel((lv as 1 | 2 | 3 | 4))}
                lang={lang}
                onReset={reset}
                onPass={() => {}}
                isCpuThinking={isCpuThinking}
                canPass={!gameOver}
              />
            </div>

            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <ReversiScore
                score={score}
                lang={lang}
                gameOver={gameOver}
                winnerLabel={winnerLabel}
              />
            </div>

            {/* Language toggle above reset */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-black border-white/40 bg-white hover:bg-white/90"
                onClick={() => setLang((p) => (p === "en" ? "ja" : "en"))}
              >
                {langToggleLabel}
              </Button>
            </div>

            <div>
              <Button variant="secondary" onClick={reset}>
                {resetLabel}
              </Button>
            </div>
          </div>

          {/* Right: board */}
          <div className="flex items-center justify-center p-6">
            <ReversiBoard
              board={board}
              validMoves={validMoves}
              onPlace={onPlace}
              currentPlayer={currentPlayer}
              isCpuThinking={isCpuThinking}
              lang={lang}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReversiGame;