"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import Reveal from "./Reveal";

const EMAIL = "cobbinaalpatson@gmail.com";

const social =
  "inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition hover:border-accent hover:text-accent";

type Status = { kind: "idle" | "sending" | "sent" | "failed"; reason?: string };

export default function Contact({ t }: { t: Dictionary["contact"] }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fields, setFields] = useState({ name: "", email: "", message: "" });

  // Sends through FormSubmit, which forwards to EMAIL. If it fails, the visitor
  // gets a pre-filled email link so the message is never lost.
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if ((form.elements.namedItem("_honey") as HTMLInputElement).value) return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          _subject: `Portfolio message from ${fields.name.trim()}`,
          _replyto: fields.email.trim(),
          _template: "table",
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || String(result.success) !== "true") throw new Error(result.message);
      setFields({ name: "", email: "", message: "" });
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "failed", reason: err instanceof Error && err.message !== "Failed to fetch" ? err.message : undefined });
    }
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`Message from ${fields.name}`)}&body=${encodeURIComponent(
    `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`,
  )}`;

  const input =
    "mt-2 w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-bg-raised/60">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <motion.h2
          className="font-display text-[clamp(3.5rem,11vw,8rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-fg"
        >
          {t.heading}
        </motion.h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-muted">{t.sub}</p>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-muted">{t.name}</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={t.namePh}
                    value={fields.name}
                    onChange={(e) => setFields({ ...fields, name: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted">{t.email}</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={t.emailPh}
                    value={fields.email}
                    onChange={(e) => setFields({ ...fields, email: e.target.value })}
                    className={input}
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-muted">{t.message}</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder={t.messagePh}
                  value={fields.message}
                  onChange={(e) => setFields({ ...fields, message: e.target.value })}
                  className={`${input} resize-none`}
                />
              </label>
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-soft disabled:cursor-wait disabled:opacity-60"
                >
                  {status.kind === "sending" ? t.sending : t.send}
                </button>
                <p role="status" aria-live="polite" className="text-sm">
                  {status.kind === "sent" && <span className="text-ok">{t.sent}</span>}
                  {status.kind === "failed" && (
                    <span className="text-danger">
                      {t.failed}
                      {status.reason ? ` (${status.reason})` : ""}{" "}
                      <a href={mailto} className="font-semibold underline underline-offset-2">
                        {t.failedLink}
                      </a>
                      .
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="space-y-7 rounded-3xl border border-line p-6 sm:p-8">
              <div>
                <dt className="text-sm text-muted">{t.emailLabel}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${EMAIL}`} className="break-all font-display text-xl text-fg underline decoration-accent/50 underline-offset-4 transition hover:text-accent">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{t.availabilityLabel}</dt>
                <dd className="mt-1 text-fg">{t.availability}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{t.locationLabel}</dt>
                <dd className="mt-1 text-fg">{t.location}</dd>
                <dd className="text-sm text-muted">
                  {t.languagesLabel}: {t.languages}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href="https://github.com/ALpatson" target="_blank" rel="noopener noreferrer" className={social}>
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
                  </svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/alpatson-cobbina-siaw/" target="_blank" rel="noopener noreferrer" className={social}>
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
