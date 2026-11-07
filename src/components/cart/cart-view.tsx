"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { VoucherBox } from "@/components/shared/voucher-box";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/client";
import { format, plural } from "@/i18n/format";
import { CART_UPDATED_EVENT } from "@/lib/cart";
import { removeCartItem, updateCartItem, type Cart, type CartItem, type CartResult } from "@/lib/cart-actions";
import { platformFee, productDiscount } from "@/lib/cart-data";
import { IdrChargeNote, Price } from "@/components/price";
import { PRODUCT_PLACEHOLDER_IMAGE, productHref } from "@/lib/product-data";

const divider = <div className="h-px w-full bg-black/5" />;

const MAX_MESSAGE = 250;

// Greeting cards are stored as their own order lines (type "design"), like in Laravel.
const isCard = (item: CartItem) => item.type === "design";

function CartLine({
  item,
  onResult,
}: {
  item: CartItem;
  onResult: (result: CartResult) => string | null;
}) {
  const t = useI18n().t.cart;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState(item.message ?? "");
  const card = isCard(item);

  const run = (action: () => Promise<CartResult>) =>
    startTransition(async () => {
      setError(onResult(await action()));
    });

  return (
    <div className={`flex flex-col gap-3 transition-opacity ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-1 gap-5">
          <Link
            href={productHref(item.slug)}
            className={`relative shrink-0 ${card ? "aspect-[1.411] w-[150px] self-start" : "size-[150px]"}`}
          >
            <Image
              src={item.image ?? PRODUCT_PLACEHOLDER_IMAGE}
              alt={item.name}
              fill
              sizes="150px"
              className="rounded object-cover"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-4 pt-2.5">
            <div className="flex flex-col gap-3">
              {card && <p className="text-xs uppercase tracking-wide text-neutral-500">{t.greetingCard}</p>}
              <p>{item.name}</p>
              <p className="text-sm"><Price value={item.price} /></p>
            </div>
            {(item.from || item.to) && (
              <p className="text-sm text-neutral-600">
                {item.from && format(t.from, { name: item.from })}
                {item.from && item.to && " · "}
                {item.to && format(t.to, { name: item.to })}
              </p>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => removeCartItem(item.id))}
              className="w-fit text-sm text-[#b10000] underline-offset-4 hover:underline disabled:opacity-50"
            >
              {t.remove}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:contents">
          <div className={`flex sm:w-[97px] sm:justify-center sm:pt-2.5 ${pending ? "pointer-events-none" : ""}`}>
            {card ? (
              <span className="text-sm">{item.quantity}</span>
            ) : (
              <QuantityStepper
                value={item.quantity}
                onChange={(n) => run(() => updateCartItem(item.id, { quantity: n }))}
              />
            )}
          </div>
          <p className="sm:w-[140px] sm:pt-5 sm:text-center"><Price value={item.price * item.quantity} /></p>
        </div>
      </div>
      {!card && (
        <Textarea
          aria-label={format(t.giftMessageFor, { name: item.name })}
          placeholder={t.giftMessage}
          rows={2}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // Saved when the field loses focus.
          onBlur={() => {
            if (message !== (item.message ?? "")) run(() => updateCartItem(item.id, { message }));
          }}
          className="bg-black/[0.01] px-5 py-3 text-sm"
        />
      )}
      {error && (
        <p role="alert" className="text-sm text-[#b10000]">
          {error}
        </p>
      )}
    </div>
  );
}

export function CartView({ initialCart }: { initialCart: Cart | null }) {
  const t = useI18n().t.cart;
  const [cart, setCart] = useState(initialCart);
  const items = cart?.items ?? [];
  const productCount = items.filter((i) => !isCard(i)).length;

  // Applies a server result; returns the error to show on the line, if any.
  const onResult = (result: CartResult) => {
    if (!result.ok) return result.message;
    setCart(result.cart);
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: result.cart.item_count }));
    return null;
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center gap-6 py-20 text-center">
        <h1 className="font-heading text-3xl">{t.empty.title}</h1>
        <p className="text-neutral-600">{t.empty.description}</p>
        <Link
          href="/quick-hampers"
          className="rounded-full bg-[#690000] px-8 py-[15px] text-white transition-opacity hover:opacity-90"
        >
          {t.empty.cta}
        </Link>
      </div>
    );
  }

  const subtotal = cart?.total ?? 0;
  const total = subtotal + platformFee - productDiscount;

  return (
    <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
      <div className="flex flex-col gap-6 lg:w-2/3">
        <div className="flex flex-col gap-1">
          <div className="flex h-[57px] items-center text-base">
            <span className="flex-1">{t.columns.product}</span>
            <span className="hidden w-[97px] text-center sm:block">{t.columns.qty}</span>
            <span className="hidden w-[140px] text-center sm:block">{t.columns.subtotal}</span>
          </div>
          {divider}
        </div>

        {items.map((item, i) => (
          <div key={item.id} className="flex flex-col gap-6">
            <CartLine item={item} onResult={onResult} />
            {i < items.length - 1 && divider}
          </div>
        ))}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-[100px] lg:flex-1">
        <VoucherBox />
        <div className="flex flex-col gap-5 rounded bg-white px-5 py-6">
          <h2>{t.summary.title}</h2>
          <dl className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between gap-10">
              <dt className="flex-1">{plural(t.summary.totalPrice, productCount)}</dt>
              <dd><Price value={subtotal} /></dd>
            </div>
            <div className="flex justify-between gap-10">
              <dt className="flex-1">{t.summary.platformFee}</dt>
              <dd><Price value={platformFee} /></dd>
            </div>
            <div className="flex justify-between gap-10">
              <dt className="flex-1">{t.summary.discount}</dt>
              <dd>-<Price value={productDiscount} /></dd>
            </div>
          </dl>
          {divider}
          <div className="flex items-center justify-between">
            <span>{t.summary.total}</span>
            <span className="font-medium"><Price value={total} /></span>
          </div>
          <IdrChargeNote value={total} mode="converted" />
          <Link
            href="/checkout"
            className="w-full rounded-full bg-[#690000] py-[15px] text-center text-white transition-opacity hover:opacity-90"
          >
            {t.checkout}
          </Link>
          <Link
            href="/checkout?ship=multiple"
            className="w-full rounded-full border border-bistre py-[15px] text-center transition-colors hover:bg-bistre/10"
          >
            {t.checkoutMultiple}
          </Link>
        </div>
      </aside>
    </div>
  );
}
