import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/home-data";
import { Price } from "@/components/price";

// Mirrors the "Card Product Latest" component in Framer.
export function ProductCard({
  product,
  badgeSide = "left",
  className = "",
}: {
  product: Product;
  badgeSide?: "left" | "right";
  className?: string;
}) {
  return (
    <Link href={product.href} className={`group flex flex-col gap-3 bg-[#fffef5] ${className}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-ivory">
        <Image
          src={product.image}
          alt={product.brand}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute top-3 rounded bg-[#b10000] px-1.5 py-0.5 text-xs text-white ${
              badgeSide === "left" ? "left-3" : "right-3"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-base">{product.brand}</span>
          <span className="truncate text-sm text-neutral-600">{product.name}</span>
        </div>
        <div className="flex flex-col items-end text-sm">
          <span><Price value={product.price} /></span>
          {product.comparePrice && (
            <span className="text-neutral-500 line-through"><Price value={product.comparePrice} /></span>
          )}
        </div>
      </div>
    </Link>
  );
}
