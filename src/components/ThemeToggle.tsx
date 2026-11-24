"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Sun/moon switch. The starting theme is set by a small script in the layout
// (saved choice, else the system setting); this reads it and lets the visitor
// flip it, remembering the choice for next time.
export default function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // The theme lives on <html>, set before React loads, so read it once here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private mode: the switch still works for this visit
    }
    setTheme(next);
  };

  const label = theme === "light" ? toDark : toLight;

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-fg-soft/80 transition-colors hover:bg-surface hover:text-fg"
    >
      {theme === "light" ? (
        // moon
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      ) : (
        // sun
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </svg>
      )}
    </button>
  );
}
