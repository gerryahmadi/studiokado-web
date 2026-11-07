"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { WordReveal } from "@/components/shared/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/i18n/messages/en";
import type { FormState } from "@/lib/account-actions";
import { submitInquiry } from "@/lib/inquiry-actions";
import {
  giftPreferences,
  inquiryPage,
  occasionOptions,
  referralOptions,
} from "@/lib/inquiry-data";

const fieldClass = "h-11 rounded-lg border-bistre/30 bg-white px-3.5";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
      </Label>
      {children}
    </div>
  );
}

function GroupTitle({ children }: { children: string }) {
  return <WordReveal as="h2" text={children} className="font-heading text-xl" />;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-[#b10000]">{message}</p> : null;
}

// Today in Jakarta (yyyy-mm-dd), the earliest delivery date Laravel accepts.
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());

// `t` is the `inquiry` dictionary, passed down by the (server) page.
export function InquiryForm({ t }: { t: Dictionary["inquiry"] }) {
  const [state, action, pending] = useActionState(submitInquiry, { status: "idle" } as FormState);
  const [preferences, setPreferences] = useState<string[]>([]);
  // Selects are controlled so their value survives the form reset React does after each submit.
  const [occasion, setOccasion] = useState<string | null>(null);
  const [referral, setReferral] = useState<string | null>(null);

  const togglePreference = (p: string) =>
    setPreferences((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const error = (name: string) => (state.status === "error" ? state.errors?.[name]?.[0] : undefined);
  const typed = (name: string) => (state.status === "error" ? state.values?.[name] : undefined);

  if (state.status === "saved") {
    return (
      <div role="status" className="flex flex-col items-center gap-6 py-16 text-center">
        <h1 className="font-heading text-2xl md:text-3xl">{t.success.title}</h1>
        <p className="max-w-md">{state.message}</p>
        <Link
          href={inquiryPage.successHref}
          className="rounded-full bg-[#690000] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90"
        >
          {t.success.cta}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-9">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="font-heading text-xl">{t.title}</h1>
        <p>{t.description}</p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <GroupTitle>{t.groups.information}</GroupTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t.fields.name} htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              autoComplete="name"
              defaultValue={typed("name")}
              className={fieldClass}
            />
            <FieldError message={error("name")} />
          </Field>
          <Field label={t.fields.phone} htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+62"
              defaultValue={typed("phone")}
              className={fieldClass}
            />
            <FieldError message={error("phone")} />
          </Field>
        </div>
        <Field label={t.fields.email} htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={typed("email")}
            className={fieldClass}
          />
          <FieldError message={error("email")} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <GroupTitle>{t.groups.orderDetails}</GroupTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t.fields.occasion} htmlFor="occasion">
            <Select
              name="occasion"
              required
              items={occasionOptions.map((o) => ({ value: o.value, label: t.options.occasions[o.key] }))}
              value={occasion} onValueChange={(v) => setOccasion(v as string | null)}>
              <SelectTrigger id="occasion" className={`${fieldClass} w-full`}>
                <SelectValue placeholder={t.fields.occasionPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {occasionOptions.map((o) => (
                  <SelectItem key={o.key} value={o.value}>
                    {t.options.occasions[o.key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={error("occasion")} />
          </Field>
          <Field label={t.fields.deliveryDate} htmlFor="delivery_date">
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              min={today()}
              defaultValue={typed("delivery_date")}
              className={fieldClass}
            />
            <FieldError message={error("delivery_date")} />
          </Field>
          <Field label={t.fields.quantity} htmlFor="quantity">
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              inputMode="numeric"
              defaultValue={typed("quantity")}
              className={fieldClass}
            />
            <FieldError message={error("quantity")} />
          </Field>
          <Field label={t.fields.budget} htmlFor="budget">
            <Input
              id="budget"
              name="budget"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={typed("budget")}
              className={fieldClass}
            />
            <FieldError message={error("budget")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <GroupTitle>{t.groups.preferences}</GroupTitle>
        <div className="flex flex-wrap gap-3">
          {giftPreferences.map((p) => {
            const selected = preferences.includes(p.value);
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={selected}
                onClick={() => togglePreference(p.value)}
                className={`h-10 rounded-full border border-bistre px-4 text-sm transition-colors ${
                  selected ? "bg-bistre text-white" : "bg-transparent hover:bg-bistre/10"
                }`}
              >
                {t.options.preferences[p.key]}
              </button>
            );
          })}
        </div>
        {preferences.map((p) => (
          <input key={p} type="hidden" name="preferences" value={p} />
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <GroupTitle>{t.groups.tellUsMore}</GroupTitle>
        <Textarea
          name="message"
          rows={5}
          maxLength={5000}
          defaultValue={typed("message")}
          placeholder={t.fields.messagePlaceholder}
          className="rounded-lg border-bistre/30 bg-white px-3.5 py-3"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <GroupTitle>{t.groups.referral}</GroupTitle>
        <Select
          name="referral"
          items={referralOptions.map((o) => ({ value: o.value, label: t.options.referrals[o.key] }))}
          value={referral} onValueChange={(v) => setReferral(v as string | null)}>
          <SelectTrigger className={`${fieldClass} w-full`} aria-label={t.groups.referral}>
            <SelectValue placeholder={t.fields.referralPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {referralOptions.map((o) => (
              <SelectItem key={o.key} value={o.value}>
                {t.options.referrals[o.key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </fieldset>

      {state.status === "error" && (
        <p role="alert" className="text-center text-sm text-[#b10000]">
          {state.errors ? t.checkFields : state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#690000] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}
