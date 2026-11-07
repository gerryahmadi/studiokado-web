import Image from "next/image";
import Link from "next/link";
import type { AccountOrders, OrderGroup } from "@/lib/account";
import { formatAccountDate, orderTabs } from "@/lib/account-data";
import { formatRupiah } from "@/lib/home-data";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-data";
import type { OrderShipmentSummary } from "@/lib/tracking";

const rp = (n: number) => formatRupiah(n).replace("Rp", "Rp ");

const statusLabel: Record<string, string> = {
  unpaid: "Waiting for Payment",
  paid: "Paid",
  confirmed: "Confirmed",
  on_delivery: "On Delivery",
  completed: "Completed",
  declined: "Declined",
  payment_expired: "Payment Expired",
  cancelled: "Cancelled",
};

const href = (group?: OrderGroup, page?: number) => {
  const qs = new URLSearchParams();
  if (group) qs.set("status", group);
  if (page && page > 1) qs.set("page", String(page));
  return `/my-account/orders${qs.size ? `?${qs}` : ""}`;
};

// Status tabs and paging are links: Laravel filters (GET /api/account/orders?status=).
// `shipments`: orders sent to several addresses (their courier column lists every address's courier).
export function OrdersList({
  orders,
  pagination,
  group,
  shipments = {},
}: AccountOrders & { group?: OrderGroup; shipments?: OrderShipmentSummary }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm">Status</span>
        <nav aria-label="Order status" className="flex flex-wrap gap-2">
          {orderTabs.map((t) => {
            const active = t.group === group;
            return (
              <Link
                key={t.label}
                href={href(t.group)}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active ? "border-bistre bg-bistre text-white" : "border-bistre/30 hover:border-bistre"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-10 text-center text-sm">
          <p>{group ? "No orders in this status." : "You haven't placed any orders yet."}</p>
          {!group && (
            <Link href="/quick-hampers" className="rounded-full bg-bistre px-6 py-2.5 text-white hover:opacity-90">
              Start Shopping
            </Link>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-4">
        {orders.map((o) => (
          <li key={o.uuid} className="flex flex-col gap-4 rounded-xl border border-ivory p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                Order <span className="font-medium">#{o.invoice ?? o.uuid.slice(0, 8)}</span>
                <span className="ml-3 text-sm text-neutral-600">
                  {o.paid_at ? `Paid on ${formatAccountDate(o.paid_at)}` : `Ordered on ${formatAccountDate(o.created_at)}`}
                </span>
                <span className="ml-3 rounded-full bg-ivory px-3 py-0.5 text-xs">{statusLabel[o.status] ?? o.status}</span>
              </p>
              <div className="flex gap-2">
                {o.payment_url ? (
                  <a
                    href={o.payment_url}
                    className="rounded-full bg-bistre px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    Pay Now
                  </a>
                ) : o.group === "on-going" ? (
                  <Link
                    href={o.invoice ? `/tracking-order/submitted?order=${encodeURIComponent(o.invoice)}` : "/tracking-order"}
                    className="rounded-full bg-bistre px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    Track Order
                  </Link>
                ) : (
                  <Link
                    href="/quick-hampers"
                    className="rounded-full bg-bistre px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    Re-Purchase
                  </Link>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative size-24 shrink-0">
                <Image
                  src={o.image ?? PRODUCT_PLACEHOLDER_IMAGE}
                  alt=""
                  fill
                  sizes="96px"
                  className="rounded object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 text-sm">
                {o.items.map((item, i) => (
                  <p key={i}>
                    {item.name} <span className="text-neutral-500">x{item.quantity}</span>
                  </p>
                ))}
                {o.more_items > 0 && <p className="text-neutral-500">+{o.more_items} more items</p>}
              </div>
              <div className="flex flex-col gap-1 text-right text-sm">
                <p className="text-neutral-600">Total Belanja</p>
                <p className="font-medium">{rp(o.total)}</p>
                {shipments[o.uuid] ? (
                  <>
                    <p className="text-neutral-600">Ship to :</p>
                    <p>{shipments[o.uuid].addresses} addresses</p>
                    <p className="text-neutral-600">{shipments[o.uuid].couriers.join(", ")}</p>
                  </>
                ) : (
                  o.courier && (
                    <>
                      <p className="text-neutral-600">Courier :</p>
                      <p>{o.courier}</p>
                    </>
                  )
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {pagination.last_page > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((n) => {
            const current = n === pagination.current_page;
            return (
              <Link
                key={n}
                href={href(group, n)}
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
  );
}
