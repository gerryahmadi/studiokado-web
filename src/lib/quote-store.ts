"use client";

import { useSyncExternalStore } from "react";

// Products picked with "+ Add to Quote", kept in localStorage until the quotation is sent
// (the Laravel merchandise app keeps its quote list in the browser the same way).

export type QuoteItem = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  color: { id: number; name: string } | null;
  size: { id: number; name: string } | null;
  quantity: number;
  // Copied when added, for the estimated total on the quotation page.
  price: number;
  price_tiers: { min_quantity: number; price: number }[];
};

const KEY = "sk_quote";
const EVENT = "quote:updated";
const EMPTY: QuoteItem[] = [];

let cache: { raw: string | null; items: QuoteItem[] } = { raw: null, items: EMPTY };

function read(): QuoteItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  // Same array for the same stored string, as useSyncExternalStore requires.
  if (raw !== cache.raw) {
    let items = EMPTY;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) items = parsed;
    } catch {}
    cache = { raw, items };
  }
  return cache.items;
}

function write(items: QuoteItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useQuoteItems() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const sameVariant = (a: QuoteItem, b: QuoteItem) => a.id === b.id && a.color?.id === b.color?.id && a.size?.id === b.size?.id;

// Adding the same product/color/size again adds to its quantity.
export function addToQuote(item: QuoteItem) {
  const current = read();
  const existing = current.find((i) => sameVariant(i, item));
  write(
    existing
      ? current.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity } : i))
      : [...current, item],
  );
}

export function setQuoteQuantity(index: number, quantity: number) {
  write(read().map((item, n) => (n === index ? { ...item, quantity } : item)));
}

export function removeFromQuote(index: number) {
  write(read().filter((_, n) => n !== index));
}

export function clearQuote() {
  write([]);
}
