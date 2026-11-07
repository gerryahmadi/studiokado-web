"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localeNames, locales, type Locale } from "@/i18n/config";
import { format } from "@/i18n/format";

// Language dropdown at the right end of the navbar. Saves the choice in the locale cookie, which
// src/proxy.ts reads to serve the other language under the same URL. It then does a full reload:
// router.refresh() only re-renders the current page, while pages the router already prefetched
// would keep showing the old language on client-side navigation.
export function LanguageSwitcher({ locale, labels }: { locale: Locale; labels: { label: string; current: string } }) {
  const [pending, setPending] = useState(false);

  const change = (next: unknown) => {
    if (!isLocale(next) || next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    setPending(true);
    window.location.reload();
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={format(labels.current, { language: localeNames[locale].name })}
        aria-busy={pending || undefined}
        className="flex h-12 items-center gap-1 pl-2 text-sm transition-opacity data-[popup-open]:opacity-70 aria-busy:opacity-50"
      >
        {localeNames[locale].short}
        <ChevronDown className="size-3.5 text-neutral-500" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={4} className="z-[70]">
          <Menu.Popup className="min-w-44 origin-[var(--transform-origin)] rounded-lg border border-bistre/10 bg-[#fffef5] p-1 text-sm text-bistre shadow-lg transition-[opacity,transform] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <Menu.RadioGroup value={locale} onValueChange={change} aria-label={labels.label}>
              {locales.map((l) => (
                <Menu.RadioItem
                  key={l}
                  value={l}
                  lang={l}
                  className="flex cursor-pointer items-center justify-between gap-6 rounded-md px-3 py-2 outline-none select-none data-[highlighted]:bg-bistre/10"
                >
                  <span>
                    <span className="mr-2 inline-block w-6 font-medium">{localeNames[l].short}</span>
                    {localeNames[l].name}
                  </span>
                  <Menu.RadioItemIndicator>
                    <Check className="size-4 text-aloeswood" />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
