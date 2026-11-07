"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronDown, Globe, X } from "lucide-react";
import { useState } from "react";
import { currencyName } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-store";

// Header "Currency" button + right-side drawer (Framer "Currency" / "Drawer - Currency Selector"):
// the visitor picks a country, grouped by region, and prices switch to its currency.
// Payment is always IDR, which the drawer states up front.
export function CurrencySelector({ label = "Currency" }: { label?: string }) {
  const { data, country, code, setCountry } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label={`${label}: ${code}`} className="flex h-12 items-center gap-2 pr-5 text-sm">
        <Globe className="size-6" strokeWidth={1.3} />
        {code}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-black/50 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[440px] flex-col overflow-y-auto bg-white px-6 py-8 text-bistre shadow-xl outline-none transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-lg">{label}</Dialog.Title>
            <Dialog.Close aria-label="Close" className="-mr-1 grid size-9 place-items-center text-neutral-500">
              <X className="size-7" strokeWidth={1} />
            </Dialog.Close>
          </div>

          <div className="mt-10">
            <p className="font-heading">
              {currencyName(code)} ({code})
            </p>
            <Dialog.Description className="mt-1 text-lg leading-relaxed text-neutral-500">
              Your current selected location is {country.name} and your order will be billed in IDR.
            </Dialog.Description>
          </div>

          <h3 className="mt-12 font-heading text-lg">Select your location</h3>

          <Accordion.Root className="mt-4 flex flex-col">
            {data.regions.map((region) => (
              <Accordion.Item key={region.name} value={region.name} className="border-b border-black/10">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left font-heading">
                    {region.name}
                    <ChevronDown
                      className="size-5 shrink-0 transition-transform group-data-[panel-open]:rotate-180"
                      strokeWidth={1.2}
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 data-[ending-style]:h-0 data-[starting-style]:h-0">
                  <ul className="flex flex-col pb-5">
                    {region.countries.map((c) => {
                      const selected = c.code === country.code;
                      return (
                        <li key={c.code}>
                          <button
                            type="button"
                            aria-current={selected || undefined}
                            onClick={() => {
                              setCountry(c.code);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between py-2.5 text-left text-lg transition-colors hover:text-aloeswood ${selected ? "font-medium" : ""}`}
                          >
                            <span>{c.name}</span>
                            <span>{c.currency}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
