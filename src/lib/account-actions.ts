"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeReturnPath, type Account } from "./account";
import { laravelRequest } from "./cart-server";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session";

// `values` echoes what was typed (never passwords): React resets a form after its action runs,
// so inputs use them as defaultValue to keep the customer's input when Laravel rejects it.
export type FormState =
  | { status: "idle" }
  | { status: "saved"; message?: string; at: number }
  | { status: "error"; message: string; errors?: Record<string, string[]>; values?: Record<string, string> };

const fields = (formData: FormData, keys: string[]) => {
  const body = new URLSearchParams();
  for (const key of keys) body.set(key, String(formData.get(key) ?? "").trim());
  return body;
};

const failed = (
  result: { message: string; errors?: Record<string, string[]> },
  body: URLSearchParams,
): FormState => ({
  status: "error",
  message: result.message,
  errors: result.errors,
  values: Object.fromEntries([...body].filter(([key]) => !key.includes("password"))),
});

async function startSession(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = safeReturnPath(formData.get("next"));
  const body = fields(formData, ["email", "password"]);
  const result = await laravelRequest<{ token: string; user: Account }>("/api/auth/login", { method: "POST", body });
  if (!result.ok) {
    // Wrong email/password has its own page in the design; other problems (rate limit, network) show inline.
    if (result.status === 422 && !result.errors) {
      redirect(`/login/failed${next === "/my-account" ? "" : `?next=${encodeURIComponent(next)}`}`);
    }
    return failed(result, body);
  }

  await startSession(result.data.token);
  redirect(next);
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const body = fields(formData, ["first_name", "last_name", "email", "phone", "password"]);
  const result = await laravelRequest<{ token: string; user: Account }>("/api/auth/register", { method: "POST", body });
  if (!result.ok) return failed(result, body);

  await startSession(result.data.token);
  redirect(safeReturnPath(formData.get("next")));
}

export async function logout() {
  const store = await cookies();
  if (store.get(SESSION_COOKIE)?.value) {
    await laravelRequest("/api/auth/logout", { method: "POST" });
    store.delete(SESSION_COOKIE);
  }
  redirect("/login");
}

async function save(path: string, body: URLSearchParams, message = "Saved."): Promise<FormState> {
  const result = await laravelRequest<Account>(path, { method: "PUT", body });
  if (!result.ok) {
    if (result.status === 401) redirect("/login?next=/my-account");
    return failed(result, body);
  }
  // Account data is fetched uncached, so re-rendering the current page shows the stored values.
  refresh();
  return { status: "saved", message, at: Date.now() };
}

export async function updateProfile(_prev: FormState, formData: FormData) {
  return save("/api/account/profile", fields(formData, ["first_name", "last_name", "email", "phone"]));
}

export async function updateAddress(_prev: FormState, formData: FormData) {
  return save("/api/account/address", fields(formData, ["recipient", "address"]));
}

// Each company card sends only its own fields; Laravel leaves the others untouched.
export async function updateCompany(_prev: FormState, formData: FormData) {
  const keys = ["name", "industry", "website", "email", "phone", "address", "npwp", "tax_name"].filter((k) => formData.has(k));
  return save("/api/account/company", fields(formData, keys));
}

export async function changePassword(_prev: FormState, formData: FormData) {
  return save(
    "/api/account/password",
    fields(formData, ["old_password", "new_password", "new_password_confirmation"]),
    "Your password has been updated.",
  );
}
