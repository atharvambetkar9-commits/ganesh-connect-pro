export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-royal shadow-gold">
            <span className="font-display text-lg text-gold">ॐ</span>
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm tracking-[0.18em] text-ivory">
              SHRI GAURI GANESH
            </div>
            <div className="-mt-0.5 font-display text-[10px] tracking-[0.22em] text-gold">
              BRANDING · MANDAL · SPONSORSHIP NETWORK
            </div>
            <div className="mt-1 text-xs text-foreground/55">
              Mumbai · Ganesh Utsav Sponsorship, Mediated.
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/70">
          <a href="#about" className="hover:text-gold">About</a>
          <a href="#sponsors" className="hover:text-gold">For Sponsors</a>
          <a href="#mandals" className="hover:text-gold">For Mandals</a>
          <a href="#benefits" className="hover:text-gold">Benefits</a>
          <a href="#register" className="hover:text-gold">Register</a>
          <a href="#contact" className="hover:text-gold">Contact</a>
        </nav>

        <div id="contact" className="text-center text-xs text-foreground/70 lg:text-right">
          <div className="font-display tracking-[0.18em] text-gold">CONTACT US</div>
          <div className="mt-1 flex flex-col gap-0.5 sm:flex-row sm:justify-center sm:gap-3 lg:justify-end">
            <a href="tel:+917977396855" className="hover:text-gold">+91 79773 96855</a>
            <span className="hidden text-gold/40 sm:inline">/</span>
            <a href="tel:+918356825305" className="hover:text-gold">+91 83568 25305</a>
          </div>
        </div>

        <div className="text-center text-xs text-foreground/50 lg:text-right">
          © {new Date().getFullYear()} Shri Gauri Ganesh Branding Mandal Sponsorship Network.
          <div className="mt-1 font-display tracking-wider text-gold">Ganpati Bappa Morya 🙏</div>
        </div>
      </div>
    </footer>
  );
}
