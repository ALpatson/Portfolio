"use client";

import { useEffect, useRef } from "react";

export type TechMode = "both" | "grid" | "network";

const GAP = 26; // dot grid spacing
const LINK = 120; // max distance at which two network points connect
const SPOT = 230; // spotlight radius

// Full-screen backdrop: a faint dot grid, drifting network points that link up
// when close, and a soft spotlight that follows the mouse (or drifts by itself
// on touch screens). Pauses in background tabs; still frame for reduced motion.
export default function TechBackground({ mode = "both" }: { mode?: TechMode }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grid = mode !== "network";
    const network = mode !== "grid";
    let w = 0, h = 0, frame = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const spot = { x: 0, y: 0 };
    let points: { x: number; y: number; vx: number; vy: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 26000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
      spot.x = w * 0.6;
      spot.y = h * 0.35;
    };
    resize();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // The spotlight eases towards the mouse, or wanders slowly on its own.
      const tx = mouse.active ? mouse.x : w * (0.5 + 0.35 * Math.sin(now / 5200));
      const ty = mouse.active ? mouse.y : h * (0.42 + 0.25 * Math.cos(now / 6800));
      spot.x += (tx - spot.x) * 0.12;
      spot.y += (ty - spot.y) * 0.12;

      const glow = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, SPOT * 1.3);
      glow.addColorStop(0, "rgba(129,140,248,0.11)");
      glow.addColorStop(1, "rgba(129,140,248,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      if (grid) {
        for (let y = GAP / 2; y < h; y += GAP) {
          for (let x = GAP / 2; x < w; x += GAP) {
            const k = Math.max(0, 1 - Math.hypot(x - spot.x, y - spot.y) / SPOT);
            const size = 1.1 + k * 1.2;
            ctx.fillStyle = `rgba(${190 + 50 * k},${195 + 45 * k},255,${0.07 + 0.5 * k})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }
      }

      if (network) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        const nodes = mouse.active ? [...points, { x: spot.x, y: spot.y, vx: 0, vy: 0 }] : points;
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d > LINK) continue;
            // Links are brighter inside the spotlight.
            const mx = (nodes[i].x + nodes[j].x) / 2, my = (nodes[i].y + nodes[j].y) / 2;
            const lit = Math.max(0, 1 - Math.hypot(mx - spot.x, my - spot.y) / (SPOT * 1.4));
            ctx.strokeStyle = `rgba(94,234,212,${(0.1 + 0.3 * lit) * (1 - d / LINK)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        for (const p of points) {
          const lit = Math.max(0, 1 - Math.hypot(p.x - spot.x, p.y - spot.y) / SPOT);
          ctx.fillStyle = `rgba(167,243,208,${0.35 + 0.5 * lit})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      if (!document.hidden) draw(now);
      frame = requestAnimationFrame(loop);
    };
    if (reduced) draw(performance.now());
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
