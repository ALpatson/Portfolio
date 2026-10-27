"use client";

import { useEffect, useRef } from "react";

type Mode = "tour" | "pieces";

const PIECES = ["K", "Q", "R", "B", "N", "P"];
const JUMPS = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Loads a piece SVG and recolours it with the accent colour, so the same
// drawing works on both light and dark palettes.
function tintedPiece(type: string, color: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      resolve(c);
    };
    img.src = `/pieces/b${type}.svg`;
  });
}

// Full-screen animated backdrop. Two styles:
//  - "tour":   a knight hops in L-shapes across the screen, leaving a fading trail.
//  - "pieces": faint chess pieces drift upwards at different depths.
// Pauses when the tab is hidden and shows a still frame for reduced motion.
export default function AnimatedBackground({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = cssVar("--accent") || "#8a6a35";
    let w = 0, h = 0, frame = 0, stopped = false;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMouse = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMouse, { passive: true });

    let draw: (now: number) => void = () => {};

    const start = async () => {
      const sprites = Object.fromEntries(await Promise.all(PIECES.map(async (p) => [p, await tintedPiece(p, accent)] as const)));
      if (stopped) return;

      if (mode === "tour") {
        const cell = w < 640 ? 56 : 72;
        let cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
        let pos = { c: Math.floor(cols / 2), r: Math.floor(rows / 2) };
        let visited = new Set<string>([`${pos.c},${pos.r}`]);
        const trail: { from: { c: number; r: number }; to: { c: number; r: number } }[] = [];
        const lit: { c: number; r: number; t: number }[] = [];
        let from = pos, to = pos, moveStart = 0;
        const MOVE_MS = 1100;

        const inside = (c: number, r: number) => c >= 0 && r >= 0 && c < cols && r < rows;
        const options = (p: { c: number; r: number }) =>
          JUMPS.map(([dc, dr]) => ({ c: p.c + dc, r: p.r + dr })).filter((q) => inside(q.c, q.r));

        // Warnsdorff's rule (go where there are fewest onward moves) gives long,
        // tidy tours; a little randomness keeps each visit different.
        const nextSquare = () => {
          cols = Math.ceil(w / cell);
          rows = Math.ceil(h / cell);
          let choices = options(pos).filter((q) => !visited.has(`${q.c},${q.r}`));
          if (!choices.length) {
            visited = new Set();
            choices = options(pos);
          }
          choices.sort(
            (a, b) =>
              options(a).filter((q) => !visited.has(`${q.c},${q.r}`)).length -
              options(b).filter((q) => !visited.has(`${q.c},${q.r}`)).length +
              (Math.random() - 0.5) * 1.5,
          );
          return choices[0] ?? pos;
        };

        const center = (p: { c: number; r: number }) => ({ x: p.c * cell + cell / 2, y: p.r * cell + cell / 2 });
        // The L: travel the long leg first, then the short one.
        const corner = (a: { c: number; r: number }, b: { c: number; r: number }) =>
          Math.abs(b.c - a.c) === 2 ? center({ c: b.c, r: a.r }) : center({ c: a.c, r: b.r });

        const pointOnL = (a: { c: number; r: number }, b: { c: number; r: number }, t: number) => {
          const p0 = center(a), p1 = corner(a, b), p2 = center(b);
          const l1 = Math.hypot(p1.x - p0.x, p1.y - p0.y), l2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const d = t * (l1 + l2);
          if (d <= l1) return { x: p0.x + ((p1.x - p0.x) * d) / l1, y: p0.y + ((p1.y - p0.y) * d) / l1 };
          const e = (d - l1) / l2;
          return { x: p1.x + (p2.x - p1.x) * e, y: p1.y + (p2.y - p1.y) * e };
        };

        draw = (now) => {
          ctx.clearRect(0, 0, w, h);
          if (!moveStart) moveStart = now;
          let t = Math.min(1, (now - moveStart) / MOVE_MS);
          if (t >= 1) {
            trail.push({ from, to });
            if (trail.length > 26) trail.shift();
            lit.push({ ...to, t: now });
            pos = to;
            visited.add(`${pos.c},${pos.r}`);
            from = pos;
            to = nextSquare();
            moveStart = now;
            t = 0;
          }
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          // Squares the knight has landed on glow, then fade out.
          for (let i = lit.length - 1; i >= 0; i--) {
            const age = (now - lit[i].t) / 9000;
            if (age > 1) {
              lit.splice(i, 1);
              continue;
            }
            ctx.globalAlpha = 0.09 * (1 - age);
            ctx.fillStyle = accent;
            ctx.fillRect(lit[i].c * cell + 1, lit[i].r * cell + 1, cell - 2, cell - 2);
          }

          // The trail: older jumps are fainter.
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = accent;
          trail.forEach((seg, i) => {
            ctx.globalAlpha = 0.04 + 0.26 * (i / trail.length);
            const a = center(seg.from), m = corner(seg.from, seg.to), b = center(seg.to);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(m.x, m.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.fill();
          });

          // The jump in progress, drawn as it happens.
          if (from !== to) {
            ctx.globalAlpha = 0.38;
            const a = center(from);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const steps = 24;
            for (let s = 1; s <= steps; s++) {
              const q = pointOnL(from, to, (eased * s) / steps);
              ctx.lineTo(q.x, q.y);
            }
            ctx.stroke();
          }

          // The knight itself, with a small hop.
          const head = from === to ? center(from) : pointOnL(from, to, eased);
          const size = cell * 0.62;
          const hop = Math.sin(Math.PI * t) * 6;
          ctx.globalAlpha = 0.5;
          ctx.drawImage(sprites.N, head.x - size / 2, head.y - size / 2 - hop, size, size);
          ctx.globalAlpha = 1;
        };
        to = nextSquare();
      } else {
        const count = w < 640 ? 14 : 26;
        const pieces = Array.from({ length: count }, () => {
          const depth = 0.3 + Math.random() * 0.7; // nearer pieces are bigger, faster and stronger
          return {
            type: PIECES[Math.floor(Math.random() * PIECES.length)],
            x: Math.random() * w,
            y: Math.random() * h,
            depth,
            size: 22 + depth * 46,
            vy: -(6 + depth * 14),
            vx: (Math.random() - 0.5) * 6,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.25,
            ox: 0,
            oy: 0,
          };
        });
        let last = 0;
        draw = (now) => {
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
          last = now;
          ctx.clearRect(0, 0, w, h);
          const scroll = window.scrollY;
          for (const p of pieces) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rot += p.vr * dt;
            const sy = (((p.y - scroll * p.depth * 0.35) % (h + 140)) + h + 140) % (h + 140) - 70;
            const sx = ((p.x % (w + 140)) + w + 140) % (w + 140) - 70;
            // Ease away from the cursor.
            const dx = sx - mouse.x, dy = sy - mouse.y, dist = Math.hypot(dx, dy);
            const push = dist < 140 ? (1 - dist / 140) * 28 : 0;
            p.ox += ((dist ? (dx / dist) * push : 0) - p.ox) * 0.08;
            p.oy += ((dist ? (dy / dist) * push : 0) - p.oy) * 0.08;
            ctx.save();
            ctx.globalAlpha = 0.05 + p.depth * 0.09;
            ctx.translate(sx + p.ox, sy + p.oy);
            ctx.rotate(Math.sin(p.rot) * 0.35);
            ctx.drawImage(sprites[p.type], -p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        };
      }

      const loop = (now: number) => {
        if (stopped) return;
        if (!document.hidden) draw(now);
        frame = requestAnimationFrame(loop);
      };
      if (reduced) draw(performance.now());
      else frame = requestAnimationFrame(loop);
    };
    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMouse);
    };
  }, [mode]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
