import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/legal-content";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { legal, common } = await getDictionary();
  return { title: `${legal.privacy.title} | ${common.meta.titleSuffix}`, description: legal.privacy.description };
}

export default async function PrivacyPolicyPage() {
  const { legal } = await getDictionary();
  return <LegalContent page={legal.privacy} />;
}
