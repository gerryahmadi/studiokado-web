"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CART_COOKIE } from "./cart";
import { laravelRequest } from "./cart-server";

// /checkout, backed by Laravel Api\CheckoutController.

export type PlaceSuggestion = { place_id: string; title: string; subtitle: string; description: string };
export type PlaceDetails = { lat: number; lng: number; postal_code: string | null; province: string | null; city: string | null };
export type ShippingRate = { company: string; type: string; name: string; duration: string | null; price: number };

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (query.trim().length < 3) return [];
  const result = await laravelRequest<PlaceSuggestion[]>(`/api/checkout/places?q=${encodeURIComponent(query.trim())}`);
  return result.ok ? result.data : [];
}

export async function getPlace(placeId: string): Promise<PlaceDetails | null> {
  const result = await laravelRequest<PlaceDetails>(`/api/checkout/place?place_id=${encodeURIComponent(placeId)}`);
  return result.ok ? result.data : null;
}

export async function getShippingRates(destination: { postalCode: string; lat: number; lng: number }) {
  const body = new URLSearchParams({
    postal_code: destination.postalCode,
    lat: String(destination.lat),
    lng: String(destination.lng),
  });
  const result = await laravelRequest<ShippingRate[]>("/api/checkout/rates", { method: "POST", body });
  return result.ok ? { ok: true as const, rates: result.data } : { ok: false as const, message: result.message };
}

// Rates for the units sent to one address (multiple-address checkout); items = { <cart item id>: units }.
export async function getShipmentRates(destination: {
  postalCode: string;
  lat: number;
  lng: number;
  items: Record<number, number>;
}) {
  const body = new URLSearchParams({
    postal_code: destination.postalCode,
    lat: String(destination.lat),
    lng: String(destination.lng),
  });
  for (const [id, qty] of Object.entries(destination.items)) body.set(`items[${id}]`, String(qty));
  const result = await laravelRequest<ShippingRate[]>("/api/checkout/multiple/rates", { method: "POST", body });
  return result.ok ? { ok: true as const, rates: result.data } : { ok: false as const, message: result.message };
}

export type PlaceOrderState = { status: "idle" } | { status: "error"; message: string; errors?: Record<string, string[]> };

const FIELDS = [
  "delivery_date",
  "billing_name",
  "billing_email",
  "billing_phone",
  "shipping_name",
  "shipping_phone",
  "shipping_address",
  "shipping_area",
  "postal_code",
  "lat",
  "lng",
  "notes",
  "courier_company",
  "courier_type",
  "payment_method",
] as const;

const MULTI_FIELDS = ["delivery_date", "billing_name", "billing_email", "billing_phone", "payment_method"] as const;

// "Pay Now": Laravel issues the invoice and a Xendit payment page; the paid cart is no longer a cart,
// so the cookie is cleared before leaving for the payment page.
export async function placeOrder(_prev: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  const multiple = formData.get("ship_mode") === "multiple";
  const body = new URLSearchParams();
  if (multiple) {
    // Laravel Api\MultiAddressCheckoutController: shipments[i][name|phone|address|area|postal_code|lat|lng|
    // notes|courier_company|courier_type] and shipments[i][items][<cart item id>]=<units>.
    for (const key of MULTI_FIELDS) body.set(key, String(formData.get(key) ?? ""));
    for (const [key, value] of formData) {
      if (key.startsWith("shipments[") && !key.endsWith("[rate]")) body.set(key, String(value));
    }
  } else {
    for (const key of FIELDS) body.set(key, String(formData.get(key) ?? ""));
  }
  body.set("newsletter", formData.get("newsletter") === "on" ? "1" : "0");

  const path = multiple ? "/api/checkout/multiple" : "/api/checkout";
  const result = await laravelRequest<{ uuid: string; invoice: string; payment_url: string }>(path, {
    method: "POST",
    body,
  });
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors };

  (await cookies()).delete(CART_COOKIE);
  redirect(result.data.payment_url);
}
