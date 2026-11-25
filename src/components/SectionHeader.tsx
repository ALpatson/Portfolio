type Props = { index?: string; label?: string; heading: string; sub?: string; align?: "center" | "left" };

// A large, tightly set headline with an optional supporting line. No label
// above it: the headline already says what the section is.
export default function SectionHeader({ heading, sub, align = "center" }: Props) {
  const center = align === "center";
  return (
    <header className={`mb-16 md:mb-20 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <h2 className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-6xl md:text-7xl">
        {heading}
      </h2>
      {sub && <p className={`mt-6 text-lg leading-relaxed text-muted md:text-xl ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{sub}</p>}
    </header>
  );
}
