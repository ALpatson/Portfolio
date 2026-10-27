export type Locale = "en" | "fr";

export type ProjectTag = "web" | "backend" | "mobile" | "research";

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  title: string;
  period: string;
  tags: ProjectTag[];
  image: string;
  live?: boolean;
  team?: boolean;
  private?: boolean;
  summary: string;
  description: string;
  role: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  note?: string;
};

export type JourneyMove = {
  move: string; // chess notation shown next to the entry, e.g. "1. e4"
  period: string;
  title: string;
  place: string;
  text: string;
};

export type SkillGroup = {
  piece: "K" | "Q" | "R" | "B" | "N" | "P";
  name: string;
  job: string;
  items: { name: string; icon?: string }[];
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { about: string; journey: string; projects: string; skills: string; contact: string; menu: string; close: string; switchTo: string };
  hero: {
    badge: string;
    kicker: string;
    lead: string;
    body: string;
    ctaWork: string;
    ctaContact: string;
    ctaCv: string;
    board: {
      caption: string;
      play: string;
      watch: string;
      yourMove: string;
      thinking: string;
      youWon: string;
      iWon: string;
      draw: string;
      check: string;
      reset: string;
      hint: string;
    };
  };
  about: {
    label: string;
    heading: string;
    text: string;
    stats: { value: string; label: string }[];
    photoAlt: string;
  };
  journey: {
    label: string;
    heading: string;
    sub: string;
    moves: JourneyMove[];
    next: { move: string; period: string; title: string; text: string; cta: string };
  };
  projects: {
    label: string;
    heading: string;
    sub: string;
    filters: Record<"all" | ProjectTag, string>;
    live: string;
    team: string;
    private: string;
    details: string;
    close: string;
    role: string;
    highlights: string;
    stack: string;
    items: Project[];
  };
  skills: { label: string; heading: string; sub: string; groups: SkillGroup[] };
  beyond: {
    label: string;
    heading: string;
    certsTitle: string;
    certs: { name: string; issuer: string; image?: string }[];
    chessTitle: string;
    chessText: string;
    chess: string[];
    chessImageAlt: string;
  };
  contact: {
    label: string;
    heading: string;
    sub: string;
    name: string;
    email: string;
    message: string;
    namePh: string;
    emailPh: string;
    messagePh: string;
    send: string;
    sending: string;
    sent: string;
    failed: string;
    failedLink: string;
    emailLabel: string;
    locationLabel: string;
    location: string;
    languagesLabel: string;
    languages: string;
    availabilityLabel: string;
    availability: string;
    cv: string;
  };
  ticker: string;
  footer: { rights: string; credit: string; top: string };
};
