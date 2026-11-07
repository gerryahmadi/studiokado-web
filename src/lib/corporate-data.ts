// Corporate pages (/corporate-gift, /corporate-gift/projects, /corporate-gift/projects/[slug]).
// Projects, client logos, merchandise banners, testimonials and FAQ come from the Laravel CMS
// (GET /api/corporate, /api/corporate/projects, /api/corporate/projects/{slug}).
// The page copy has no CMS field in Laravel; it lives in the `corporate` dictionary
// (src/i18n/messages/*/corporate.json). This file keeps the non-text config.

import { laravelHeaders, laravelUrl } from "./api";

const img = (name: string) => `/images/corporate/${name}`;

export const corporateProjectHref = (slug: string) => `/corporate-gift/projects/${encodeURIComponent(slug)}`;

// Studiokado's main WhatsApp line; used when the Laravel setting cta_whatsapp is empty.
const FALLBACK_WHATSAPP = "6281282098155";
export const whatsappHref = (number: string | null) => `https://wa.me/${(number || FALLBACK_WHATSAPP).replace(/\D/g, "")}`;

export const corporateHero = {
  image: img("hero.png"), // used when no corporate banner is uploaded in the admin
  primaryHref: "/corporate-merchandise",
  // Laravel has no single catalog file; the merchandise catalog page stands in for it.
  secondaryHref: "/corporate-merchandise",
};

export const whyUsCards = ["brand", "logistics", "manager"] as const;

export const orderDetailCards = ["moq", "pricing", "leadTime"] as const;

export const merchandiseHref = "/corporate-merchandise";

export const reachMap = img("map.svg");

export const corporateSpecialists = [
  { key: "adyn", name: "Adyn", image: img("contact-adyn.png") },
  { key: "dea", name: "Dea", image: img("contact-dea.png") },
] as const;

export const portfolio = {
  ctaHref: "/corporate-merchandise",
  cardsPerRow: 4,
};

export const projectDetailBackHref = "/corporate-gift/projects";

export type CorporateProject = { slug: string; client: string; category: string; image: string | null };

export type CorporateLandingResponse = {
  hero_image: string | null;
  whatsapp: string | null;
  logos: { image: string; link: string | null }[];
  featured_projects: CorporateProject[];
  merchandise: { image: string; title: string; subtitle: string }[];
  testimonials: { quote: string; name: string; role: string; photo: string | null }[];
  faq: { q: string; a: string }[];
};

export type CorporateProjectsResponse = {
  hero_image: string | null;
  categories: { slug: string; title: string; projects: CorporateProject[] }[];
};

export type CorporateProjectDetail = {
  slug: string;
  title: string;
  category: string | null;
  subtitle: string | null;
  images: string[];
  // `html` is admin-authored HTML from the corporate CMS.
  sections: { title: string | null; html: string | null; image: string | null }[];
  meta: { title: string; description: string | null };
  related: CorporateProject[];
};

async function corporateFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(laravelUrl(path), {
    headers: laravelHeaders(),
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Corporate API ${path} failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export const getCorporateLanding = async () => (await corporateFetch<CorporateLandingResponse>("/api/corporate"))!;

export const getCorporateProjects = async () =>
  (await corporateFetch<CorporateProjectsResponse>("/api/corporate/projects"))!;

// null when the project doesn't exist.
export const getCorporateProject = (slug: string) =>
  corporateFetch<CorporateProjectDetail>(`/api/corporate/projects/${encodeURIComponent(slug)}`);
