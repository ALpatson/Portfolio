"use client";

import { motion } from "motion/react";
import { ease } from "./Reveal";

type Props = { index: string; label: string; heading: string; sub?: string };

// "§ 02 · Journey" label, then a serif heading whose words rise in one by one.
export default function SectionHeader({ index, label, heading, sub }: Props) {
  const words = heading.split(" ");
  return (
    <header className="mb-14 max-w-3xl">
      <motion.p
        className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span>§ {index}</span>
        <span className="h-px w-10 bg-accent/50" aria-hidden="true" />
        <span>{label}</span>
      </motion.p>
      {/* The heading itself watches the viewport; the words (hidden below a
          clipping edge) just follow it. Watching the words directly never
          fires, because a clipped element never counts as visible. */}
      <motion.h2
        className="font-display text-4xl leading-[1.05] font-medium tracking-tight text-fg sm:text-5xl md:text-6xl"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
              transition={{ duration: 0.8, ease }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {sub && (
        <motion.p
          className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
        >
          {sub}
        </motion.p>
      )}
    </header>
  );
}
