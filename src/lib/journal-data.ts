// Journal pages (/journal and /journal/[slug], same paths as Laravel's JournalController, English only).
// Posts and related products come from the Laravel API (GET /api/journal, GET /api/journal/{slug}).

import { laravelHeaders, laravelUrl } from "./api";
import type { ProductSummary } from "./product-data";

export const journalHref = (slug: string) => `/journal/${encodeURIComponent(slug)}`;

// Shown when a post has no cover image uploaded in the admin.
export const POST_PLACEHOLDER_IMAGE = "/images/journal/a-1.png";

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  published_at: string | null;
};

export type PostDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  header_image: string | null;
  // HTML from the admin editor.
  content: string | null;
  published_at: string | null;
  updated_at: string | null;
  meta: { title: string; description: string | null };
};

export type JournalResponse = {
  meta: { title: string; description: string };
  top_featured_post: PostSummary | null;
  featured_posts: PostSummary[];
  posts: PostSummary[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
};

export type JournalPostResponse = {
  post: PostDetail;
  other_posts: PostSummary[];
  products: ProductSummary[];
};

export async function getJournal(page?: string): Promise<JournalResponse> {
  const qs = page ? `?${new URLSearchParams({ page })}` : "";
  const res = await fetch(laravelUrl(`/api/journal${qs}`), {
    headers: laravelHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Journal API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as JournalResponse;
}

// null when the post doesn't exist (or isn't published yet).
export async function getJournalPost(slug: string): Promise<JournalPostResponse | null> {
  const res = await fetch(laravelUrl(`/api/journal/${encodeURIComponent(slug)}`), {
    headers: laravelHeaders(),
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Journal post API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as JournalPostResponse;
}

export const journalPage = {
  title: "Journal",
  latestEyebrow: "Latest",
  description:
    "Get inspired by our latest hampers, corporate gifting ideas, and behind-the-scenes moments from Studio Kado.",
  alsoLike: "You may also like",
  showAll: "Show All Journal",
};
