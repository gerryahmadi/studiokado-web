// Base URL of the Laravel backend (studiokado/). Server-side only.
// Default matches `php artisan serve --port=8005` from start-all.ps1.
export const LARAVEL_URL = (process.env.LARAVEL_URL ?? "http://127.0.0.1:8005").replace(/\/+$/, "");

export const laravelUrl = (path: string) => `${LARAVEL_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Headers for every call to the Laravel API. The shared key lets Laravel rate-limit per visitor
// (X-Client-Ip, added by laravelRequest) instead of per Next.js server IP.
// Env STOREFRONT_API_KEY must match Laravel's STOREFRONT_API_KEY.
export const laravelHeaders = (extra: Record<string, string> = {}): Record<string, string> => ({
  Accept: "application/json",
  ...(process.env.STOREFRONT_API_KEY ? { "X-Storefront-Key": process.env.STOREFRONT_API_KEY } : {}),
  ...extra,
});
