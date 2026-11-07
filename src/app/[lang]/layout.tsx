import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { WhatsappCta } from "@/components/layout/whatsapp-cta";
import { I18nProvider } from "@/i18n/client";
import { localeTags, locales } from "@/i18n/config";
import { pickClientMessages } from "@/i18n/namespaces";
import { getDictionary, getLocale } from "@/i18n/server";
import { getCurrencyData } from "@/lib/currency";
import { CurrencyProvider } from "@/lib/currency-store";
import "../globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

// Prerender every page once per locale; src/proxy.ts picks which one a visitor gets.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { common } = await getDictionary();
  return { title: common.meta.title, description: common.meta.description };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dictionary, currency] = await Promise.all([getLocale(), getDictionary(), getCurrencyData()]);

  return (
    <html lang={localeTags[locale]} className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
      <body className="min-h-screen bg-white font-sans text-bistre">
        <I18nProvider locale={locale} messages={pickClientMessages(dictionary)}>
          <CurrencyProvider data={currency}>
            {children}
            <WhatsappCta />
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
