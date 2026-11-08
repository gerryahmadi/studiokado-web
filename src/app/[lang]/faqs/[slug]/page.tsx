import { redirect } from "next/navigation";

// Old Laravel URLs (/faqs/{group}) land on the matching group of the single FAQs page.
export default async function FaqGroupPage({ params }: PageProps<"/[lang]/faqs/[slug]">) {
  const { slug } = await params;
  redirect(`/faqs#${encodeURIComponent(slug)}`);
}
