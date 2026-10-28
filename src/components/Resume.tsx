import type { Dictionary } from "@/content/types";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// Two downloadable CVs (English and French), each shown as a preview of its first page.
export default function Resume({ t }: { t: Dictionary["resume"] }) {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader index="05" label={t.label} heading={t.heading} sub={t.sub} />
      <p className="-mt-8 mb-10 font-mono text-xs uppercase tracking-wider text-muted">{t.updated}</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {t.files.map((f, i) => (
          <Reveal key={f.code} delay={0.08 * i} className="group overflow-hidden rounded-3xl border border-line bg-surface p-1.5 transition-colors hover:border-line-strong">
            <a href={f.href} target="_blank" rel="noopener" className="relative block aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-white" aria-label={`${t.open}: ${f.name}`}>
              <img
                src={f.preview}
                alt=""
                loading="lazy"
                className="w-full origin-top transition-transform duration-700 ease-out group-hover:-translate-y-[6%]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />
              <span className="absolute top-3 left-3 rounded-full bg-bg/85 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-fg backdrop-blur">{f.code}</span>
            </a>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-3">
              <div>
                <p className="font-display text-xl font-medium text-fg">{f.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">{t.meta}</p>
              </div>
              <div className="flex gap-2">
                <a href={f.href} target="_blank" rel="noopener" className="rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition hover:border-accent hover:text-accent">
                  {t.open} ↗
                </a>
                <a href={f.href} download={f.fileName} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft">
                  {t.download} ↓
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
