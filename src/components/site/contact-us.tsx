import { Phone, Mail, MapPin } from "lucide-react";

const PHONES = ["+91 79773 96855", "+91 83568 25305"];
const EMAIL = "gauriganesh.branding@gmail.com";

export function ContactUs() {
  return (
    <section id="contact" className="relative border-t border-gold/20 bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Contact Us
          </div>
          <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
            Speak with the Mandal Sponsorship desk
          </h2>
          <p className="mt-4 text-foreground/70">
            Mumbai's sponsorship season is short and the best slots go fast. Call us
            directly — we answer personally, in Marathi, Hindi or English.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PHONES.map((p) => (
            <a
              key={p}
              href={`tel:${p.replace(/\s+/g, "")}`}
              className="group flex items-center gap-4 rounded-2xl border border-gold/25 bg-card/50 p-5 transition hover:border-gold/60 hover:bg-card/70"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-gold shadow-gold">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80">
                  Call / WhatsApp
                </div>
                <div className="mt-0.5 font-display text-lg text-ivory group-hover:text-gold">
                  {p}
                </div>
              </div>
            </a>
          ))}

          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center gap-4 rounded-2xl border border-gold/25 bg-card/50 p-5 transition hover:border-gold/60 hover:bg-card/70"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-gold shadow-gold">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80">
                Email
              </div>
              <div className="mt-0.5 truncate font-display text-base text-ivory group-hover:text-gold">
                {EMAIL}
              </div>
            </div>
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
          <MapPin className="h-4 w-4 text-gold" /> Based in Mumbai · serving Greater Mumbai &amp; MMR
        </div>
      </div>
    </section>
  );
}
