import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export async function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const t = (await getDictionary()).common.faq;

  return (
    <section className={cn("relative z-10 bg-[#fffef5] px-6 pb-[100px] md:px-[60px]", className)}>
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-[60px]">
        <SectionHeading label={t.label} title={t.title} description={t.description} />
        <Accordion className="w-full max-w-[800px]">
          {items.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-b border-bistre/15">
              <AccordionTrigger className="py-5 font-heading text-lg font-normal hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
