// Static content for the cart / checkout / QRIS / multiple-address pages.
// TODO: replace with data from the Laravel API (an Order with status "cart").

const img = (name: string) => `/images/cart/${name}`;

export type CartLine = {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  items?: string;
  editable?: boolean;
};

export const cartLines: CartLine[] = [
  {
    id: "custom-hamper",
    name: "Custom Hampers",
    image: img("custom-hamper.png"),
    price: 318400,
    qty: 1,
    items:
      "Item : Sage Green Luxe Socks x1, Spruce Mini Candle - Green Stripe x1, Sage Collapsible Pocket Cup 12 oz x1, Bala Bangles - Sage x1",
    editable: true,
  },
  {
    id: "whiskey-business",
    name: "Whiskey Business",
    image: "/images/home/product-latest.png",
    price: 318400,
    qty: 1,
  },
];

export const platformFee = 0;
export const productDiscount = 0;

// `key` picks the label from checkout.payment.methods in the dictionary.
export const paymentMethods = [
  { id: "qris", key: "qris", href: "/qris" },
  { id: "credit-card", key: "creditCard", href: "/qris" },
] as const;

export const qris = {
  logo: img("qris-logo.png"),
  code: img("qris-code.png"),
  nmid: "ID2022221807490",
  provider: "Xendit",
  totalBill: 41300,
  // Time left to pay: 02:49:59 in the Framer design.
  secondsLeft: 2 * 3600 + 49 * 60 + 59,
};

