import type { Dictionary, Locale } from "./types";
import en from "./en";
import fr from "./fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export const hasLocale = (value: string): value is Locale => (locales as string[]).includes(value);

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
