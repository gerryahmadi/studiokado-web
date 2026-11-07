"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CART_UPDATED_EVENT } from "@/lib/cart";
import { addHamperToCart } from "@/lib/cart-actions";
import { HAMPER_PLACEHOLDER_IMAGE } from "@/lib/hamper-data";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";
import { useHamper } from "@/lib/hamper-store";
import { Price } from "@/components/price";
import { HamperBottomBar } from "./hamper-bottom-bar";
import { HamperHeader } from "./hamper-header";

function Row({
  image,
  name,
  price,
  qty,
}: {
  image: string | null;
  name: string;
  price: number;
  qty: number;
}) {
  return (
    <li className="flex items-center gap-5 py-4">
      <div className="relative size-[86px] shrink-0">
        <Image src={image ?? HAMPER_PLACEHOLDER_IMAGE} alt={name} fill sizes="86px" className="rounded object-cover" />
      </div>
      <p className="flex-1">{name}</p>
      <p className="hidden w-24 text-center text-sm sm:block">{qty}</p>
      <p className="w-28 text-right text-sm"><Price value={price * qty} /></p>
    </li>
  );
}

export function ReviewStep() {
  const router = useRouter();
  const { box, items, card, note, total, reset } = useHamper();
  const { t: messages } = useI18n();
  const t = messages.hamper.review;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const complete = () => {
    if (!box) return;
    setError(null);
    startTransition(async () => {
      const result = await addHamperToCart({
        packagingId: box.id,
        items: items.map(({ item, qty }) => ({ productId: item.id, quantity: qty })),
        card: card && { id: card.id, ...note },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: result.cart.item_count }));
      reset();
      router.push("/cart");
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[54px]">
        <HamperHeader current="review" />

        {!box ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <p>{t.notStarted}</p>
            <Link
              href="/create-hampers/package"
              className="rounded-full bg-[#690000] px-8 py-3 text-white transition-opacity hover:opacity-90"
            >
              {t.chooseBox}
            </Link>
          </div>
        ) : (
          <div className="grid w-full max-w-[1400px] gap-10 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col">
              <div className="flex h-14 items-center border-b border-black/5 text-base">
                <span className="flex-1">{t.product}</span>
                <span className="hidden w-24 text-center sm:block">{t.quantity}</span>
                <span className="w-28 text-right">{t.total}</span>
              </div>
              <ul className="divide-y divide-black/5">
                <Row image={box.image} name={format(messages.hamper.bar.box, { name: box.name, size: box.size })} price={box.price} qty={1} />
                {items.map(({ item, qty }) => (
                  <Row key={item.id} image={item.image} name={item.name} price={item.price} qty={qty} />
                ))}
              </ul>

              {card && (
                <div className="mt-6 flex gap-5 border-t border-black/5 pt-6">
                  <div className="relative aspect-[1.41] w-[200px] shrink-0">
                    <Image
                      src={card.image ?? HAMPER_PLACEHOLDER_IMAGE}
                      alt={card.name}
                      fill
                      sizes="200px"
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-2 text-sm">
                    <p className="font-medium">{card.name}</p>
                    {note.from && <p>{format(t.from, { name: note.from })}</p>}
                    {note.to && <p>{format(t.to, { name: note.to })}</p>}
                    {note.message && <p className="whitespace-pre-line">{format(t.message, { message: note.message })}</p>}
                    <Link
                      href="/create-hampers/card"
                      className="mt-1 rounded-full border border-bistre px-5 py-2 transition-colors hover:bg-bistre/10"
                    >
                      {t.edit}
                    </Link>
                  </div>
                  <p className="w-28 text-right text-sm"><Price value={card.price} /></p>
                </div>
              )}
            </div>

            <aside className="flex h-fit flex-col gap-4 rounded bg-white p-5 shadow-sm">
              <h2>{t.summary}</h2>
              <div className="flex items-center justify-between border-t border-black/5 pt-4">
                <span>{t.subtotal}</span>
                <span className="font-medium"><Price value={total} /></span>
              </div>
              {items.length === 0 && (
                <p className="text-sm">
                  {t.empty}{" "}
                  <Link href="/create-hampers/items" className="underline underline-offset-4">
                    {t.addItems}
                  </Link>
                </p>
              )}
              {error && (
                <p role="alert" className="text-sm text-[#b10000]">
                  {error}
                </p>
              )}
            </aside>
          </div>
        )}
      </div>
      {box && <HamperBottomBar ctaLabel={messages.hamper.card.complete} onCta={complete} pending={pending} showTotalInCta requireItems />}
    </>
  );
}
