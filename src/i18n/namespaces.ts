import type { Dictionary } from "./messages/en";

// Namespaces sent to the browser for Client Components (useI18n). Keep this list to what client code
// needs: everything here is serialized into the page. Page copy read only on the server (home,
// corporate, legal, ...) stays out.
export const CLIENT_NAMESPACES = ["common", "shop", "cart", "checkout", "hamper", "product"] as const;

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

export type ClientMessages = Pick<Dictionary, ClientNamespace>;

export function pickClientMessages(dictionary: Dictionary): ClientMessages {
  return Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, dictionary[ns]])) as ClientMessages;
}
