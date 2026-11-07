import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { SiteShell } from "@/components/layout/site-shell";
import { getQuotationRequests, requireAccount } from "@/lib/account";
import { formatAccountDate } from "@/lib/account-data";
import { formatRupiah } from "@/lib/home-data";

export const metadata: Metadata = { title: "Quotation Request | Studiokado" };

const rp = (n: number) => formatRupiah(n).replace("Rp", "Rp ");

// Requests sent from /corporate-merchandise/quotation while signed in. Each row expands to its items.
export default async function AccountQuotationPage() {
  await requireAccount("/my-account/quotation-request");
  const quotations = await getQuotationRequests();

  return (
    <SiteShell>
      <AccountShell active="quotation">
        {quotations.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center text-sm">
            <p>You haven&apos;t requested a quotation yet.</p>
            <Link href="/corporate-merchandise" className="rounded-full bg-bistre px-6 py-2.5 text-white hover:opacity-90">
              Browse Merchandise
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <div className="min-w-[560px] text-sm">
              <div className="grid grid-cols-[8%_1fr_1fr_1fr_20%] bg-[#e3e3e3]">
                <span className="px-5 py-3">No.</span>
                <span className="px-3 py-3">Submitted On</span>
                <span className="px-3 py-3">Estimated Total</span>
                <span className="px-3 py-3">Items</span>
                <span className="px-3 py-3 text-center">Action</span>
              </div>
              {quotations.map((q, i) => (
                <details key={q.id} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}>
                  <summary className="grid cursor-pointer list-none grid-cols-[8%_1fr_1fr_1fr_20%] items-center [&::-webkit-details-marker]:hidden">
                    <span className="px-5 py-4">{i + 1}.</span>
                    <span className="px-3 py-4">{formatAccountDate(q.submitted_at)}</span>
                    <span className="px-3 py-4">{rp(q.estimated_total)}</span>
                    <span className="px-3 py-4">{q.item_count}</span>
                    <span className="flex justify-center px-3 py-4" aria-label={`Show items of request ${i + 1}`}>
                      <ChevronDown className="size-5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
                    </span>
                  </summary>
                  <div className="flex flex-col gap-2 px-5 pb-5">
                    <p className="text-neutral-600">
                      {q.company_name}
                      {q.request_date && ` · Needed by ${formatAccountDate(q.request_date)}`}
                    </p>
                    <ul className="flex flex-col divide-y divide-black/5">
                      {q.items.map((item, n) => (
                        <li key={n} className="flex justify-between gap-4 py-2">
                          <span>
                            {item.name}
                            {item.color && item.color !== "-" && ` – ${item.color}`}
                            {item.size && item.size !== "-" && ` (${item.size})`}
                          </span>
                          <span className="shrink-0">
                            {item.quantity} Pcs{item.unit_price !== null && ` × ${rp(item.unit_price)}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {q.note && <p className="whitespace-pre-line">Notes: {q.note}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </AccountShell>
    </SiteShell>
  );
}
