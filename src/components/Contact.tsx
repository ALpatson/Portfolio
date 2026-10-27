"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Dictionary } from "@/content/types";
import Reveal, { ease } from "./Reveal";

const EMAIL = "cobbinaalpatson@gmail.com";

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
    "w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-fg placeholder:text-faint focus:border-accent focus:ring-0 focus:outline-none transition-colors";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-bg-raised">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <span>§ 06</span>
          <span className="h-px w-10 bg-accent/50" aria-hidden="true" />
          <span>{t.label}</span>
        </p>
        <motion.h2
          className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] font-medium tracking-tight text-fg italic"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          {t.heading}
        </motion.h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-muted">{t.sub}</p>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.name}</span>
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
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.email}</span>
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
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.message}</span>
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
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
                <p role="status" aria-live="polite" className="text-sm">
                  {status.kind === "sent" && <span className="text-ok">{t.sent}</span>}
                  {status.kind === "failed" && (
                    <span className="text-[#e08a7a]">
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
            <dl className="space-y-7">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.emailLabel}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${EMAIL}`} className="break-all font-display text-xl text-fg underline decoration-accent/50 underline-offset-4 transition hover:text-accent">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.availabilityLabel}</dt>
                <dd className="mt-1 text-fg">{t.availability}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.locationLabel}</dt>
                <dd className="mt-1 text-fg">{t.location}</dd>
                <dd className="text-sm text-muted">
                  {t.languagesLabel}: {t.languages}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href="/resume.pdf" target="_blank" rel="noopener" className="rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition hover:border-accent hover:text-accent">
                  {t.cv} ↓
                </a>
                <a href="https://github.com/ALpatson" target="_blank" rel="noopener noreferrer" className="rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition hover:border-accent hover:text-accent">
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/alpatson-cobbina-siaw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition hover:border-accent hover:text-accent"
                >
                  LinkedIn ↗
                </a>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
