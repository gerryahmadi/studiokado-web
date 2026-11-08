"use client";

import { BASE_CURRENCY, formatRupiah } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-store";
import { useI18n } from "@/i18n/client";
import { format as formatMessage } from "@/i18n/format";

/** An IDR amount shown in the visitor's chosen currency. Usable from server components. */
export function Price({ value }: { value: number }) {
  return <>{useCurrency().format(value)}</>;
}

/**
 * Payment is always in IDR. Shown under a total only when the visitor picked another currency:
 * - "converted" (cart): the total above is converted → tell them the actual IDR charge.
 * - "estimate" (checkout): the total above is IDR → show the converted estimate.
 */
export function IdrChargeNote({ value, mode }: { value: number; mode: "converted" | "estimate" }) {
  const { code, format } = useCurrency();
  const t = useI18n().t.common.idrNote;
  if (code === BASE_CURRENCY) return null;
  return (
    <p className="text-xs text-neutral-500">
      {mode === "converted"
        ? formatMessage(t.converted, { idr: formatRupiah(value), currency: code })
        : formatMessage(t.estimate, { amount: format(value) })}
    </p>
  );
}
