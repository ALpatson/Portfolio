"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import type { Dictionary } from "@/content/types";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Journey({ t }: { t: Dictionary["journey"] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" className="border-y border-line bg-bg-raised">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <SectionHeader index="02" label={t.label} heading={t.heading} sub={t.sub} />

        <ol ref={listRef} className="relative">
          {/* the line of play, drawn as you scroll */}
          <span className="absolute top-2 bottom-2 left-[5.5rem] w-px bg-line sm:left-[7.5rem]" aria-hidden="true" />
          <motion.span
            className="absolute top-2 bottom-2 left-[5.5rem] w-px origin-top bg-accent sm:left-[7.5rem]"
            style={{ scaleY: progress }}
            aria-hidden="true"
          />

          {t.moves.map((m, i) => (
            <Reveal as="li" key={m.move} x={-20} y={0} delay={0.04 * i} className="relative grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr]">
              <span className="pt-6 pr-5 text-right font-mono text-sm text-accent sm:text-base">{m.move}</span>
              <span className="absolute top-[1.85rem] left-[5.5rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-accent bg-bg-raised sm:left-[7.5rem]" aria-hidden="true" />
              <div className="group border-b border-line py-6 pl-8 transition-colors hover:border-line-strong sm:pl-10">
                <p className="font-mono text-xs uppercase tracking-wider text-muted">{m.period}</p>
                <h3 className="mt-1.5 font-display text-2xl font-medium text-fg transition-colors group-hover:text-accent-soft sm:text-[1.7rem]">
                  {m.title}
                </h3>
                <p className="mt-0.5 text-sm text-fg-soft">{m.place}</p>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{m.text}</p>
              </div>
            </Reveal>
          ))}

          <Reveal as="li" x={-20} y={0} className="relative grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr]">
            <span className="pt-7 pr-5 text-right font-mono text-sm text-accent sm:text-base">
              {t.next.move}
              <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-accent" aria-hidden="true" />
            </span>
            <span className="absolute top-[2.1rem] left-[5.5rem] h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-accent sm:left-[7.5rem]" aria-hidden="true" />
            <div className="py-6 pl-8 sm:pl-10">
              <div className="rounded-3xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-7">
                <p className="font-mono text-xs uppercase tracking-wider text-accent">{t.next.period}</p>
                <h3 className="mt-1.5 font-display text-3xl font-medium italic text-fg">{t.next.title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-fg-soft">{t.next.text}</p>
                <a
                  href="#contact"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-soft"
                >
                  {t.next.cta}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}
