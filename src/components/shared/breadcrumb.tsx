import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-base">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label} className="flex items-center gap-2">
              {it.href && !last ? (
                <Link href={it.href} className="hover:underline">
                  {it.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium" : ""}>
                  {it.label}
                </span>
              )}
              {!last && <ChevronRight className="size-4 text-aloeswood" strokeWidth={1.5} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
