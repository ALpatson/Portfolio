"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Chess, type Move, type Square } from "chess.js";
import type { Dictionary } from "@/content/types";

type BoardText = Dictionary["beyond"]["board"];

// Morphy vs. the Duke of Brunswick and Count Isouard, Paris 1858.
const OPERA_GAME =
  "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#".split(" ");

const FILES = "abcdefgh";
const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

type Piece = { id: string; type: string; color: "w" | "b"; square: Square };

function startingPieces(game: Chess): Piece[] {
  const pieces: Piece[] = [];
  for (const row of game.board()) {
    for (const cell of row) {
      if (cell) pieces.push({ id: `${cell.color}${cell.type}-${cell.square}`, type: cell.type, color: cell.color, square: cell.square });
    }
  }
  return pieces;
}

// Moves the tracked pieces the same way chess.js moved them, so each piece
// keeps its id and can slide to its new square instead of being redrawn.
function applyMove(pieces: Piece[], move: Move): Piece[] {
  let capturedSquare: string | null = move.captured ? move.to : null;
  if (move.flags.includes("e")) capturedSquare = `${move.to[0]}${move.from[1]}`;

  const rank = move.from[1];
  const rookMove =
    move.flags.includes("k") ? { from: `h${rank}`, to: `f${rank}` } : move.flags.includes("q") ? { from: `a${rank}`, to: `d${rank}` } : null;

  return pieces
    .filter((p) => p.square !== capturedSquare || p.square === move.from)
    .map((p) => {
      if (p.square === move.from) return { ...p, square: move.to, type: move.promotion ?? p.type };
      if (rookMove && p.square === rookMove.from) return { ...p, square: rookMove.to as Square };
      return p;
    });
}

// A small engine: grab material, deliver mate, avoid hanging pieces, with a
// little randomness so games differ. Strong enough to be fun, weak enough to beat.
function engineMove(game: Chess): Move | null {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    let score = Math.random() * 0.6;
    if (move.captured) score += VALUE[move.captured] * 10 - VALUE[move.piece];
    if (move.promotion) score += 8;
    const center = "de".includes(move.to[0]) && "45".includes(move.to[1]);
    if (center) score += 0.5;
    game.move(move);
    if (game.isCheckmate()) score += 1000;
    else if (game.inCheck()) score += 1.5;
    if (game.isAttacked(move.to, game.turn())) score -= VALUE[move.piece] * 8;
    game.undo();
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

const squareXY = (square: string) => ({
  left: `${FILES.indexOf(square[0]) * 12.5}%`,
  top: `${(8 - Number(square[1])) * 12.5}%`,
});

export default function ChessBoard({ t }: { t: BoardText }) {
  const gameRef = useRef<Chess>(null as unknown as Chess);
  if (gameRef.current === null) gameRef.current = new Chess();
  const [pieces, setPieces] = useState<Piece[]>(() => startingPieces(new Chess()));
  const [checkSquare, setCheckSquare] = useState<Square | null>(null);
  const [mode, setMode] = useState<"watch" | "play">("watch");
  const [ply, setPly] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [targets, setTargets] = useState<Square[]>([]);
  const [status, setStatus] = useState<string>("");
  const [thinking, setThinking] = useState(false);

  const reset = useCallback(() => {
    gameRef.current = new Chess();
    setPieces(startingPieces(gameRef.current));
    setPly(0);
    setLastMove(null);
    setSelected(null);
    setTargets([]);
    setStatus("");
    setThinking(false);
    setCheckSquare(null);
  }, []);

  const play = useCallback((move: Move) => {
    setPieces((prev) => applyMove(prev, move));
    setLastMove({ from: move.from, to: move.to });
    const game = gameRef.current;
    setCheckSquare(game.inCheck() ? (game.findPiece({ type: "k", color: game.turn() })[0] ?? null) : null);
  }, []);

  // Watch mode: replay the Opera Game, pause on the mate, then start again.
  useEffect(() => {
    if (mode !== "watch") return;
    const game = gameRef.current;
    const delay = ply === 0 ? 1400 : ply >= OPERA_GAME.length ? 4200 : 1100;
    const timer = setTimeout(() => {
      if (ply >= OPERA_GAME.length) {
        reset();
        return;
      }
      play(game.move(OPERA_GAME[ply]));
      setPly((n) => n + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [mode, ply, play, reset]);

  const finishTurn = useCallback(() => {
    const game = gameRef.current;
    if (game.isCheckmate()) setStatus(game.turn() === "b" ? t.youWon : t.iWon);
    else if (game.isDraw() || game.isGameOver()) setStatus(t.draw);
    else if (game.inCheck()) setStatus(t.check);
    else setStatus(game.turn() === "w" ? t.yourMove : t.thinking);
  }, [t]);

  // Play mode: after White moves, the engine answers.
  useEffect(() => {
    if (mode !== "play") return;
    const game = gameRef.current;
    if (game.turn() !== "b" || game.isGameOver()) return;
    setThinking(true);
    setStatus(t.thinking);
    const timer = setTimeout(() => {
      const reply = engineMove(game);
      if (reply) play(game.move(reply));
      setThinking(false);
      finishTurn();
    }, 650);
    return () => clearTimeout(timer);
  }, [mode, pieces, play, finishTurn, t.thinking]);

  const startPlaying = () => {
    reset();
    setMode("play");
    setStatus(t.yourMove);
  };

  const startWatching = () => {
    reset();
    setMode("watch");
  };

  const onSquare = (square: Square) => {
    if (mode !== "play" || thinking) return;
    const game = gameRef.current;
    if (game.turn() !== "w" || game.isGameOver()) return;

    if (selected && targets.includes(square)) {
      const move = game.move({ from: selected, to: square, promotion: "q" });
      play(move);
      setSelected(null);
      setTargets([]);
      finishTurn();
      return;
    }
    const piece = game.get(square);
    if (piece && piece.color === "w") {
      setSelected(square);
      setTargets(game.moves({ square, verbose: true }).map((m) => m.to));
    } else {
      setSelected(null);
      setTargets([]);
    }
  };

  const occupied = new Set(pieces.map((p) => p.square));

  return (
    <div className="w-full max-w-[min(30rem,88vw)]">
      <div className="rounded-[1.6rem] border border-line-strong bg-surface p-2 shadow-[0_30px_60px_-25px_rgba(var(--shadow),0.45)]">
      <div className="relative aspect-square overflow-hidden rounded-[1.1rem]">
        {/* Squares (also the click targets in play mode) */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }, (_, i) => {
            const file = FILES[i % 8];
            const rank = 8 - Math.floor(i / 8);
            const square = `${file}${rank}` as Square;
            const light = (i % 8) % 2 === Math.floor(i / 8) % 2;
            const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
            const isTarget = targets.includes(square);
            return (
              <button
                key={square}
                type="button"
                tabIndex={mode === "play" ? 0 : -1}
                aria-label={mode === "play" ? square : undefined}
                aria-hidden={mode !== "play"}
                onClick={() => onSquare(square)}
                className={`relative ${light ? "bg-square-light" : "bg-square-dark"} ${mode === "play" ? "cursor-pointer" : "cursor-default"}`}
              >
                {isLast && <span className="absolute inset-0 bg-accent/35" />}
                {selected === square && <span className="absolute inset-0 bg-accent/55" />}
                {checkSquare === square && <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(200,60,40,0.8),transparent_70%)]" />}
                {isTarget && (
                  <span
                    className={`absolute inset-0 m-auto rounded-full ${
                      occupied.has(square) ? "h-[90%] w-[90%] border-4 border-black/25" : "h-[28%] w-[28%] bg-black/25"
                    }`}
                  />
                )}
                {i % 8 === 0 && (
                  <span className={`absolute top-0.5 left-1 font-mono text-[9px] ${light ? "text-square-dark" : "text-square-light"}`}>{rank}</span>
                )}
                {rank === 1 && (
                  <span className={`absolute right-1 bottom-0 font-mono text-[9px] ${light ? "text-square-dark" : "text-square-light"}`}>{file}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pieces slide between squares */}
        <div className="pointer-events-none absolute inset-0">
          <AnimatePresence>
            {pieces.map((p) => (
              <motion.img
                key={p.id}
                src={`/pieces/${p.color}${p.type.toUpperCase()}.svg`}
                alt=""
                draggable={false}
                className="absolute h-[12.5%] w-[12.5%] p-[0.6%] drop-shadow-[0_3px_3px_rgba(0,0,0,0.35)]"
                initial={false}
                animate={{ ...squareXY(p.square), opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="min-h-[1.25rem] font-mono text-xs text-muted" aria-live="polite">
          {mode === "watch" ? t.caption : status || t.hint}
        </p>
        <div className="flex gap-2">
          {mode === "watch" ? (
            <button
              type="button"
              onClick={startPlaying}
              className="rounded-full border border-accent/60 px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-ink"
            >
              {t.play}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={startPlaying}
                className="rounded-full border border-line-strong px-4 py-1.5 text-sm text-fg-soft transition hover:border-accent hover:text-accent"
              >
                {t.reset}
              </button>
              <button
                type="button"
                onClick={startWatching}
                className="rounded-full border border-line-strong px-4 py-1.5 text-sm text-fg-soft transition hover:border-accent hover:text-accent"
              >
                {t.watch}
              </button>
            </>
          )}
        </div>
      </div>
      {mode === "watch" && (
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-faint" aria-hidden="true">
          {OPERA_GAME.slice(0, ply)
            .map((san, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${san}` : san))
            .slice(-6)
            .join("  ")}
          <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent/70" />
        </p>
      )}
    </div>
  );
}
