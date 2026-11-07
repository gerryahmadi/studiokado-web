"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HAMPER_PLACEHOLDER_IMAGE, isSoldOut, type HamperBox } from "@/lib/hamper-data";
import { useI18n } from "@/i18n/client";
import { useHamper } from "@/lib/hamper-store";
import { Price } from "@/components/price";
import { HamperHeader } from "./hamper-header";

export function PackageStep({ boxes }: { boxes: HamperBox[] }) {
  const router = useRouter();
  const { box: selected, selectBox } = useHamper();
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-[54px]">
      <HamperHeader current="package" />
      <ul className="grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-4">
        {boxes.map((b) => {
          const soldOut = isSoldOut(b);
          return (
            <li key={b.id}>
              <button
                type="button"
                disabled={soldOut}
                aria-pressed={selected?.id === b.id}
                onClick={() => {
                  selectBox(b);
                  router.push("/create-hampers/items");
                }}
                className="group flex w-full flex-col items-center gap-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  className={`relative block aspect-square w-full overflow-hidden rounded ${
                    selected?.id === b.id ? "ring-2 ring-[#b10000] ring-offset-2" : ""
                  }`}
                >
                  <Image
                    src={b.image ?? HAMPER_PLACEHOLDER_IMAGE}
                    alt={b.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-col items-center gap-1">
                  <span>
                    {b.name} · {b.size}
                  </span>
                  <span className="text-sm">{soldOut ? t.shop.soldOut : <Price value={b.price} />}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
