"use client";

import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { format as fill } from "@/i18n/format";
import { useCurrency } from "@/lib/currency-store";
import { PRODUCT_FORM_ID } from "./card-options";

export function FavoriteButton() {
  const [on, setOn] = useState(false);
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={t.product.favorite}
      className="grid size-8 place-items-center"
    >
      <Heart className={`size-6 ${on ? "fill-[#b10000] text-[#b10000]" : ""}`} strokeWidth={1.5} />
    </button>
  );
}

// Price + quantity selector. The quantity is submitted with the add-to-cart form (CardOptions).
export function ProductPurchase({ price }: { price: number }) {
  const [qty, setQty] = useState(1);
  const { format } = useCurrency();
  const quantity = useI18n().t.shop.quantity;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <p className="flex-1 font-heading text-xl">{format(price).replace(/^Rp/, "Rp ")}</p>
        <div className="flex items-center gap-1 rounded-full border border-bistre/30">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label={fill(quantity.decrease, { label: quantity.default })}
            className="grid size-10 place-items-center"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center" aria-live="polite">
            {qty}
          </span>
          <input type="hidden" name="quantity" value={qty} form={PRODUCT_FORM_ID} />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label={fill(quantity.increase, { label: quantity.default })}
            className="grid size-10 place-items-center"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
