import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { OrdersList } from "@/components/account/orders-list";
import { SiteShell } from "@/components/layout/site-shell";
import { getAccountOrders, requireAccount } from "@/lib/account";
import { orderTabs } from "@/lib/account-data";
import { getOrderShipmentSummary } from "@/lib/tracking";

export const metadata: Metadata = { title: "Orders | Studiokado" };

export default async function AccountOrdersPage({ searchParams }: PageProps<"/[lang]/my-account/orders">) {
  const { status, page } = await searchParams;
  const group = orderTabs.find((t) => t.group && t.group === status)?.group;
  const pageNumber = Math.max(1, Number(page) || 1);

  await requireAccount("/my-account/orders");
  const data = await getAccountOrders(group, pageNumber);
  const shipments = await getOrderShipmentSummary(data.orders.map((o) => o.uuid));

  return (
    <SiteShell>
      <AccountShell active="orders">
        <OrdersList {...data} group={group} shipments={shipments} />
      </AccountShell>
    </SiteShell>
  );
}
