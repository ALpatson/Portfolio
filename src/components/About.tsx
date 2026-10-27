"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import type { Dictionary } from "@/content/types";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// Counts up to whole numbers when they come into view; anything else
// (like "<0.05%") is shown as written.
function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = /^\d+$/.test(value) ? Number(value) : null;
  const [shown, setShown] = useState(target === null ? value : "0");

  useEffect(() => {
    if (!inView || target === null) return;
    const start = performance.now();
    const duration = target > 100 ? 1400 : 900;
    const from = target > 100 ? target - 40 : 0;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(String(Math.round(from + (target - from) * eased)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <Reveal delay={delay} className="border-t border-line pt-5">
      <span ref={ref} className="block font-display text-4xl font-medium text-fg tabular-nums md:text-5xl">
        {shown}
      </span>
      <span className="mt-2 block text-sm leading-snug text-muted">{label}</span>
    </Reveal>
  );
}

export default function About({ t }: { t: Dictionary["about"] }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader index="01" label={t.label} heading={t.heading} />
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal>
          <div ref={photoRef} className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-sm border border-accent/40" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface">
              <motion.img
                src="/images/profile.webp"
                alt={t.photoAlt}
                className="h-[112%] w-full object-cover grayscale-[25%]"
                style={{ y }}
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="font-display text-xl leading-relaxed text-fg-soft md:text-2xl md:leading-relaxed">{t.text}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
            {t.stats.map((s, i) => (
              <Stat key={s.label} value={s.value} label={s.label} delay={0.08 * i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
