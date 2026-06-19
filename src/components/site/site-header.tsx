import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#sponsors", label: "For Sponsors" },
  { href: "#mandals", label: "For Mandals" },
  { href: "#benefits", label: "Benefits" },
  { href: "#register", label: "Register" },
];

function openRegister(role: "sponsor" | "mandal" = "sponsor") {
  window.dispatchEvent(new CustomEvent("open-register", { detail: role }));
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/20 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-royal shadow-gold">
            <span className="font-display text-base text-gold">ॐ</span>
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-[11px] tracking-[0.18em] text-ivory sm:text-xs">
              SHRI GAURI GANESH
            </div>
            <div className="-mt-0.5 truncate font-display text-[9px] tracking-[0.22em] text-gold sm:text-[10px]">
              BRANDING · MANDAL · SPONSORSHIP NETWORK
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openRegister("sponsor")}
            className="hidden bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal hover:opacity-90 sm:inline-flex"
          >
            Get Started
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-gold/30 bg-background">
              <SheetTitle className="font-display text-gold">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-secondary hover:text-gold"
                  >
                    {n.label}
                  </a>
                ))}
                <Button
                  onClick={() => {
                    setOpen(false);
                    openRegister("sponsor");
                  }}
                  className="mt-4 bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal"
                >
                  Get Started
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
