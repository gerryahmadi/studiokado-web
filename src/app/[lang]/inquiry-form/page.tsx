import type { Metadata } from "next";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { inquiryPage } from "@/lib/inquiry-data";

export async function generateMetadata(): Promise<Metadata> {
  const { inquiry, common } = await getDictionary();
  return { title: `${inquiry.meta.title} | ${common.meta.titleSuffix}`, description: inquiry.description };
}

export default async function InquiryFormPage() {
  const { inquiry } = await getDictionary();

  return (
    <SiteShell>
      <section className="bg-[#fffef5] px-6 pt-[150px] md:px-[50px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 pb-[50px] md:flex-row md:items-start md:gap-[103px]">
          <div className="min-w-0 flex-1">
            <InquiryForm t={inquiry} />
          </div>
          <div className="relative hidden aspect-[0.854] w-[358px] shrink-0 md:block">
            <Image
              src={inquiryPage.image}
              alt=""
              fill
              sizes="358px"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
