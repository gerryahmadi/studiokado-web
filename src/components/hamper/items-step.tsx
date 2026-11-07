"use client";

import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/shared/reveal";
import { CatalogFilterPanel, CatalogPagination } from "@/components/shop/catalog-controls";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import {
  HAMPER_ITEMS_PATH,
  HAMPER_PLACEHOLDER_IMAGE,
  isSoldOut,
  type HamperItemsResponse,
} from "@/lib/hamper-data";
import { useI18n } from "@/i18n/client";
import { format, plural } from "@/i18n/format";
import { useHamper } from "@/lib/hamper-store";
import { Price } from "@/components/price";
import type { ShopQuery } from "@/lib/shop-data";
import { HamperBottomBar } from "./hamper-bottom-bar";
import { HamperHeader } from "./hamper-header";

export function ItemsStep({ products, filters, pagination, query }: HamperItemsResponse & { query: ShopQuery }) {
  const { box, items, setItemQty, fits } = useHamper();
  const { t: messages } = useI18n();
  const t = messages.hamper.items;
  const [showFilters, setShowFilters] = useState(filters.some((f) => query[f.name as keyof ShopQuery]));
  const qtyOf = (id: number) => items.find((i) => i.item.id === id)?.qty ?? 0;

  return (
    <>
      <div className="flex flex-col items-center gap-[54px]">
        <HamperHeader current="items" />

        {!box && (
          <p className="rounded-md bg-ivory px-5 py-3 text-sm">
            {t.chooseBoxFirst}{" "}
            <Link href="/create-hampers/package" className="underline underline-offset-4">
              {t.pickPackaging}
            </Link>
            {t.untilFull}
          </p>
        )}

        <div className="flex w-full max-w-[1400px] flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="font-medium">{plural(t.found, pagination.total)}</p>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className="flex h-10 items-center gap-1 rounded px-5 text-sm"
            >
              <SlidersHorizontal className="size-4" strokeWidth={1.5} />
              {messages.shop.filter}
            </button>
          </div>
          {showFilters && (
            <CatalogFilterPanel basePath={HAMPER_ITEMS_PATH} filters={filters} query={query} clearLabel={messages.shop.clearFilters} />
          )}
        </div>

        {products.length === 0 && <p className="py-10 text-center">{t.noMatch}</p>}

        <ul className="grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item, index) => {
            const qty = qtyOf(item.id);
            const soldOut = isSoldOut(item);
            const stockLeft = item.stock === null ? Infinity : item.stock - qty;
            const canAdd = !!box && !soldOut && stockLeft > 0 && fits(item);
            return (
              <Reveal as="li" key={item.id} delay={(index % 4) * 0.1} className="flex flex-col gap-3">
                <div className="relative aspect-square w-full overflow-hidden rounded bg-ivory">
                  <Image
                    src={item.image ?? HAMPER_PLACEHOLDER_IMAGE}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium uppercase leading-snug">{item.name}</h3>
                  <p className="text-sm"><Price value={item.price} /></p>
                </div>
                {qty === 0 ? (
                  <button
                    type="button"
                    disabled={!canAdd}
                    onClick={() => setItemQty(item, 1)}
                    className="h-10 rounded-full border border-bistre text-sm transition-colors hover:bg-bistre/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    {soldOut ? messages.shop.soldOut : box && !fits(item) ? t.doesntFit : t.add}
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">{format(t.inBox, { count: qty })}</span>
                    <QuantityStepper
                      value={qty}
                      min={0}
                      // Going up only while the box has room and there is stock.
                      onChange={(n) => (n < qty || canAdd) && setItemQty(item, n)}
                    />
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>

        <CatalogPagination basePath={HAMPER_ITEMS_PATH} query={query} pagination={pagination} />
      </div>
      <HamperBottomBar ctaLabel={t.next} ctaHref="/create-hampers/card" requireItems />
    </>
  );
}
