"use client";

import Image from "next/image";
import { useActionState } from "react";
import { WordReveal } from "@/components/shared/reveal";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/messages/en";
import type { OrderTracking } from "@/lib/tracking";
import { trackOrder, type TrackState } from "@/lib/tracking-actions";
import { trackingPage } from "@/lib/tracking-data";
import { TrackingResult } from "./tracking-result";

// `t` is the `tracking` dictionary, passed down by the (server) page.
// Lookup: order or tracking number + checkout email (Laravel Api\OrderTrackingController). `initial` is an
// order the page already loaded (My Account's "Track Order" link for a signed-in owner).
export function TrackingForm({
  t,
  locale,
  notFound = false,
  initialNumber = "",
  initial = null,
}: {
  t: Dictionary["tracking"];
  locale: Locale;
  notFound?: boolean;
  initialNumber?: string;
  initial?: OrderTracking | null;
}) {
  const [state, formAction, pending] = useActionState<TrackState, FormData>(
    trackOrder,
    initial ? { status: "found", data: initial } : notFound ? { status: "notFound" } : { status: "idle" },
  );
  const missing = state.status === "notFound";

  return (
    <>
      <section className="flex flex-col items-center gap-6 px-6 pb-10 pt-[157px] md:flex-row md:px-20">
        <div className="flex w-full flex-1 flex-col items-center gap-8 p-6 md:p-[50px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <WordReveal as="h1" text={t.title} className="font-heading text-3xl md:text-4xl" />
            <WordReveal text={t.description} delay={0.3} stagger={0.02} />
          </div>
          <form action={formAction} className="flex w-full flex-col items-center gap-4">
            <Input
              name="number"
              required
              defaultValue={initialNumber}
              aria-label={t.inputLabel}
              aria-invalid={missing}
              placeholder={t.inputLabel}
              className="h-12 w-full bg-white"
            />
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-label={t.emailLabel}
              aria-invalid={missing}
              placeholder={t.emailLabel}
              className="h-12 w-full bg-white"
            />
            {(missing || state.status === "error") && (
              <p role="alert" className="text-center text-[#b10000]">
                {missing ? t.notFound : t.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[#690000] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "…" : t.submit}
            </button>
            {!missing && <p className="text-center">{t.hint}</p>}
          </form>
        </div>
        <div className="relative hidden aspect-[528/487] w-[528px] max-w-[45%] shrink-0 md:block">
          <Image src={trackingPage.image} alt="" fill sizes="528px" className="object-contain" />
        </div>
      </section>

      {state.status === "found" && <TrackingResult order={state.data} t={t} locale={locale} />}
    </>
  );
}
