"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { HamperBox, HamperCard, HamperItem } from "./hamper-data";

// The hamper being built while the customer moves through the wizard. Kept in sessionStorage so a
// reload or a filter/page change on the items step doesn't lose it; the products themselves are
// stored with it because the items step only loads one page at a time. Cleared once in the cart.

export type CardNote = { from: string; to: string; message: string };

type HamperState = {
  box: HamperBox | null;
  items: { item: HamperItem; qty: number }[];
  card: HamperCard | null;
  note: CardNote;
};

const KEY = "sk_hamper";
const EVENT = "hamper:updated";
const EMPTY: HamperState = { box: null, items: [], card: null, note: { from: "", to: "", message: "" } };

let cache: { raw: string | null; state: HamperState } = { raw: null, state: EMPTY };

function read(): HamperState {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  // Same object for the same stored string, as useSyncExternalStore requires.
  if (raw !== cache.raw) {
    let state = EMPTY;
    try {
      if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
    } catch {}
    cache = { raw, state };
  }
  return cache.state;
}

function write(update: (s: HamperState) => HamperState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(update(read())));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

const actions = {
  selectBox: (box: HamperBox) => write((s) => ({ ...s, box })),
  setItemQty: (item: HamperItem, qty: number) =>
    write((s) => {
      const rest = s.items.filter((i) => i.item.id !== item.id);
      if (qty <= 0) return { ...s, items: rest };
      const index = s.items.findIndex((i) => i.item.id === item.id);
      const items = [...rest];
      items.splice(index < 0 ? items.length : index, 0, { item, qty });
      return { ...s, items };
    }),
  selectCard: (card: HamperCard, note: CardNote) => write((s) => ({ ...s, card, note })),
  removeCard: () => write((s) => ({ ...s, card: null, note: EMPTY.note })),
  reset: () => write(() => EMPTY),
};

export function useHamper() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);

  return useMemo(() => {
    const itemsTotal = state.items.reduce((s, { item, qty }) => s + item.price * qty, 0);
    const usedSlots = state.items.reduce((s, { item, qty }) => s + item.slot * qty, 0);
    return {
      ...state,
      total: (state.box?.price ?? 0) + itemsTotal + (state.card?.price ?? 0),
      itemCount: state.items.reduce((s, { qty }) => s + qty, 0),
      usedSlots,
      capacity: state.box?.slot_capacity ?? 0,
      // Whether `qty` more of `item` still fit in the chosen box (Laravel checks the same).
      fits: (item: HamperItem, qty = 1) => !!state.box && usedSlots + item.slot * qty <= state.box.slot_capacity,
      ...actions,
    };
  }, [state]);
}
