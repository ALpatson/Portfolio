// A slow band of chess notation (the Opera Game) between the hero and the rest.
export default function Ticker({ text }: { text: string }) {
  return (
    <div className="overflow-hidden border-y border-line bg-bg-raised/70 py-3" aria-hidden="true">
      <div className="ticker-track flex w-max gap-12 whitespace-nowrap font-mono text-xs tracking-wider text-faint">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
