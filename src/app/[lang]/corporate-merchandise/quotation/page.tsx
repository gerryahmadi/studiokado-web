import type { Metadata } from "next";
import { QuotationForm } from "@/components/corporate/quotation-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getAccount } from "@/lib/account";

export const metadata: Metadata = { title: "Request Quotation | Studiokado" };

export default async function QuotationPage() {
  // Signed-in customers get their details prefilled, and the request shows up in My Account.
  const account = await getAccount();

  return (
    <SiteShell>
      <div className="bg-white px-5">
        <QuotationForm
          defaults={{
            name: account?.name ?? "",
            company_name: account?.company.name ?? "",
            email: account?.email ?? "",
            phone: account?.phone ?? "",
          }}
        />
      </div>
    </SiteShell>
  );
}
