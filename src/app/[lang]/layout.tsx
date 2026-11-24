import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/content";
import "../globals.css";

// Apple devices use the system font (San Francisco); Inter is the closest match elsewhere.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
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
    other: { "theme-color": "#000000" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
