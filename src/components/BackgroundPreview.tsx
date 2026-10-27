"use client";

import { useEffect, useState } from "react";
import AnimatedBackground from "./AnimatedBackground";

// TEMPORARY: preview animated backgrounds and the dark palette from the URL,
// e.g. /en?bg=tour, /en?bg=pieces&theme=ink. Remove once a choice is made.
export default function BackgroundPreview() {
  const [mode, setMode] = useState<"tour" | "pieces" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme) document.documentElement.dataset.theme = theme;
    const bg = params.get("bg");
    // Reading the URL has to wait until the page is in the browser, hence the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (bg === "tour" || bg === "pieces") setMode(bg);
  }, []);

  return mode ? <AnimatedBackground mode={mode} /> : null;
}
