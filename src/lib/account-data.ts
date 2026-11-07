// Static parts of the /my-account pages. The data itself comes from the Laravel API (lib/account.ts).

import type { OrderGroup } from "./account";

export const accountMenu = [
  { key: "profile", label: "Profile", href: "/my-account" },
  { key: "company", label: "Company Information", href: "/my-account/company-information" },
  { key: "quotation", label: "Quotation Request", href: "/my-account/quotation-request" },
  { key: "orders", label: "Orders", href: "/my-account/orders" },
  { key: "password", label: "Change Password", href: "/my-account/change-password" },
] as const;

export type AccountMenuKey = (typeof accountMenu)[number]["key"];

// `name` is the field Laravel expects; `value` the current one.
export type InfoField = { name: string; label: string; value: string | null; type?: string; multiline?: boolean };

export const accountAvatar = "/images/account/avatar.png";

export const orderTabs: { label: string; group?: OrderGroup }[] = [
  { label: "All" },
  { label: "On Going", group: "on-going" },
  { label: "Completed", group: "completed" },
  { label: "Failed", group: "failed" },
];

export const formatAccountDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(
    new Date(iso),
  );
