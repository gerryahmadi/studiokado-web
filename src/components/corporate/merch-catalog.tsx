import { Search, Tag } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { MERCH_PATH, merchandiseCatalog, type MerchCatalogResponse, type MerchQuery } from "@/lib/merch-data";
import { MerchCard } from "./merch-card";

// Category, search and paging are links/GET forms: Laravel filters (GET /api/merchandise/catalog).
const hrefWith = (query: MerchQuery, changes: MerchQuery) => {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, page: undefined, ...changes })) {
    if (value) next.set(key, value);
  }
  return next.size ? `${MERCH_PATH}?${next}` : MERCH_PATH;
};

const itemClass = (on: boolean) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-1 text-left text-base ${on ? "bg-[#f3e7b3]" : "hover:bg-[#f3e7b3]/50"}`;

export function MerchCatalog({ categories, products, pagination, query }: MerchCatalogResponse & { query: MerchQuery }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-10">
      <aside className="flex shrink-0 flex-col gap-4 md:border-r md:border-ivory md:pr-10">
        <p>Category</p>
        <ul className="flex w-full flex-col gap-3 md:w-[190px]">
          <li>
            <Link href={hrefWith(query, { category: undefined })} aria-current={!query.category ? "page" : undefined} className={itemClass(!query.category)}>
              <Tag className="size-4 text-[#4a3224]" strokeWidth={1.5} />
              All Products
            </Link>
          </li>
          {categories.map((c) => {
            const on = query.category === String(c.id);
            return (
              <li key={c.id}>
                <Link
                  href={hrefWith(query, { category: String(c.id) })}
                  aria-current={on ? "page" : undefined}
                  className={itemClass(on)}
                >
                  <Tag className="size-4 text-aloeswood" strokeWidth={1.5} />
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <p className="w-[71%]">{merchandiseCatalog.hint}</p>
          <form action={MERCH_PATH} className="relative">
            {query.category && <input type="hidden" name="category" value={query.category} />}
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <Input
              name="keyword"
              defaultValue={query.keyword}
              aria-label="Search products"
              placeholder="Search"
              className="h-10 w-44 bg-white pl-9"
            />
          </form>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-md bg-neutral-100 p-6 text-center">
            <p className="font-bold">No products found</p>
            <Link href={MERCH_PATH} className="rounded-full bg-bistre px-6 py-2.5 text-white hover:opacity-90">
              Show all products
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-[52px] pb-8 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <MerchCard product={p} />
              </li>
            ))}
          </ul>
        )}

        {pagination.last_page > 1 && (
          <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((n) => {
              const current = n === pagination.current_page;
              return (
                <Link
                  key={n}
                  href={hrefWith(query, { page: n === 1 ? undefined : String(n) })}
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
        )}
      </div>
    </div>
  );
}
