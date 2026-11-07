import { getCurrencyData } from "@/lib/currency";

// Client-side retry for the currency drawer when the prerendered page got the IDR-only fallback
// (Laravel was unreachable at render time).
export async function GET() {
  return Response.json(await getCurrencyData());
}
