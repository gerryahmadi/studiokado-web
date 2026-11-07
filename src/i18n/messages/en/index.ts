// English dictionary: the source of truth for the dictionary's shape.
// Every other locale must provide exactly these keys (checked by the `satisfies Dictionary` in its index.ts).
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
};

export type Dictionary = typeof dictionary;

export default dictionary;
