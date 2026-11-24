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

  // Apple product-page layout: centred headline and calls to action, with the
  // code card presented underneath like a product shot.
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-8">
        <motion.p
          {...fade(0.1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-[13px] text-fg-soft"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
          </span>
          {t.badge}
        </motion.p>

        <motion.p {...fade(0.2)} className="mb-2 text-lg font-semibold text-accent md:text-xl">
          {t.kicker}
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-fg">
          <span className="sr-only">Alpatson Cobbina Siaw</span>
          <Letters text="Alpatson" delay={0.25} />
          <Letters text="Cobbina Siaw." delay={0.5} className="text-muted" />
        </h1>

        <motion.div {...fade(0.85)} className="flex justify-center">
          <TypedRoles roles={t.roles} label={t.rolesLabel} />
        </motion.div>

        <motion.p {...fade(0.9)} className="mt-6 max-w-2xl text-xl leading-snug font-semibold text-fg sm:text-2xl">
          {t.lead}
        </motion.p>
        <motion.p {...fade(1.0)} className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {t.body}
        </motion.p>

        <motion.div {...fade(1.1)} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href="#projects"
            className="rounded-full bg-accent px-6 py-3 text-[17px] text-accent-ink transition hover:bg-accent-soft"
          >
            {t.ctaWork}
          </a>
          <a href="#contact" className="group text-[17px] text-accent transition hover:underline">
            {t.ctaContact}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">›</span>
          </a>
          <a href="#resume" className="group text-[17px] text-accent transition hover:underline">
            {t.ctaCv}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">›</span>
          </a>
        </motion.div>

        <motion.div
          className="relative mt-20 flex w-full min-w-0 justify-center text-left"
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          {/* soft light behind the "product" */}
          <div
            className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 35%, transparent), transparent)" }}
            aria-hidden="true"
          />
          <CodeCard t={t.code} role={t.roles[0]} />
        </motion.div>
      </div>
    </section>
  );
}
