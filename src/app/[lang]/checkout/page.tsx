import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { MinimalHeader } from "@/components/layout/minimal-header";
import { getDictionary } from "@/i18n/server";
import { getCart } from "@/lib/cart-actions";

export async function generateMetadata(): Promise<Metadata> {
  const { checkout, common } = await getDictionary();
  return { title: `${checkout.meta.title} | ${common.meta.titleSuffix}` };
}

// Dynamic: checks out the cart from the cart cookie. Nothing to pay for -> back to the cart.
// ?ship=multiple opens with "Multiple addresses" selected (the cart's second checkout button).
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ ship?: string | string[] }> }) {
  const { ship } = await searchParams;
  const cart = await getCart();
  if (!cart || !cart.items.some((i) => i.type !== "design")) redirect("/cart");

  return (
    <>
      <MinimalHeader />
      <main className="min-h-screen bg-[#fdfdfd] px-6 pb-12 pt-[100px] md:px-12">
        <CheckoutForm cart={cart} initialMode={ship === "multiple" ? "multiple" : "single"} />
      </main>
    </>
  );
}
