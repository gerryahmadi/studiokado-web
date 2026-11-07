"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BASE_CURRENCY, COUNTRY_COOKIE, INDONESIA, formatMoney, type Country, type CurrencyData } from "./currency";

// The chosen country lives in a cookie read on the client only, so pages stay static/cached.
// The server (and the first client render) always shows IDR; visitors who picked another
// country switch right after hydration.

const listeners = new Set<() => void>();

function readCookie(): string | null {
  return document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([A-Z]{2})`))?.[1] ?? null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type CurrencyContextValue = {
  data: CurrencyData;
  country: Country;
  /** ISO code of the currency prices are shown in. */
  code: string;
  setCountry: (code: string) => void;
  /** Formats an IDR amount in the visitor's currency. */
  format: (idr: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ data: initial, children }: { data: CurrencyData; children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, readCookie, () => null);
  const [data, setData] = useState(initial);

  // The page may have been prerendered while Laravel was down (IDR-only fallback, no date):
  // fetch the real list once in the browser.
  useEffect(() => {
    if (initial.date !== null) return;
    let cancelled = false;
    fetch("/api/currency")
      .then((res) => (res.ok ? (res.json() as Promise<CurrencyData>) : null))
      .then((fresh) => {
        if (!cancelled && fresh?.date) setData(fresh);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initial]);

  const country = useMemo(() => {
    const all = data.regions.flatMap((r) => r.countries);
    // Unknown/removed country or missing rate → default country → Indonesia.
    const pick = (code: string | null) => all.find((c) => c.code === code && data.rates[c.currency] !== undefined);
    return pick(stored) ?? pick(data.default_country) ?? INDONESIA;
  }, [data, stored]);

  const setCountry = useCallback((code: string) => {
    document.cookie = `${COUNTRY_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const rate = data.rates[country.currency] ?? 1;
    const code = data.rates[country.currency] !== undefined ? country.currency : BASE_CURRENCY;
    return { data, country, code, setCountry, format: (idr) => formatMoney(idr, code, rate) };
  }, [data, country, setCountry]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
