"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Photo = { src: string; alt: string };

// Where each card sits in the pile: front, then fanned out behind it.
const SLOTS = [
  { x: 0, y: 0, rotate: -2, scale: 1 },
  { x: 18, y: 10, rotate: 5, scale: 0.95 },
  { x: -16, y: 18, rotate: -7, scale: 0.9 },
  { x: 10, y: 24, rotate: 9, scale: 0.86 },
];

// A small pile of prints. The front photo is tossed to the back every few
// seconds, or when the visitor clicks, presses Enter, or swipes it away.
export default function PhotoStack({ photos, hint }: { photos: Photo[]; hint: string }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [leaving, setLeaving] = useState<-1 | 1 | 0>(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Guards against double moves: a swipe ends with a click event too, and
  // state updates land too late to stop the second call.
  const busy = useRef(false);
  const dragged = useRef(false);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();

  const next = useCallback((direction: -1 | 1 = 1) => {
    if (busy.current) return;
    busy.current = true;
    setLeaving(direction);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(0);
      busy.current = false;
    }, 260);
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced || photos.length < 2) return;
    const timer = setTimeout(() => next(1), 4200);
    return () => clearTimeout(timer);
  }, [inView, paused, reduced, order, next, photos.length]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-sm">
      <div
        className="relative aspect-[4/5]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {order.map((photoIndex, slot) => {
          const photo = photos[photoIndex];
          const front = slot === 0;
          const pos = SLOTS[Math.min(slot, SLOTS.length - 1)];
          const tossed = front && leaving !== 0;
          return (
            <motion.button
              key={photo.src}
              type="button"
              tabIndex={front ? 0 : -1}
              aria-hidden={!front}
              aria-label={front ? `${photo.alt}. ${hint}` : undefined}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                if (front) next(1);
              }}
              onKeyDown={(e) => front && (e.key === "ArrowRight" || e.key === "ArrowLeft") && next(e.key === "ArrowRight" ? 1 : -1)}
              drag={front ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragStart={() => {
                dragged.current = true;
              }}
              onDragEnd={(_, info) => {
                // The click that follows a drag fires right after this; clear the flag once it has.
                setTimeout(() => (dragged.current = false), 0);
                if (Math.abs(info.offset.x) > 70) next(info.offset.x > 0 ? 1 : -1);
              }}
              className={`absolute inset-0 overflow-hidden rounded-[1.4rem] border-[6px] border-white bg-surface shadow-[0_22px_40px_-18px_rgba(var(--shadow),0.5)] ${
                front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
              style={{ zIndex: photos.length - slot }}
              initial={false}
              animate={
                tossed
                  ? { x: leaving * 340, y: -30, rotate: leaving * 18, opacity: 0, scale: 1 }
                  : { x: pos.x, y: pos.y, rotate: pos.rotate, scale: pos.scale, opacity: 1 }
              }
              transition={tossed ? { duration: 0.26, ease: "easeIn" } : { type: "spring", stiffness: 220, damping: 26 }}
            >
              <img src={photo.src} alt="" draggable={false} className="h-full w-full rounded-[1rem] object-cover" loading={front ? "eager" : "lazy"} />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between font-mono text-[11px] text-muted">
        <span aria-hidden="true">
          {String(order[0] + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          {photos.map((p, i) => (
            <span key={p.src} className={`h-1 rounded-full transition-all duration-300 ${i === order[0] ? "w-6 bg-accent" : "w-2 bg-line-strong"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
