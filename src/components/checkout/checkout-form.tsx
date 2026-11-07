"use client";

import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { VoucherBox } from "@/components/shared/voucher-box";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/client";
import { format, plural } from "@/i18n/format";
import type { Cart } from "@/lib/cart-actions";
import { paymentMethods } from "@/lib/cart-data";
import { placeOrder, type PlaceOrderState } from "@/lib/checkout-actions";
import { formatRupiah } from "@/lib/home-data";
import { IdrChargeNote } from "@/components/price";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-data";
import { AddressFields, Card, Field, inputClass, ShippingRateOptions, Toggle } from "./checkout-ui";
import { MultiAddressShipping, useMultiShipment } from "./multi-address-shipping";
import { useShippingDestination } from "./use-shipping-destination";

// The voucher box (its own <form>) sits outside this form; aside inputs join it through form="...".
const FORM_ID = "checkout-form";

export type ShipMode = "single" | "multiple";

const SINGLE_NAMES = {
  address: "shipping_address",
  area: "shipping_area",
  postal_code: "postal_code",
  lat: "lat",
  lng: "lng",
} as const;

function ShipModeOption({
  checked,
  disabled,
  onSelect,
  icon,
  title,
  description,
}: {
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex flex-1 items-start gap-3 rounded border px-4 py-3 transition-colors ${
        checked ? "border-bistre bg-bistre/5" : "border-black/10"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="radio"
        name="ship_mode_choice"
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="mt-1 accent-bistre"
      />
      <span className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm">
          {icon}
          {title}
        </span>
        <span className="text-xs text-neutral-500">{description}</span>
      </span>
    </label>
  );
}

export function CheckoutForm({ cart, initialMode = "single" }: { cart: Cart; initialMode?: ShipMode }) {
  const t = useI18n().t.checkout;
  const [state, formAction, pending] = useActionState<PlaceOrderState, FormData>(placeOrder, { status: "idle" });
  const errors = state.status === "error" ? (state.errors ?? {}) : {};
  const err = (name: string) => errors[name]?.[0];

  const products = cart.items.filter((i) => i.type !== "design");
  const shipment = useMultiShipment(products);
  // Splitting needs at least two units; a custom hamper (packaging + its items) ships as one box.
  const isCustomHamper = products.some((i) => i.type === "packaging");
  const canSplit = shipment.totalUnits > 1 && !isCustomHamper;
  const [mode, setMode] = useState<ShipMode>(canSplit ? initialMode : "single");
  const multiple = mode === "multiple";
  // Client-side allocation check on submit (each unit at one address, no empty address).
  const [splitError, setSplitError] = useState<string | null>(null);

  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [method, setMethod] = useState<(typeof paymentMethods)[number]["id"]>(paymentMethods[0].id);
  const single = useShippingDestination();

  const shipping = multiple ? shipment.shippingTotal : (single.rate?.price ?? 0);
  const shippingReady = multiple ? shipment.recipients.every((r) => shipment.rates[r]) : !!single.rate;
  const total = cart.total + shipping;
  // Recipient fields aren't highlighted one by one, so their first server error is spelled out.
  const shipmentError = Object.entries(errors).find(([key]) => key.startsWith("shipments"));
  const recipientNo = shipmentError?.[0].match(/^shipments\.(\d+)/)?.[1];
  const formError =
    splitError ??
    (state.status !== "error"
      ? null
      : shipmentError
        ? recipientNo !== undefined
          ? format(t.errors.recipient, { n: +recipientNo + 1, message: shipmentError[1][0] })
          : shipmentError[1][0]
        : Object.keys(errors).length > 0
          ? t.errors.checkFields
          : state.message);

  return (
    <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-5 lg:flex-row lg:items-start">
      <form
        id={FORM_ID}
        action={formAction}
        onSubmit={(e) => {
          if (multiple && shipment.problem) {
            e.preventDefault();
            setSplitError(shipment.problem);
          } else {
            setSplitError(null);
          }
        }}
        className="flex flex-col gap-5 lg:w-[68%]"
      >
        <Card title={t.shippingDate.title}>
          <Field label={t.shippingDate.label} id="delivery-date" error={err("delivery_date")}>
            <Input
              id="delivery-date"
              type="date"
              name="delivery_date"
              min={cart.min_delivery_date}
              required
              className={`${inputClass} max-w-xs`}
            />
          </Field>
        </Card>

        <Card
          title={t.billing.title}
          aside={
            <Link href="/login" className="text-sm font-medium underline-offset-4 hover:underline">
              {t.billing.signIn}
            </Link>
          }
        >
          <Field label={t.billing.name} id="billing-name" error={err("billing_name")}>
            <Input
              id="billing-name"
              name="billing_name"
              autoComplete="name"
              required
              maxLength={100}
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label={t.billing.email} id="billing-email" error={err("billing_email")}>
              <Input
                id="billing-email"
                name="billing_email"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                className={inputClass}
              />
            </Field>
            <Field label={t.billing.phone} id="billing-phone" error={err("billing_phone")}>
              <Input
                id="billing-phone"
                name="billing_phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={20}
                value={billingPhone}
                onChange={(e) => setBillingPhone(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input type="checkbox" name="newsletter" className="size-[18px] accent-bistre" />
            {t.billing.newsletter}
          </label>
        </Card>

        <Card title={multiple ? t.shipping.titleMultiple : t.shipping.title}>
          <div role="radiogroup" aria-label={t.shipping.shipTo} className="flex flex-col gap-3 sm:flex-row">
            <ShipModeOption
              checked={!multiple}
              onSelect={() => {
                setMode("single");
                setSplitError(null);
              }}
              icon={<MapPin className="size-4" />}
              title={t.shipping.one.title}
              description={t.shipping.one.description}
            />
            <ShipModeOption
              checked={multiple}
              disabled={!canSplit}
              onSelect={() => setMode("multiple")}
              icon={<Users className="size-4" />}
              title={t.shipping.multiple.title}
              description={
                canSplit
                  ? t.shipping.multiple.description
                  : isCustomHamper
                    ? t.shipping.multiple.customHamper
                    : t.shipping.multiple.needsTwo
              }
            />
          </div>
          <input type="hidden" name="ship_mode" value={mode} />

          {multiple ? (
            <MultiAddressShipping shipment={shipment} showErrors={!!splitError} />
          ) : (
            <>
              <Toggle checked={sameAsBilling} onChange={setSameAsBilling} label={t.shipping.sameAsBilling} />
              {sameAsBilling ? (
                <>
                  <input type="hidden" name="shipping_name" value={billingName} />
                  <input type="hidden" name="shipping_phone" value={billingPhone} />
                  {(err("shipping_name") || err("shipping_phone")) && (
                    <p className="text-xs text-[#b10000]">{err("shipping_name") ?? err("shipping_phone")}</p>
                  )}
                </>
              ) : (
                <>
                  <Field label={t.shipping.name} id="ship-name" error={err("shipping_name")}>
                    <Input id="ship-name" name="shipping_name" required maxLength={100} className={inputClass} />
                  </Field>
                  <Field label={t.shipping.phone} id="ship-phone" error={err("shipping_phone")}>
                    <Input
                      id="ship-phone"
                      name="shipping_phone"
                      type="tel"
                      required
                      maxLength={20}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}
              <AddressFields
                dest={single}
                idPrefix="ship"
                name={(f) => SINGLE_NAMES[f]}
                errors={{ address: err("shipping_address") ?? err("lat"), postal_code: err("postal_code") }}
              />
              <Field label={t.shipping.notes} id="ship-notes" error={err("notes")}>
                <Textarea id="ship-notes" name="notes" rows={3} maxLength={500} className="bg-white" />
              </Field>
            </>
          )}
        </Card>

        {!multiple && (
          <Card title={t.method.title}>
            <ShippingRateOptions
              dest={single}
              radioName="shipping_rate"
              companyName="courier_company"
              typeName="courier_type"
              error={err("courier_company") && t.method.choose}
            />
          </Card>
        )}

        <Card title={t.products.title}>
          {products.map((l) => (
            <div key={l.id} className="flex flex-col gap-3">
              <div className="flex gap-5">
                <div className="relative h-[150px] w-[122px] shrink-0">
                  <Image
                    src={l.image ?? PRODUCT_PLACEHOLDER_IMAGE}
                    alt={l.name}
                    fill
                    sizes="122px"
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 pt-2.5 text-sm font-medium">
                  <p>{l.name}</p>
                  <p>{formatRupiah(l.price)}</p>
                  <p>{format(t.products.pcs, { count: l.quantity })}</p>
                </div>
                <p className="w-[140px] pt-2.5 text-center text-sm">{formatRupiah(l.price * l.quantity)}</p>
              </div>
              {l.message && (
                <p className="rounded bg-black/[0.01] px-3 py-2 text-sm text-neutral-600">{format(t.products.message, { message: l.message })}</p>
              )}
            </div>
          ))}
          <Link href="/cart" className="w-fit text-sm underline-offset-4 hover:underline">
            {t.products.editCart}
          </Link>
        </Card>
      </form>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-[100px] lg:flex-1">
        <VoucherBox />
        <section className="flex flex-col gap-5 rounded bg-white px-5 py-6">
          <h2 className="text-sm">{t.payment.title}</h2>
          <div role="radiogroup" aria-label={t.payment.title} className="flex flex-col gap-3">
            {paymentMethods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded border px-4 py-3 text-sm transition-colors ${
                  method === m.id ? "border-bistre bg-bistre/5" : "border-black/10"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  form={FORM_ID}
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-bistre"
                />
                {t.payment.methods[m.key]}
              </label>
            ))}
          </div>
          <dl className="flex flex-col gap-3 border-t border-black/5 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>{t.payment.subtotal}</dt>
              <dd>{formatRupiah(cart.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>
                {t.payment.shipping}
                {multiple && (
                  <span className="text-neutral-500">
                    {" "}
                    ({plural(t.payment.addresses, shipment.recipients.length)})
                  </span>
                )}
              </dt>
              <dd>{shippingReady || shipping > 0 ? formatRupiah(shipping) : "–"}</dd>
            </div>
            {multiple && shipment.recipients.length > 1 && (
              <div className="flex flex-col gap-1.5 border-l-2 border-black/5 pl-3 text-xs text-neutral-500">
                {shipment.recipients.map((r, i) => (
                  <div key={r} className="flex justify-between">
                    <dt>{format(t.payment.recipient, { n: i + 1 })}</dt>
                    <dd>{shipment.rates[r] ? formatRupiah(shipment.rates[r].price) : "–"}</dd>
                  </div>
                ))}
              </div>
            )}
          </dl>
          <div className="flex items-center justify-between border-t border-black/5 pt-4">
            <span>{t.payment.total}</span>
            <span className="font-medium">{formatRupiah(total)}</span>
          </div>
          <IdrChargeNote value={total} mode="estimate" />
          {formError && (
            <p role="alert" className="text-sm text-[#b10000]">
              {formError}
            </p>
          )}
          <button
            type="submit"
            form={FORM_ID}
            disabled={pending}
            className="w-full rounded-full bg-[#690000] py-[15px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? t.payment.processing : t.payment.pay}
          </button>
        </section>
      </aside>
    </div>
  );
}
