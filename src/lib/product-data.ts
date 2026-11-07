// Product detail page (/p/:slug, same path as Laravel's ProductController@show).
// Product, cards and "You may also like" come from the Laravel API (GET /api/product/{slug}).
// The FAQ block is still static (copy in the `shop` dictionary). TODO: replace with data from the Laravel API.

import { laravelHeaders, laravelUrl } from "./api";
import type { Product } from "./home-data";

export const productHref = (slug: string) => `/p/${encodeURIComponent(slug)}`;

// Shown when a product has no image uploaded in the admin.
export const PRODUCT_PLACEHOLDER_IMAGE = "/images/home/product-latest.png";

export type ProductDetail = {
  id: number;
  slug: string;
  name: string;
  excerpt: string | null;
  type: string;
  price: number;
  stock: number;
  height: number | null;
  width: number | null;
  length: number | null;
  tags: string[];
  images: string[];
  // HTML from the admin editor.
  description: string | null;
  // "Content of the box" images.
  sub_items: string[];
  show_notes: boolean;
  show_upload: boolean;
  delivery_start_date: string | null;
  meta: {
    title: string;
    description: string | null;
    keywords: string | null;
    canonical_url: string | null;
  };
};

export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  excerpt: string | null;
  type: string;
  price: number;
  stock: number;
  image: string | null;
};

export type ProductResponse = {
  product: ProductDetail;
  cards: ProductSummary[];
  other_products: ProductSummary[];
};

export type ProductResult =
  | { found: true; data: ProductResponse }
  | { found: false; redirect: string | null };

export async function getProduct(slug: string): Promise<ProductResult> {
  const res = await fetch(laravelUrl(`/api/product/${encodeURIComponent(slug)}`), {
    headers: laravelHeaders(),
    next: { revalidate: 60 },
  });
  if (res.status === 404) {
    const body = (await res.json().catch(() => ({}))) as { redirect?: string | null };
    return { found: false, redirect: body.redirect ?? null };
  }
  if (!res.ok) throw new Error(`Product API failed: ${res.status} ${res.statusText}`);
  return { found: true, data: (await res.json()) as ProductResponse };
}

// Maps an API product to the shared product card.
export const toProductCard = (p: ProductSummary): Product => ({
  brand: p.name,
  name: p.excerpt ?? "",
  price: p.price,
  image: p.image ?? PRODUCT_PLACEHOLDER_IMAGE,
  href: productHref(p.slug),
});

export type GiftCard = {
  id: string;
  name: string;
  image?: string;
};

export const toGiftCard = (p: ProductSummary): GiftCard => ({
  id: String(p.id),
  name: p.name,
  image: p.image ?? undefined,
});

// Static "You may also like" placeholder, still used by /cart. TODO: replace with data from the Laravel API.
const relatedPlaceholder: Product = {
  brand: "Dotted & Spotted",
  name: "B5 Softback Spiral Academic Year Diary",
  price: 590000,
  comparePrice: 678000,
  badge: "15% off",
  image: PRODUCT_PLACEHOLDER_IMAGE,
  href: "/p/whiskey-business",
};

export const productPage = {
  related: {
    href: "/quick-hampers",
    products: Array.from({ length: 4 }, () => relatedPlaceholder),
  },
  faq: {
    href: "/faqs",
  },
};

// Keys into shop.faq.items in the dictionary (answers are placeholders, as in Framer).
export const shopFaqKeys = ["returns", "shipping", "international"] as const;
