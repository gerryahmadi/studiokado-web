import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { MerchCard } from "@/components/corporate/merch-card";
import { MerchFavorite, MerchPurchase } from "@/components/corporate/merch-purchase";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Price } from "@/components/price";
import {
  getMerchProduct,
  MERCH_PLACEHOLDER_IMAGE,
  merchandiseCatalog,
  merchHref,
  merchIdFromSlug,
} from "@/lib/merch-data";

async function load(slug: string) {
  const id = merchIdFromSlug(slug);
  return id ? getMerchProduct(id) : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/corporate-merchandise/[slug]">): Promise<Metadata> {
  const product = await load((await params).slug);
  return product ? { title: `${product.name} | Corporate Merchandise | Studiokado` } : {};
}

export default async function MerchandiseDetailPage({ params }: PageProps<"/[lang]/corporate-merchandise/[slug]">) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();
  // Only the id is read; keep one canonical URL when the name part is outdated or missing.
  if (slug !== p.slug) permanentRedirect(merchHref(p.slug));

  const images = p.images.length > 0 ? p.images : [p.image ?? MERCH_PLACEHOLDER_IMAGE];

  return (
    <SiteShell>
      <div className="bg-white px-5">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-20 px-0 pb-12 pt-[157px] md:px-[50px]">
          <div className="flex flex-col gap-5">
            <Breadcrumb
              items={[
                { label: "Home", href: "/corporate-gift" },
                { label: "Merchandise", href: "/corporate-merchandise" },
                { label: merchandiseCatalog.title, href: "/corporate-merchandise" },
                { label: p.name },
              ]}
            />
            <div className="flex flex-col gap-10 md:flex-row md:items-start">
              <div className="flex flex-col gap-3 md:w-[660px] md:max-w-[50%]">
                <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5]">
                  <Image src={images[0]} alt={p.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                {images.length > 1 && (
                  <ul className="grid grid-cols-4 gap-3">
                    {images.slice(1, 5).map((src) => (
                      <li key={src} className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                        <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex items-start gap-5">
                  <div className="flex flex-1 flex-col gap-2">
                    <h1 className="font-heading text-3xl md:text-4xl">{p.name}</h1>
                    <p className="text-sm">
                      {p.min_price !== null && <>From <Price value={p.min_price} /> / pcs · </>}Production time: {p.production_time}
                    </p>
                  </div>
                  <MerchFavorite />
                </div>
                {p.price_tiers.length > 0 && (
                  <table className="w-full max-w-sm text-left text-sm">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th scope="col" className="py-2 font-normal">Quantity</th>
                        <th scope="col" className="py-2 font-normal">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.price_tiers.map((t) => (
                        <tr key={t.min_quantity} className="border-b border-black/5">
                          <td className="py-2">{t.min_quantity}+ pcs</td>
                          <td className="py-2"><Price value={t.price} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {/* Admin-authored HTML, rendered unescaped like the Laravel merchandise app. */}
                {p.description && (
                  <div
                    className="article-content border-b border-black/10 pb-6 text-sm"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                )}
                <MerchPurchase product={p} />
              </div>
            </div>
          </div>

          {p.related.length > 0 && (
            <section className="flex flex-col gap-6 border-t-2 border-[#e9e1d3] pt-6">
              <h2 className="font-heading text-3xl md:text-4xl">{merchandiseCatalog.pairingsTitle}</h2>
              <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {p.related.map((r) => (
                  <li key={r.id}>
                    <MerchCard product={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
