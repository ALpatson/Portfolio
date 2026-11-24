"use client";

import { useEffect } from "react";

// TEMPORARY: ?theme=light previews Apple's light look on the real site.
// Remove once the look is chosen.
export default function ThemePreview() {
  useEffect(() => {
    const theme = new URLSearchParams(window.location.search).get("theme");
    if (theme) document.documentElement.dataset.theme = theme;
  }, []);
  return null;
}
