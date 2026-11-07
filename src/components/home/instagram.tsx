import Script from "next/script";
import { WordReveal } from "@/components/shared/reveal";
import { getDictionary } from "@/i18n/server";
import { instagram } from "@/lib/home-data";

// Striped skeleton shown until the Elfsight widget injects the feed into its container.
const placeholder = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(60,43,33,0.06) 0 2px, transparent 2px 22px)",
};

export async function Instagram() {
  const t = (await getDictionary()).home.instagram;

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
      {/* Same Elfsight Instagram feed as the Laravel site (resources/views/inc/instagram-feed.blade.php). */}
      <div className={`peer elfsight-app-${instagram.elfsightAppId}`} data-elfsight-app-lazy />
      <a
        href={instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.title}
        className="hidden grid-cols-2 gap-2.5 peer-empty:grid md:grid-cols-5"
      >
        {Array.from({ length: instagram.slots }, (_, i) => (
          <span key={i} className="block h-[232px] bg-[#e7e5dc]" style={placeholder} />
        ))}
      </a>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </section>
  );
}
