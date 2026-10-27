"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  as?: "div" | "li" | "article" | "p";
};

export const ease = [0.22, 1, 0.36, 1] as const;

// Fades and slides its content in the first time it scrolls into view.
export default function Reveal({ children, className, delay = 0, y = 24, x = 0, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </Tag>
  );
}
