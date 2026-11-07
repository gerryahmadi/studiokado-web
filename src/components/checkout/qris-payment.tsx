"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/format";
import { qris } from "@/lib/cart-data";

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-heading text-xl">{pad(value)}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function QrisPayment() {
  const t = useI18n().t.checkout.qris;
  const [left, setLeft] = useState(qris.secondsLeft);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 rounded p-4 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <Clock className="size-[35px] shrink-0 text-aloeswood" strokeWidth={1.5} />
          <div className="flex flex-col gap-2.5">
            <h1 className="font-heading text-xl">{t.waiting}</h1>
            <p className="text-sm">{t.complete}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2.5" role="timer" aria-label={t.timeLeft}>
          <Unit value={h} label={t.hours} />
          <span aria-hidden>:</span>
          <Unit value={m} label={t.minutes} />
          <span aria-hidden>:</span>
          <Unit value={s} label={t.seconds} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-10 bg-[#f9f9f9] py-10">
        <div className="flex flex-col items-center gap-5">
          <Image src={qris.logo} alt="QRIS" width={122} height={81} />
          <Image src={qris.code} alt={t.codeAlt} width={300} height={300} unoptimized />
          <p className="text-sm">{format(t.nmid, { nmid: qris.nmid })}</p>
        </div>
        <p className="flex items-center gap-1 px-4 py-3 text-sm font-medium">
          {t.poweredBy} <span>{qris.provider}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-sm">{t.totalBill}</p>
        <p className="text-lg">Rp{new Intl.NumberFormat("en-US").format(qris.totalBill)}</p>
      </div>
    </div>
  );
}
