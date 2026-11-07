import type { Metadata } from "next";
import { MerchCatalog } from "@/components/corporate/merch-catalog";
import { SiteShell } from "@/components/layout/site-shell";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getMerchCatalog, merchandiseCatalog, type MerchQuery } from "@/lib/merch-data";

export const metadata: Metadata = { title: "Corporate Merchandise | Studiokado" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CorporateMerchandisePage({ searchParams }: PageProps<"/[lang]/corporate-merchandise">) {
  const params = await searchParams;
  const query: MerchQuery = {
    category: first(params.category),
    keyword: first(params.keyword)?.trim() || undefined,
    page: first(params.page),
  };
  const catalog = await getMerchCatalog(query);
  const category = catalog.categories.find((c) => String(c.id) === query.category);

  return (
    <SiteShell>
      <div className="bg-white px-5">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-8 px-0 pb-12 pt-[160px] md:px-[50px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/corporate-gift" },
              { label: "Merchandise", href: "/corporate-merchandise" },
              { label: category?.name ?? merchandiseCatalog.title },
            ]}
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-4xl md:text-5xl">{category?.name ?? merchandiseCatalog.title}</h1>
            <p>
              {new Intl.NumberFormat("id-ID").format(catalog.pagination.total)} Items
            </p>
          </div>
          <MerchCatalog {...catalog} query={query} />
        </div>
      </div>
    </SiteShell>
  );
}
