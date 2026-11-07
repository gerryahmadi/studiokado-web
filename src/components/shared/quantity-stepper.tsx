"use client";

import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  step = 1,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}) {
  const t = useI18n().t.shop.quantity;
  const name = label ?? t.default;

  return (
    <div className="flex w-fit items-center rounded-full border border-bistre/30">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label={format(t.decrease, { label: name })}
        className="grid size-9 place-items-center disabled:opacity-30"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label={format(t.increase, { label: name })}
        className="grid size-9 place-items-center disabled:opacity-30"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
