import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { TrackingForm } from "@/components/tracking/tracking-form";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { tracking, common } = await getDictionary();
  return { title: `${tracking.meta.notFoundTitle} | ${common.meta.titleSuffix}` };
}

export default async function TrackingNotFoundPage() {
  const { tracking } = await getDictionary();

  return (
    <SiteShell>
      <TrackingForm t={tracking} locale={await getLocale()} notFound />
    </SiteShell>
  );
}
