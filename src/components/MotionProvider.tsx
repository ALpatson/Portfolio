"use client";

import { MotionConfig } from "motion/react";

// "user" makes every animation respect the visitor's reduced-motion setting.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
