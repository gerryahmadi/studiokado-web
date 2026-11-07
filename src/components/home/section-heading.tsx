import { Reveal, WordReveal } from "@/components/shared/reveal";
import { SectionLabel } from "@/components/shared/section-label";

// Centered heading used by the lower home sections. `eyebrow` is plain caps text,
// `label` is the rounded "Label" chip from Framer.
export function SectionHeading({
  eyebrow,
  label,
  title,
  description,
}: {
  eyebrow?: string;
  label?: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-3 text-center">
      {eyebrow && <p className="text-sm">{eyebrow}</p>}
      {label && (
        <div className="mb-3">
          <SectionLabel className="normal-case">{label}</SectionLabel>
        </div>
      )}
      <WordReveal as="h2" text={title} className="font-heading text-3xl" />
      <WordReveal text={description} delay={0.3} stagger={0.02} className="max-w-[80%]" />
    </Reveal>
  );
}
