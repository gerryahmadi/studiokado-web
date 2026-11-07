import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { SiteShell } from "@/components/layout/site-shell";
import { requireAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Change Password | Studiokado" };

export default async function ChangePasswordPage() {
  const account = await requireAccount("/my-account/change-password");

  return (
    <SiteShell>
      <AccountShell active="password">
        <ChangePasswordForm hasPassword={account.has_password} />
      </AccountShell>
    </SiteShell>
  );
}
