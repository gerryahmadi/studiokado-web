import { getDictionary } from "@/i18n/server";
import { toProductCard } from "@/lib/product-data";
import { getPopularHampers } from "@/lib/shop-data";
import { CarouselSection } from "./carousel-section";
import { ProductCard } from "./product-card";

export async function PopularHampers() {
  const [products, { home, common }] = await Promise.all([getPopularHampers(), getDictionary()]);
  if (products.length === 0) return null;
  const t = home.popularHampers;

  return (
    <CarouselSection
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      labels={common.carousel}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={toProductCard(p)} className="w-[320px] shrink-0" />
      ))}
    </CarouselSection>
  );
}
