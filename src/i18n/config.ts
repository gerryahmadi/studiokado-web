// Locale settings shared by the proxy, server components and client components.
//
// How a locale is picked (see src/proxy.ts):
//   1. /id/... or /en/... in the URL: saved to the cookie, then redirected to the URL without the prefix.
//   2. The LOCALE_COOKIE cookie (set by the language dropdown in the navbar).
//   3. The browser's Accept-Language header.
//   4. defaultLocale.
// The proxy then rewrites the request to app/[lang]/..., so public URLs carry no locale prefix.

export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

// English is the source language of the copy (and Laravel's app.locale).
export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);

// Shown in the language dropdown.
export const localeNames: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  id: { short: "ID", name: "Bahasa Indonesia" },
};

// BCP 47 tags for Intl formatting and <html lang>.
export const localeTags: Record<Locale, string> = { en: "en", id: "id" };
