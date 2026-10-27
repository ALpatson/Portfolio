"use client";

import { useEffect, useState } from "react";
import TechBackground, { type TechMode } from "./TechBackground";

// The site background. While we're still deciding, ?bg=grid or ?bg=network in
// the URL shows just one layer; the default is both together.
export default function BackgroundPreview() {
  const [mode, setMode] = useState<TechMode>("both");

  useEffect(() => {
    const bg = new URLSearchParams(window.location.search).get("bg");
    // Reading the URL has to wait until the page is in the browser, hence the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (bg === "grid" || bg === "network") setMode(bg);
  }, []);

  return <TechBackground mode={mode} />;
}
