// Multi-currency price DISPLAY. Every price in the API, cart, checkout and payment is IDR;
// other currencies are only an estimate shown to the visitor. The visitor picks a COUNTRY
// (header "Currency" drawer, grouped by region as in Framer) and its currency is used.
// Regions, countries and rates come from Laravel (GET /api/currency-rates, config/currency.php);
// rates are refreshed there once a day by `php artisan currency:sync-rates`.

import { laravelHeaders, laravelUrl } from "./api";

export const BASE_CURRENCY = "IDR";
export const COUNTRY_COOKIE = "country";

export type Country = { code: string; name: string; currency: string };
export type CurrencyRegion = { name: string; countries: Country[] };
export type CurrencyData = {
  date: string | null;
  default_country: string;
  /** Units of each currency per 1 IDR, so converted = idr * rate. */
  rates: Record<string, number>;
  regions: CurrencyRegion[];
};

export const INDONESIA: Country = { code: "ID", name: "Indonesia", currency: BASE_CURRENCY };

export const IDR_ONLY: CurrencyData = {
  date: null,
  default_country: INDONESIA.code,
  rates: { [BASE_CURRENCY]: 1 },
  regions: [{ name: "Asia Pacific", countries: [INDONESIA] }],
};

// Server-side. Never throws: if Laravel is down the site simply stays in IDR.
export async function getCurrencyData(): Promise<CurrencyData> {
  try {
    const res = await fetch(laravelUrl("/api/currency-rates"), {
      headers: laravelHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return IDR_ONLY;
    const data = (await res.json()) as CurrencyData;
    return data.regions?.length ? data : IDR_ONLY;
  } catch {
    return IDR_ONLY;
  }
}

/** "Indonesian Rupiah", "Singapore Dollar", … */
export function currencyName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
}

// The existing IDR look ("Rp150.000"), unchanged.
export const formatRupiah = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(n);

// Other currencies: "SGD 10.60", "JPY 1,309" — the code avoids ambiguous "$" signs.
// Decimals follow the currency (JPY/KRW/VND none, KWD/BHD three, the rest two).
export function formatMoney(idr: number, currency: string, rate: number): string {
  if (currency === BASE_CURRENCY) return formatRupiah(idr);
  const number = new Intl.NumberFormat("en-US", { style: "currency", currency })
    .formatToParts(idr * rate)
    .filter((p) => p.type !== "currency" && p.type !== "literal")
    .map((p) => p.value)
    .join("");
  return `${currency} ${number}`;
}
