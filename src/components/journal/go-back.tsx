"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

// "link.button-icon" variant used as a back link.
export function GoBack() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex w-fit items-center gap-1 underline-offset-4 hover:underline"
    >
      <ArrowUpRight className="size-4 -scale-x-100" strokeWidth={1.5} />
      Go back
    </button>
  );
}
