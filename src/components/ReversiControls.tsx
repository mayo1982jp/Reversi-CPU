"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Props = {
  level: number;
  onLevelChange: (level: number) => void;
  onRestart: () => void;
  lang: "en" | "ja";
};

const ReversiControls: React.FC<Props> = ({ level, onLevelChange, onRestart, lang }) => {
  const labelLevel = lang === "ja" ? "難易度" : "Level";
  const labelRestart = lang === "ja" ? "リスタート" : "Restart";
  const labelHint = lang === "ja" ? "ヒント表示" : "Show Hints";

  return (
    <div
      className={cn(
        "w-full sm:max-w-md", // 左側に収まる幅
        "bg-card text-card-foreground rounded-lg shadow p-4",
        "flex flex-col gap-4"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium">{labelLevel}</div>
        <Select value={String(level)} onValueChange={(v) => onLevelChange(Number(v))}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{labelHint}</span>
        <Slider defaultValue={[50]} max={100} step={10} className="w-full" />
      </div>

      <div className="flex justify-start">
        <Button variant="secondary" onClick={onRestart}>
          {labelRestart}
        </Button>
      </div>
    </div>
  );
};

export default ReversiControls;