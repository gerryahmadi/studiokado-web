"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HAMPER_PLACEHOLDER_IMAGE, isSoldOut, type HamperCard } from "@/lib/hamper-data";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";
import { useHamper } from "@/lib/hamper-store";
import { Price } from "@/components/price";
import { HamperBottomBar } from "./hamper-bottom-bar";
import { HamperHeader } from "./hamper-header";

const MAX_MESSAGE = 250;

// "Popup card product" in Framer: preview + From / To / Message for the chosen card.
function CardDialog({ card, onClose }: { card: HamperCard; onClose: () => void }) {
  const { selectCard, note } = useHamper();
  const { t: messages } = useI18n();
  const t = messages.shop.giftNote;
  const [from, setFrom] = useState(note.from);
  const [to, setTo] = useState(note.to);
  const [message, setMessage] = useState(note.message);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={card.name}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectCard(card, { from, to, message });
          onClose();
        }}
        className="relative flex max-h-[90vh] w-full max-w-[417px] flex-col gap-5 overflow-y-auto bg-white p-5"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/90"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
        <div className="relative aspect-[1.41] w-full overflow-hidden rounded">
          <Image src={card.image ?? HAMPER_PLACEHOLDER_IMAGE} alt={card.name} fill sizes="417px" className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hc-from" className="text-sm">
              {t.from}
            </Label>
            <Input id="hc-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder={t.fromPlaceholder} className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hc-to" className="text-sm">
              {t.to}
            </Label>
            <Input id="hc-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder={t.toPlaceholder} className="h-10" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hc-message" className="text-sm">
            {t.message}
          </Label>
          <Textarea
            id="hc-message"
            rows={4}
            maxLength={MAX_MESSAGE}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={format(t.messagePlaceholder, { max: MAX_MESSAGE })}
          />
          <span className="self-end text-xs text-neutral-500">
            {message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <button
          type="submit"
          className="h-12 rounded-full bg-[#690000] text-white transition-opacity hover:opacity-90"
        >
          {messages.hamper.card.select}{card.price > 0 && <> · <Price value={card.price} /></>}
        </button>
      </form>
    </div>
  );
}

export function CardStep({ cards }: { cards: HamperCard[] }) {
  const { card } = useHamper();
  const { t } = useI18n();
  const [open, setOpen] = useState<HamperCard | null>(null);

  return (
    <>
      <div className="flex flex-col items-center gap-[54px]">
        <HamperHeader current="card" />
        <ul className="grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => {
            const selected = card?.id === c.id;
            const soldOut = isSoldOut(c);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setOpen(c)}
                  disabled={soldOut}
                  aria-pressed={selected}
                  className="group flex w-full flex-col gap-7 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    className={`relative block aspect-[1.41] w-full overflow-hidden rounded ${
                      selected ? "ring-2 ring-[#b10000] ring-offset-2" : ""
                    }`}
                  >
                    <Image
                      src={c.image ?? HAMPER_PLACEHOLDER_IMAGE}
                      alt={c.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col items-start gap-1 text-left">
                    <span className="truncate">{c.name}</span>
                    <span className="text-sm">{soldOut ? t.shop.soldOut : c.price > 0 ? <Price value={c.price} /> : t.hamper.card.free}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {open && <CardDialog key={open.id} card={open} onClose={() => setOpen(null)} />}
      <HamperBottomBar ctaLabel={t.hamper.card.complete} ctaHref="/create-hampers/review" showTotalInCta />
    </>
  );
}
