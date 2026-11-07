import type { Metadata } from "next";
import { CardStep } from "@/components/hamper/card-step";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { getHamperCards } from "@/lib/hamper-data";

export async function generateMetadata(): Promise<Metadata> {
  const { hamper, common } = await getDictionary();
  return { title: `${hamper.meta.card} | ${common.meta.titleSuffix}` };
}

export default async function CardPage() {
  const cards = await getHamperCards();

  return (
    <SiteShell footer={false}>
      <div className="min-h-screen bg-white px-6 pb-[180px] pt-[160px] md:px-[60px]">
        <CardStep cards={cards} />
      </div>
    </SiteShell>
  );
}
