import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-[320px_1fr] bg-black text-white rounded-md overflow-hidden">
          {/* 左: ヘッダー + 操作エリア（角丸カードデザイン） */}
          <div className="space-y-4 md:pr-2 p-6">
            {/* タイトル/説明カード */}
            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>

            {/* コントロールカード */}
            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <ReversiControls
                level={level}
                onLevelChange={(lv: number) => setLevel((lv as 0 | 1 | 2))}
                lang={lang}
                onReset={resetGame}
                onPass={passTurn}
                isCpuThinking={isCpuThinking}
                canPass={!gameOver}
              />
            </div>

            {/* スコアカード */}
            <div className="rounded-lg border border-white/10 bg-card/20 backdrop-blur-sm p-4">
              <ReversiScore
                score={score}
                lang={lang}
                gameOver={gameOver}
                winnerLabel={winnerLabel}
              />
            </div>
          </div>

          {/* 右: 盤面エリア */}
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