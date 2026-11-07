import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { CartButton } from "./cart-button";
import { CurrencySelector } from "./currency-selector";
import { LanguageSwitcher } from "./language-switcher";

// Mirrors the "Navbar white" component in Framer.
const links = [
  { key: "quickHampers", href: "/quick-hampers" },
  { key: "createHampers", href: "/create-hampers/package" },
  { key: "corporateHampers", href: "/corporate-gift", chevron: true },
  { key: "journal", href: "/journal" },
  { key: "faqs", href: "/faqs" },
  { key: "trackOrder", href: "/tracking-order" },
] as const;

export async function Navbar() {
  const [locale, { common }] = await Promise.all([getLocale(), getDictionary()]);
  const t = common.nav;

  return (
    <header className="fixed inset-x-0 top-[37px] z-50 bg-[#fffef5]">
      <nav className="relative mx-auto flex items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" aria-label="Studiokado">
          <Image
            src="/images/layout/logo-navbar.png"
            alt="Studiokado"
            width={143}
            height={44}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Centred like Framer from 1160px; below that it sits in flow, tighter, so it can't overlap the logo/icons. */}
        <ul className="hidden w-max items-center gap-4 text-[13px] lg:flex min-[1160px]:absolute min-[1160px]:left-1/2 min-[1160px]:-translate-x-1/2 min-[1160px]:gap-8 min-[1160px]:text-sm">
          {links.map((l) => (
            <li key={l.key}>
              <Link href={l.href} className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-aloeswood">
                {t[l.key]}
                {"chevron" in l && <ChevronDown className="size-3.5 text-neutral-500" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <CurrencySelector label={t.currency} />
          <CartButton labels={t.cart} />
          {/* Guests are sent on to /login by the account pages. */}
          <Link href="/my-account" aria-label={t.account} className="grid size-12 place-items-center">
            <User className="size-6" strokeWidth={1.3} />
          </Link>
          <LanguageSwitcher locale={locale} labels={common.language} />
        </div>
      </nav>
    </header>
  );
}
