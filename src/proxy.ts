import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/i18n/config";

// Locale routing. Public URLs have no locale prefix (/quick-hampers); every page lives under
// app/[lang]/, so each request is rewritten internally to /en/... or /id/... and both variants are
// prerendered. See src/i18n/config.ts for how the locale is picked.

// Best match from Accept-Language ("id-ID,id;q=0.9,en;q=0.8"), comparing primary subtags only.
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0].toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.lang)
    .find(isLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = "", ...rest] = pathname.split("/");

  // /id/journal -> remember "id" and redirect to /journal, so shareable links can pick the language
  // while every page keeps a single canonical URL.
  if (isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join("/")}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
    return response;
  }

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : (fromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // Same URL, different language: a CDN in front of Next must not cache HTML across locales
  // (Next sets its own Vary header, so this can't be fixed from here).
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals, the public/ asset folders and static files
    // (favicon.ico, icon.png, ...). Must stay a literal: Next reads it at build time.
    "/((?!api/|_next/|images/|videos/|.*\\.(?:ico|png|jpe?g|gif|webp|avif|svg|mp4|webm|txt|xml|json|webmanifest|woff2?)$).*)",
  ],
};
