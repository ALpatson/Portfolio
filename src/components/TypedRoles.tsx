"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const TYPE_MS = 65;
const DELETE_MS = 32;
const HOLD_MS = 1700;
const START_MS = 1300; // wait for the name animation to finish first

// Types a role, holds it, erases it, then types the next one, forever.
export default function TypedRoles({ roles, label }: { roles: string[]; label: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), START_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started || reduced) return;
    const role = roles[index];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && text === role) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (!deleting && text === role) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else setText(deleting ? role.slice(0, text.length - 1) : role.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [started, reduced, text, deleting, index, roles]);

  return (
    <p className="mt-6 flex min-h-[2.4rem] items-center font-display text-2xl text-fg-soft sm:text-3xl">
      {/* Screen readers get the full list once, not a stream of letters. */}
      <span className="sr-only">
        {label} {roles.join(", ")}
      </span>
      <span aria-hidden="true">{reduced ? roles[0] : text}</span>
      <span aria-hidden="true" className="ml-1 inline-block h-[1.1em] w-[3px] animate-pulse rounded-full bg-accent" />
    </p>
  );
}
