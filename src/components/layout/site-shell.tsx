import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { TopBarNotification } from "./top-bar-notification";

// Shared chrome for every page: highlight bar, navbar and footer.
export function SiteShell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <>
      <TopBarNotification />
      <Navbar />
      <main>{children}</main>
      {footer && <Footer />}
    </>
  );
}
