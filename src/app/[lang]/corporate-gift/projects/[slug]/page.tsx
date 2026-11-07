import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/corporate/project-card";
import { ScrollRow } from "@/components/corporate/scroll-row";
import { SiteShell } from "@/components/layout/site-shell";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/server";
import { getCorporateProject, projectDetailBackHref } from "@/lib/corporate-data";

export async function generateMetadata({ params }: PageProps<"/[lang]/corporate-gift/projects/[slug]">): Promise<Metadata> {
  const [project, { corporate, common }] = await Promise.all([getCorporateProject((await params).slug), getDictionary()]);
  if (!project) return {};
  return {
    title: `${format(corporate.meta.projectTitle, { project: project.meta.title })} | ${common.meta.titleSuffix}`,
    description: project.meta.description ?? undefined,
  };
}

export default async function CorporateProjectDetailPage({ params }: PageProps<"/[lang]/corporate-gift/projects/[slug]">) {
  const [p, { corporate, common }] = await Promise.all([getCorporateProject((await params).slug), getDictionary()]);
  if (!p) notFound();
  const t = corporate.projectDetail;

  return (
    <SiteShell>
      <div className="bg-white px-5">
        <div className="mx-auto flex max-w-[80%] flex-col gap-7 px-0 pb-12 pt-[160px] md:px-[50px]">
          <Link href={projectDetailBackHref} className="flex w-fit items-center gap-2 text-base">
            <ArrowLeft className="size-[27px] text-aloeswood" strokeWidth={1.5} />
            {t.back}
          </Link>

          <div className="flex flex-col gap-2">
            {p.category && <p className="text-base">{p.category}</p>}
            <h1 className="font-heading text-3xl md:text-4xl">{p.title}</h1>
            {p.subtitle && <p className="text-lg">{p.subtitle}</p>}
          </div>

          <div className="flex flex-col gap-7 pb-8">
            {p.images.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                {p.images.map((src) => (
                  <div key={src} className="relative h-[475px] overflow-hidden">
                    <Image src={src} alt={p.title} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {p.sections.map((s, i) => (
              <section key={i} className="flex flex-col gap-5">
                {s.title && <h2 className="font-heading text-2xl">{s.title}</h2>}
                {/* Admin-authored HTML, rendered unescaped like the Laravel blade view. */}
                {s.html && <div className="article-content" dangerouslySetInnerHTML={{ __html: s.html }} />}
                {s.image && (
                  <div className="relative h-[475px] overflow-hidden">
                    <Image src={s.image} alt={p.title} fill sizes="80vw" className="object-cover" />
                  </div>
                )}
              </section>
            ))}
          </div>

          {p.related.length > 0 && (
            <>
              <div className="h-0.5 w-full bg-[#e3e3e3]" />
              <ScrollRow title={t.related} labels={common.carousel} headingClassName="font-heading text-3xl md:text-4xl">
                {p.related.map((r) => (
                  <ProjectCard key={r.slug} project={r} className="w-[240px] shrink-0 md:w-[calc(25%-12px)]" />
                ))}
              </ScrollRow>
            </>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
