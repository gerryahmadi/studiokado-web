import type { Metadata } from "next";
import { CorporateLanding } from "@/components/corporate/corporate-landing";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { getCorporateLanding } from "@/lib/corporate-data";

export async function generateMetadata(): Promise<Metadata> {
  const { corporate, common } = await getDictionary();
  return {
    title: `${corporate.meta.title} | ${common.meta.titleSuffix}`,
    description: corporate.meta.description,
  };
}

export default async function CorporateGiftPage() {
  const data = await getCorporateLanding();

  return (
    <SiteShell>
      <CorporateLanding data={data} />
    </SiteShell>
  );
}
