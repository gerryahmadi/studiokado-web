import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import { topBarNotification } from "@/lib/home-data";

// Highlight bar above the navbar (brown, centered white text with an underlined link).
export async function TopBarNotification() {
  if (!topBarNotification.active) return null;
  const { topBar } = (await getDictionary()).common;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-[37px] items-center justify-center gap-1.5 bg-aloeswood px-2.5 text-center text-sm text-white">
      <span>{topBar.text}</span>
      <Link href={topBarNotification.href} className="underline underline-offset-4 transition-opacity hover:opacity-80">
        {topBar.cta}
      </Link>
    </div>
  );
}
