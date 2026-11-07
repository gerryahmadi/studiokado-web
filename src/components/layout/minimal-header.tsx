import Image from "next/image";
import Link from "next/link";

// Logo-only header used on the cart / checkout flow ("Navbar white" in Framer).
export function MinimalHeader({ offsetTopBar = false }: { offsetTopBar?: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 z-50 bg-white px-6 py-4 md:px-12 ${offsetTopBar ? "top-[37px]" : "top-0"}`}
    >
      <Link href="/" aria-label="Studiokado" className="inline-block">
        <Image
          src="/images/layout/logo-navbar.png"
          alt="Studiokado"
          width={165}
          height={44}
          priority
          className="h-11 w-auto"
        />
      </Link>
    </header>
  );
}
