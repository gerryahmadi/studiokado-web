"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CART_COOKIE } from "./cart";
import { cartRequest } from "./cart-server";

import type { Cart, CartItem, CartResult } from "./cart-server";

export type { Cart, CartItem, CartResult };

export type AddToCartState =
  | { status: "idle" }
  | { status: "added"; itemCount: number; at: number }
  | { status: "error"; message: string };

// "Add to Cart" / "Purchase Now" on /p/[slug]. Purchase Now (intent=buy) goes straight to checkout.
export async function addToCart(_prev: AddToCartState, formData: FormData): Promise<AddToCartState> {
  const noCard = formData.get("no_card") === "on";
  const body = new URLSearchParams();
  for (const key of ["product_id", "quantity", "card_from", "card_to"]) {
    body.set(key, String(formData.get(key) ?? ""));
  }
  if (!noCard) {
    body.set("card_id", String(formData.get("card_id") ?? ""));
    body.set("card_message", String(formData.get("card_message") ?? ""));
  }

  const result = await cartRequest("/api/cart/items", { method: "POST", body });
  if (!result.ok) return { status: "error", message: result.message };
  if (formData.get("intent") === "buy") redirect("/checkout");
  return { status: "added", itemCount: result.cart.item_count, at: Date.now() };
}

export type HamperInput = {
  packagingId: number;
  items: { productId: number; quantity: number }[];
  card: { id: number; from: string; to: string; message: string } | null;
};

// "Complete Box" on /create-hampers/review: the box, its items and the card go into the cart.
export async function addHamperToCart(hamper: HamperInput): Promise<CartResult> {
  const body = new URLSearchParams();
  body.set("packaging_id", String(hamper.packagingId));
  hamper.items.forEach((item, i) => {
    body.set(`items[${i}][product_id]`, String(item.productId));
    body.set(`items[${i}][quantity]`, String(item.quantity));
  });
  if (hamper.card) {
    body.set("card_id", String(hamper.card.id));
    body.set("card_from", hamper.card.from);
    body.set("card_to", hamper.card.to);
    body.set("card_message", hamper.card.message);
  }
  return cartRequest("/api/cart/hamper", { method: "POST", body });
}

export async function updateCartItem(id: number, changes: { quantity?: number; message?: string }) {
  const body = new URLSearchParams();
  if (changes.quantity !== undefined) body.set("quantity", String(changes.quantity));
  if (changes.message !== undefined) body.set("message", changes.message);
  return cartRequest(`/api/cart/items/${id}`, { method: "PATCH", body });
}

export async function removeCartItem(id: number) {
  return cartRequest(`/api/cart/items/${id}`, { method: "DELETE" });
}

// Current cart for server components (/cart). Never creates a cart.
export async function getCart(): Promise<Cart | null> {
  if (!(await cookies()).get(CART_COOKIE)?.value) return null;
  const result = await cartRequest("/api/cart", { method: "GET", persistToken: false });
  return result.ok ? result.cart : null;
}
