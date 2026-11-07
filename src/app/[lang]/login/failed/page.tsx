import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/auth-form";
import { SiteShell } from "@/components/layout/site-shell";
import { safeReturnPath } from "@/lib/account";

export const metadata: Metadata = { title: "Login | Studiokado" };

// The login action lands here when Laravel rejects the email/password.
export default async function LoginFailedPage({ searchParams }: PageProps<"/[lang]/login/failed">) {
  const { next } = await searchParams;

  return (
    <SiteShell>
      <div className="bg-white px-6 pb-24 pt-[200px]">
        <LoginForm failed next={safeReturnPath(next)} />
      </div>
    </SiteShell>
  );
}
