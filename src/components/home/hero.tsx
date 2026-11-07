import Link from "next/link";
import { Reveal, WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { hero } from "@/lib/home-data";

const buttonClass = {
  solid: "bg-[#b10000] border-[#b10000]",
  outline: "border-white",
};

export async function Hero() {
  const t = (await getDictionary()).home.hero;

  return (
    <div className="pt-[117px]">
      <section className="sticky top-0 h-[75vh] min-h-[480px] w-full overflow-hidden bg-bistre">
        <video
          src={hero.video}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-10 text-white">
          <div className="flex max-w-[600px] flex-col gap-6">
            <div className="flex flex-col gap-4">
              <WordReveal text={t.eyebrow} className="text-lg" />
              <WordReveal
                as="h1"
                text={t.title}
                delay={0.15}
                stagger={0.06}
                className="font-heading text-5xl leading-[1.2] md:text-6xl"
              />
              <WordReveal text={t.description} delay={0.5} stagger={0.02} className="max-w-[540px] text-lg" />
            </div>
            <Reveal delay={0.8} className="flex flex-wrap gap-2.5">
              {hero.buttons.map((b) => (
                <Link
                  key={b.key}
                  href={b.href}
                  className={`rounded-lg border px-6 py-3 text-white transition-opacity hover:opacity-90 ${buttonClass[b.variant]}`}
                >
                  {t.buttons[b.key]}
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
