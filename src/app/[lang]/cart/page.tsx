import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { ProductCard } from "@/components/home/product-card";
import { Footer } from "@/components/layout/footer";
import { MinimalHeader } from "@/components/layout/minimal-header";
import { TopBarNotification } from "@/components/layout/top-bar-notification";
import { LinkButtonIcon } from "@/components/shared/link-button-icon";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary } from "@/i18n/server";
import { getCart } from "@/lib/cart-actions";
import { productPage, shopFaqKeys, toProductCard } from "@/lib/product-data";
import { getRandomQuickHampers, QUICK_HAMPERS_PATH } from "@/lib/shop-data";

export async function generateMetadata(): Promise<Metadata> {
  const { cart, common } = await getDictionary();
  return { title: `${cart.meta.title} | ${common.meta.titleSuffix}` };
}

// Dynamic: reads the cart cookie and loads the cart from Laravel on every request.
export default async function CartPage() {
  const [cart, { shop }] = await Promise.all([getCart(), getDictionary()]);
  const related = await getRandomQuickHampers(4, cart?.items.map((i) => i.slug) ?? []);

  return (
    <>
      <TopBarNotification />
      <MinimalHeader offsetTopBar />
      <main className="bg-white">
        <section className="min-h-[80vh] px-6 pb-10 pt-[157px] md:px-[60px]">
          <CartView initialCart={cart} />
        </section>

        {related.length > 0 && (
          <section className="px-6 pb-[100px] pt-10 md:px-10">
            <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-12">
              <div className="flex items-center justify-between gap-5">
                <WordReveal as="h2" text={shop.related.title} className="font-heading text-3xl" />
                <LinkButtonIcon href={QUICK_HAMPERS_PATH}>{shop.related.cta}</LinkButtonIcon>
              </div>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {related.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 4) * 0.1}>
                    <ProductCard product={toProductCard(p)} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#fffef5] px-6 pb-[150px] pt-[100px] md:px-12">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12">
            <div className="flex flex-col gap-5">
              <h2 className="font-heading text-4xl">{shop.faq.title}</h2>
              <LinkButtonIcon href={productPage.faq.href}>{shop.faq.cta}</LinkButtonIcon>
            </div>
            <Accordion className="w-full">
              {shopFaqKeys.map((key) => shop.faq.items[key]).map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
