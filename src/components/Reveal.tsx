type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  as?: "div" | "li" | "article" | "p";
};

export const ease = [0.22, 1, 0.36, 1] as const;

// Used to fade every block in on scroll. The page now keeps one orchestrated
// moment (the hero on load) and lets everything else simply be there, so this
// is a plain wrapper; delay/x/y are accepted and ignored to keep call sites tidy.
export default function Reveal({ children, className, as = "div" }: Props) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
