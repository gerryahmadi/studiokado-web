import { FeatureCards } from "@/components/shared/feature-cards";
import { getDictionary } from "@/i18n/server";
import { howItWorksSteps } from "@/lib/home-data";
import { SectionHeading } from "./section-heading";

export async function HowItWorks() {
  const t = (await getDictionary()).home.howItWorks;

  return (
    <section className="relative z-10 bg-[#fffef5] px-6 py-20 md:px-[60px]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-12">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <FeatureCards cards={howItWorksSteps.map((key) => t.steps[key])} />
      </div>
    </section>
  );
}
