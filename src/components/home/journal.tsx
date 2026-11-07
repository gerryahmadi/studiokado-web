import Image from "next/image";
import Link from "next/link";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { journal } from "@/lib/home-data";

export async function Journal() {
  const t = (await getDictionary()).home.journal;

  return (
    <section className="relative z-10 flex flex-col gap-6 bg-[#fffef5] px-6 pb-20 pt-10 md:px-[50px]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <WordReveal as="h2" text={t.title} className="font-heading text-3xl text-aloeswood" />
        <WordReveal
          text={t.description}
          delay={0.3}
          stagger={0.02}
          className="text-aloeswood md:w-[478px] md:text-right"
        />
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {journal.articles.map((a) => (
          <Link key={a.key} href={a.href} className="group flex flex-col gap-3">
            <div className="relative aspect-[1.176] w-full overflow-hidden rounded-md">
              <Image
                src={a.image}
                alt={t.articles[a.key]}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="pr-4">{t.articles[a.key]}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
