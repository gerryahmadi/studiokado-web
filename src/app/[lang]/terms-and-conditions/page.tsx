import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/legal-content";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { legal, common } = await getDictionary();
  return { title: `${legal.terms.title} | ${common.meta.titleSuffix}`, description: legal.terms.description };
}

export default async function TermsAndConditionsPage() {
  const { legal } = await getDictionary();
  return <LegalContent page={legal.terms} />;
}
