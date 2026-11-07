import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { InfoCard } from "@/components/account/info-card";
import { SiteShell } from "@/components/layout/site-shell";
import { requireAccount } from "@/lib/account";
import { updateAddress, updateProfile } from "@/lib/account-actions";
import { accountAvatar } from "@/lib/account-data";

export const metadata: Metadata = { title: "My Account | Studiokado" };

export default async function MyAccountPage() {
  const account = await requireAccount("/my-account");

  return (
    <SiteShell>
      <AccountShell active="profile">
        <InfoCard
          title="Contact Information"
          avatar={accountAvatar}
          action={updateProfile}
          fields={[
            { name: "first_name", label: "First Name", value: account.first_name },
            { name: "last_name", label: "Last Name", value: account.last_name },
            { name: "email", label: "Email Address", value: account.email, type: "email" },
            { name: "phone", label: "Phone No.", value: account.phone, type: "tel" },
          ]}
        />
        <InfoCard
          title="Address"
          columns={1}
          action={updateAddress}
          fields={[
            { name: "recipient", label: "Recipient", value: account.address.recipient },
            { name: "address", label: "Address", value: account.address.address, multiline: true },
          ]}
        />
      </AccountShell>
    </SiteShell>
  );
}
