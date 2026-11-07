"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import type { ShopFilter, ShopQuery } from "@/lib/shop-data";

// Filter chips and page links shared by Quick Hampers and the Create Hampers items step.
// Filtering and paging happen in Laravel; every control is a link that changes the query string.
// Changing a filter resets to page 1, like the Laravel filter form.
export const catalogHref = (basePath: string, query: ShopQuery, changes: ShopQuery) => {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, page: undefined, ...changes })) {
    if (value) next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

export function CatalogFilterPanel({
  basePath,
  filters,
  query,
  clearLabel,
}: {
  basePath: string;
  filters: ShopFilter[];
  query: ShopQuery;
  clearLabel: string;
}) {
  const active = filters.some((f) => query[f.name as keyof ShopQuery]);
  const clearHref = query.search ? catalogHref(basePath, {}, { search: query.search }) : basePath;

  return (
    <div className="flex flex-col gap-5">
      {filters.map((filter) => {
        const selected = query[filter.name as keyof ShopQuery];
        return (
          <div key={filter.name} className="flex flex-col gap-2">
            <span className="text-sm font-bold">{filter.title}</span>
            <div className="flex flex-wrap gap-2">
              {filter.items.map((item) => {
                const on = selected === item.value;
                return (
                  <Link
                    key={item.value}
                    href={catalogHref(basePath, query, { [filter.name]: on ? undefined : item.value })}
                    scroll={false}
                    aria-current={on ? "true" : undefined}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      on ? "border-bistre bg-bistre text-white" : "border-bistre/30 bg-white hover:border-bistre"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      {active && (
        <Link href={clearHref} scroll={false} className="self-start text-sm underline underline-offset-4">
          {clearLabel}
        </Link>
      )}
    </div>
  );
}

export function CatalogPagination({
  basePath,
  query,
  pagination,
}: {
  basePath: string;
  query: ShopQuery;
  pagination: { current_page: number; last_page: number };
}) {
  const { t } = useI18n();
  if (pagination.last_page <= 1) return null;
  return (
    <nav aria-label={t.shop.pagination} className="flex flex-wrap justify-center gap-2 px-6">
      {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((n) => {
        const current = n === pagination.current_page;
        return (
          <Link
            key={n}
            href={catalogHref(basePath, query, { page: n === 1 ? undefined : String(n) })}
            aria-current={current ? "page" : undefined}
            className={`flex size-9 items-center justify-center rounded-full text-sm ${
              current ? "bg-bistre text-white" : "border border-bistre/30 bg-white hover:border-bistre"
            }`}
          >
            {n}
          </Link>
        );
      })}
    </nav>
  );
}
