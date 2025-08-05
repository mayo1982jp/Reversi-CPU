import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReversiBoard from "./ReversiBoard";
import ReversiControls from "./ReversiControls";
import ReversiScore from "./ReversiScore";
import { useReversi } from "@/components/useReversi";

const ReversiGame: React.FC = () => {
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const [lang] = useState<"en" | "ja">("ja");

  const {
    board,
    currentPlayer,
    validMoves,
    isCpuThinking,
    onPlace,
    resetGame,
    score,
    passTurn,
    gameOver,
    winnerLabel,
  } = useReversi(level, lang);

  const title = useMemo(() => (lang === "ja" ? "リバーシ" : "Reversi"), [lang]);
  const desc = useMemo(
    () => (lang === "ja" ? "CPU対戦。難易度を選んで遊べます。" : "Play against CPU. Choose difficulty."),
    [lang]
  );

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="flex items-center justify-center">
          <ReversiBoard
            board={board}
            validMoves={validMoves}
            onPlace={onPlace}
            currentPlayer={currentPlayer}
            isCpuThinking={isCpuThinking}
            lang={lang}
          />
        </div>

        <div className="space-y-4 md:pl-2">
          <ReversiControls
            level={level}
            onLevelChange={(lv: number) => setLevel((lv as 0 | 1 | 2))}
            lang={lang}
            onReset={resetGame}
            onPass={passTurn}
            isCpuThinking={isCpuThinking}
            canPass={!gameOver}
          />
          <ReversiScore score={score} lang={lang} gameOver={gameOver} winnerLabel={winnerLabel} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReversiGame;