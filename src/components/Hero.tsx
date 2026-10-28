"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import CodeCard from "./CodeCard";
import TypedRoles from "./TypedRoles";
import { ease } from "./Reveal";

// Letters rise in one by one. Each word is kept in a no-wrap group so a line
// can only break between words, never in the middle of one.
function Letters({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  let index = 0;
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`} aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split("").map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "105%", rotate: 6 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease, delay: delay + i * 0.035 }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ t }: { t: Dictionary["hero"] }) {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease, delay },
  });

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0">
          <motion.p
            {...fade(0.1)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg-raised/70 px-3.5 py-1.5 text-xs text-fg-soft"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            {t.badge}
          </motion.p>

          <motion.p {...fade(0.2)} className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            {t.kicker}
          </motion.p>

          <h1 className="font-display text-[clamp(3.2rem,9vw,7rem)] leading-[0.92] font-medium tracking-tight text-fg">
            <span className="sr-only">Alpatson Cobbina Siaw</span>
            <Letters text="Alpatson" delay={0.25} />
            <Letters text="Cobbina Siaw" delay={0.5} className="italic text-accent" />
          </h1>

          <motion.div {...fade(0.85)}>
            <TypedRoles roles={t.roles} label={t.rolesLabel} />
          </motion.div>

          <motion.p {...fade(0.9)} className="mt-6 max-w-xl font-display text-2xl leading-snug text-fg sm:text-[1.7rem]">
            {t.lead}
          </motion.p>
          <motion.p {...fade(1.0)} className="mt-4 max-w-xl leading-relaxed text-muted">
            {t.body}
          </motion.p>

          <motion.div {...fade(1.1)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft"
            >
              {t.ctaWork}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
            <a
              href="#contact"
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent hover:text-accent"
            >
              {t.ctaContact}
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener" className="px-2 py-3 text-sm text-muted underline decoration-line-strong underline-offset-4 transition hover:text-fg">
              {t.ctaCv}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="flex min-w-0 justify-center lg:justify-end"
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.4 }}
        >
          <CodeCard t={t.code} role={t.roles[0]} />
        </motion.div>
      </div>
    </section>
  );
}
