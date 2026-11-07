// Kamus Bahasa Indonesia. Strukturnya wajib sama dengan ../en (dicek oleh `satisfies Dictionary`).
import type { Dictionary } from "../en";
import cart from "./cart.json";
import checkout from "./checkout.json";
import common from "./common.json";
import corporate from "./corporate.json";
import hamper from "./hamper.json";
import home from "./home.json";
import inquiry from "./inquiry.json";
import legal from "./legal.json";
import { privacy, terms } from "./legal-documents";
import product from "./product.json";
import shop from "./shop.json";
import tracking from "./tracking.json";

const dictionary = {
  common,
  home,
  corporate,
  inquiry,
  tracking,
  shop,
  product,
  cart,
  checkout,
  hamper,
  legal: {
    terms: { ...legal.terms, html: terms },
    privacy: { ...legal.privacy, html: privacy },
  },
} satisfies Dictionary;

export default dictionary;
