"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

// Scroll-in motion from the Framer pages, done with IntersectionObserver + CSS (see globals.css):
// - <Reveal>: block fades in while rising 50px (section headings, cards, images).
// - <WordReveal>: text fades in word by word, each word rising 10px (headings, paragraphs).
// Each plays once, the first time it enters the viewport.

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, shown] as const;
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** Seconds before the block starts moving (use to stagger cards in a row). */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const [ref, shown] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown ? "" : undefined}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function WordReveal({
  as: Tag = "p",
  text,
  delay = 0,
  stagger = 0.03,
  className,
}: {
  as?: ElementType;
  text: string;
  /** Seconds before the first word appears. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
  className?: string;
}) {
  const [ref, shown] = useInView<HTMLElement>();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={ref} data-shown={shown ? "" : undefined} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-word="" className="inline-block" style={{ transitionDelay: `${delay + i * stagger}s` }}>
            {w}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
