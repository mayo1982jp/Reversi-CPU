import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
  level: number;
  onLevelChange: (level: number) => void;
  onReset: () => void;
  lang: "en" | "ja";
  onToggleLang: () => void;
  scores: { black: number; white: number };
};

const ReversiControls: React.FC<Props> = ({
  level,
  onLevelChange,
  onReset,
  lang,
  onToggleLang,
  scores,
}) => {
  const labelLevel = lang === "ja" ? "レベル" : "Level";
  const labelReset = lang === "ja" ? "リセット" : "Reset";
  const labelLang = lang === "ja" ? "日本語" : "Japanese";
  const labelScore =
    lang === "ja"
      ? `スコア: 黒 ${scores.black} - 白 ${scores.white}`
      : `Score: Black ${scores.black} - White ${scores.white}`;

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
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={onReset}>
          {labelReset}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{labelLang}</span>
        <Switch checked={lang === "ja"} onCheckedChange={onToggleLang} />
      </div>
      <div className="text-sm">{labelScore}</div>
    </div>
  );
};

export default ReversiControls;