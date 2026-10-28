"use client";

import type { Dictionary } from "@/content/types";
import PhotoStack from "./PhotoStack";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <Reveal delay={delay} className="border-t border-line pt-5">
      <span className="block font-display text-4xl font-medium text-fg tabular-nums md:text-5xl">{value}</span>
      <span className="mt-2 block text-sm leading-snug text-muted">{label}</span>
    </Reveal>
  );
}

export default function About({ t }: { t: Dictionary["about"] }) {
  return (
    <section id="about" className="mx-auto max-w-6xl overflow-x-clip px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader index="01" label={t.label} heading={t.heading} />
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal>
          <PhotoStack photos={t.photos} hint={t.photoHint} />
        </Reveal>
        <div>
          {t.text.split("\n\n").map((para, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <p className={`font-display leading-relaxed ${i === 0 ? "text-xl text-fg md:text-2xl md:leading-relaxed" : "mt-5 text-lg text-fg-soft"}`}>{para}</p>
            </Reveal>
          ))}
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
