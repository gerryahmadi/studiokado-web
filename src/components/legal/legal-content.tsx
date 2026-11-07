import { SiteShell } from "@/components/layout/site-shell";

export type LegalPage = { title: string; html: string };

// Same structure as Laravel's pages/basic.blade.php: a title over the CMS-authored HTML.
// Content comes from the `legal` dictionary (src/i18n/messages/*/legal-documents.ts).
export function LegalContent({ page }: { page: LegalPage }) {
  return (
    <SiteShell>
      <div className="bg-[#fffef5] px-6 pb-24 pt-[150px] md:px-[50px]">
        <div className="mx-auto flex max-w-[900px] flex-col gap-10">
          <h1 className="text-3xl font-bold md:text-4xl">{page.title}</h1>
          {/* Trusted HTML from our own dictionary files, rendered unescaped like the Laravel blade view. */}
          <article className="article-content" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </div>
    </SiteShell>
  );
}
