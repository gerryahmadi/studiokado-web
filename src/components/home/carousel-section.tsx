"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { WordReveal } from "@/components/shared/reveal";
import { format } from "@/i18n/format";

// Faint grid lines ("PaperBackground" code component in Framer: grid, 52px, 0.5px, 20% opacity).
export const gridPaper = {
  backgroundImage:
    "linear-gradient(rgba(60,43,33,0.1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(60,43,33,0.1) 0.5px, transparent 0.5px)",
  backgroundSize: "52px 52px",
};

// Section with eyebrow, title, description and prev/next arrows that scroll the row of cards.
export function CarouselSection({
  eyebrow,
  title,
  description,
  labels,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** "Previous {title}" / "Next {title}" for the arrow buttons. */
  labels: { previous: string; next: string };
  children: React.ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section
      className="relative z-10 flex flex-col gap-6 bg-[#fffef5] px-6 pb-[60px] pt-10 md:px-[50px]"
      style={gridPaper}
    >
      <div className="flex flex-col gap-2.5">
        <WordReveal text={eyebrow} className="text-sm" />
        <div className="flex items-center justify-between gap-5">
          <WordReveal as="h2" text={title} delay={0.1} className="font-heading text-3xl text-aloeswood" />
          <div className="flex gap-5 text-neutral-500">
            <button type="button" onClick={() => scroll(-1)} aria-label={format(labels.previous, { title })}>
              <ChevronLeft className="size-7" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={format(labels.next, { title })}>
              <ChevronRight className="size-7" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <WordReveal text={description} delay={0.3} stagger={0.02} className="text-sm" />
      </div>
      <div ref={track} className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none]">
        {children}
      </div>
    </section>
  );
}
