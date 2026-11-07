import type { Metadata } from "next";
import { ItemsStep } from "@/components/hamper/items-step";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { getHamperItems } from "@/lib/hamper-data";
import { toShopQuery } from "@/lib/shop-data";

export async function generateMetadata(): Promise<Metadata> {
  const { hamper, common } = await getDictionary();
  return { title: `${hamper.meta.items} | ${common.meta.titleSuffix}` };
}

export default async function ItemsPage({ searchParams }: PageProps<"/[lang]/create-hampers/items">) {
  const query = toShopQuery(await searchParams);
  const data = await getHamperItems(query);

  return (
    <SiteShell footer={false}>
      <div className="min-h-screen bg-white px-6 pb-[180px] pt-[160px] md:px-[60px]">
        <ItemsStep {...data} query={query} />
      </div>
    </SiteShell>
  );
}
