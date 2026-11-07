"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { WordReveal } from "@/components/shared/reveal";
import { useI18n } from "@/i18n/client";
import { hamperSteps, type HamperStepKey } from "@/lib/hamper-data";

// Page intro ("Let's Begin With The Perfect Box") followed by the 4-step progress indicator.
export function HamperHeader({ current }: { current: HamperStepKey }) {
  const t = useI18n().t.hamper;
  const { eyebrow, title, description } = t.intro[current];
  const currentIndex = hamperSteps.findIndex((s) => s.key === current);

  return (
    <div className="flex w-full flex-col items-center gap-[54px]">
      <div className="flex max-w-[448px] flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap items-baseline justify-center gap-2.5">
          {eyebrow && <span className="text-lg">{eyebrow}</span>}
          {title && <WordReveal as="h1" text={title} className="font-heading text-3xl md:text-4xl" />}
        </div>
        <WordReveal text={description} delay={0.3} stagger={0.02} className="text-sm" />
      </div>

      <ol className="flex w-full max-w-[1400px] flex-wrap items-center justify-center" aria-label={t.steps.progress}>
        {hamperSteps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const reached = i <= currentIndex;
          return (
            <li key={s.key} className="flex items-center">
              <Link
                href={s.href}
                aria-current={active ? "step" : undefined}
                className="flex items-center gap-2.5 p-2.5"
              >
                <span
                  className={`grid size-6 place-items-center rounded-full border ${
                    done || active ? "border-[#b10000]" : "border-[#b10000]/60"
                  } ${done ? "bg-[#b10000]" : ""}`}
                >
                  {done && <Check className="size-4 text-white" strokeWidth={1.5} />}
                </span>
                <span className={`text-sm ${reached ? "font-medium" : ""}`}>{t.steps[s.key]}</span>
              </Link>
              {i < hamperSteps.length - 1 && (
                <span
                  aria-hidden
                  className={`mx-2.5 h-1 w-[30px] rounded-sm ${i < currentIndex ? "bg-[#b10000]" : "bg-[#d9d9d9]"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
