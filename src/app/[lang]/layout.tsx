import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/content";
import "../globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = "https://alpatsonportfolio.vercel.app";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", fr: "/fr" } },
    openGraph: {
      type: "website",
      siteName: "Alpatson Cobbina Siaw",
      url: `/${lang}`,
      title: meta.title,
      description: meta.description,
      locale: lang === "fr" ? "fr_FR" : "en_US",
      images: [{ url: "/images/og-image-v4.jpg", width: 1200, height: 630, alt: "Alpatson Cobbina Siaw, Full-Stack Software Engineer" }],
    },
    twitter: { card: "summary_large_image" },
    other: { "theme-color": "#07080c" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="grain min-h-dvh">{children}</body>
    </html>
  );
}
