import { getDictionary } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { TestimonialSlider } from "./testimonial-slider";

export type Testimonial = { quote: string; name: string; role: string; photo: string | null };

// Testimonials section (home and corporate pages): localized heading + the client-side slider.
export async function Testimonials({ items, className }: { items: Testimonial[]; className?: string }) {
  const t = (await getDictionary()).common.testimonials;

  return (
    <section className={cn("relative z-10 bg-[#fffef5] px-6 py-10 md:px-[60px]", className)}>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-24">
        <SectionHeading label={t.label} title={t.title} description={t.description} />
        <TestimonialSlider items={items} labels={{ rating: t.rating, previous: t.previous, next: t.next }} />
      </div>
    </section>
  );
}
