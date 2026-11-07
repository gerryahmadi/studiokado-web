"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/client";
import { format, plural } from "@/i18n/format";
import { CART_UPDATED_EVENT } from "@/lib/cart";
import { addToCart, type AddToCartState } from "@/lib/cart-actions";
import type { GiftCard } from "@/lib/product-data";

const MAX_MESSAGE = 250;

// The quantity stepper (ProductPurchase) sits outside this form and joins it through form="...".
export const PRODUCT_FORM_ID = "product-form";

// Framer form field: transparent, 1px rgba(117,115,115,0.3) border, 4px radius, 12px padding,
// #1e1e1e text, #c9c9c9 placeholder, bistre border on focus.
const fieldClass =
  "rounded-[4px] border-[rgba(117,115,115,0.3)] bg-transparent p-3 text-sm text-[#1e1e1e] placeholder:text-[#c9c9c9] focus-visible:border-bistre focus-visible:ring-0 md:text-sm";

function CardThumb({
  card,
  selected,
  onSelect,
  className = "w-[270px] shrink-0",
  sizes = "270px",
}: {
  card: GiftCard;
  selected: boolean;
  onSelect: () => void;
  className?: string;
  sizes?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={card.name}
      data-card-id={card.id}
      className={`relative aspect-[1.411] overflow-hidden rounded ring-offset-2 transition-shadow ${className} ${
        selected ? "ring-2 ring-bistre" : "hover:ring-2 hover:ring-bistre/30"
      }`}
    >
      {card.image ? (
        <Image src={card.image} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center bg-ivory p-4 text-center">
          <span className="font-heading text-2xl leading-tight">{card.name}</span>
        </span>
      )}
    </button>
  );
}

// "View All": every card in a modal (Framer only shows a dark overlay, no designed modal).
function CardsDialog({
  cards,
  selected,
  onSelect,
  onClose,
}: {
  cards: GiftCard[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.product.card.pick}
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[960px] flex-col gap-6 rounded-[20px] bg-ivory p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-xl">{t.product.card.pick}</h2>
          <button type="button" onClick={onClose} aria-label={t.shop.giftNote.close} className="grid size-8 place-items-center">
            <X className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 overflow-y-auto p-1 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              <CardThumb
                card={c}
                selected={selected === c.id}
                onSelect={() => onSelect(c.id)}
                className="w-full"
                sizes="(min-width: 768px) 300px, 50vw"
              />
              <span className="line-clamp-2 text-sm">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// "Customization options" block under "What inside": from/to, message and card picker.
// The picker only shows when the product offers cards (Laravel: quick hampers only).
export function CardOptions({ productId, cards }: { productId: number; cards: GiftCard[] }) {
  const { t: messages } = useI18n();
  const t = messages.product.card;
  const note = messages.shop.giftNote;
  const [noNote, setNoNote] = useState(false);
  // Controlled so React's automatic form reset after a submit doesn't wipe them.
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(cards[0]?.id ?? "");
  const [viewAll, setViewAll] = useState(false);
  const [state, formAction, pending] = useActionState<AddToCartState, FormData>(addToCart, { status: "idle" });
  const rowRef = useRef<HTMLDivElement>(null);

  // Let the navbar badge pick up the new count.
  useEffect(() => {
    if (state.status === "added") {
      window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: state.itemCount }));
    }
  }, [state]);

  // Picking from the modal closes it and scrolls the preview row to the chosen card.
  const pickFromDialog = (id: string) => {
    setSelected(id);
    setViewAll(false);
    requestAnimationFrame(() =>
      rowRef.current
        ?.querySelector<HTMLElement>(`[data-card-id="${CSS.escape(id)}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    );
  };

  return (
    <form id={PRODUCT_FORM_ID} action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="product_id" value={productId} />
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          name="no_card"
          checked={noNote}
          onChange={(e) => setNoNote(e.target.checked)}
          className="size-[18px] accent-bistre"
        />
        <span>{t.noNote}</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-from" className="text-sm">
            {note.from}
          </Label>
          <Input id="card-from" name="card_from" maxLength={100} value={from} onChange={(e) => setFrom(e.target.value)} placeholder={note.fromPlaceholder} className={`h-10 ${fieldClass}`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-to" className="text-sm">
            {note.to}
          </Label>
          <Input id="card-to" name="card_to" maxLength={100} value={to} onChange={(e) => setTo(e.target.value)} placeholder={note.toPlaceholder} className={`h-10 ${fieldClass}`} />
        </div>
      </div>

      {!noNote && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-message" className="text-sm">
              {note.message}
            </Label>
            <Textarea
              id="card-message"
              name="card_message"
              rows={4}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={format(note.messagePlaceholder, { max: MAX_MESSAGE })}
              className={`h-[100px] resize-y [field-sizing:fixed] ${fieldClass}`}
            />
            <span className="self-end text-xs text-neutral-500">
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>

          {cards.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>{t.pick}</span>
              <button
                type="button"
                onClick={() => setViewAll(true)}
                className="text-sm text-[#b10000] underline-offset-4 hover:underline"
              >
                {t.viewAll}
              </button>
            </div>
            <div ref={rowRef} className="flex gap-3 overflow-x-auto p-1 pb-2 [scrollbar-width:thin]">
              {cards.map((c) => (
                <CardThumb key={c.id} card={c} selected={selected === c.id} onSelect={() => setSelected(c.id)} />
              ))}
            </div>
            <input type="hidden" name="card_id" value={selected} />
            {viewAll && (
              <CardsDialog
                cards={cards}
                selected={selected}
                onSelect={pickFromDialog}
                onClose={() => setViewAll(false)}
              />
            )}
          </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="submit"
          name="intent"
          value="buy"
          disabled={pending}
          className="h-12 rounded border border-bistre text-sm transition-colors hover:bg-bistre/10 disabled:opacity-50"
        >
          {t.purchase}
        </button>
        <button
          type="submit"
          name="intent"
          value="add"
          disabled={pending}
          className="h-12 rounded bg-[#b10000] text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? t.adding : t.add}
        </button>
      </div>

      <div aria-live="polite" className="text-sm">
        {state.status === "added" && (
          <p key={state.at}>
            {plural(t.added, state.itemCount)}{" "}
            <Link href="/cart" className="text-[#b10000] underline underline-offset-4">
              {t.viewCart}
            </Link>
          </p>
        )}
        {state.status === "error" && <p className="text-[#b10000]">{state.message}</p>}
      </div>
    </form>
  );
}
