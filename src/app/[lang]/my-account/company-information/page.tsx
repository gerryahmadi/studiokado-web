import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { InfoCard } from "@/components/account/info-card";
import { SiteShell } from "@/components/layout/site-shell";
import { requireAccount } from "@/lib/account";
import { updateCompany } from "@/lib/account-actions";

export const metadata: Metadata = { title: "Company Information | Studiokado" };

export default async function CompanyInformationPage() {
  const { company } = await requireAccount("/my-account/company-information");

  return (
    <SiteShell>
      <AccountShell active="company">
        <InfoCard
          title="Basic Information"
          action={updateCompany}
          fields={[
            { name: "name", label: "Company Name", value: company.name },
            { name: "industry", label: "Industry", value: company.industry },
            { name: "website", label: "Company Website", value: company.website },
            { name: "email", label: "Company Email", value: company.email, type: "email" },
            { name: "phone", label: "Company Phone", value: company.phone, type: "tel" },
          ]}
        />
        <InfoCard
          title="Company Address"
          columns={1}
          action={updateCompany}
          fields={[{ name: "address", label: "Address", value: company.address, multiline: true }]}
        />
        <InfoCard
          title="Tax Information (Optional)"
          columns={1}
          action={updateCompany}
          fields={[
            { name: "npwp", label: "NPWP No.", value: company.npwp },
            { name: "tax_name", label: "Tax Registered Name", value: company.tax_name },
          ]}
        />
      </AccountShell>
    </SiteShell>
  );
}
