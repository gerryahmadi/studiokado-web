// Non-text config for the Home page (mirrors the Framer page at path "/", node yu0jusiUa): images,
// links and the keys that pick each item's copy from the `home` dictionary (src/i18n/messages/*/home.json).
// TODO: replace with data from the Laravel API.

const img = (name: string) => `/images/home/${name}`;

export const topBarNotification = {
  active: true,
  href: "/quick-hampers",
};

export const hero = {
  // Background loop video (asset from the Framer "Hero" component).
  video: "/videos/home-hero.mp4",
  buttons: [
    { key: "shop", href: "/quick-hampers", variant: "solid" },
    { key: "create", href: "/create-hampers/package", variant: "outline" },
  ],
} as const;

// "Pop Up - Personal Gifts" component in Framer.
export const shoppingPath = {
  options: [
    { key: "personal", href: "/quick-hampers", image: img("path-personal.png") },
    { key: "corporate", href: "/corporate-gift", image: img("path-corporate.png") },
  ],
} as const;

export type Product = {
  brand: string;
  name: string;
  price: number;
  comparePrice?: number;
  badge?: string;
  image: string;
  href: string;
};

export const occasions = {
  items: [
    { key: "birthdayHer", image: img("occ-her.png"), href: "/occasions-page" },
    { key: "birthdayHim", image: img("occ-him.png"), href: "/occasions-page" },
    { key: "farewell", image: img("occ-farewell.png"), href: "/occasions-page" },
    { key: "bridalShower", image: img("occ-bridal.png"), href: "/occasions-page" },
  ],
} as const;

// Framer shows a grey placeholder box above each step; no illustration yet.
export const howItWorksSteps = ["choose", "message", "order"] as const;

// "Card - A" component in Framer.
export const corporateGifting = {
  client: "Telkomsel",
  image: img("corporate-telkomsel.webp"),
  href: "/corporate-gift/projects",
};

export const brideStory = {
  href: "/p/whiskey-business",
  image: img("bride.png"),
};

export const homeTestimonials = [
  { key: "amanda", name: "Amanda Pratama", photo: img("testi-amanda.png") },
  { key: "priya", name: "Priya K", photo: img("testi-priya.png") },
  { key: "mark", name: "Mark D.", photo: img("testi-mark.png") },
  { key: "ben", name: "Ben F.", photo: img("testi-ben.png") },
] as const;

export const instagram = {
  href: "https://www.instagram.com/studiokado.co.id/",
  // Elfsight widget used by the Laravel site; `slots` is the skeleton count shown while it loads.
  elfsightAppId: "dcd70629-e326-4d52-8d56-ff2ef7b9cbed",
  slots: 5,
};

// Placeholder posts from the Framer CMS.
export const journal = {
  articles: [
    { key: "materials", image: img("journal-1.png"), href: "/journal" },
    { key: "trust", image: img("journal-2.png"), href: "/journal" },
    { key: "edge", image: img("journal-3.png"), href: "/journal" },
    { key: "restraint", image: img("journal-4.png"), href: "/journal" },
  ],
} as const;

// Answers are "lorem ipsum" in Framer.
export const homeFaqKeys = ["returns", "shipping", "international"] as const;

export const specialEvent = {
  href: "/inquiry-form",
  image: img("event.png"),
};

export const whatsapp = {
  href: "https://wa.me/6281282098155",
  image: img("whatsapp.png"),
};

export const formatRupiah = (n: number) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
