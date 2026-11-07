import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCardBlock, ArticleLarge, ArticleSmall } from "@/components/journal/article-cards";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import { getJournal, journalPage } from "@/lib/journal-data";

const pageParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// Title and description from Laravel's seo.journal translations, plus " - Page N" when paginated.
export async function generateMetadata({ searchParams }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const page = pageParam((await searchParams).page);
  const { meta } = await getJournal(page);
  return {
    title: `${page ? `${meta.title} - Page ${page}` : meta.title} | Studiokado`,
    description: meta.description,
  };
}

export default async function JournalPage({ searchParams }: PageProps<"/[lang]/journal">) {
  const { top_featured_post, featured_posts, posts, pagination } = await getJournal(
    pageParam((await searchParams).page),
  );
  const featured = top_featured_post ?? posts[0];

  return (
    <SiteShell>
      <div className="bg-white px-5 pb-40 pt-40">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[120px] px-0 md:px-12">
          <section className="flex flex-col items-center gap-20">
            <WordReveal as="h1" text={journalPage.title} className="font-heading text-5xl md:text-7xl" />
            {featured && <ArticleLarge article={featured} />}
          </section>

          <section className="flex flex-col gap-12">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl">{journalPage.latestEyebrow}</span>
                <WordReveal as="h2" text={journalPage.title} className="font-heading text-3xl md:text-4xl" />
              </div>
              <WordReveal text={journalPage.description} delay={0.3} stagger={0.02} className="font-light md:w-[478px]" />
            </div>
            <ul className="grid gap-10 py-10 md:grid-cols-3">
              {posts.map((a, i) => (
                <Reveal as="li" key={a.id} delay={(i % 3) * 0.1}>
                  <ArticleSmall article={a} />
                </Reveal>
              ))}
            </ul>
            {pagination.last_page > 1 && (
              <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((n) => {
                  const current = n === pagination.current_page;
                  return (
                    <Link
                      key={n}
                      href={n === 1 ? "/journal" : `/journal?page=${n}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex size-9 items-center justify-center rounded-full text-sm ${
                        current ? "bg-bistre text-white" : "border border-bistre/30 bg-white hover:border-bistre"
                      }`}
                    >
                      {n}
                    </Link>
                  );
                })}
              </nav>
            )}
          </section>

          {featured_posts.length > 0 && (
            <section className="flex flex-col gap-12">
              <WordReveal as="h2" text={journalPage.alsoLike} className="text-2xl md:text-3xl" />
              <div className="grid gap-4 md:grid-cols-3">
                {featured_posts.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 3) * 0.1}>
                    <ArticleCardBlock article={a} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
