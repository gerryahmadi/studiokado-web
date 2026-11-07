"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/home/product-card";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";
import type { Product } from "@/lib/home-data";
import {
  QUICK_HAMPERS_PATH,
  type QuickHampersResponse,
  type ShopFilter,
  type ShopQuery,
} from "@/lib/shop-data";
import { CatalogFilterPanel, CatalogPagination, catalogHref } from "./catalog-controls";

export function ShopCatalog({
  products,
  filters,
  pagination,
  query,
}: {
  products: Product[];
  filters: ShopFilter[];
  pagination: QuickHampersResponse["pagination"];
  query: ShopQuery;
}) {
  const t = useI18n().t.shop;
  const activeFilters = filters.filter((f) => query[f.name as keyof ShopQuery]);
  const [showFilters, setShowFilters] = useState(activeFilters.length > 0);
  const clearHref = query.search ? catalogHref(QUICK_HAMPERS_PATH, {}, { search: query.search }) : QUICK_HAMPERS_PATH;

  return (
    <div className="flex flex-col bg-[#fffef5] pb-[100px]">
      <div className="flex flex-wrap items-center justify-between gap-5 bg-[#fffef5] px-6 md:px-10">
        <span className="text-sm text-[#030607]/60">{format(t.total, { count: pagination.total })}</span>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
          className="flex items-center gap-1 text-sm"
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.5} />
          {t.filter}
        </button>
      </div>

      {showFilters && (
        <div className="bg-[#fffef5] px-6 pt-6 md:px-10">
          <CatalogFilterPanel
            basePath={QUICK_HAMPERS_PATH}
            filters={filters}
            query={query}
            clearLabel={t.clearFilters}
          />
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 bg-[#fffef5] px-6 pb-10 pt-10 md:grid-cols-3 md:px-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.href} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-[#fffef5] px-6 pb-10 pt-10 md:px-10">
          <div className="flex flex-col items-center gap-5 rounded-md bg-neutral-100 p-6 text-center">
            <div className="flex flex-col gap-2">
              <p className="font-bold">{t.empty.title}</p>
              <p>{t.empty.description}</p>
            </div>
            <Link
              href={clearHref}
              className="rounded-full bg-bistre px-6 py-2.5 text-white transition-opacity hover:opacity-90"
            >
              {t.clearFilters}
            </Link>
          </div>
        </div>
      )}

      <CatalogPagination basePath={QUICK_HAMPERS_PATH} query={query} pagination={pagination} />
    </div>
  );
}
