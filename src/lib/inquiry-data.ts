// Config for /inquiry-form (Framer page /form-inquiry-personal). Copy lives in the `inquiry` dictionary
// (src/i18n/messages/*/inquiry.json). Submissions go to Laravel (POST /api/inquiry, see lib/inquiry-actions.ts).
//
// Each option's `value` is what Laravel receives and stores, so it stays in English whatever the page
// language; `key` picks the visible label from the dictionary.

export const INQUIRY_PATH = "/inquiry-form";

export const inquiryPage = {
  image: "/images/inquiry/side.png",
  successHref: "/",
};

export const giftPreferences = [
  { key: "hampers", value: "Hampers" },
  { key: "giftBox", value: "Curated Gift Box" },
  { key: "individual", value: "Individual Gifts" },
  { key: "personalizedName", value: "Personalized Name" },
  { key: "customCard", value: "Custom Card" },
  { key: "customPackaging", value: "Customized Packaging" },
  { key: "recommendations", value: "Open to Recommendations" },
] as const;

export const occasionOptions = [
  { key: "birthday", value: "Birthday" },
  { key: "wedding", value: "Wedding & Pre-Wedding" },
  { key: "milestone", value: "Milestone & Achievement" },
  { key: "baby", value: "Baby & New Family" },
  { key: "farewell", value: "Farewell" },
  { key: "other", value: "Other" },
] as const;

export const referralOptions = [
  { key: "instagram", value: "Instagram" },
  { key: "google", value: "Google" },
  { key: "friends", value: "Friends & Family" },
  { key: "brideStory", value: "Bride Story" },
  { key: "other", value: "Other" },
] as const;
