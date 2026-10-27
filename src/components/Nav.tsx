"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary, Locale } from "@/content/types";

const SECTIONS = ["about", "journey", "projects", "skills", "contact"] as const;

export default function Nav({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const other: Locale = lang === "en" ? "fr" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Highlight whichever section fills the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the visitor's place when switching language.
  const hash = active ? `#${active}` : "";
  const links = SECTIONS.map((id, i) => ({ id, n: i + 1, label: t[id] }));

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Alpatson Cobbina Siaw">
          <img src="/pieces/bN.svg" alt="" className="nav-logo h-7 w-7 transition-transform duration-500 group-hover:-rotate-12" />
          <span className="font-display text-lg font-medium tracking-tight">
            Alpatson<span className="text-accent">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ id, n, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${active === id ? "text-fg" : "text-muted hover:text-fg"}`}
              >
                {active === id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">
                  <span className="mr-1.5 font-mono text-[10px] text-accent">{n}.</span>
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`/${other}${hash}`}
            aria-label={t.switchTo}
            title={t.switchTo}
            className="flex items-center rounded-full border border-line-strong p-0.5 font-mono text-[11px]"
          >
            <span className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-fg text-bg" : "text-muted"}`}>EN</span>
            <span className={`rounded-full px-2.5 py-1 ${lang === "fr" ? "bg-fg text-bg" : "text-muted"}`}>FR</span>
          </a>
          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute left-2.5 h-px w-5 bg-fg transition ${open ? "top-5 rotate-45" : "top-[15px]"}`} />
            <span className={`absolute left-2.5 h-px w-5 bg-fg transition ${open ? "top-5 -rotate-45" : "top-[25px]"}`} />
          </button>
        </div>
      </nav>

    </header>

      {/* Outside the header on purpose: its backdrop blur would trap this fixed
          panel inside the 64px bar, leaving the links with no background. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg px-6 pt-8 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-2">
              {links.map(({ id, n, label }, i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-line py-4 font-display text-3xl">
                    <span className="font-mono text-sm text-accent">{n}.</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
