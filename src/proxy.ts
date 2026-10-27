import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Old static-site pages, so existing links keep working.
const legacyPages: Record<string, string> = {
  "/index.html": "",
  "/about.html": "#about",
  "/projects.html": "#projects",
  "/contact.html": "#contact",
};

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("fr") ? "fr" : "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/en" || pathname === "/fr" || pathname.startsWith("/en/") || pathname.startsWith("/fr/")) return;

  const locale = preferredLocale(request);
  const hash = legacyPages[pathname];
  if (pathname === "/" || hash !== undefined) {
    return NextResponse.redirect(new URL(`/${locale}${hash ?? ""}`, request.url));
  }
}

export const config = {
  // Everything except Next internals and files in /public (anything with a dot),
  // but still catching the old *.html pages.
  matcher: ["/", "/((?!_next|images|pieces|favicon\\.ico|resume\\.pdf).*\\.html)", "/((?!_next|.*\\..*).*)"],
};
