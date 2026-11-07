import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductCard } from "@/components/home/product-card";
import { SiteShell } from "@/components/layout/site-shell";
import { CardOptions } from "@/components/product/card-options";
import { ProductGallery } from "@/components/product/product-gallery";
import { FavoriteButton, ProductPurchase } from "@/components/product/product-purchase";
import { LinkButtonIcon } from "@/components/shared/link-button-icon";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";
import {
  getProduct,
  PRODUCT_PLACEHOLDER_IMAGE,
  productPage,
  shopFaqKeys,
  toGiftCard,
  toProductCard,
} from "@/lib/product-data";
import { MoveVertical, MoveHorizontal } from "lucide-react";

// Same lookup as Laravel's ProductController@show: unknown slugs 404, discontinued ones 301
// to the target in database/redirects/legacy-products.csv.
async function loadProduct(slug: string) {
  const result = await getProduct(slug);
  if (!result.found) {
    if (result.redirect) permanentRedirect(result.redirect);
    notFound();
  }
  return result.data;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProduct(slug);
  if (!result.found) return {};
  const { meta } = result.data.product;
  return {
    title: `${meta.title} | Studiokado`,
    description: meta.description ?? undefined,
    keywords: meta.keywords ?? undefined,
    alternates: meta.canonical_url ? { canonical: meta.canonical_url } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/p/[slug]">) {
  const { slug } = await params;
  const [{ product: p, cards, other_products }, { product: t, shop }] = await Promise.all([
    loadProduct(slug),
    getDictionary(),
  ]);
  const images = p.images.length > 0 ? p.images : [PRODUCT_PLACEHOLDER_IMAGE];
  const accordionDefault = p.description ? ["description"] : p.sub_items.length > 0 ? ["inside"] : [];

  return (
    <SiteShell>
      <div className="bg-[#fffef5] pt-[117px]">
        {/* Product */}
        <section className="px-6 pb-10 pt-10 md:px-10 md:pt-[110px]">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-10 md:flex-row md:items-start">
            <div className="md:sticky md:top-[150px] md:w-1/2 md:shrink-0">
              <ProductGallery images={images} alt={p.name} />
            </div>

            {/* min-w-0: let the card scroller overflow instead of widening this column. */}
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <div className="flex flex-col gap-5">
                {p.tags.length > 0 && (
                  <ul className="flex gap-0.5">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full bg-ivory px-3 py-1 text-xs">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-5">
                    <h1 className="flex-1 font-heading text-4xl">{p.name}</h1>
                    <FavoriteButton />
                  </div>
                  {p.height || p.width ? (
                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                      {p.height ? (
                        <span className="flex items-center gap-1">
                          <MoveVertical className="size-4" strokeWidth={1.5} />
                          {format(t.dimension, { value: p.height })}
                        </span>
                      ) : null}
                      {p.width ? (
                        <span className="flex items-center gap-1">
                          <MoveHorizontal className="size-4" strokeWidth={1.5} />
                          {format(t.dimension, { value: p.width })}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <ProductPurchase price={p.price} />
              </div>

              {accordionDefault.length > 0 && (
                <Accordion defaultValue={accordionDefault} className="w-full">
                  {p.description && (
                    <AccordionItem value="description">
                      <AccordionTrigger>{t.description}</AccordionTrigger>
                      {/* Admin-authored HTML, rendered unescaped like the Laravel blade view. */}
                      <AccordionContent>
                        <div dangerouslySetInnerHTML={{ __html: p.description }} />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {p.sub_items.length > 0 && (
                    <AccordionItem value="inside">
                      <AccordionTrigger>{t.inside}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-3 gap-3">
                          {p.sub_items.map((src) => (
                            <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-ivory">
                              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}

              <CardOptions productId={p.id} cards={cards.map(toGiftCard)} />
            </div>
          </div>
        </section>

        {/* You may also like */}
        {other_products.length > 0 && (
          <section className="flex flex-col gap-12 px-6 pb-[100px] pt-10 md:px-10">
            <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12">
              <div className="flex items-center justify-between gap-5">
                <WordReveal as="h2" text={shop.related.title} className="font-heading text-4xl" />
                <LinkButtonIcon href={productPage.related.href}>
                  {shop.related.cta}
                </LinkButtonIcon>
              </div>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {other_products.map((r, i) => (
                  <Reveal key={r.id} delay={(i % 4) * 0.1}>
                    <ProductCard product={toProductCard(r)} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="bg-ivory px-6 pb-[150px] pt-[100px] md:px-12">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12">
            <div className="flex flex-col gap-5">
              <h2 className="font-heading text-4xl">{shop.faq.title}</h2>
              <LinkButtonIcon href={productPage.faq.href}>{shop.faq.cta}</LinkButtonIcon>
            </div>
            <Accordion className="w-full">
              {shopFaqKeys.map((key) => shop.faq.items[key]).map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
