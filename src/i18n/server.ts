// Server-side access to the current locale and its dictionary.
// `lang` is the root param of app/[lang] (filled in by src/proxy.ts), so any Server Component can call
// these without receiving the locale as a prop. next/root-params fails the build if this file is
// imported from a Client Component; pass client components the strings they need as props.
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./messages/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./messages/en").then((m) => m.default),
  id: () => import("./messages/id").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}
