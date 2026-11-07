import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { laravelRequest } from "./cart-server";
import { SESSION_COOKIE } from "./session";

// Server-only reads for the signed-in customer (Laravel Api\AccountController, guard "storefront").
// Not a "use server" module: exporting these from one would expose them as callable endpoints.

export type Account = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  has_password: boolean;
  address: { recipient: string | null; address: string | null };
  company: Record<"name" | "industry" | "website" | "email" | "phone" | "address" | "npwp" | "tax_name", string | null>;
};

export type OrderGroup = "on-going" | "completed" | "failed";

export type AccountOrder = {
  uuid: string;
  invoice: string | null;
  status: string;
  group: OrderGroup | null;
  created_at: string;
  paid_at: string | null;
  image: string | null;
  items: { name: string; quantity: number }[];
  more_items: number;
  total: number;
  courier: string | null;
  payment_url: string | null;
};

export type AccountOrders = {
  orders: AccountOrder[];
  pagination: { current_page: number; last_page: number; total: number };
};

export type QuotationRequest = {
  id: number;
  submitted_at: string;
  request_date: string | null;
  company_name: string;
  note: string | null;
  item_count: number;
  estimated_total: number;
  items: { name: string; color: string; size: string; quantity: number; unit_price: number | null }[];
};

// The signed-in customer, or null (no cookie, or the token expired / was revoked).
// Cached per request so the page and its components share one call.
export const getAccount = cache(async (): Promise<Account | null> => {
  if (!(await cookies()).get(SESSION_COOKIE)?.value) return null;
  const result = await laravelRequest<Account>("/api/account");
  if (result.ok) return result.data;
  // Only 401 means signed out; anything else (rate limit, Laravel down) must not look like a logout.
  if (result.status === 401) return null;
  throw new Error(`Account API failed: ${result.status} ${result.message}`);
});

// For /my-account pages: sends guests to /login and back here afterwards.
export async function requireAccount(returnTo: string): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return account;
}

export async function getAccountOrders(status?: OrderGroup, page = 1): Promise<AccountOrders> {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  if (page > 1) qs.set("page", String(page));
  const result = await laravelRequest<AccountOrders>(`/api/account/orders${qs.size ? `?${qs}` : ""}`);
  if (!result.ok) throw new Error(`Account orders API failed: ${result.status} ${result.message}`);
  return result.data;
}

export async function getQuotationRequests(): Promise<QuotationRequest[]> {
  const result = await laravelRequest<QuotationRequest[]>("/api/account/quotations");
  if (!result.ok) throw new Error(`Account quotations API failed: ${result.status} ${result.message}`);
  return result.data;
}

// Only same-site paths, so ?next= can't send the customer to another site after login.
export function safeReturnPath(value: unknown, fallback = "/my-account"): string {
  // Browsers read "/\" like "//", so backslashes are rejected too.
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : fallback;
}
