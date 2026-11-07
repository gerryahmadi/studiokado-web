import Image from "next/image";
import Link from "next/link";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { specialEvent } from "@/lib/home-data";

export async function SpecialEvent() {
  const t = (await getDictionary()).home.specialEvent;

  return (
    <section className="relative z-10 bg-[#fffef5] px-6 py-6 md:px-[50px]">
      <div className="flex flex-col items-center gap-2.5 rounded-xl bg-ivory p-8 md:flex-row">
        <div className="relative h-[223px] w-full shrink-0 overflow-hidden md:w-[350px]">
          <Image
            src={specialEvent.image}
            alt=""
            fill
            sizes="(min-width: 768px) 350px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col items-start gap-5 p-5">
          <div className="flex flex-col gap-3">
            <WordReveal as="h2" text={t.title} className="font-heading text-4xl md:text-5xl" />
            <p className="text-sm">{t.description}</p>
          </div>
          <Link
            href={specialEvent.href}
            className="rounded-full bg-aloeswood px-[30px] py-[15px] text-white transition-opacity hover:opacity-90"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
