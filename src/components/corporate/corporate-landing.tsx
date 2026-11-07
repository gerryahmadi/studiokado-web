import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/home/faq";
import { Testimonials } from "@/components/home/testimonials";
import { FeatureCards } from "@/components/shared/feature-cards";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import { SectionLabel } from "@/components/shared/section-label";
import { getDictionary } from "@/i18n/server";
import {
  corporateHero,
  corporateProjectHref,
  corporateSpecialists,
  merchandiseHref,
  orderDetailCards,
  reachMap,
  whatsappHref,
  whyUsCards,
  type CorporateLandingResponse,
} from "@/lib/corporate-data";

function Heading({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <Reveal className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
      <SectionLabel>{label}</SectionLabel>
      <WordReveal as="h2" text={title} className="font-heading text-2xl md:text-3xl" />
      {description && <WordReveal text={description} delay={0.3} stagger={0.02} className="max-w-[80%] leading-relaxed" />}
    </Reveal>
  );
}

const button = "rounded-lg px-[30px] py-[15px] text-center transition-opacity hover:opacity-90";
const outlineCta =
  "w-full rounded-lg border border-bistre px-6 py-3 text-center text-sm transition-colors hover:bg-bistre hover:text-white md:w-[32%]";

function Marquee({ logos, reverse = false }: { logos: string[]; reverse?: boolean }) {
  // Items are rendered twice so translating by -50% loops seamlessly.
  const loop = [...logos, ...logos];
  return (
    <div className="mx-auto w-full max-w-[90%] overflow-hidden">
      <ul
        className="flex w-max items-center gap-16"
        style={{ animation: `marquee 30s linear infinite ${reverse ? "reverse" : ""}` }}
      >
        {loop.map((src, i) => (
          <li key={i} className="relative h-[90px] w-[122px] shrink-0 opacity-80">
            <Image src={src} alt="" fill sizes="122px" className="object-contain" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function CorporateLanding({ data }: { data: CorporateLandingResponse }) {
  const t = (await getDictionary()).corporate;
  const logos = data.logos.map((l) => l.image);
  // Two rows of logos scrolling in opposite directions.
  const half = Math.ceil(logos.length / 2);
  const whatsapp = whatsappHref(data.whatsapp);

  return (
    <div className="bg-white px-5 pt-[117px]">
      {/* Hero */}
      {/* Full-bleed: cancels the page's 20px side padding. Image is the Framer banner, not the admin one. */}
      <section className="relative -mx-5 flex min-h-[560px] items-end overflow-hidden p-6 md:h-[746px] md:p-[60px]">
        <Image src={corporateHero.image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-[652px] max-h-full bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 flex w-full flex-col gap-6 text-white">
          <div className="flex flex-col gap-4">
            <WordReveal text={t.hero.eyebrow} />
            <WordReveal
              as="h1"
              text={t.hero.title}
              delay={0.15}
              stagger={0.06}
              className="max-w-4xl font-heading text-4xl leading-[1.2] md:text-[64px]"
            />
            <WordReveal text={t.hero.description} delay={0.5} stagger={0.015} className="max-w-[691px]" />
          </div>
          <Reveal delay={0.8} className="flex flex-wrap gap-4">
            <Link href={corporateHero.primaryHref} className={`${button} bg-[#8b5e3c] text-white`}>
              {t.hero.primary}
            </Link>
            <Link href={corporateHero.secondaryHref} className={`${button} border border-white text-white`}>
              {t.hero.secondary}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Trusted by */}
      <section className="flex flex-col items-center gap-6 px-0 pb-[100px] pt-20 md:px-[60px]">
        <Reveal className="flex flex-col items-center gap-6">
          <SectionLabel>{t.trustedBy.label}</SectionLabel>
          <WordReveal as="h2" text={t.trustedBy.title} className="max-w-[70%] text-center font-heading text-2xl md:text-3xl" />
        </Reveal>
        <Reveal delay={0.2} className="flex w-full flex-col gap-6">
          <Marquee logos={logos.slice(0, half)} />
          <Marquee logos={logos.slice(half)} reverse />
        </Reveal>
      </section>

      {/* Why Studiokado */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 py-[100px] md:px-[60px]">
        <Heading label={t.whyUs.label} title={t.whyUs.title} />
        <FeatureCards cards={whyUsCards.map((key) => t.whyUs.cards[key])} />
      </section>

      {/* Custom gift boxes: image grid of featured projects */}
      <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 py-[100px] md:px-[60px]">
        <Heading label={t.customGifts.label} title={t.customGifts.title} description={t.customGifts.description} />
        <div className="grid w-full max-w-[1080px] grid-cols-2 gap-4 md:grid-cols-4">
          {data.featured_projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.1}>
              <Link
                href={corporateProjectHref(p.slug)}
                aria-label={p.client}
                className="group relative block aspect-[314/284] overflow-hidden bg-ivory"
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.client}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
            </Reveal>
          ))}
        </div>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={outlineCta}>
          {t.customGifts.cta}
        </a>
      </section>

      {/* Order details */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 py-[100px] md:px-[60px]">
        <Heading label={t.orderDetails.label} title={t.orderDetails.title} />
        <FeatureCards cards={orderDetailCards.map((key) => t.orderDetails.cards[key])} />
      </section>

      {/* Merchandise ("Card - A" in Framer) */}
      <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-9 pb-[100px] pt-20 md:px-[60px]">
        <Heading label={t.merchandise.label} title={t.merchandise.title} description={t.merchandise.description} />
        <div className="grid w-full max-w-[1080px] grid-cols-2 gap-4 md:flex md:h-[500px]">
          {data.merchandise.slice(0, 4).map((m, i) => (
            <Reveal key={i} delay={i * 0.1} className="md:flex-1">
              <Link
                href={merchandiseHref}
                className="group relative block aspect-[0.6] h-full overflow-hidden md:aspect-auto"
              >
                <Image
                  src={m.image}
                  alt={m.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 text-white">
                  <span className="text-xl font-bold">{m.title}</span>
                  <span className="text-sm">{m.subtitle}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link href={merchandiseHref} className={outlineCta}>
          {t.merchandise.cta}
        </Link>
      </section>

      {/* Reach */}
      <section className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 py-[100px] md:px-[60px]">
        <Heading label={t.reach.label} title={t.reach.title} description={t.reach.description} />
        {/* Decorative world map ("Map" component in Framer). */}
        <Reveal className="w-full">
          <Image src={reachMap} alt="" width={1200} height={625} unoptimized className="h-auto w-full" />
        </Reveal>
      </section>

      <Testimonials items={data.testimonials} className="bg-white px-0 py-[100px]" />

      <Faq items={data.faq} className="bg-white px-0" />

      {/* Specialists */}
      <section className="mb-20 flex flex-col gap-4 rounded-xl bg-[#fbf8f4] px-6 py-9 md:px-8">
        <Reveal className="flex flex-col items-center gap-3 p-5 text-center">
          <WordReveal as="h2" text={t.specialists.title} className="font-heading text-2xl md:text-3xl" />
          <WordReveal text={t.specialists.description} delay={0.3} stagger={0.02} />
        </Reveal>
        <div className="grid gap-10 px-5 pb-5 md:grid-cols-2 md:gap-[52px]">
          {corporateSpecialists.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.15} className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative aspect-[0.65] w-40 shrink-0 overflow-hidden rounded-full sm:w-[38%]">
                <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col items-start gap-2">
                  <p className="font-heading text-xl">{p.name}</p>
                  <span className="rounded-full bg-[#e7d7c4] px-3 py-2 text-sm">{t.specialists.people[p.key].role}</span>
                </div>
                <p className="text-sm">{t.specialists.people[p.key].description}</p>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${button} bg-aloeswood text-white`}
                >
                  {t.specialists.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
