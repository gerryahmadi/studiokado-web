import { LogOut, Tag } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/account-actions";
import { accountMenu, type AccountMenuKey } from "@/lib/account-data";

// Layout shared by every /my-account page: title, side menu, content.
export function AccountShell({ active, children }: { active: AccountMenuKey; children: React.ReactNode }) {
  return (
    <div className="bg-white px-5 pb-16 pt-[128px]">
      <div className="mx-auto flex max-w-[90%] flex-col gap-6 px-0 md:px-[60px]">
        <h1 className="font-heading text-xl">My Account</h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <nav aria-label="Account" className="shrink-0 md:border-r md:border-ivory md:pr-10">
            <ul className="flex flex-col gap-5 md:w-[229px]">
              {accountMenu.map((m) => {
                const on = m.key === active;
                return (
                  <li key={m.key}>
                    <Link
                      href={m.href}
                      aria-current={on ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-1 text-base ${
                        on ? "bg-[#f3e7b3]" : "hover:bg-[#f3e7b3]/50"
                      }`}
                    >
                      <Tag className={`size-4 ${on ? "text-[#4a3224]" : "text-aloeswood"}`} strokeWidth={1.5} />
                      {m.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#f3e7b3]/50"
                  >
                    <LogOut className="size-4 text-aloeswood" strokeWidth={1.5} />
                    Logout
                  </button>
                </form>
              </li>
            </ul>
          </nav>
          <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
