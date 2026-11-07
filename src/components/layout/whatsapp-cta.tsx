import Image from "next/image";
import { getDictionary } from "@/i18n/server";
import { whatsapp } from "@/lib/home-data";

// Floating "Chat with us" button, rendered on every page from the root layout. --wa-offset lifts it
// above fixed bottom bars (set by HamperBottomBar).
export async function WhatsappCta() {
  const { common } = await getDictionary();

  return (
    <a
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-5 bottom-[calc(var(--wa-offset,0px)+2rem)] z-40 flex w-fit items-center gap-2 rounded-full bg-[#27d165] py-3 pr-8 pl-5 text-white shadow-[0_0.6px_3px_-1px_#00ff004a,0_2.29px_11.44px_-2px_#00ff0047,0_10px_50px_-3px_#00ff0033]"
    >
      <Image src={whatsapp.image} alt="" width={29} height={29} className="size-4.25 md:size-7.25" />
      <span className="leading-normal md:text-lg">{common.whatsapp.cta}</span>
    </a>
  );
}
