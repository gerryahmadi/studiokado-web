import Image from "next/image";
import Link from "next/link";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { occasions } from "@/lib/home-data";

export async function Occasions() {
  const t = (await getDictionary()).home.occasions;

  return (
    <section className="relative z-10 flex flex-col gap-6 bg-ivory px-6 pb-[60px] pt-[52px] md:px-[50px]">
      <div className="flex flex-col gap-2.5">
        <WordReveal text={t.eyebrow} className="text-sm" />
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-10">
          <WordReveal as="h2" text={t.title} delay={0.1} className="font-heading text-3xl text-aloeswood" />
          <WordReveal text={t.description} delay={0.3} stagger={0.02} className="text-sm md:w-[478px] md:text-right" />
        </div>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none]">
        {occasions.items.map((o) => (
          <Link
            key={o.key}
            href={o.href}
            className="group relative size-[280px] shrink-0 overflow-hidden rounded-xl border border-ivory"
          >
            <Image
              src={o.image}
              alt={t.items[o.key]}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <WordReveal
              as="span"
              text={t.items[o.key]}
              delay={0.2}
              className="absolute inset-x-0 bottom-4 text-center font-heading text-lg text-white"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
