"use client";

import { useEffect, useRef } from "react";

// The ink drawing of me, large and frameless. It rests a little faded; a soft
// light follows the cursor and brings the lines to full strength where it
// passes. With no mouse nearby the light drifts on its own.
export default function HeroPortrait({ alt }: { alt: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (x: number, y: number) => {
      el.style.setProperty("--x", `${x * 100}%`);
      el.style.setProperty("--y", `${y * 100}%`);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return set(0.5, 0.25);

    const cur = { x: 0.5, y: 0.25 };
    const target = { x: 0.5, y: 0.25 };
    let mouse = false, visible = true, frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = el.getBoundingClientRect();
      mouse = e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom;
      target.x = (e.clientX - b.left) / b.width;
      target.y = (e.clientY - b.top) / b.height;
    };
    const loop = (now: number) => {
      if (!mouse) {
        target.x = 0.5 + 0.18 * Math.sin(now / 2600);
        target.y = 0.35 + 0.2 * Math.cos(now / 3400);
      }
      cur.x += (target.x - cur.x) * 0.1;
      cur.y += (target.y - cur.y) * 0.1;
      set(cur.x, cur.y);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Two mask layers on one image: the light, and a fade at the bottom so the
  // drawing melts into the page.
  const mask =
    "radial-gradient(circle clamp(150px, 18vw, 260px) at var(--x, 50%) var(--y, 25%), #000 30%, rgba(0,0,0,0.55) 100%), linear-gradient(#000 78%, transparent)";
  return (
    <img
      ref={ref}
      src="/images/me-ink.webp"
      alt={alt}
      draggable={false}
      className="absolute inset-0 h-full w-full object-cover object-top select-none lg:object-contain lg:object-bottom"
      style={{ maskImage: mask, WebkitMaskImage: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    />
  );
}
