import { laravelRequest } from "./cart-server";

// Order tracking from Laravel Api\OrderTrackingController. Not a "use server" module (see account.ts);
// the form's server action lives in tracking-actions.ts.

export type ShipmentStatus = "waiting" | "on_delivery" | "delivered";

export type TrackingShipment = {
  position: number;
  name: string | null;
  phone: string | null;
  address: string | null;
  courier: string | null;
  tracking_number: string | null;
  status: ShipmentStatus;
  picked_up_at: string | null;
  delivered_at: string | null;
  items: { name: string | null; quantity: number }[];
  // Courier history, newest first.
  history: { at: string | null; note: string | null; status: string | null }[];
};

export type OrderTracking = {
  invoice: string;
  status: string;
  ordered_at: string | null;
  paid_at: string | null;
  delivery_date: string | null;
  customer: { name: string | null; email: string | null; phone: string | null };
  // Sent to several addresses: one shipment per recipient, each with its own courier.
  multiple: boolean;
  shipments: TrackingShipment[];
};

export type TrackingLookup =
  | { status: "found"; data: OrderTracking }
  | { status: "notFound" }
  | { status: "error"; message: string };

// Order or tracking (waybill) number + the checkout email. A signed-in owner may leave the email out.
export async function lookupOrder(number: string, email?: string): Promise<TrackingLookup> {
  const qs = new URLSearchParams({ number: number.trim() });
  if (email?.trim()) qs.set("email", email.trim());
  const result = await laravelRequest<OrderTracking>(`/api/orders/track?${qs}`);
  if (result.ok) return { status: "found", data: result.data };
  if (result.status === 404 || result.status === 422) return { status: "notFound" };
  return { status: "error", message: result.message };
}

// My Account > Orders: { uuid: { addresses, couriers } } for orders sent to several addresses.
export type OrderShipmentSummary = Record<string, { addresses: number; couriers: string[] }>;

export async function getOrderShipmentSummary(uuids: string[]): Promise<OrderShipmentSummary> {
  if (uuids.length === 0) return {};
  const qs = new URLSearchParams();
  for (const uuid of uuids) qs.append("uuids[]", uuid);
  const result = await laravelRequest<OrderShipmentSummary>(`/api/account/orders/shipments?${qs}`);
  // Laravel encodes an empty map as [].
  return result.ok && !Array.isArray(result.data) ? result.data : {};
}
