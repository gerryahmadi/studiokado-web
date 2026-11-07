import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getAccount, safeReturnPath } from "@/lib/account";

export const metadata: Metadata = { title: "Login | Studiokado" };

export default async function LoginPage({ searchParams }: PageProps<"/[lang]/login">) {
  const { next } = await searchParams;
  const returnTo = safeReturnPath(next);
  if (await getAccount()) redirect(returnTo);

  return (
    <SiteShell>
      <div className="bg-white px-6 pb-24 pt-[140px]">
        <LoginForm next={returnTo} />
      </div>
    </SiteShell>
  );
}
