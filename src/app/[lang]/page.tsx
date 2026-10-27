import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Beyond from "@/components/Beyond";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import BackgroundPreview from "@/components/BackgroundPreview";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <MotionProvider>
      <BackgroundPreview />
      <Nav t={t.nav} lang={lang} />
      <main className="relative z-[1]">
        <Hero t={t.hero} />
        <Ticker text={t.ticker} />
        <About t={t.about} />
        <Journey t={t.journey} />
        <Projects t={t.projects} />
        <Skills t={t.skills} />
        <Beyond t={t.beyond} />
        <Contact t={t.contact} />
      </main>
      <div className="relative z-[1]">
        <Footer t={t.footer} />
      </div>
    </MotionProvider>
  );
}
