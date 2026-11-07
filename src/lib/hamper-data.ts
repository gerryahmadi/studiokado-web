// Create Hampers flow (package -> items -> card -> review). Boxes, items and cards come from Laravel
// (GET /api/hampers/packagings, /api/hampers/items, /api/hampers/cards); the finished box is added to
// the cart with POST /api/cart/hamper. A box holds as many items as its slot capacity allows.

import { laravelHeaders, laravelUrl } from "./api";
import type { ShopFilter, ShopQuery } from "./shop-data";

export const HAMPER_ITEMS_PATH = "/create-hampers/items";

export type HamperBox = {
  id: number;
  name: string;
  size: string;
  price: number;
  stock: number | null;
  image: string | null;
  slot_capacity: number;
};
export type HamperItem = { id: number; name: string; price: number; stock: number | null; image: string | null; slot: number };
export type HamperCard = { id: number; name: string; price: number; stock: number | null; image: string | null };

export type HamperItemsResponse = {
  filters: ShopFilter[];
  products: HamperItem[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
};

export const HAMPER_PLACEHOLDER_IMAGE = "/images/hamper/box-broken-white.png";

export const isSoldOut = (p: { stock: number | null }) => p.stock !== null && p.stock < 1;

// Step titles and intros live in the `hamper` dictionary (hamper.steps / hamper.intro), keyed by `key`.
export const hamperSteps = [
  { key: "package", href: "/create-hampers/package" },
  { key: "items", href: "/create-hampers/items" },
  { key: "card", href: "/create-hampers/card" },
  { key: "review", href: "/create-hampers/review" },
] as const;

export type HamperStepKey = (typeof hamperSteps)[number]["key"];

async function hamperFetch<T>(path: string): Promise<T> {
  const res = await fetch(laravelUrl(path), {
    headers: laravelHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Hamper API ${path} failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export const getHamperBoxes = () => hamperFetch<HamperBox[]>("/api/hampers/packagings");

export const getHamperCards = () => hamperFetch<HamperCard[]>("/api/hampers/cards");

// Same filters and paging as Quick Hampers (search, price, occasion, category, page).
export function getHamperItems(query: ShopQuery = {}) {
  const qs = new URLSearchParams(query).toString();
  return hamperFetch<HamperItemsResponse>(`/api/hampers/items${qs ? `?${qs}` : ""}`);
}
