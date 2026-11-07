"use client";

import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/account-actions";
import { MERCH_MIN_QUANTITY, merchHref, quotationPage as q, tieredUnitPrice } from "@/lib/merch-data";
import { submitQuotation } from "@/lib/quote-actions";
import { clearQuote, removeFromQuote, setQuoteQuantity, useQuoteItems } from "@/lib/quote-store";

const fmt = (n: number) => "Rp " + new Intl.NumberFormat("id-ID").format(n);
const tomorrow = () => {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
};

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-[#b10000]">{error}</p>}
    </div>
  );
}

export function QuotationForm({ defaults }: { defaults: { name: string; company_name: string; email: string; phone: string } }) {
  const items = useQuoteItems();
  const [state, formAction, pending] = useActionState(submitQuotation, { status: "idle" } as FormState);

  const rows = items.map((item) => {
    const unit = tieredUnitPrice(item.price_tiers, item.quantity, item.price);
    return { item, unit, total: unit * item.quantity };
  });
  const total = rows.reduce((s, r) => s + r.total, 0);

  // The request is stored in Laravel; start a fresh quote list.
  const sent = state.status === "saved";
  useEffect(() => {
    if (sent) clearQuote();
  }, [sent]);

  const error = (name: string) => (state.status === "error" ? state.errors?.[name]?.[0] : undefined);
  const value = (name: keyof typeof defaults | "request_date" | "note") =>
    (state.status === "error" ? state.values?.[name] : undefined) ?? (name in defaults ? defaults[name as keyof typeof defaults] : "");

  if (sent) {
    return (
      <div role="status" className="mx-auto flex max-w-xl flex-col items-center gap-6 pb-20 pt-[200px] text-center">
        <h1 className="font-heading text-2xl md:text-3xl">{q.sentTitle}</h1>
        <p>{q.sentBody}</p>
        <p>{q.thanks}</p>
        <Link href={q.backHref} className="rounded-full bg-black px-[30px] py-[15px] text-white hover:opacity-90">
          {q.backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[90%] flex-col gap-10 pb-20 pt-[160px]">
      <Link href={q.backHref} className="flex w-fit items-center gap-2 text-base">
        <ArrowLeft className="size-[27px] text-aloeswood" strokeWidth={1.5} />
        {q.backLabel}
      </Link>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-[100px]">
        <form action={formAction} className="flex flex-col gap-10 lg:w-2/5">
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <h1 className="font-heading text-2xl md:text-3xl">{q.contactTitle}</h1>
          <p>{q.intro}</p>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 font-heading text-xl">Information</legend>
            <Field id="q-name" label="Full name" error={error("name")}>
              <Input id="q-name" name="name" required minLength={3} maxLength={100} autoComplete="name" defaultValue={value("name")} className="h-11 bg-white" />
            </Field>
            <Field id="q-company" label="Company" error={error("company_name")}>
              <Input
                id="q-company"
                name="company_name"
                required
                minLength={3}
                maxLength={100}
                autoComplete="organization"
                defaultValue={value("company_name")}
                className="h-11 bg-white"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="q-email" label="Email" error={error("email")}>
                <Input id="q-email" name="email" type="email" required autoComplete="email" defaultValue={value("email")} className="h-11 bg-white" />
              </Field>
              <Field id="q-phone" label="Phone number" error={error("phone")}>
                <Input id="q-phone" name="phone" type="tel" required autoComplete="tel" defaultValue={value("phone")} className="h-11 bg-white" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2 font-heading text-xl">Preferred Delivery Date</legend>
            <Input
              name="request_date"
              type="date"
              required
              min={tomorrow()}
              defaultValue={value("request_date")}
              aria-label="Preferred delivery date"
              className="h-11 bg-white"
            />
            <p className="text-sm italic">{q.dateHint}</p>
            {error("request_date") && <p className="text-sm text-[#b10000]">{error("request_date")}</p>}
          </fieldset>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2 font-heading text-xl">Project Details (Optional)</legend>
            <Textarea name="note" rows={5} maxLength={10000} defaultValue={value("note")} aria-label="Project details" className="bg-white" />
          </fieldset>

          <div className="flex flex-col gap-3">
            <p>{q.reviewNote}</p>
            {state.status === "error" && (
              <p role="alert" className="text-sm text-[#b10000]">
                {state.errors ? "Please check the highlighted fields." : state.message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending || items.length === 0}
              className="w-full rounded-full bg-black px-[30px] py-[15px] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Sending…" : q.submit}
            </button>
          </div>
        </form>

        <section className="flex flex-1 flex-col gap-3">
          <h2 className="font-heading text-2xl md:text-3xl">{q.summaryTitle}</h2>
          <p>{q.summaryIntro}</p>

          {rows.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-lg bg-neutral-100 p-6">
              <p>{q.emptySummary}</p>
              <Link href={q.backHref} className="rounded-full bg-black px-6 py-2.5 text-sm text-white hover:opacity-90">
                Browse Merchandise
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-[#e3e3e3]">
                  <tr>
                    <th scope="col" className="w-[6%] px-5 py-3 font-normal">No.</th>
                    <th scope="col" className="px-3 py-3 font-normal">Item of Description</th>
                    <th scope="col" className="w-[18%] px-3 py-3 font-normal">Qty</th>
                    <th scope="col" className="w-[16%] px-3 py-3 font-normal">Unit Price</th>
                    <th scope="col" className="w-[18%] px-3 py-3 font-normal">Total</th>
                    <th scope="col" className="w-[5%] px-3 py-3 font-normal">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ item, unit, total: rowTotal }, i) => (
                    <tr key={`${item.id}-${item.color?.id}-${item.size?.id}`} className={i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}>
                      <td className="px-5 py-4">{i + 1}.</td>
                      <td className="px-3 py-4">
                        <Link href={merchHref(item.slug)} className="hover:underline">
                          {item.name}
                        </Link>
                        {item.color && ` – ${item.color.name}`}
                        {item.size && ` (Size ${item.size.name})`}
                      </td>
                      <td className="px-3 py-4">
                        <QuantityStepper
                          value={item.quantity}
                          min={MERCH_MIN_QUANTITY}
                          step={10}
                          onChange={(n) => setQuoteQuantity(i, n)}
                        />
                      </td>
                      <td className="px-3 py-4">{fmt(unit)}</td>
                      <td className="px-3 py-4">{fmt(rowTotal)}</td>
                      <td className="px-3 py-4">
                        <button type="button" onClick={() => removeFromQuote(i)} aria-label={`Remove ${item.name}`}>
                          <X className="size-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#e3e3e3] font-bold">
                  <tr>
                    <td colSpan={4} className="px-5 py-4">Estimated Total</td>
                    <td colSpan={2} className="px-3 py-4">{fmt(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 py-3 text-sm">
            <p className="font-medium">{q.notesTitle}</p>
            <p>{q.notes}</p>
            <ul className="list-disc pl-5">
              {q.noteList.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p>{q.thanks}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
