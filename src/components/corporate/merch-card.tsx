import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/price";
import { MERCH_PLACEHOLDER_IMAGE, merchHref, type MerchCardData } from "@/lib/merch-data";

// Mirrors "Card Product Corporate" in Framer.
export function MerchCard({ product }: { product: MerchCardData }) {
  return (
    <Link href={merchHref(product.slug)} className="group flex min-w-0 flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
        <Image
          src={product.image ?? MERCH_PLACEHOLDER_IMAGE}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">{product.name}</h3>
        {product.min_price !== null && (
          <p className="truncate text-sm text-neutral-600">From <Price value={product.min_price} /> / pcs</p>
        )}
      </div>
    </Link>
  );
}
