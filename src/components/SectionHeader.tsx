"use client";

import { motion } from "motion/react";
import { ease } from "./Reveal";

type Props = { index?: string; label: string; heading: string; sub?: string; align?: "center" | "left" };

// Apple-style section intro: a small coloured label, a large tightly-set
// headline that rises into place, and a calm supporting line.
export default function SectionHeader({ label, heading, sub, align = "center" }: Props) {
  const center = align === "center";
  return (
    <header className={`mb-16 md:mb-20 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <motion.p
        className="mb-3 text-base font-semibold text-accent md:text-lg"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        {label}
      </motion.p>
      <motion.h2
        className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-6xl md:text-7xl"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease }}
      >
        {heading}
      </motion.h2>
      {sub && (
        <motion.p
          className={`mt-6 text-lg leading-relaxed text-muted md:text-xl ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
        >
          {sub}
        </motion.p>
      )}
    </header>
  );
}
