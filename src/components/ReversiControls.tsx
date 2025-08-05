import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  level: number;
  onLevelChange: (level: number) => void;
  onReset: () => void; // kept for compatibility but unused here
  onPass: () => void; // unused
  lang: "en" | "ja";
  isCpuThinking: boolean; // unused
  canPass: boolean; // unused
};

const ReversiControls: React.FC<Props> = ({
  level,
  onLevelChange,
  lang,
}) => {
  const labelLevel = lang === "ja" ? "レベル" : "Level";

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium">{labelLevel}</div>
        <Select value={String(level)} onValueChange={(v) => onLevelChange(Number(v))}>
          <SelectTrigger className="w-28 bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2" />
    </div>
  );
};

export default ReversiControls;