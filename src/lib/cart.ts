// The cart is a Laravel Order with status "cart", identified by its uuid. Laravel keeps guest carts in
// its own session, which Next.js can't share, so the uuid lives in an httpOnly cookie on this domain
// and is sent as X-Cart-Token (see Api\CartController).
export const CART_COOKIE = "sk_cart";

// Fired on window after the cart changes; detail = new item count. The navbar badge listens to it.
export const CART_UPDATED_EVENT = "cart:updated";
