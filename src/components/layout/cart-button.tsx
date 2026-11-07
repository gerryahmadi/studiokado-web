"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { plural } from "@/i18n/format";
import { CART_UPDATED_EVENT } from "@/lib/cart";

// Mirrors "Cart Button" in the Framer navbar: 48px button, 20x18 bag icon at (14,15) and an 18px
// "Cart Counter" badge at (7,23), hidden when the cart is empty.
export function CartButton({ labels }: { labels: { one: string; other: string } }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { itemCount: 0 }))
      .then((data: { itemCount: number }) => active && setCount(data.itemCount))
      .catch(() => {});

    const onUpdate = (e: Event) => setCount((e as CustomEvent<number>).detail);
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    return () => {
      active = false;
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
    };
  }, []);

  return (
    <Link href="/cart" aria-label={plural(labels, count)} className="relative size-12">
      <svg
        viewBox="0 0 20 18"
        aria-hidden="true"
        className="absolute left-[14px] top-[15px] h-[18px] w-5 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          d="M1.787 3.166C2.086 1.348 3.83.001 5.884 0h8.232c2.055 0 3.8 1.347 4.1 3.166l1.74 10.588c.175 1.066-.176 2.147-.963 2.962C18.206 17.531 17.062 18 15.857 18H4.143c-1.205 0-2.349-.469-3.136-1.284C.22 15.901-.131 14.82.044 13.754l1.74-10.588Z"
          strokeMiterlimit={10}
        />
        <path d="M13.47 4.861c0 1.914-1.58 3.465-3.53 3.465-1.949 0-3.529-1.551-3.529-3.465" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-[23px] grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#b10000] px-1 text-[14px] leading-none text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
