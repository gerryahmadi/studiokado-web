import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/server";
import { shoppingPath } from "@/lib/home-data";
import { CarouselSection } from "./carousel-section";

export async function ShoppingPath() {
  const { home, common } = await getDictionary();
  const t = home.shoppingPath;

  return (
    <CarouselSection eyebrow={t.eyebrow} title={t.title} description={t.description} labels={common.carousel}>
      {shoppingPath.options.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          className="group relative flex h-[364px] w-[85%] shrink-0 items-end overflow-hidden rounded-xl md:w-auto md:flex-1"
        >
          <Image
            src={o.image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 85vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(60,43,33,0)_37%,#3c2b21_87%)]" />
          <div className="relative z-10 flex flex-col p-8 text-white">
            <p className="max-w-[15rem] text-sm font-medium">{t.options[o.key].label}</p>
            <span className="max-h-0 overflow-hidden text-sm underline underline-offset-4 opacity-0 transition-all group-hover:mt-3 group-hover:max-h-6 group-hover:opacity-100">
              {t.options[o.key].cta}
            </span>
          </div>
        </Link>
      ))}
    </CarouselSection>
  );
}
