"use client";

// Dictionary access for Client Components. The root layout passes the namespaces listed in
// CLIENT_NAMESPACES (src/i18n/namespaces.ts) to <I18nProvider>; components read them with useI18n().
// Server Components should keep using getDictionary() from ./server instead.
import { createContext, useContext } from "react";
import type { Locale } from "./config";
import type { ClientMessages } from "./namespaces";

const I18nContext = createContext<{ locale: Locale; t: ClientMessages } | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: ClientMessages;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, t: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n() must be used inside <I18nProvider> (rendered by app/[lang]/layout.tsx).");
  return context;
}
