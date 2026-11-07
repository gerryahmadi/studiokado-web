import { BrideStory } from "@/components/home/bride-story";
import { CorporateGifting } from "@/components/home/corporate-gifting";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Instagram } from "@/components/home/instagram";
import { Journal } from "@/components/home/journal";
import { Occasions } from "@/components/home/occasions";
import { PopularHampers } from "@/components/home/popular-hampers";
import { ShoppingPath } from "@/components/home/shopping-path";
import { SpecialEvent } from "@/components/home/special-event";
import { Testimonials } from "@/components/home/testimonials";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { homeFaqKeys, homeTestimonials } from "@/lib/home-data";

export default async function HomePage() {
  const { home } = await getDictionary();
  const testimonials = homeTestimonials.map((t) => ({ ...t, ...home.testimonials[t.key] }));
  const faq = homeFaqKeys.map((key) => home.faq[key]);

  return (
    <SiteShell>
      <Hero />
      <ShoppingPath />
      <PopularHampers />
      <Occasions />
      <HowItWorks />
      <CorporateGifting />
      <BrideStory />
      <Testimonials items={testimonials} />
      <Instagram />
      <Journal />
      <Faq items={faq} />
      <SpecialEvent />
    </SiteShell>
  );
}
