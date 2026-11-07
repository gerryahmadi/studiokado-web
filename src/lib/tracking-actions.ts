"use server";

import { lookupOrder, type TrackingLookup } from "./tracking";

export type TrackState = { status: "idle" } | TrackingLookup;

// "Track" on /tracking-order.
export async function trackOrder(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const number = String(formData.get("number") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!number) return { status: "notFound" };
  return lookupOrder(number, email);
}
