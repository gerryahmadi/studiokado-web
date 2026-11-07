import type { Metadata } from "next";
import { QrisPayment } from "@/components/checkout/qris-payment";
import { MinimalHeader } from "@/components/layout/minimal-header";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { checkout, common } = await getDictionary();
  return { title: `${checkout.meta.qris} | ${common.meta.titleSuffix}` };
}

export default function QrisPage() {
  return (
    <>
      <MinimalHeader />
      <main className="min-h-screen bg-white px-6 pb-12 pt-[100px] md:px-12">
        <QrisPayment />
      </main>
    </>
  );
}
