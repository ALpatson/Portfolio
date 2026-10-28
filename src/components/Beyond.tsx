import type { Dictionary } from "@/content/types";
import ChessBoard from "./ChessBoard";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Beyond({ t }: { t: Dictionary["beyond"] }) {
  const withImage = t.certs.filter((c) => c.image);
  const textOnly = t.certs.filter((c) => !c.image);

  return (
    <section id="beyond" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader index="06" label={t.label} heading={t.heading} />

      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <Reveal>
          <h3 className="font-display text-3xl font-medium text-fg">{t.playTitle}</h3>
          <p className="mt-2 mb-6 max-w-md leading-relaxed text-muted">{t.playText}</p>
          <ChessBoard t={t.board} />
        </Reveal>

        <Reveal delay={0.1} className="overflow-hidden rounded-3xl border border-line bg-surface p-1.5">
          <div className="aspect-[16/10] overflow-hidden rounded-[1.1rem]">
            <img src="/images/chess.webp" alt={t.chessImageAlt} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="px-5 pt-5 pb-4">
            <h3 className="font-display text-2xl font-medium text-fg">{t.chessTitle}</h3>
            <p className="mt-2 leading-relaxed text-muted">{t.chessText}</p>
            <ul className="mt-5 space-y-2.5">
              {t.chess.map((c, i) => (
                <li key={c} className="flex gap-3 text-sm text-fg-soft">
                  <img src={`/pieces/${i === t.chess.length - 1 ? "bK" : "bQ"}.svg`} alt="" className="dark-invert h-5 w-5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-20">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.certsTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {withImage.map((c, i) => (
              <Reveal key={c.name} delay={0.06 * i} className="group overflow-hidden rounded-3xl border border-line bg-surface p-1.5">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#f3efe7] p-3">
                  <img src={c.image} alt={`${c.name} certificate`} loading="lazy" className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-3 pt-3.5 pb-3">
                  <p className="font-medium leading-snug text-fg">{c.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{c.issuer}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <ul className="mt-4 grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 overflow-hidden rounded-2xl border border-line bg-surface/50">
            {textOnly.map((c) => (
              <li key={c.name} className="flex flex-col gap-1 px-4 py-3">
                <span className="text-sm text-fg-soft">{c.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
      </div>
    </section>
  );
}
