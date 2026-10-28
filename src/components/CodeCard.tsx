"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Dictionary } from "@/content/types";

type Token = [text: string, className: string];

const C = {
  kw: "text-[#c792ea]", // keywords
  name: "text-[#82aaff]", // identifiers
  key: "text-fg-soft",
  str: "text-[#a5d6a7]",
  punct: "text-muted",
  comment: "text-faint italic",
};

const START_MS = 900;
const CHAR_MS = 14;

// A small editor window that types out a "profile" object, as if it were code.
export default function CodeCard({ t, role }: { t: Dictionary["hero"]["code"]; role: string }) {
  const reduced = useReducedMotion();

  const lines: Token[][] = useMemo(() => {
    const str = (v: string): Token => [`"${v}"`, C.str];
    const arr = (vs: string[]): Token[] => [
      ["[", C.punct],
      ...vs.flatMap((v, i): Token[] => (i ? [[", ", C.punct], str(v)] : [str(v)])),
      ["]", C.punct],
    ];
    const prop = (k: string, value: Token[]): Token[] => [["  ", ""], [k, C.key], [": ", C.punct], ...value, [",", C.punct]];
    return [
      [[t.comment, C.comment]],
      [["const ", C.kw], ["alpatson", C.name], [" = {", C.punct]],
      prop("role", [str(role)]),
      prop("basedIn", [str(t.basedIn)]),
      prop("stack", arr(["Python", "Django", "TypeScript", "React", "PostgreSQL"])),
      prop("shipped", arr(["Pin and Codes Store", "KNUST Chess Platform"])),
      prop("lastStop", [str(t.lastStop)]),
      prop("openTo", [str(t.openTo)]),
      [["};", C.punct]],
      [],
      [["export default ", C.kw], ["alpatson", C.name], [";", C.punct]],
    ];
  }, [t, role]);

  const total = useMemo(() => lines.reduce((n, l) => n + l.reduce((m, [s]) => m + s.length, 0) + 1, 0), [lines]);
  const [shown, setShown] = useState(0);
  const done = reduced || shown >= total;

  useEffect(() => {
    if (reduced) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let count = 0;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        count += 1;
        setShown(count);
        if (count >= total) clearInterval(interval); // finished typing
      }, CHAR_MS);
    }, START_MS);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [reduced, total]);

  // Render only the characters typed so far.
  let budget = done ? Infinity : shown;
  let cursorLine = lines.length - 1;
  const rendered = lines.map((line, li) => {
    if (budget <= 0) return null;
    const parts = line.map(([text, cls], ti) => {
      if (budget <= 0) return null;
      const visible = text.slice(0, budget);
      budget -= text.length;
      return (
        <span key={ti} className={cls}>
          {visible}
        </span>
      );
    });
    budget -= 1; // the line break
    cursorLine = li;
    return parts;
  });

  return (
    <div className="w-full max-w-[34rem] overflow-hidden rounded-[1.6rem] border border-line-strong bg-surface/85 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      {/* Title bar with tabs */}
      <div className="flex items-center gap-4 border-b border-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="flex gap-1 overflow-hidden font-mono text-[11px]">
          <span className="rounded-md bg-bg px-2.5 py-1 text-fg">developer.ts</span>
          <span className="hidden px-2.5 py-1 text-faint sm:inline">projects.json</span>
          <span className="hidden px-2.5 py-1 text-faint sm:inline">opera.pgn</span>
        </div>
      </div>

      {/* Code */}
      <pre className="px-4 py-5 font-mono text-[12px] leading-[1.75] sm:text-[13px]" aria-label="Profile">
        {rendered.map((parts, li) =>
          parts === null ? null : (
            <div key={li} className="flex">
              <span className="mr-4 w-5 shrink-0 text-right text-faint/70 select-none" aria-hidden="true">
                {li + 1}
              </span>
              <code className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] pl-[2ch] -indent-[2ch]">
                {parts}
                {li === cursorLine && <span className="ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-accent" aria-hidden="true" />}
              </code>
            </div>
          ),
        )}
      </pre>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
          main
        </span>
        <a href="#contact" className={`transition-colors hover:text-accent ${done ? "text-accent" : ""}`}>
          {t.outro}
        </a>
        <span className="hidden sm:inline">TypeScript · UTF-8</span>
      </div>
    </div>
  );
}
