import { Reveal } from "./reveal";

// Row of "Card 2" cards from Framer (bold title + short text). Framer shows a grey placeholder box
// above the text where an illustration will go.
export function FeatureCards({ cards }: { cards: { title: string; description: string }[] }) {
  return (
    <ol className="grid w-full gap-4 md:grid-cols-3 md:items-center md:gap-5">
      {cards.map((c, i) => (
        <Reveal
          as="li"
          key={c.title}
          delay={i * 0.1}
          className="flex flex-col gap-8 rounded-xl border border-black/5 bg-[#fffef5] p-10"
        >
          <span aria-hidden className="block size-15 rounded-full bg-neutral-300" />
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">{c.title}</h3>
            <p>{c.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
