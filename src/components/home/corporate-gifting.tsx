import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { corporateGifting } from "@/lib/home-data";
import { SectionHeading } from "./section-heading";

export async function CorporateGifting() {
  const t = (await getDictionary()).home.corporateGifting;
  const project = corporateGifting;

  return (
    <section className="relative z-10 bg-[#fffef5] px-6 py-[100px] md:px-[60px]">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-12">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />
        <Reveal className="w-full">
          <Link href={project.href} className="group relative block h-[320px] w-full overflow-hidden md:h-[500px]">
            <Image
              src={project.image}
              alt={project.client}
              fill
              sizes="(min-width: 1200px) 1080px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 text-white">
              <span className="text-xl font-bold">{project.client}</span>
              <span className="text-sm">{t.projectSubtitle}</span>
            </div>
          </Link>
        </Reveal>
        <Link
          href={project.href}
          className="w-full rounded-lg border border-bistre px-6 py-3 text-center text-sm transition-colors hover:bg-bistre hover:text-white md:w-[62%]"
        >
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
