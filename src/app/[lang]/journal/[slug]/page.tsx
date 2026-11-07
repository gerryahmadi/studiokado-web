import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleCardBlock } from "@/components/journal/article-cards";
import { GoBack } from "@/components/journal/go-back";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import { Price } from "@/components/price";
import { getJournalPost, journalPage } from "@/lib/journal-data";
import { PRODUCT_PLACEHOLDER_IMAGE, productHref } from "@/lib/product-data";

// Same as Laravel's JournalController@show: unknown slugs go back to the journal index.
async function loadPost(slug: string) {
  const data = await getJournalPost(slug);
  if (!data) redirect("/journal");
  return data;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getJournalPost(slug);
  if (!data) return {};
  const { meta, cover_image } = data.post;
  return {
    title: `${meta.title} | Studiokado`,
    description: meta.description ?? undefined,
    openGraph: cover_image ? { images: [cover_image] } : undefined,
  };
}

export default async function JournalArticlePage({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { slug } = await params;
  const { post, other_posts, products } = await loadPost(slug);
  // Like article.blade.php: the wide header crop on desktop, the 4:3 cover on mobile.
  const bannerMobile = post.cover_image ?? post.header_image;
  const bannerDesktop = post.header_image ?? post.cover_image;

  return (
    <SiteShell>
      <div className="bg-white px-5 pt-[150px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-0 md:px-[60px]">
          <GoBack />
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="text-lg leading-relaxed">{post.excerpt}</p>}
          </div>
          {bannerMobile && bannerDesktop && (
            <>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md md:hidden">
                <Image src={bannerMobile} alt={post.title} fill priority sizes="100vw" className="object-cover" />
              </div>
              <div className="relative hidden aspect-[11/3] w-full overflow-hidden rounded-md md:block">
                <Image src={bannerDesktop} alt={post.title} fill priority sizes="1280px" className="object-cover" />
              </div>
            </>
          )}
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-0 py-14 md:flex-row md:gap-[120px] md:px-[60px]">
          {/* Admin-authored HTML, rendered unescaped like the Laravel blade view. */}
          <article
            className="article-content min-w-0 flex-1"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
          {products.length > 0 && (
            <aside className="flex flex-col gap-6 md:w-1/4">
              {products.map((p) => (
                <Reveal key={p.id}>
                  <Link href={productHref(p.slug)} className="group flex flex-col items-center gap-5">
                    <span className="relative block aspect-square w-full overflow-hidden rounded">
                      <Image
                        src={p.image ?? PRODUCT_PLACEHOLDER_IMAGE}
                        alt={p.name}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-[#f0a481]/10" />
                    </span>
                    <span className="flex flex-col items-center gap-1 text-center">
                      <span>{p.name}</span>
                      <span><Price value={p.price} /></span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </aside>
          )}
        </div>
      </div>

      {other_posts.length > 0 && (
        <section className="bg-[#fef9f7] px-6 py-40 md:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-12">
            <div className="flex items-baseline justify-between gap-5">
              <WordReveal as="h2" text={journalPage.alsoLike} className="text-2xl md:text-3xl" />
              <Link href="/journal" className="underline-offset-4 hover:underline">
                {journalPage.showAll}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {other_posts.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 0.1}>
                  <ArticleCardBlock article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
