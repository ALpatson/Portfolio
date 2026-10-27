"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import SectionHeader from "./SectionHeader";
import { ease } from "./Reveal";

export default function Skills({ t }: { t: Dictionary["skills"] }) {
  const [active, setActive] = useState(0);
  const group = t.groups[active];

  return (
    <section id="skills" className="border-y border-line bg-bg-raised">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <SectionHeader index="04" label={t.label} heading={t.heading} sub={t.sub} />

        {/* A back rank: one square per piece */}
        <div role="tablist" aria-label={t.label} className="grid grid-cols-6 overflow-hidden rounded-md border border-line-strong">
          {t.groups.map((g, i) => {
            const light = i % 2 === 0;
            const selected = i === active;
            return (
              <button
                key={g.piece}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="skill-panel"
                onClick={() => setActive(i)}
                className={`group relative flex aspect-square flex-col items-center justify-center gap-1 sm:aspect-[5/4] ${light ? "bg-square-light" : "bg-square-dark"}`}
              >
                {selected && <motion.span layoutId="skill-square" className="absolute inset-0 bg-accent/60" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <motion.img
                  src={`/pieces/${selected ? "w" : "b"}${g.piece}.svg`}
                  alt=""
                  className="relative w-[58%] max-w-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]"
                  animate={{ y: selected ? -6 : 0 }}
                  whileHover={{ y: -8, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                />
                <span className={`relative hidden font-mono text-[10px] uppercase tracking-wider sm:block ${light ? "text-[#3a2e1f]" : "text-[#f1e6cf]"}`}>
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>

        <div id="skill-panel" role="tabpanel" className="relative mt-10 min-h-56">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.piece}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
              className="grid gap-8 md:grid-cols-[1fr_1.6fr]"
            >
              <div>
                <h3 className="font-display text-3xl font-medium text-fg">{group.name}</h3>
                <p className="mt-2 font-display text-lg italic text-accent">{group.job}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-3">
                {group.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                    className="flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent"
                  >
                    {item.icon && <img src={`https://cdn.simpleicons.org/${item.icon}/cfcdc8`} alt="" className="h-4 w-4" loading="lazy" />}
                    {item.name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
