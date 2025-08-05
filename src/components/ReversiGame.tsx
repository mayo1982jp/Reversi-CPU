import React from "react";
import ReversiBoard from "./ReversiBoard";
import ReversiControls from "./ReversiControls";
import {
  applyMove,
  countPieces,
  getValidMoves,
  useReversi,
  type Cell,
} from "@/hooks/useReversi";
import { bestCpuMove } from "@/utils/alphabeta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ReversiGame: React.FC = () => {
  const {
    board,
    setBoard,
    currentPlayer,
    setCurrentPlayer,
    isCpuThinking,
    setIsCpuThinking,
    reset,
  } = useReversi();

  const [level, setLevel] = React.useState<number>(1);
  const [lang, setLang] = React.useState<"en" | "ja">("en");

  const validMoves = React.useMemo(
    () => getValidMoves(board, currentPlayer),
    [board, currentPlayer]
  );

  const scores = countPieces(board);

  const gameOver = React.useMemo(() => {
    const hasBlack = getValidMoves(board, 1).length > 0;
    const hasWhite = getValidMoves(board, -1).length > 0;
    const anyEmpty = board.some((r) => r.some((c) => c === 0));
    return (!hasBlack && !hasWhite) || !anyEmpty;
  }, [board]);

  const announceIfOver = React.useCallback(() => {
    if (!gameOver) return;
    const { black, white } = scores;
    if (black > white) {
      toast.success(lang === "ja" ? "あなたの勝ち！" : "You win!");
    } else if (white > black) {
      toast.error(lang === "ja" ? "CPUの勝ち…" : "CPU wins…");
    } else {
      toast(lang === "ja" ? "引き分け" : "Draw");
    }
  }, [gameOver, scores, lang]);

  const handlePlayerMove = (r: number, c: number) => {
    if (currentPlayer !== 1 || isCpuThinking) return;
    const moves = getValidMoves(board, 1);
    if (!moves.some(([mr, mc]) => mr === r && mc === c)) return;

    const nb = applyMove(board, r, c, 1);
    setBoard(nb);
    setCurrentPlayer(-1);
  };

  // CPU turn effect
  React.useEffect(() => {
    if (gameOver) {
      announceIfOver();
      return;
    }
    if (currentPlayer === -1) {
      setIsCpuThinking(true);
      const id = setTimeout(() => {
        const move = bestCpuMove(board, Math.max(1, Math.min(4, level)));
        if (move) {
          const nb = applyMove(board, move[0], move[1], -1);
          setBoard(nb);
          setCurrentPlayer(1);
        } else {
          // pass
          if (getValidMoves(board, 1).length === 0) {
            // both cannot move -> game over
            // trigger announce in next effect
          } else {
            setCurrentPlayer(1);
          }
        }
        setIsCpuThinking(false);
      }, 250);
      return () => clearTimeout(id);
    }
  }, [currentPlayer, level, board, setBoard, setCurrentPlayer, setIsCpuThinking, announceIfOver, gameOver]);

  // Auto-pass for player if no moves
  React.useEffect(() => {
    if (currentPlayer === 1 && !isCpuThinking) {
      const moves = getValidMoves(board, 1);
      if (moves.length === 0) {
        toast(lang === "ja" ? "パス（黒の手なし）" : "Pass (no move for Black)");
        setCurrentPlayer(-1);
      }
    }
  }, [currentPlayer, isCpuThinking, board, setCurrentPlayer, lang]);

  const title = lang === "ja" ? "リバーシ（CPU対戦）" : "Reversi (vs CPU)";

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReversiControls
          level={level}
          onLevelChange={setLevel}
          onReset={() => {
            reset();
            toast.success(lang === "ja" ? "盤面をリセットしました" : "Board reset");
          }}
          lang={lang}
          onToggleLang={() => setLang((p) => (p === "en" ? "ja" : "en"))}
          scores={scores}
        />
        <ReversiBoard
          board={board}
          validMoves={validMoves}
          onPlace={handlePlayerMove}
          currentPlayer={currentPlayer}
          isCpuThinking={isCpuThinking}
          lang={lang}
        />
      </CardContent>
    </Card>
  );
};

export default ReversiGame;