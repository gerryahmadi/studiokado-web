"use client";

import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HAMPER_PLACEHOLDER_IMAGE } from "@/lib/hamper-data";
import { useI18n } from "@/i18n/client";
import { format as fill } from "@/i18n/format";
import { useHamper } from "@/lib/hamper-store";
import { useCurrency } from "@/lib/currency-store";
import { Price } from "@/components/price";

// Fixed bar at the bottom of the items / card / review steps: box size and fill, chosen thumbnails,
// detail and CTA. The CTA is a link, or a button when `onCta` is given (review step: add to cart).
export function HamperBottomBar({
  ctaLabel,
  ctaHref,
  onCta,
  pending = false,
  showTotalInCta = false,
  requireItems = false,
}: {
  ctaLabel: string;
  ctaHref?: string;
  onCta?: () => void;
  pending?: boolean;
  showTotalInCta?: boolean;
  requireItems?: boolean;
}) {
  const { box, items, card, total, usedSlots, capacity, setItemQty, removeCard } = useHamper();
  const { format } = useCurrency();
  const t = useI18n().t.hamper.bar;
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Lift the floating WhatsApp button above this bar while it is mounted.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty("--wa-offset", `${bar.offsetHeight}px`));
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--wa-offset");
    };
  }, []);

  const disabled = !box || (requireItems && items.length === 0) || pending;

  const thumbs = [
    box && { key: "box", src: box.image, label: box.name, onRemove: undefined },
    ...items.map(({ item }) => ({
      key: `item-${item.id}`,
      src: item.image,
      label: item.name,
      onRemove: () => setItemQty(item, 0),
    })),
    card && { key: "card", src: card.image, label: card.name, onRemove: removeCard },
  ].filter(Boolean) as { key: string; src: string | null; label: string; onRemove?: () => void }[];

  const ctaClass = "rounded-full bg-[#f0a481] px-[30px] py-[15px] text-[#69452f] transition-opacity md:px-[60px]";
  const ctaText = `${pending ? t.adding : ctaLabel}${showTotalInCta ? ` ${format(total)}` : ""}`;

  return (
    <div ref={barRef} className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white px-6 md:px-[60px]">
      {open && (
        <div className="mx-auto max-w-[1400px] border-b border-black/5 py-4 text-sm">
          <ul className="flex flex-col gap-2">
            {box && (
              <li className="flex justify-between gap-4">
                <span>
                  {fill(t.box, { name: box.name, size: box.size })}
                </span>
                <span><Price value={box.price} /></span>
              </li>
            )}
            {items.map(({ item, qty }) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.name} × {qty}
                </span>
                <span><Price value={item.price * qty} /></span>
              </li>
            ))}
            {card && (
              <li className="flex justify-between gap-4">
                <span>{fill(t.card, { name: card.name })}</span>
                <span><Price value={card.price} /></span>
              </li>
            )}
            {thumbs.length === 0 && <li>{t.nothing}</li>}
          </ul>
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-2 py-3">
        <div className="flex flex-col gap-1">
          <p className="text-base">
            {t.currentSize} <span className="font-medium">{box?.size ?? "—"}</span>
          </p>
          {box && capacity > 0 && (
            <div className="flex items-center gap-2 text-xs" title={t.spaceUsed}>
              <span className="h-1.5 w-28 overflow-hidden rounded-full bg-[#d9d9d9]">
                <span
                  className="block h-full rounded-full bg-[#b10000]"
                  style={{ width: `${Math.min(100, (usedSlots / capacity) * 100)}%` }}
                />
              </span>
              {fill(t.full, { percent: Math.round((usedSlots / capacity) * 100) })}
            </div>
          )}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6">
          <ul className="flex items-center gap-5">
            {thumbs.map((thumb) => (
              <li key={thumb.key} className="relative size-[46px]">
                <Image src={thumb.src ?? HAMPER_PLACEHOLDER_IMAGE} alt={thumb.label} fill sizes="46px" className="rounded object-cover" />
                {thumb.onRemove && (
                  <button
                    type="button"
                    onClick={thumb.onRemove}
                    aria-label={fill(t.remove, { name: thumb.label })}
                    className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-black/10"
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex items-center gap-1 text-lg"
          >
            {t.detail}
            <ChevronDown className={`size-[22px] text-[#ce6a47] transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>
          {disabled ? (
            <span aria-disabled className={`${ctaClass} cursor-not-allowed opacity-50`}>
              {ctaText}
            </span>
          ) : onCta ? (
            <button type="button" onClick={onCta} className={`${ctaClass} hover:opacity-90`}>
              {ctaText}
            </button>
          ) : (
            <Link href={ctaHref ?? "#"} className={`${ctaClass} hover:opacity-90`}>
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
