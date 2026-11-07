import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";
import { toProductCard } from "@/lib/product-data";
import { getQuickHampers, shopPage, toShopQuery } from "@/lib/shop-data";

// Same title rule as Laravel's QuickHampersController@index: meta title, plus " - Page N" when paginated.
export async function generateMetadata({ searchParams }: PageProps<"/[lang]/quick-hampers">): Promise<Metadata> {
  const query = toShopQuery(await searchParams);
  const [{ page }, { shop }] = await Promise.all([getQuickHampers(query), getDictionary()]);
  const title = query.page ? format(shop.meta.paged, { title: page.meta.title, page: query.page }) : page.meta.title;
  return {
    title: `${title} | Studiokado`,
    description: page.meta.description ?? undefined,
    keywords: page.meta.keywords ?? undefined,
  };
}

export default async function QuickHampersPage({ searchParams }: PageProps<"/[lang]/quick-hampers">) {
  const query = toShopQuery(await searchParams);
  const { page, filters, products, pagination } = await getQuickHampers(query);

  return (
    <SiteShell>
      <div className="pt-[117px]">
        <div className="relative h-[75vh] min-h-[320px] w-full">
          <Image src={shopPage.banner} alt={page.title} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-3 bg-[#fffef5] px-6 py-[50px] md:px-10">
          <h1 className="font-heading text-4xl">{page.title}</h1>
          {/* Admin-authored HTML, rendered unescaped like the Laravel blade view. */}
          {page.content && (
            <div className="max-w-2xl text-[#030607]/70" dangerouslySetInnerHTML={{ __html: page.content }} />
          )}
        </div>
        <ShopCatalog
          products={products.map(toProductCard)}
          filters={filters}
          pagination={pagination}
          query={query}
        />
      </div>
    </SiteShell>
  );
}
