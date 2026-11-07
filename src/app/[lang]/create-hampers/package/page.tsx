import type { Metadata } from "next";
import { PackageStep } from "@/components/hamper/package-step";
import { SiteShell } from "@/components/layout/site-shell";
import { getDictionary } from "@/i18n/server";
import { getHamperBoxes } from "@/lib/hamper-data";

export async function generateMetadata(): Promise<Metadata> {
  const { hamper, common } = await getDictionary();
  return { title: `${hamper.meta.package} | ${common.meta.titleSuffix}` };
}

// Dotted paper background ("PaperBackground" code component in Framer).
const dots = {
  backgroundImage: "radial-gradient(circle, rgba(50,77,82,0.2) 1px, transparent 1.5px)",
  backgroundSize: "28px 28px",
};

export default async function PackagePage() {
  const boxes = await getHamperBoxes();

  return (
    <SiteShell>
      <div className="min-h-screen bg-[#fdfdfd] px-6 pb-[100px] pt-[160px] md:px-[60px]" style={dots}>
        <PackageStep boxes={boxes} />
      </div>
    </SiteShell>
  );
}
