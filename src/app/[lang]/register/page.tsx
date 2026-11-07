import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getAccount, safeReturnPath } from "@/lib/account";

export const metadata: Metadata = { title: "Register | Studiokado" };

export default async function RegisterPage({ searchParams }: PageProps<"/[lang]/register">) {
  const { next } = await searchParams;
  const returnTo = safeReturnPath(next);
  if (await getAccount()) redirect(returnTo);

  return (
    <SiteShell>
      <div className="bg-white px-6 pb-24 pt-[140px]">
        <RegisterForm next={returnTo} />
      </div>
    </SiteShell>
  );
}
