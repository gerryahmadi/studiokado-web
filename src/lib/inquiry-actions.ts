"use server";

import type { FormState } from "./account-actions";
import { laravelRequest } from "./cart-server";

// Personal gifting inquiry (/inquiry-form) -> Laravel Api\InquiryController@store.
export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const values: Record<string, string> = {};
  const body = new URLSearchParams();
  for (const key of ["name", "phone", "email", "occasion", "delivery_date", "quantity", "budget", "message", "referral"]) {
    const value = String(formData.get(key) ?? "").trim();
    values[key] = value;
    if (value) body.set(key, value);
  }
  for (const preference of formData.getAll("preferences")) body.append("preferences[]", String(preference));

  const result = await laravelRequest<{ message: string }>("/api/inquiry", { method: "POST", body });
  if (!result.ok) return { status: "error", message: result.message, errors: result.errors, values };
  return { status: "saved", message: result.data.message, at: Date.now() };
}
