"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// The reduced-motion setting is only known in the browser. Reading it during
// the first render makes the browser's HTML differ from the server's (React
// error #418), so this reports `false` until the page has mounted.
export function useSettledReducedMotion() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // Flipping a flag once after mount is the point of this hook.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduced);
}
