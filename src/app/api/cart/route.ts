import { cookies } from "next/headers";
import { laravelHeaders, laravelUrl } from "@/lib/api";
import { CART_COOKIE } from "@/lib/cart";
import { clientIp } from "@/lib/cart-server";

// Item count for the navbar badge. Fetched client-side so pages using the navbar stay static.
export async function GET() {
  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) return Response.json({ itemCount: 0 });

  try {
    const res = await fetch(laravelUrl("/api/cart"), {
      headers: laravelHeaders({ "X-Cart-Token": token, ...(await clientIp()) }),
      cache: "no-store",
    });
    if (!res.ok) return Response.json({ itemCount: 0 });
    const cart = (await res.json()) as { item_count: number };
    return Response.json({ itemCount: cart.item_count });
  } catch {
    return Response.json({ itemCount: 0 });
  }
}
