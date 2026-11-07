"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";

// Mirrors "inner.product-images" (main image + thumbnails) in Framer.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-ivory">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        // Framer "InnerProductThumbnails": fixed 72px squares, 8px gap, red border on the active one.
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={format(t.product.showImage, { n: i + 1 })}
              aria-current={i === active}
              className={`relative size-[72px] shrink-0 overflow-hidden rounded-lg border transition-colors ${
                i === active ? "border-[#b10000]" : "border-transparent hover:border-[#b10000]/40"
              }`}
            >
              <Image src={src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
