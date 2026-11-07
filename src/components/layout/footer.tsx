import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/server";

// Mirrors the "Footer" component in Framer. Labels come from common.footer in the dictionary.
const columns = [
  {
    key: "company",
    links: [
      { key: "aboutUs", href: "/about-us" },
      { key: "createHampers", href: "/create-hampers/package" },
      { key: "corporateHampers", href: "/corporate-gift" },
      { key: "faqs", href: "/faqs" },
    ],
  },
  {
    key: "help",
    links: [
      { key: "becomeVendor", href: "/become-a-vendor" },
      { key: "shipping", href: "/shipping" },
      { key: "privacy", href: "/privacy-policy" },
      { key: "terms", href: "/terms-and-conditions" },
      { key: "returns", href: "/return-and-refunds" },
    ],
  },
  {
    key: "connect",
    links: [
      { key: "journal", href: "/journal" },
      { key: "contact", href: "/contact-us" },
      { key: "caseStudies", href: "/case-studies" },
      { key: "careers", href: "/careers" },
      { key: "trackOrder", href: "/tracking-order" },
    ],
  },
] as const;

export async function Footer() {
  const { common } = await getDictionary();
  const t = common.footer;

  return (
    <footer className="relative z-10 bg-bistre px-8 py-[100px] text-[#fafafa]">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label={common.nav.home}>
            <Image
              src="/images/layout/logo-footer.png"
              alt="Studiokado"
              width={201}
              height={54}
              className="h-[54px] w-auto"
            />
          </Link>
          <address className="text-sm leading-[1.2] not-italic">
            Menara Rajawali, Ground Floor Jl. DR. Ide Anak Agung
            <br />
            Gde Agung RT.5/RW.2, Kuningan, Jakarta, 12950
          </address>
        </div>

        <div className="grid grid-cols-2 gap-5 gap-y-10 sm:grid-cols-[repeat(3,167px)] sm:gap-y-5">
          {columns.map((c) => (
            <div key={c.key} className="flex flex-col gap-4">
              <h3 className="font-heading text-lg leading-[1.3] tracking-[-0.02em] text-white">
                {t.columns[c.key]}
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-[1.2]">
                {c.links.map((l) => (
                  <li key={l.key}>
                    <Link href={l.href} className="transition-opacity hover:opacity-70">
                      {t.links[l.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
