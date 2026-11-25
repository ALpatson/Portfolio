// The AC monogram (Alpatson Cobbina): a light A and a blue C on a dark tile.
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--fg)" />
      <path d="M4.5 24 10.5 8l6 16" fill="none" stroke="var(--bg)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27.5 11.5a6.5 6.5 0 1 0 0 9" fill="none" stroke="#3c48ff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
