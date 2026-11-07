import type { Metadata } from "next";
import { ReviewStep } from "@/components/hamper/review-step";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { hamper, common } = await getDictionary();
  return { title: `${hamper.meta.review} | ${common.meta.titleSuffix}` };
}

export default function ReviewPage() {
  return (
    <SiteShell footer={false}>
      <div className="min-h-screen bg-white px-6 pb-[180px] pt-[160px] md:px-[60px]">
        <ReviewStep />
      </div>
    </SiteShell>
  );
}
