import { redirect } from "next/navigation";

// Multiple addresses now live in checkout ("Ship to: Multiple addresses").
export default function MultipleAddressPage() {
  redirect("/checkout?ship=multiple");
}
