"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { Dictionary, Project, ProjectTag } from "@/content/types";
import SectionHeader from "./SectionHeader";
import { ease } from "./Reveal";

type T = Dictionary["projects"];
const FILTERS: ("all" | ProjectTag)[] = ["all", "web", "backend", "mobile", "research"];

function Badges({ p, t }: { p: Project; t: T }) {
  return (
    <div className="flex gap-1.5">
      {p.live && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          {t.live}
        </span>
      )}
      {p.team && <span className="rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-soft backdrop-blur">{t.team}</span>}
      {p.private && <span className="rounded-full bg-bg/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted backdrop-blur">{t.private}</span>}
    </div>
  );
}

// Projects without a screenshot get a small terminal "cover" instead.
function Cover({ p, className }: { p: Project; className?: string }) {
  if (p.image) {
    return <img src={p.image} alt="" loading="lazy" className={`h-full w-full object-cover object-top ${className ?? ""}`} />;
  }
  return (
    <div className={`flex h-full w-full flex-col justify-center gap-1 bg-[#0d0b09] p-6 font-mono text-xs text-fg-soft ${className ?? ""}`}>
      <p><span className="text-ok">$</span> java -jar {p.id}.jar</p>
      <p className="mt-2 text-accent">⚔ {p.title.toUpperCase()} ⚔</p>
      <p className="mt-2">A wild Goblin appears!</p>
      <p>&gt; 1. Attack&nbsp;&nbsp; 2. Item&nbsp;&nbsp; 3. Run</p>
    </div>
  );
}

function Card({ p, index, t, onOpen }: { p: Project; index: number; t: T; onOpen: () => void }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - box.left) / box.width - 0.5) * 6);
    rx.set(-((e.clientY - box.top) / box.height - 0.5) * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease, delay: Math.min(index, 6) * 0.05 }}
      style={{ perspective: 900 }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-1.5 text-left transition-colors hover:border-line-strong"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-line bg-bg">
          <Cover p={p} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="absolute top-3 left-3">
            <Badges p={p} t={t} />
          </div>
          <span className="absolute top-3 right-3 font-mono text-[11px] text-fg/70">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="flex flex-1 flex-col px-4 pt-4 pb-3.5">
          <h3 className="font-display text-xl font-medium text-fg">{p.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[11px] text-faint">{p.stack.slice(0, 3).join(" · ")}</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              {t.details}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </motion.button>
    </motion.li>
  );
}

function Details({ p, t, onClose }: { p: Project; t: T; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line-strong bg-bg-raised p-2 sm:rounded-3xl"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/8] overflow-hidden rounded-[1.25rem] border border-line bg-bg">
          <Cover p={p} />
          <div className="absolute top-4 left-4">
            <Badges p={p} t={t} />
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg/85 text-fg backdrop-blur transition hover:bg-accent hover:text-accent-ink"
        >
          ✕
        </button>

        <div className="px-4 pt-6 pb-5 sm:px-6 sm:pt-8 sm:pb-6">
          {p.period && <p className="font-mono text-xs uppercase tracking-wider text-muted">{p.period}</p>}
          <h3 id="project-title" className="mt-1 font-display text-3xl font-medium text-fg sm:text-4xl">
            {p.title}
          </h3>
          <p className="mt-4 leading-relaxed text-fg-soft">{p.description}</p>

          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{t.role}</p>
            <p className="mt-1 leading-relaxed text-fg">{p.role}</p>
          </div>

          {p.highlights.length > 0 && (
            <>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">{t.highlights}</p>
              <ul className="mt-2 space-y-1.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-fg-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {p.stack.length > 0 && (
            <>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">{t.stack}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full border border-line-strong px-3 py-1 text-xs text-fg-soft">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}

          {p.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {p.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    i === 0 ? "bg-accent text-accent-ink hover:bg-accent-soft" : "border border-line-strong text-fg hover:border-accent hover:text-accent"
                  }`}
                >
                  {l.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
          {p.note && <p className="mt-3 text-xs text-faint">{p.note}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ t }: { t: T }) {
  const [filter, setFilter] = useState<"all" | ProjectTag>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  // Stable, so the dialog's focus/scroll-lock effect doesn't re-run on every render.
  const close = useCallback(() => setOpenId(null), []);
  const shown = t.items.filter((p) => filter === "all" || p.tags.includes(filter));
  const open = t.items.find((p) => p.id === openId) ?? null;
  const count = (f: "all" | ProjectTag) => (f === "all" ? t.items.length : t.items.filter((p) => p.tags.includes(f)).length);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader index="03" label={t.label} heading={t.heading} sub={t.sub} />

      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label={t.label}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${filter === f ? "text-accent-ink" : "text-muted hover:text-fg"}`}
          >
            {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">
              {t.filters[f]} <span className="font-mono text-[10px] opacity-70">{count(f)}</span>
            </span>
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <Card key={p.id} p={p} index={i} t={t} onOpen={() => setOpenId(p.id)} />
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>{open && <Details key={open.id} p={open} t={t} onClose={close} />}</AnimatePresence>
    </section>
  );
}
