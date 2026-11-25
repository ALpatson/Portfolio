"use client";

import { useEffect, useState } from "react";
import { liveProducts, type LiveStatus } from "@/content/live";
import type { Dictionary } from "@/content/types";

type T = Dictionary["hero"]["live"];

// "Running right now": the products I've shipped, checked for real by
// /api/status (cached about a minute), each with its response time.
export default function LiveStatusStrip({ t }: { t: T }) {
  const [sites, setSites] = useState<LiveStatus[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { sites: LiveStatus[] }) => !cancelled && setSites(data.sites))
      .catch(() => !cancelled && setSites([]));
    return () => {
      cancelled = true;
    };
  }, []);

  // Until the check returns (or if it fails), list the products without a verdict.
  const rows: (LiveStatus & { url: string; pending: boolean })[] = liveProducts.map((p) => {
    const found = sites?.find((s) => s.id === p.id);
    return {
      id: p.id,
      name: p.name,
      url: p.url,
      host: new URL(p.url).host.replace(/^www\./, ""),
      up: found?.up ?? false,
      ms: found?.ms ?? null,
      pending: !found,
    };
  });

  return (
    <div className="mt-12 w-full max-w-3xl">
      <p className="text-sm text-muted">{t.title}</p>
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {rows.map((s) => {
          const state = s.pending ? t.checking : s.up ? t.online : t.offline;
          return (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[15px] text-fg-soft transition-colors hover:text-fg"
                title={`${s.host}: ${state}${s.ms !== null ? `, ${s.ms} ms` : ""}`}
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  {s.up && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-50" />}
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${s.pending ? "bg-faint" : s.up ? "bg-ok" : "bg-danger"}`} />
                </span>
                <span className="font-medium">{s.name}</span>
                <span className="text-sm text-faint tabular-nums">
                  {s.pending ? t.checking : s.up && s.ms !== null ? `${s.ms} ms` : state}
                </span>
                <span className="sr-only">({state})</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
