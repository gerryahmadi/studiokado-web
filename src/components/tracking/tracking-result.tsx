import { CheckCircle2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { format } from "@/i18n/format";
import type { Dictionary } from "@/i18n/messages/en";
import type { OrderTracking, TrackingShipment } from "@/lib/tracking";

type T = Dictionary["tracking"];
type TimelineEvent = { key: string; at: string | null; title: string; description: string };

const statusStyle: Record<TrackingShipment["status"], string> = {
  waiting: "bg-neutral-100 text-neutral-700",
  on_delivery: "bg-amber-50 text-amber-900",
  delivered: "bg-emerald-50 text-emerald-900",
};

// "dropping_off" -> "Dropping off" (Biteship status codes).
const humanize = (code: string) => code.charAt(0).toUpperCase() + code.slice(1).replace(/_/g, " ");

// Courier history (newest first) followed by the order's own milestones.
function timeline(order: OrderTracking, shipment: TrackingShipment, t: T): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  if (shipment.delivered_at && !shipment.history.some((h) => h.status === "delivered")) {
    events.push({ key: "delivered", at: shipment.delivered_at, ...t.events.delivered });
  }
  shipment.history.forEach((h, i) =>
    events.push({ key: `h${i}`, at: h.at, title: h.status ? humanize(h.status) : "", description: h.note ?? "" }),
  );
  if (shipment.picked_up_at && shipment.history.length === 0) {
    events.push({
      key: "onDelivery",
      at: shipment.picked_up_at,
      title: t.events.onDelivery.title,
      description: format(t.events.onDelivery.description, { courier: shipment.courier ?? "" }),
    });
  }
  if (order.paid_at) events.push({ key: "processed", at: order.paid_at, ...t.events.processed });
  if (order.ordered_at) events.push({ key: "orderPlaced", at: order.ordered_at, ...t.events.orderPlaced });
  return events;
}

function Shipment({
  order,
  shipment,
  t,
  formatDate,
}: {
  order: OrderTracking;
  shipment: TrackingShipment;
  t: T;
  formatDate: (iso: string) => string;
}) {
  const events = timeline(order, shipment, t);

  return (
    <div className="flex flex-col gap-8 border-t border-[#e9e1d3] pt-10 lg:flex-row lg:gap-[90px]">
      <div className="flex flex-1 flex-col gap-5 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {order.multiple && (
            <h3 className="font-heading text-2xl">{format(t.result.recipient, { position: shipment.position })}</h3>
          )}
          <span className={`rounded-full px-3 py-0.5 text-xs ${statusStyle[shipment.status]}`}>
            {t.result.status[shipment.status]}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p>{t.result.shipTo}</p>
          <address className="flex flex-col gap-1 not-italic">
            {shipment.name && <span className="font-semibold">{shipment.name}</span>}
            {shipment.address && <span>{shipment.address}</span>}
            {shipment.phone && <span>{shipment.phone}</span>}
          </address>
        </div>
        {shipment.courier && (
          <div className="flex flex-col gap-1">
            <p className="text-neutral-600">{t.result.courier}</p>
            <p>{shipment.courier}</p>
            {shipment.tracking_number && (
              <p>{format(t.result.trackingNumber, { number: shipment.tracking_number })}</p>
            )}
          </div>
        )}
        {shipment.items.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-neutral-600">{t.result.items}</p>
            <ul className="flex flex-col gap-0.5">
              {shipment.items.map((item, i) => (
                <li key={i}>
                  {item.name} <span className="text-neutral-500">×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex max-w-[1200px] flex-1 flex-col gap-6">
        <h4 className="font-heading text-2xl">{t.result.deliveryStatus}</h4>
        {shipment.status !== "delivered" && shipment.history.length === 0 && (
          <p className="text-sm text-neutral-600">{t.result.awaitingPickup}</p>
        )}
        <ol className="flex flex-col">
          {events.map((e, i) => {
            const last = i === events.length - 1;
            return (
              <li key={e.key} className="relative flex gap-3 pb-9">
                <time dateTime={e.at ?? undefined} className="w-[127px] shrink-0 text-sm font-medium">
                  {e.at ? formatDate(e.at) : ""}
                </time>
                <span className="relative flex w-11 shrink-0 justify-center">
                  {i === 0 ? (
                    <span className="mt-1 size-[11px] rounded-full bg-[#690000]" aria-hidden />
                  ) : (
                    <CheckCircle2 className="size-6 text-[#d6d6d6]" strokeWidth={1.5} aria-hidden />
                  )}
                  {!last && <span aria-hidden className="absolute left-1/2 top-7 h-[calc(100%+8px)] w-px bg-[#d6d6d6]" />}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-extrabold">{e.title}</p>
                  <p className="text-sm">{e.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// One section per recipient: a single-address order has one; a multiple-address order has one per address.
export function TrackingResult({ order, t, locale }: { order: OrderTracking; t: T; locale: Locale }) {
  const dateFormat = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  const formatDate = (iso: string) => dateFormat.format(new Date(iso));

  return (
    <section className="mx-auto flex w-[90%] flex-col gap-10 border-t-2 border-[#e9e1d3] px-4 py-20 lg:px-20">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-3xl">{t.result.orderInformation}</h2>
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold">{format(t.result.orderNumber, { number: order.invoice })}</p>
          {order.customer.name && <p>{order.customer.name}</p>}
        </div>
        {order.multiple && (
          <p className="max-w-2xl rounded bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {format(t.result.multiple, { count: order.shipments.length })}
          </p>
        )}
      </div>

      {order.shipments.map((shipment) => (
        <Shipment key={shipment.position} order={order} shipment={shipment} t={t} formatDate={formatDate} />
      ))}
    </section>
  );
}
