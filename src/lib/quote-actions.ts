"use server";

import type { FormState } from "./account-actions";
import { laravelRequest } from "./cart-server";
import type { QuoteItem } from "./quote-store";

// "Request Quotation" on /corporate-merchandise/quotation -> Laravel Merchandise\QuotationController@submit
// (the endpoint the Laravel merchandise app uses). When signed in, Laravel links it to the account.
// The quote list lives in the browser, so the form posts it as JSON in the "items" field.
export async function submitQuotation(_prev: FormState, formData: FormData): Promise<FormState> {
  let items: QuoteItem[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("items") ?? "[]"));
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  const contact = {
    name: String(formData.get("name") ?? "").trim(),
    company_name: String(formData.get("company_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").replace(/[^\d]/g, ""),
    request_date: String(formData.get("request_date") ?? ""),
    note: String(formData.get("note") ?? "").trim(),
  };
  const values = { ...contact, phone: String(formData.get("phone") ?? "") };

  if (items.length === 0) return { status: "error", message: "Add at least one product to your quotation.", values };

  const result = await laravelRequest<unknown>("/api/merchandise/quotation/submit", {
    method: "POST",
    json: {
      contact,
      // Products without colors/sizes send 0, like the Laravel merchandise app.
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        thumbnail: i.image,
        color: i.color?.id ?? 0,
        color_name: i.color?.name ?? "-",
        size: i.size?.id ?? 0,
        size_name: i.size?.name ?? "-",
        quantity: i.quantity,
      })),
    },
  });
  if (!result.ok) {
    // Field errors come back as "contact.name"; the form uses the bare names.
    const errors = result.errors
      ? Object.fromEntries(
          Object.entries(result.errors).map(([k, v]) => [
            k.replace(/^contact\./, ""),
            v.map((m) => m.replace(/contact\.(\w+)/, (_, f: string) => f.replace("_", " "))),
          ]),
        )
      : undefined;
    return { status: "error", message: result.message, errors, values };
  }
  return { status: "saved", at: Date.now() };
}
