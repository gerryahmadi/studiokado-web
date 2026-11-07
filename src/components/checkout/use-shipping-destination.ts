"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import {
  getPlace,
  getShipmentRates,
  getShippingRates,
  searchPlaces,
  type PlaceSuggestion,
  type ShippingRate,
} from "@/lib/checkout-actions";

export type Destination = { description: string; lat: number; lng: number };
export type RatesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rates: ShippingRate[] };

export const rateKey = (r: ShippingRate) => `${r.company}:${r.type}`;

// One shipping destination: address search (Google Places through Laravel) and the courier rates
// for the picked place. Used once in single-address checkout and once per recipient otherwise.
// `items` ({ <cart item id>: units }) prices only those units (multiple addresses) instead of the whole cart.
export function useShippingDestination(
  onRateChange?: (rate: ShippingRate | null) => void,
  items?: Record<number, number>,
) {
  const t = useI18n().t.checkout.address;
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  // Text of the suggestion the user picked; set before its details load so the search doesn't re-run.
  const [pickedText, setPickedText] = useState<string | null>(null);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [rates, setRates] = useState<RatesState>({ status: "idle" });
  const [rate, setRate] = useState<ShippingRate | null>(null);

  const selectRate = (next: ShippingRate | null) => {
    setRate(next);
    onRateChange?.(next);
  };

  // Debounced suggestions while typing (cleared once a place is chosen).
  useEffect(() => {
    if (pickedText === address || address.trim().length < 3) return;
    const timer = setTimeout(async () => {
      setSearching(true);
      setSuggestions(await searchPlaces(address));
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [address, pickedText]);

  // Only the latest rates request may update state (items can change while one is in flight).
  const request = useRef(0);
  const units = items ? Object.values(items).reduce((sum, qty) => sum + qty, 0) : null;

  // `keep`: re-select this courier if it is still offered (rates reloaded after the items changed).
  const loadRates = async (postalCode: string, dest: Destination, keep: ShippingRate | null = null) => {
    const id = ++request.current;
    selectRate(null);
    if (!/^\d{5}$/.test(postalCode)) {
      setRates({ status: "idle" });
      return;
    }
    if (units === 0) {
      setRates({ status: "error", message: t.addItems });
      return;
    }
    setRates({ status: "loading" });
    const where = { postalCode, lat: dest.lat, lng: dest.lng };
    const result = items ? await getShipmentRates({ ...where, items }) : await getShippingRates(where);
    if (id !== request.current) return;
    if (!result.ok) {
      setRates({ status: "error", message: result.message });
      return;
    }
    setRates({ status: "ready", rates: result.rates });
    const same = keep && result.rates.find((r) => rateKey(r) === rateKey(keep));
    if (same) selectRate(same);
  };

  // Multiple addresses: the parcel changed, so re-price it (debounced while the stepper is clicked).
  const itemsKey = items ? JSON.stringify(items) : null;
  useEffect(() => {
    if (itemsKey === null || !destination) return;
    const timer = setTimeout(() => loadRates(zip, destination, rate), 400);
    return () => clearTimeout(timer);
    // Only a change of the items re-prices; address and zip changes load rates themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const choosePlace = async (place: PlaceSuggestion) => {
    setPickedText(place.description);
    setAddress(place.description);
    setSuggestions([]);
    const details = await getPlace(place.place_id);
    if (!details) {
      setRates({ status: "error", message: t.notFound });
      return;
    }
    const dest = { description: place.description, lat: details.lat, lng: details.lng };
    setDestination(dest);
    setProvince(details.province ?? "");
    setCity(details.city ?? "");
    setZip(details.postal_code ?? "");
    await loadRates(details.postal_code ?? "", dest);
  };

  // Typing a new address drops the old coordinates and rates.
  const changeAddress = (value: string) => {
    setAddress(value);
    if (destination && value !== pickedText) {
      setDestination(null);
      setPickedText(null);
      selectRate(null);
      setRates({ status: "idle" });
    }
  };

  const changeZip = (value: string) => {
    const next = value.replace(/\D/g, "");
    setZip(next);
    if (destination) loadRates(next, destination);
  };

  return {
    address,
    suggestions,
    searching,
    destination,
    province,
    city,
    zip,
    rates,
    rate,
    selectRate,
    changeAddress,
    changeZip,
    choosePlace,
    closeSuggestions: () => setSuggestions([]),
  };
}

export type ShippingDestination = ReturnType<typeof useShippingDestination>;
