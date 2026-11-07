import { cookies, headers } from "next/headers";
import { laravelHeaders, laravelUrl } from "./api";
import { CART_COOKIE } from "./cart";
import { SESSION_COOKIE } from "./session";

// Server-only helpers for the Laravel cart/checkout API (next/headers keeps this out of client bundles).
// Not a "use server" module on purpose: exporting these from one would expose them as callable endpoints.

export type CartItem = {
  id: number;
  product_id: number;
  slug: string;
  name: string;
  type: string;
  image: string | null;
  price: number;
  quantity: number;
  from: string | null;
  to: string | null;
  message: string | null;
};

// token is null when there is no cart yet.
export type Cart = {
  token: string | null;
  item_count: number;
  total: number;
  weight: number;
  min_delivery_date: string;
  items: CartItem[];
};

export type CartResult = { ok: true; cart: Cart } | { ok: false; message: string };

export type LaravelResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string[]> };

// The visitor's IP for Laravel's per-visitor rate limit (see laravelHeaders).
export async function clientIp(): Promise<Record<string, string>> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip");
  return ip ? { "X-Client-Ip": ip } : {};
}

// Calls the Laravel API with the cart token (X-Cart-Token) and, when signed in, the customer's
// token (Authorization: Bearer). `json` sends a JSON body instead of a form body.
export async function laravelRequest<T>(
  path: string,
  init: { method: string; body?: URLSearchParams; json?: unknown } = { method: "GET" },
): Promise<LaravelResult<T>> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  let res: Response;
  try {
    res = await fetch(laravelUrl(path), {
      method: init.method,
      headers: laravelHeaders({
        "Content-Type": init.json === undefined ? "application/x-www-form-urlencoded" : "application/json",
        "X-Cart-Token": store.get(CART_COOKIE)?.value ?? "",
        ...(session ? { Authorization: `Bearer ${session}` } : {}),
        ...(await clientIp()),
      }),
      body: init.json === undefined ? init.body : JSON.stringify(init.json),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 0, message: "Could not reach the store. Please try again." };
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: data?.message ?? "Something went wrong. Please try again.",
      errors: data?.errors,
    };
  }
  return { ok: true, data: data as T };
}

// Cart calls (Api\CartController): also keeps the cookie in sync with the token Laravel returns
// (not when reading from a server component, where cookies can't be set).
export async function cartRequest(
  path: string,
  init: { method: string; body?: URLSearchParams; persistToken?: boolean },
): Promise<CartResult> {
  const result = await laravelRequest<Cart>(path, init);
  if (!result.ok) return { ok: false, message: result.message };

  const cart = result.data;
  if (cart.token && init.persistToken !== false) {
    (await cookies()).set(CART_COOKIE, cart.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return { ok: true, cart };
}
