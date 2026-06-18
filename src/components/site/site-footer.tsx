export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-royal shadow-gold">
            <span className="font-display text-base text-gold">M</span>
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm tracking-[0.18em] text-ivory">
              MANDAL MEDIATORS
            </div>
            <div className="mt-0.5 text-xs text-foreground/55">
              Mumbai · Ganesh Utsav Sponsorship, Mediated.
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/70">
          <a href="#sponsors" className="hover:text-gold">For Sponsors</a>
          <a href="#mandals" className="hover:text-gold">For Mandals</a>
          <a href="#benefits" className="hover:text-gold">Benefits</a>
          <a href="#register" className="hover:text-gold">Register</a>
        </nav>

        <div className="text-xs text-foreground/50">
          © {new Date().getFullYear()} Mandal Mediators. Ganpati Bappa Morya.
        </div>
      </div>
    </footer>
  );
}
