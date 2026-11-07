// Quick Hampers page (/quick-hampers, same path as Laravel's QuickHampersController@index).
// Page copy, filters and products come from the Laravel API (GET /api/quick-hampers).
// The banner image is still static. TODO: replace with data from the Laravel API.

import { laravelHeaders, laravelUrl } from "./api";
import type { ProductSummary } from "./product-data";

export const QUICK_HAMPERS_PATH = "/quick-hampers";

// Query params Laravel's getProducts() reads; each takes a single value.
export const SHOP_QUERY_KEYS = ["search", "price", "occasion", "season", "category", "page"] as const;

export type ShopFilterItem = { label: string; name: string; value: string };

export type ShopFilter = {
  name: string;
  title: string;
  items: ShopFilterItem[];
};

export type QuickHampersResponse = {
  page: {
    title: string;
    content: string | null;
    meta: { title: string; description: string | null; keywords: string | null };
  };
  filters: ShopFilter[];
  products: ProductSummary[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
};

export type ShopQuery = Partial<Record<(typeof SHOP_QUERY_KEYS)[number], string>>;

// Keeps only the params Laravel understands (first value if repeated).
export function toShopQuery(params: Record<string, string | string[] | undefined>): ShopQuery {
  const query: ShopQuery = {};
  for (const key of SHOP_QUERY_KEYS) {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first) query[key] = first;
  }
  return query;
}

export async function getQuickHampers(query: ShopQuery = {}): Promise<QuickHampersResponse> {
  const qs = new URLSearchParams(query).toString();
  const res = await fetch(laravelUrl(`/api/quick-hampers${qs ? `?${qs}` : ""}`), {
    headers: laravelHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Quick hampers API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as QuickHampersResponse;
}

// Top 10 quick hampers for the homepage "Popular Hampers" section (ranked by Laravel:
// quantity sold, then add-to-cart count). Returns [] on failure so the homepage still renders.
export async function getPopularHampers(): Promise<ProductSummary[]> {
  try {
    const res = await fetch(laravelUrl("/api/quick-hampers/popular"), {
      headers: laravelHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Popular hampers API failed: ${res.status} ${res.statusText}`);
    return ((await res.json()) as { products: ProductSummary[] }).products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Copy (empty state, filter labels) lives in the `shop` dictionary.
export const shopPage = {
  banner: "/images/home/summer-banner.png",
};
