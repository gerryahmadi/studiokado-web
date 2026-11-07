import Image from "next/image";
import Link from "next/link";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { brideStory } from "@/lib/home-data";

export async function BrideStory() {
  const t = (await getDictionary()).home.brideStory;

  return (
    <section className="relative z-10 bg-[#fffef5] px-6 pb-[60px] pt-10 md:px-[50px]">
      <div className="flex flex-col overflow-hidden rounded-xl md:flex-row">
        <div className="relative h-80 md:w-1/2">
          <Image
            src={brideStory.image}
            alt={t.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#f0a481]/10" />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-5 bg-ivory px-8 py-10 md:pl-8 md:pr-[50px]">
          <div className="flex flex-col gap-1">
            <p className="text-lg">{t.eyebrow}</p>
            <WordReveal as="h2" text={t.title} className="font-heading text-4xl" />
            <p className="mt-1 text-sm leading-relaxed">{t.description}</p>
          </div>
          <Link
            href={brideStory.href}
            className="rounded-lg border border-[#403128] px-9 py-3 transition-colors hover:bg-[#403128] hover:text-white"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
