import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { TrackingForm } from "@/components/tracking/tracking-form";
import { getDictionary, getLocale } from "@/i18n/server";
import { lookupOrder } from "@/lib/tracking";

export async function generateMetadata(): Promise<Metadata> {
  const { tracking, common } = await getDictionary();
  return { title: `${tracking.meta.title} | ${common.meta.titleSuffix}` };
}

// /tracking-order/submitted?order=<invoice>: My Account's "Track Order" link. A signed-in owner sees the
// order straight away (no email needed); anyone else gets the form with the number filled in.
export default async function TrackingSubmittedPage({ searchParams }: PageProps<"/[lang]/tracking-order/submitted">) {
  const { order } = await searchParams;
  const number = typeof order === "string" ? order.slice(0, 50) : "";
  const [{ tracking }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const lookup = number ? await lookupOrder(number) : null;

  return (
    <SiteShell>
      <TrackingForm
        t={tracking}
        locale={locale}
        initialNumber={number}
        initial={lookup?.status === "found" ? lookup.data : null}
      />
    </SiteShell>
  );
}
