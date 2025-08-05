import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  level: number;
  onLevelChange: (level: number) => void;
  onReset: () => void;
  onPass: () => void;
  lang: "en" | "ja";
  isCpuThinking: boolean;
  canPass: boolean;
};

const ReversiControls: React.FC<Props> = ({
  level,
  onLevelChange,
  onReset,
  onPass,
  lang,
  isCpuThinking,
  canPass,
}) => {
  const labelLevel = lang === "ja" ? "レベル" : "Level";
  const labelReset = lang === "ja" ? "リセット" : "Reset";
  const labelPass = lang === "ja" ? "パス" : "Pass";

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium">{labelLevel}</div>
        <Select value={String(level)} onValueChange={(v) => onLevelChange(Number(v))}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={onReset}>
          {labelReset}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onPass} disabled={!canPass || isCpuThinking} variant="default">
          {labelPass}
        </Button>
      </div>
    </div>
  );
};

export default ReversiControls;