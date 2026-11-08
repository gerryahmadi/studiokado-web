import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { SectionLabel } from "@/components/shared/section-label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary } from "@/i18n/server";
import { faqJsonLd, getFaqs } from "@/lib/faq-data";

// Title and description from Laravel's seo.faqs translations.
export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getFaqs();
  return { title: `${meta.title} | Studiokado`, description: meta.description };
}

// All FAQ groups on one page; the chips jump to each group (Laravel used /faqs/{group} per group).
export default async function FaqsPage() {
  const [{ groups }, { common }] = await Promise.all([getFaqs(), getDictionary()]);
  const t = common.faq;

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(groups)).replace(/</g, "\\u003c") }}
      />
      <div className="bg-[#fffef5] px-6 pb-[150px] pt-[150px] md:px-[60px]">
        <div className="mx-auto flex max-w-[900px] flex-col gap-14">
          <header className="flex flex-col items-center gap-4 text-center">
            <SectionLabel className="normal-case">{t.label}</SectionLabel>
            <h1 className="font-heading text-4xl">{t.title}</h1>
            <p className="max-w-[600px] text-[#030607]/70">{t.description}</p>
          </header>

          {groups.length > 1 && (
            <nav aria-label={t.label} className="flex flex-wrap justify-center gap-2">
              {groups.map((g) => (
                <a
                  key={g.slug}
                  href={`#${g.slug}`}
                  className="rounded-full border border-bistre/20 px-4 py-1.5 text-sm transition-colors hover:bg-bistre/5"
                >
                  {g.name}
                </a>
              ))}
            </nav>
          )}

          {groups.map((g) => (
            <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-title`} className="scroll-mt-32">
              <h2 id={`${g.slug}-title`} className="mb-2 font-heading text-2xl">
                {g.name}
              </h2>
              <Accordion className="w-full">
                {g.faqs.map((f) => (
                  <AccordionItem key={f.id} value={String(f.id)} className="border-b border-bistre/15">
                    <AccordionTrigger className="py-5 font-heading text-lg font-normal hover:no-underline">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-base">
                      {/* HTML authored in the Laravel admin, rendered as the Blade view does. */}
                      <div className="article-content" dangerouslySetInnerHTML={{ __html: f.answer ?? "" }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
