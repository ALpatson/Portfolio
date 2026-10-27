"use client";

import { useEffect, useRef, useState } from "react";

const CELL = 72;
const KNIGHT_JUMPS = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

// Faint board grid behind the hero. The square under the cursor lights up,
// together with every square a knight could jump to from it.
export default function KnightField() {
  const ref = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState<{ c: number; r: number } | null>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      setCell({ c: Math.floor((e.clientX - box.left) / CELL), r: Math.floor((e.clientY - box.top) / CELL) });
    };
    const onLeave = () => setCell(null);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const squares = cell
    ? [{ c: cell.c, r: cell.r, main: true }, ...KNIGHT_JUMPS.map(([dc, dr]) => ({ c: cell.c + dc, r: cell.r + dr, main: false }))]
    : [];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_60%_40%,black_30%,transparent_80%)]"
      style={{
        backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
        backgroundSize: `${CELL}px ${CELL}px`,
        opacity: 0.55,
      }}
    >
      {squares.map(({ c, r, main }) => (
        <span
          key={`${main ? "m" : "k"}-${c}-${r}`}
          className="absolute transition-opacity duration-300"
          style={{
            left: c * CELL,
            top: r * CELL,
            width: CELL,
            height: CELL,
            background: main ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "color-mix(in srgb, var(--accent) 7%, transparent)",
            outline: main ? "1px solid color-mix(in srgb, var(--accent) 50%, transparent)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
