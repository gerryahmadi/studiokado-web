import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Mirrors the "link.button-icon" component in Framer.
export function LinkButtonIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex w-fit items-center gap-1 underline-offset-4 hover:underline">
      {children}
      <ArrowUpRight className="size-4" strokeWidth={1.5} />
    </Link>
  );
}
