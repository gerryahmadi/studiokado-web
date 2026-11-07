// httpOnly cookie holding the customer's Laravel API token (guard "storefront").
// Set by the login/register actions, sent as "Authorization: Bearer" by laravelRequest().
export const SESSION_COOKIE = "sk_session";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // Matches ApiToken::LIFETIME_DAYS in Laravel.
