"use client";

import { ChevronDown, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Price } from "@/components/price";
import { MERCH_MIN_QUANTITY, tieredUnitPrice, type MerchProductDetail } from "@/lib/merch-data";
import { addToQuote, useQuoteItems } from "@/lib/quote-store";

export function MerchFavorite() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" onClick={() => setOn((v) => !v)} aria-pressed={on} aria-label="Add to favorites" className="grid size-8 place-items-center">
      <Heart className={`size-6 ${on ? "fill-[#b10000] text-[#b10000]" : ""}`} strokeWidth={1.5} />
    </button>
  );
}

// Color, size, quantity and "+ Add to Quote" (the quote list lives in the browser, see lib/quote-store.ts).
export function MerchPurchase({ product }: { product: MerchProductDetail }) {
  const quoteItems = useQuoteItems();
  const [color, setColor] = useState(product.colors[0] ?? null);
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [qty, setQty] = useState(MERCH_MIN_QUANTITY);
  const [added, setAdded] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);

  const unit = tieredUnitPrice(product.price_tiers, qty, product.price);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-black/10">
        <button
          type="button"
          onClick={() => setOpenCustom((o) => !o)}
          aria-expanded={openCustom}
          className="flex w-full items-center justify-between gap-12 py-3 font-heading text-lg"
        >
          Customization Options
          <ChevronDown className={`size-6 transition-transform ${openCustom ? "rotate-180" : ""}`} strokeWidth={1.25} />
        </button>
        {openCustom && (
          <p className="pb-4 text-sm">
            Custom screen printing and embroidery services are available. Share your logo and artwork with our
            consultant after submitting your quotation request.
          </p>
        )}
      </div>

      {product.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Color: {color?.name}</p>
          <div className="flex flex-wrap gap-1 py-1" role="radiogroup" aria-label="Color">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={color?.id === c.id}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c)}
                className={`size-10 rounded-full border-2 p-1 ${color?.id === c.id ? "border-bistre" : "border-transparent"}`}
              >
                <span className="block size-full rounded-full border border-black/10" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Size: {size?.name}</p>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={size?.id === s.id}
                onClick={() => setSize(s)}
                className={`grid h-10 min-w-10 place-items-center rounded border px-2 text-sm ${
                  size?.id === s.id ? "border-bistre bg-bistre text-white" : "border-black/20 hover:border-bistre"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={qty} min={MERCH_MIN_QUANTITY} step={10} onChange={setQty} />
        <p className="text-sm">
          <Price value={unit} /> / pcs · <span className="font-medium"><Price value={unit * qty} /></span>
        </p>
      </div>
      <p className="-mt-3 text-xs text-neutral-600">Minimum order {MERCH_MIN_QUANTITY} pcs.</p>

      <button
        type="button"
        onClick={() => {
          addToQuote({
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            color: color && { id: color.id, name: color.name },
            size: size && { id: size.id, name: size.name },
            quantity: qty,
            price: product.price,
            price_tiers: product.price_tiers,
          });
          setAdded(true);
        }}
        className="w-full rounded-full bg-[#050505] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90"
      >
        {added ? "Added to Quote" : "+ Add to Quote"}
      </button>
      {quoteItems.length > 0 && (
        <Link href="/corporate-merchandise/quotation" className="text-sm underline underline-offset-4">
          View quotation request ({quoteItems.length} {quoteItems.length === 1 ? "product" : "products"})
        </Link>
      )}
    </div>
  );
}
