"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/client";
import { formatRupiah } from "@/lib/home-data";
import { rateKey, type ShippingDestination } from "./use-shipping-destination";

export const inputClass = "h-10 bg-white";

export function Card({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded bg-white px-5 py-6">
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-sm">{title}</h2>
        {aside}
      </div>
      <div className="h-px w-full bg-black/5" />
      {children}
    </section>
  );
}

export function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-[#b10000]">{error}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-[19px] w-8 rounded-full transition-colors ${checked ? "bg-[#b10000]" : "bg-[#d1d1d6]"}`}
      >
        <span
          className={`absolute top-0.5 size-[15px] rounded-full bg-white transition-all ${checked ? "left-[15px]" : "left-0.5"}`}
        />
      </button>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export type AddressFieldName = "address" | "area" | "postal_code" | "lat" | "lng";

// Address search + province / city / zip for one destination. `name` maps each field to its form name.
export function AddressFields({
  dest,
  idPrefix,
  name,
  errors = {},
}: {
  dest: ShippingDestination;
  idPrefix: string;
  name: (field: AddressFieldName) => string;
  errors?: { address?: string; postal_code?: string };
}) {
  const t = useI18n().t.checkout.address;
  const listId = `${idPrefix}-address-suggestions`;
  return (
    <>
      <Field label={t.label} id={`${idPrefix}-address`} error={errors.address}>
        <div className="relative">
          <Input
            id={`${idPrefix}-address`}
            name={name("address")}
            required
            maxLength={500}
            autoComplete="off"
            role="combobox"
            aria-expanded={dest.suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            placeholder={t.placeholder}
            value={dest.address}
            onChange={(e) => dest.changeAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") dest.closeSuggestions();
            }}
            className={`${inputClass} pr-10`}
          />
          <Search className="pointer-events-none absolute right-2.5 top-1/2 size-[18px] -translate-y-1/2 text-neutral-500" />
          {dest.suggestions.length > 0 && (
            <ul
              id={listId}
              role="listbox"
              className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded border border-black/10 bg-white shadow-lg"
            >
              {dest.suggestions.map((s) => (
                <li key={s.place_id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => dest.choosePlace(s)}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-black/[0.03]"
                  >
                    <span className="text-sm">{s.title}</span>
                    <span className="text-xs text-neutral-500">{s.subtitle}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {dest.searching && <p className="text-xs text-neutral-500">{t.searching}</p>}
        {!dest.destination && dest.address.trim().length >= 3 && !dest.searching && dest.suggestions.length === 0 && (
          <p className="text-xs text-neutral-500">{t.pickSuggestion}</p>
        )}
      </Field>
      <input type="hidden" name={name("area")} value={dest.destination?.description ?? ""} />
      <input type="hidden" name={name("lat")} value={dest.destination?.lat ?? ""} />
      <input type="hidden" name={name("lng")} value={dest.destination?.lng ?? ""} />
      <div className="flex flex-col gap-5 sm:flex-row">
        <Field label={t.province} id={`${idPrefix}-province`}>
          <Input id={`${idPrefix}-province`} value={dest.province} readOnly className={`${inputClass} bg-neutral-50`} />
        </Field>
        <Field label={t.city} id={`${idPrefix}-city`}>
          <Input id={`${idPrefix}-city`} value={dest.city} readOnly className={`${inputClass} bg-neutral-50`} />
        </Field>
        <Field label={t.zip} id={`${idPrefix}-zip`} error={errors.postal_code}>
          <Input
            id={`${idPrefix}-zip`}
            name={name("postal_code")}
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            required
            value={dest.zip}
            onChange={(e) => dest.changeZip(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
    </>
  );
}

// Courier options for one destination, plus the hidden courier fields the order needs.
export function ShippingRateOptions({
  dest,
  radioName,
  companyName,
  typeName,
  error,
}: {
  dest: ShippingDestination;
  radioName: string;
  companyName: string;
  typeName: string;
  error?: string;
}) {
  const t = useI18n().t.checkout.method;
  const { rates, rate } = dest;
  return (
    <>
      {rates.status === "ready" && rates.rates.length > 0 ? (
        <div role="radiogroup" aria-label={t.title} className="flex flex-col gap-3">
          {rates.rates.map((r) => (
            <label
              key={rateKey(r)}
              className={`flex cursor-pointer items-center gap-3 rounded border px-4 py-3 text-sm transition-colors ${
                rate && rateKey(rate) === rateKey(r) ? "border-bistre bg-bistre/5" : "border-black/10"
              }`}
            >
              <input
                type="radio"
                name={radioName}
                required
                checked={rate ? rateKey(rate) === rateKey(r) : false}
                onChange={() => dest.selectRate(r)}
                className="accent-bistre"
              />
              <span className="flex flex-1 flex-col">
                <span>{r.name}</span>
                {r.duration && <span className="text-xs text-neutral-500">{r.duration}</span>}
              </span>
              <span>{formatRupiah(r.price)}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-100 p-5 text-center text-sm" aria-live="polite">
          {rates.status === "loading"
            ? t.loading
            : rates.status === "error"
              ? rates.message
              : rates.status === "ready"
                ? t.none
                : t.enterAddress}
        </div>
      )}
      <input type="hidden" name={companyName} value={rate?.company ?? ""} />
      <input type="hidden" name={typeName} value={rate?.type ?? ""} />
      {error && <p className="text-xs text-[#b10000]">{error}</p>}
    </>
  );
}
