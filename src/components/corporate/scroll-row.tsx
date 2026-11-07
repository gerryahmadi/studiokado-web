"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { WordReveal } from "@/components/shared/reveal";
import { format } from "@/i18n/format";

// Heading row with prev/next buttons that scroll the cards underneath (the "CaretCircle" arrows in Framer).
export function ScrollRow({
  title,
  headingClassName = "font-heading text-2xl md:text-3xl",
  labels,
  children,
}: {
  title: string;
  headingClassName?: string;
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
    <div className="flex flex-col gap-9">
      <div className="flex items-center justify-between gap-9">
        <WordReveal as="h2" text={title} className={headingClassName} />
        <div className="flex gap-1">
          <button type="button" onClick={() => scroll(-1)} aria-label={format(labels.previous, { title })}>
            <ChevronLeft className="size-9 rounded-full" strokeWidth={1.25} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={format(labels.next, { title })}>
            <ChevronRight className="size-9 rounded-full" strokeWidth={1.25} />
          </button>
        </div>
      </div>
      <div ref={track} className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {children}
      </div>
    </div>
  );
}
