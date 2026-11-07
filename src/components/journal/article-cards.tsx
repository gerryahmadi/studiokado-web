import Image from "next/image";
import Link from "next/link";
import { journalHref, POST_PLACEHOLDER_IMAGE, type PostSummary } from "@/lib/journal-data";

// "article-large" in Framer: wide image on the left, title and "Read Now" on the right.
export function ArticleLarge({ article }: { article: PostSummary }) {
  return (
    <Link
      href={journalHref(article.slug)}
      className="group flex w-full flex-col items-center gap-8 md:flex-row md:gap-20"
    >
      <span className="relative block aspect-[1.651] w-full overflow-hidden rounded-md md:w-[64%]">
        <Image
          src={article.image ?? POST_PLACEHOLDER_IMAGE}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 768px) 64vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col gap-8">
        <span className="text-2xl font-medium leading-snug">{article.title}</span>
        {article.excerpt && <span className="font-light">{article.excerpt}</span>}
        <span className="text-base underline-offset-4 group-hover:underline">Read Now ↗</span>
      </span>
    </Link>
  );
}

// "article-small" in Framer: small thumbnail beside the title.
export function ArticleSmall({ article }: { article: PostSummary }) {
  return (
    <Link href={journalHref(article.slug)} className="group flex items-center gap-7 pr-6">
      <span className="relative block h-24 w-[140px] shrink-0 overflow-hidden rounded-md">
        <Image
          src={article.image ?? POST_PLACEHOLDER_IMAGE}
          alt=""
          fill
          sizes="140px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="font-medium leading-snug">{article.title}</span>
    </Link>
  );
}

// "article-card" in Framer (same card used on the homepage journal).
export function ArticleCardBlock({ article }: { article: PostSummary }) {
  return (
    <Link href={journalHref(article.slug)} className="group flex flex-col gap-3">
      <span className="relative block aspect-[1.176] w-full overflow-hidden rounded-md">
        <Image
          src={article.image ?? POST_PLACEHOLDER_IMAGE}
          alt={article.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="pr-4">{article.title}</span>
    </Link>
  );
}
