import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/corporate/project-card";
import { ScrollRow } from "@/components/corporate/scroll-row";
import { SiteShell } from "@/components/layout/site-shell";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { corporateHero, corporateProjectHref, getCorporateProjects, portfolio } from "@/lib/corporate-data";

export async function generateMetadata(): Promise<Metadata> {
  const { corporate, common } = await getDictionary();
  return { title: `${corporate.meta.portfolioTitle} | ${common.meta.titleSuffix}` };
}

export default async function CorporateProjectsPage() {
  const [{ hero_image, categories }, { corporate, common }] = await Promise.all([getCorporateProjects(), getDictionary()]);
  const t = corporate.portfolio;

  return (
    <SiteShell>
      <div className="bg-white px-5">
        <section className="relative flex min-h-[520px] items-end overflow-hidden p-6 pt-[157px] md:p-[60px]">
          <Image src={hero_image ?? corporateHero.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex max-w-[80%] flex-col gap-6 pb-8 text-white md:pl-[50px]">
            <div className="flex flex-col gap-4">
              <WordReveal as="h1" text={t.title} stagger={0.06} className="font-heading text-4xl md:text-5xl" />
              <WordReveal text={t.description} delay={0.4} stagger={0.02} className="max-w-[691px] text-lg" />
            </div>
            <Link
              href={portfolio.ctaHref}
              className="w-fit rounded-full bg-[#8b5e3c] px-[30px] py-[15px] text-white transition-opacity hover:opacity-90"
            >
              {t.cta}
            </Link>
          </div>
        </section>

        <section className="bg-[#f6f3e9] px-6 pb-[120px] pt-[60px] md:px-[100px]">
          <div className="mx-auto flex max-w-[90%] flex-col gap-[60px]">
            {categories.map((c, i) => (
              <div key={c.slug} className="flex flex-col gap-[60px]">
                {i > 0 && <div className="h-0.5 w-full bg-[#e9e1d3]" />}
                <ScrollRow title={c.title} labels={common.carousel}>
                  <div className="flex w-full gap-4 lg:gap-6">
                    {/* Every client in the category; the cards show the first few. */}
                    <ul className="hidden w-[20%] shrink-0 flex-col gap-2 text-base lg:flex">
                      {c.projects.map((p) => (
                        <li key={p.slug}>
                          <Link href={corporateProjectHref(p.slug)} className="hover:underline">
                            {p.client}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-1 gap-4">
                      {c.projects.slice(0, portfolio.cardsPerRow).map((p, i) => (
                        <ProjectCard
                          key={p.slug}
                          project={p}
                          delay={i * 0.1}
                          className="w-[220px] shrink-0 lg:w-auto lg:flex-1"
                        />
                      ))}
                    </div>
                  </div>
                </ScrollRow>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
