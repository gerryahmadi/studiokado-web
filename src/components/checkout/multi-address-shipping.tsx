"use client";

import { AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/client";
import { format, plural } from "@/i18n/format";
import type { CartItem } from "@/lib/cart-actions";
import type { ShippingRate } from "@/lib/checkout-actions";
import { formatRupiah } from "@/lib/home-data";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-data";
import { AddressFields, Field, inputClass, ShippingRateOptions } from "./checkout-ui";
import { useShippingDestination } from "./use-shipping-destination";

// recipient id -> cart item id -> units sent to that recipient
type Allocation = Record<number, Record<number, number>>;

const unitsOf = (alloc: Record<number, number> | undefined) =>
  Object.values(alloc ?? {}).reduce((sum, qty) => sum + qty, 0);

// Split the cart's units between recipients. Every unit must land at exactly one address,
// and every address must get at least one unit.
export function useMultiShipment(items: CartItem[]) {
  const t = useI18n().t.checkout.multi;
  const [recipients, setRecipients] = useState<number[]>([1]);
  // Everything starts with the first recipient; new recipients start empty.
  const [allocation, setAllocation] = useState<Allocation>(() => ({
    1: Object.fromEntries(items.map((i) => [i.id, i.quantity])),
  }));
  const [rates, setRates] = useState<Record<number, ShippingRate | null>>({});

  const assigned = (itemId: number) => recipients.reduce((sum, r) => sum + (allocation[r]?.[itemId] ?? 0), 0);
  const left = (item: CartItem) => item.quantity - assigned(item.id);

  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const assignedUnits = recipients.reduce((sum, r) => sum + unitsOf(allocation[r]), 0);
  const unassigned = items.filter((i) => left(i) > 0);
  const emptyIndexes = recipients.flatMap((r, i) => (unitsOf(allocation[r]) === 0 ? [i + 1] : []));

  const add = () => setRecipients((rs) => [...rs, Math.max(...rs) + 1]);

  // A removed recipient's items go back to the first remaining recipient.
  const remove = (id: number) => {
    const rest = recipients.filter((r) => r !== id);
    const target = rest[0];
    setRecipients(rest);
    setAllocation(({ [id]: removed, ...others }) => {
      const merged = { ...others[target] };
      for (const [itemId, qty] of Object.entries(removed ?? {})) merged[+itemId] = (merged[+itemId] ?? 0) + qty;
      return { ...others, [target]: merged };
    });
    setRates((rs) => {
      const next = { ...rs };
      delete next[id];
      return next;
    });
  };

  // Raising a recipient's quantity takes unassigned units first, then moves units away from the
  // other recipients (latest address first), so a new address can be filled with "+" alone.
  // Lowering it leaves the units unassigned.
  const setQuantity = (recipient: number, itemId: number, qty: number) =>
    setAllocation((a) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return a;
      const next: Allocation = { ...a, [recipient]: { ...a[recipient], [itemId]: qty } };
      const held = recipients.reduce((sum, r) => sum + (next[r]?.[itemId] ?? 0), 0);
      let excess = held - item.quantity;
      for (const r of [...recipients].reverse()) {
        if (excess <= 0) break;
        if (r === recipient) continue;
        const take = Math.min(excess, next[r]?.[itemId] ?? 0);
        if (take > 0) {
          next[r] = { ...next[r], [itemId]: next[r][itemId] - take };
          excess -= take;
        }
      }
      return next;
    });

  // Positions (1-based) of the other recipients currently holding units of an item.
  const heldElsewhere = (recipient: number, itemId: number) =>
    recipients.flatMap((r, i) => (r !== recipient && (allocation[r]?.[itemId] ?? 0) > 0 ? [i + 1] : []));

  const setRate = useCallback(
    (recipient: number, rate: ShippingRate | null) => setRates((rs) => ({ ...rs, [recipient]: rate })),
    [],
  );

  const problem =
    unassigned.length > 0
      ? format(t.problemUnassigned, { count: totalUnits - assignedUnits })
      : emptyIndexes.length > 0
        ? format(t.problemEmpty, { list: emptyIndexes.join(", ") })
        : null;

  return {
    items,
    recipients,
    allocation,
    rates,
    totalUnits,
    assignedUnits,
    unassigned,
    left,
    heldElsewhere,
    problem,
    shippingTotal: recipients.reduce((sum, r) => sum + (rates[r]?.price ?? 0), 0),
    canAdd: recipients.length < totalUnits,
    add,
    remove,
    setQuantity,
    setRate,
  };
}

export type MultiShipment = ReturnType<typeof useMultiShipment>;

function RecipientCard({
  id,
  index,
  shipment,
  showErrors,
}: {
  id: number;
  index: number;
  shipment: MultiShipment;
  showErrors: boolean;
}) {
  const t = useI18n().t.checkout.multi;
  const { setRate } = shipment;
  const mine = shipment.allocation[id] ?? {};
  // Each address is priced on the units it receives.
  const dest = useShippingDestination((rate) => setRate(id, rate), mine);
  const field = (name: string) => `shipments[${index}][${name}]`;
  const idPrefix = `recipient-${id}`;
  const units = unitsOf(mine);
  // Every item is listed: "+" takes an unassigned unit or moves one over from another address.
  const items = shipment.items;

  return (
    <section aria-labelledby={`${idPrefix}-title`} className="flex flex-col gap-5 rounded border border-black/10 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-bistre text-xs text-white">
          {index + 1}
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <h3 id={`${idPrefix}-title`} className="text-sm font-medium">
            {format(t.recipient, { n: index + 1 })}
          </h3>
          <p className="text-xs text-neutral-500">
            {plural(t.items, units)}
            {dest.rate ? ` · ${dest.rate.name} · ${formatRupiah(dest.rate.price)}` : ""}
          </p>
        </div>
        {shipment.recipients.length > 1 && (
          <button
            type="button"
            onClick={() => shipment.remove(id)}
            className="flex items-center gap-1.5 text-sm text-[#b10000] underline-offset-4 hover:underline"
          >
            <Trash2 className="size-4" />
            {t.remove}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Field label={t.name} id={`${idPrefix}-name`}>
          <Input id={`${idPrefix}-name`} name={field("name")} required maxLength={100} className={inputClass} />
        </Field>
        <Field label={t.phone} id={`${idPrefix}-phone`}>
          <Input
            id={`${idPrefix}-phone`}
            name={field("phone")}
            type="tel"
            required
            maxLength={20}
            className={inputClass}
          />
        </Field>
      </div>

      <AddressFields dest={dest} idPrefix={idPrefix} name={field} />

      <div className="flex flex-col gap-2.5">
        <p className="text-sm">{t.itemsFor}</p>
        {units === 0 && shipment.recipients.length > 1 && (
          <p className="text-xs text-neutral-500">{t.moveHint}</p>
        )}
        <ul className="divide-y divide-black/5 rounded border border-black/5 bg-neutral-50/60">
          {items.map((item) => {
            const qty = mine[item.id] ?? 0;
            const remaining = shipment.left(item);
            const elsewhere = shipment.heldElsewhere(id, item.id);
            const elsewhereUnits = item.quantity - qty - remaining;
            return (
              <li key={item.id} className={`flex items-center gap-3 px-3 py-2.5 ${qty === 0 ? "opacity-60" : ""}`}>
                <div className="relative h-[60px] w-12 shrink-0">
                  <Image
                    src={item.image ?? PRODUCT_PLACEHOLDER_IMAGE}
                    alt=""
                    fill
                    sizes="48px"
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
                  <p className="truncate">{item.name}</p>
                  {item.to && <p className="truncate text-xs text-neutral-500">{format(t.to, { name: item.to })}</p>}
                  <p className="text-xs text-neutral-500">
                    {formatRupiah(item.price)}
                    {remaining > 0 && <span className="text-amber-700"> · {format(t.notAssigned, { count: remaining })}</span>}
                    {elsewhereUnits > 0 && elsewhere.length > 0 && (
                      <span> · {format(t.atRecipient, { count: elsewhereUnits, list: elsewhere.join(", ") })}</span>
                    )}
                  </p>
                </div>
                <QuantityStepper
                  value={qty}
                  min={0}
                  max={item.quantity}
                  label={item.to ? `${item.name} (${item.to})` : item.name}
                  onChange={(next) => shipment.setQuantity(id, item.id, next)}
                />
                <input type="hidden" name={`${field("items")}[${item.id}]`} value={qty} />
              </li>
            );
          })}
        </ul>
        {showErrors && units === 0 && (
          <p className="text-xs text-[#b10000]">{t.addOrRemove}</p>
        )}
      </div>

      <Field label={t.notes} id={`${idPrefix}-notes`}>
        <Textarea
          id={`${idPrefix}-notes`}
          name={field("notes")}
          rows={2}
          maxLength={500}
          placeholder={t.notesPlaceholder}
          className="bg-white"
        />
      </Field>

      <div className="flex flex-col gap-2.5">
        <p className="text-sm">{t.method}</p>
        <ShippingRateOptions
          dest={dest}
          radioName={field("rate")}
          companyName={field("courier_company")}
          typeName={field("courier_type")}
        />
      </div>
    </section>
  );
}

export function MultiAddressShipping({ shipment, showErrors }: { shipment: MultiShipment; showErrors: boolean }) {
  const t = useI18n().t.checkout.multi;
  const complete = shipment.unassigned.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {shipment.recipients.map((id, index) => (
        <RecipientCard key={id} id={id} index={index} shipment={shipment} showErrors={showErrors} />
      ))}

      {shipment.canAdd && (
        <button
          type="button"
          onClick={shipment.add}
          className="flex items-center justify-center gap-2 rounded border border-dashed border-bistre/40 py-3.5 text-sm transition-colors hover:bg-bistre/5"
        >
          <Plus className="size-4" />
          {t.add}
        </button>
      )}

      <div
        aria-live="polite"
        className={`flex items-start gap-3 rounded px-4 py-3 text-sm ${
          complete ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
        }`}
      >
        {complete ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
        <div className="flex flex-col gap-1">
          <p>
            {plural(t.assigned, shipment.recipients.length, {
              assigned: shipment.assignedUnits,
              total: shipment.totalUnits,
            })}
          </p>
          {!complete && (
            <p className="text-xs">
              {format(t.notAssignedYet, {
                items: shipment.unassigned.map((i) => `${i.name} ×${shipment.left(i)}`).join(", "),
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
