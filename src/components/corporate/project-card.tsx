import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { corporateProjectHref, type CorporateProject } from "@/lib/corporate-data";

// Mirrors "Card - A" in Framer: tall photo with the client name and category over the bottom.
export function ProjectCard({
  project,
  delay = 0,
  className = "",
}: {
  project: CorporateProject;
  /** Seconds before the card rises in (staggers a row of cards). */
  delay?: number;
  className?: string;
}) {
  // The reveal wrapper carries the sizing classes so it sizes like the card did.
  return (
    <Reveal delay={delay} className={`min-w-0 ${className}`}>
      <Link
        href={corporateProjectHref(project.slug)}
        className="group relative block aspect-[3/5] overflow-hidden rounded-sm bg-ivory"
      >
        {project.image && (
          <Image
            src={project.image}
            alt={project.client}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-5 flex flex-col gap-1 p-5 text-center text-white">
          <span className="font-bold">{project.client}</span>
          <span className="text-sm">{project.category}</span>
        </div>
      </Link>
    </Reveal>
  );
}
