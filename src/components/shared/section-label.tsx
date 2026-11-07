import { cn } from "@/lib/utils";

// Mirrors the "Label" component in Framer (small rounded chip above section headings).
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-[#3d2c22]/10 px-2.5 py-1.5 text-base uppercase text-[#33261f]",
        className,
      )}
    >
      {children}
    </span>
  );
}
