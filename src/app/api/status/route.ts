import { cacheLife } from "next/cache";
import { liveProducts, type LiveStatus } from "@/content/live";

// Checks whether each live product answers, and how fast. The result is cached
// for about a minute, so the sites are pinged at most once a minute however
// many people open the portfolio.
async function checkAll(): Promise<{ checkedAt: string; sites: LiveStatus[] }> {
  "use cache";
  cacheLife("minutes");

  const sites = await Promise.all(
    liveProducts.map(async ({ id, name, url }) => {
      const host = new URL(url).host.replace(/^www\./, "");
      const started = performance.now();
      try {
        const res = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
          headers: { "user-agent": "alpatson-portfolio-status-check" },
          cache: "no-store",
        });
        return { id, name, host, up: res.status < 500, ms: Math.round(performance.now() - started) };
      } catch {
        return { id, name, host, up: false, ms: null };
      }
    }),
  );
  return { checkedAt: new Date().toISOString(), sites };
}

export async function GET() {
  return Response.json(await checkAll());
}
