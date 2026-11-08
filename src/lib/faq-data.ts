// FAQs page (/faqs, same path as Laravel's HomeController@faqs). Groups and questions are managed in the
// Laravel admin (FAQ / FAQ Group) and come from GET /api/faqs.

import { laravelHeaders, laravelUrl } from "./api";

export type FaqEntry = {
  id: number;
  question: string;
  // HTML from the admin editor.
  answer: string | null;
};

export type FaqGroup = { name: string; slug: string; faqs: FaqEntry[] };

export type FaqsResponse = {
  meta: { title: string; description: string };
  groups: FaqGroup[];
};

export async function getFaqs(): Promise<FaqsResponse> {
  const res = await fetch(laravelUrl("/api/faqs"), {
    headers: laravelHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`FAQs API failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as FaqsResponse;
}

// schema.org FAQPage, like the Laravel page, so search engines can show the Q&A as rich results.
export function faqJsonLd(groups: FaqGroup[]) {
  const text = (html: string | null) => (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: text(f.answer) },
      })),
    ),
  };
}
