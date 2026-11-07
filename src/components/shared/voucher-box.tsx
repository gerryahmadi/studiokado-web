"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/client";

// "Voucher & Promo" card shared by cart and checkout (static: codes are not validated yet).
export function VoucherBox() {
  const t = useI18n().t.shop.voucher;
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  return (
    <div className="flex flex-col gap-5 rounded bg-white px-5 py-6">
      <h2>{t.title}</h2>
      <form
        className="flex gap-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(code.trim().length > 0);
        }}
      >
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setApplied(false);
          }}
          placeholder={t.placeholder}
          aria-label={t.label}
          className="h-10 flex-1 bg-white"
        />
        <button
          type="submit"
          className="h-10 w-[94px] rounded-full border border-bistre text-sm transition-colors hover:bg-bistre/10"
        >
          {t.apply}
        </button>
      </form>
      {applied && <p className="text-sm text-neutral-600">{t.notice}</p>}
    </div>
  );
}
