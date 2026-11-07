// Corporate merchandise (/corporate-merchandise, /corporate-merchandise/[slug], /corporate-merchandise/quotation).
// Catalog from Laravel (GET /api/merchandise/catalog, /api/merchandise/catalog/{id}). Merchandise has no slug
// in Laravel: URLs are "{id}-{name}" and only the id is read.

import { laravelHeaders, laravelUrl } from "./api";

export const MERCH_PATH = "/corporate-merchandise";
export const merchHref = (slug: string) => `${MERCH_PATH}/${slug}`;
export const merchIdFromSlug = (slug: string) => Number.parseInt(slug, 10) || null;

// Laravel's quotation form rejects smaller quantities (Merchandise\QuotationController).
export const MERCH_MIN_QUANTITY = 50;

export const MERCH_PLACEHOLDER_IMAGE = "/images/corporate/merch-default.png";

export type MerchCardData = {
  id: number;
  slug: string;
  name: string;
  price: number;
  min_price: number | null;
  image: string | null;
};

export type MerchCatalogResponse = {
  categories: { id: number; name: string }[];
  products: MerchCardData[];
  pagination: { current_page: number; last_page: number; total: number };
};

export type MerchProductDetail = MerchCardData & {
  // Admin-authored HTML.
  description: string | null;
  production_time: string;
  categories: string[];
  images: string[];
  colors: { id: number; name: string; hex: string }[];
  sizes: { id: number; name: string }[];
  price_tiers: { min_quantity: number; price: number }[];
  related: MerchCardData[];
};

export type MerchQuery = { category?: string; keyword?: string; page?: string };

export const merchandiseCatalog = {
  title: "All Products",
  hint: "Select products to include in your quotation request.",
  pairingsTitle: "Recommended Pairings",
};

export const quotationPage = {
  backLabel: "Back to Merchandise",
  backHref: MERCH_PATH,
  contactTitle: "Contact Details",
  intro: "Complete the form below, and our gifting consultant will contact you within 1×24 hours to continue.",
  dateHint: "Please specify the date you need your order delivered.",
  reviewNote: "Your inquiry will be reviewed by our gifting consultant.",
  submit: "Request Quotation",
  summaryTitle: "Request Summary",
  summaryIntro: "A formal quotation will be prepared by our gifting consultant after reviewing your request.",
  emptySummary: "Your quotation is empty. Add products from the merchandise catalog first.",
  notesTitle: "Notes:",
  notes:
    "This is an estimated summary based on your selected products. Final pricing and availability will be confirmed in the official quotation.",
  noteList: ["Prices exclude VAT & shipping", "Valid for 14 days", "Production starts after artwork approval"],
  thanks: "Thank you for your trust in Studiokado. We look forward to supporting your corporate gifting needs.",
  sentTitle: "Thank you for your request",
  sentBody: "Our gifting consultant will review it and contact you within 1×24 hours with a formal quotation.",
};

export async function getMerchCatalog(query: MerchQuery = {}): Promise<MerchCatalogResponse> {
  const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v) as [string, string][]).toString();
  const res = await fetch(laravelUrl(`/api/merchandise/catalog${qs ? `?${qs}` : ""}`), {
    headers: laravelHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Merchandise catalog API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as MerchCatalogResponse;
}

// null when the product doesn't exist or is unpublished.
export async function getMerchProduct(id: number): Promise<MerchProductDetail | null> {
  const res = await fetch(laravelUrl(`/api/merchandise/catalog/${id}`), {
    headers: laravelHeaders(),
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Merchandise product API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as MerchProductDetail;
}

// Same rule as Laravel's get_tiered_unit_price(): the highest tier whose minimum is reached.
export function tieredUnitPrice(tiers: MerchProductDetail["price_tiers"], quantity: number, basePrice: number) {
  let price = basePrice;
  for (const tier of tiers) {
    if (quantity >= tier.min_quantity) price = tier.price;
    else break;
  }
  return price;
}
