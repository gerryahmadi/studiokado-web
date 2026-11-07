"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/shared/reveal";
import type { Testimonial } from "./testimonials";

// Scrolls the track by one card, wrapping around at either end.
function step(el: HTMLElement | null, dir: 1 | -1) {
  const card = el?.firstElementChild as HTMLElement | null;
  if (!el || !card) return;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  const atStart = el.scrollLeft <= 4;
  if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
  else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  else el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
}

// "Slideshow" in Framer: three cards visible, auto-advances every 3s, loops, arrow navigation.
export function TestimonialSlider({
  items,
  labels,
}: {
  items: Testimonial[];
  labels: { rating: string; previous: string; next: string };
}) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => step(track.current, 1), 3000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ul
        ref={track}
        className="flex snap-x gap-6 overflow-x-auto [scrollbar-width:none]"
      >
        {items.map((t, i) => (
          <Reveal
            as="li"
            delay={(i % 3) * 0.1}
            key={`${t.name}-${t.quote.slice(0, 20)}`}
            className="flex min-h-[300px] w-[85%] shrink-0 snap-start flex-col justify-between gap-6 rounded-xl bg-[#f4f8f9] p-6 md:w-[calc((100%-48px)/3)]"
          >
            <div className="flex flex-col gap-6">
              <div className="flex gap-1 text-[#2c3e44]" aria-label={labels.rating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-neutral-600">“{t.quote}”</p>
            </div>
            <div className="flex items-center gap-4">
              {t.photo ? (
                <Image src={t.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-11 place-items-center rounded-full bg-bistre/10 font-heading">
                  {t.name.charAt(0)}
                </span>
              )}
              <div>
                <p className="text-xl">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => step(track.current, -1)}
        aria-label={labels.previous}
        className="absolute left-2 top-1/2 -translate-y-1/2"
      >
        <ArrowLeft className="size-7" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => step(track.current, 1)}
        aria-label={labels.next}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <ArrowRight className="size-7" strokeWidth={1.5} />
      </button>
    </div>
  );
}
