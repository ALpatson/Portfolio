import type { Dictionary } from "@/content/types";

// Cached so the year is fixed when the page is prerendered (required with cacheComponents).
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer({ t }: { t: Dictionary["footer"] }) {
  const year = await currentYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} Alpatson Cobbina Siaw. {t.rights}
        </p>
        <div className="flex items-center gap-5">
          <a href="https://lichess.org" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-faint transition hover:text-muted">
            {t.credit}
          </a>
          <a href="#top" className="transition hover:text-accent">
            {t.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
