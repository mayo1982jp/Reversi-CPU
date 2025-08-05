import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Score = {
  black: number;
  white: number;
};

type Props = {
  score: Score;
  lang: "en" | "ja";
  gameOver: boolean;
  winnerLabel: string | null;
};

const ReversiScore: React.FC<Props> = ({ score, lang, gameOver, winnerLabel }) => {
  const title = lang === "ja" ? "スコア" : "Score";
  const blackLabel = lang === "ja" ? "黒" : "Black";
  const whiteLabel = lang === "ja" ? "白" : "White";
  const resultLabel = lang === "ja" ? "結果" : "Result";

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="font-medium">{title}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-black" />
            <span>{blackLabel}</span>
          </div>
          <span className="font-semibold">{score.black}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-white border" />
            <span>{whiteLabel}</span>
          </div>
          <span className="font-semibold">{score.white}</span>
        </div>
        {gameOver && (
          <div className="pt-2 text-sm text-muted-foreground">
            <span className="font-medium mr-2">{resultLabel}:</span>
            <span>{winnerLabel ?? "-"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReversiScore;