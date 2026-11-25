"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary, Locale } from "@/content/types";
import Logo from "./Logo";

const SECTIONS = ["about", "journey", "projects", "skills", "resume", "contact"] as const;

// Apple-style global nav: a slim, frosted bar with small quiet links.
export default function Nav({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const other: Locale = lang === "en" ? "fr" : "en";

  useEffect(() => {
    // Highlight whichever section fills the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the visitor's place when switching language.
  const hash = active ? `#${active}` : "";
  const links = SECTIONS.map((id) => ({ id, label: t[id] }));

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-line/60 backdrop-blur-xl backdrop-saturate-150"
        style={{ background: "var(--nav-bg)" }}
      >
        <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2 text-fg" aria-label="Alpatson Cobbina Siaw">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight">Alpatson</span>
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`text-[13px] transition-colors ${active === id ? "text-fg" : "text-fg-soft/80 hover:text-fg"}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`/${other}${hash}`}
              aria-label={t.switchTo}
              title={t.switchTo}
              className="text-[13px] text-fg-soft/80 transition-colors hover:text-fg"
            >
              <span className={lang === "en" ? "font-semibold text-fg" : ""}>EN</span>
              <span className="mx-1.5 text-faint">/</span>
              <span className={lang === "fr" ? "font-semibold text-fg" : ""}>FR</span>
            </a>
            <button
              type="button"
              className="relative h-10 w-8 md:hidden"
              aria-label={open ? t.close : t.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={`absolute left-1.5 h-[1.5px] w-5 rounded-full bg-fg transition ${open ? "top-5 rotate-45" : "top-[15px]"}`} />
              <span className={`absolute left-1.5 h-[1.5px] w-5 rounded-full bg-fg transition ${open ? "top-5 -rotate-45" : "top-[24px]"}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Outside the header on purpose: its backdrop blur would trap this fixed
          panel inside the bar, leaving the links with no background. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-12 bottom-0 z-40 overflow-y-auto bg-bg px-8 pt-8 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-1">
              {links.map(({ id, label }, i) => (
                <motion.li key={id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="block py-2.5 text-[28px] font-semibold tracking-tight text-fg">
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
