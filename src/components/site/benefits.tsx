import { ShieldCheck, MapPin, Scale, Handshake } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Hyper-Vetted Network",
    body: "Every mandal in our roster is audited for footfall, legal standing, and brand fit before introduction.",
  },
  {
    icon: Scale,
    title: "End-to-End Compliance",
    body: "Contracts, GST, statutory clearances, and invoicing handled centrally — no scattered paperwork.",
  },
  {
    icon: MapPin,
    title: "Hyper-Local Precision",
    body: "Match your brand to zones, demographics, and impression density across all 24 wards of Mumbai.",
  },
  {
    icon: Handshake,
    title: "Single Point of Trust",
    body: "One relationship manager. One contract. One settlement. Zero middlemen, zero ambiguity.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative border-y border-gold/15 bg-card/40 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Why this network</span>
          <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
            A structured pipeline for a{" "}
            <span className="text-gradient-gold">sacred opportunity</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative bg-background p-8 transition-colors hover:bg-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-[var(--crimson)] to-[var(--accent)] text-ivory shadow-royal">
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg text-ivory">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {it.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
          {[
            ["120+", "Mandals Onboarded"],
            ["25M+", "Daily Festival Footfall"],
            ["60+", "Corporate Brands Served"],
            ["11", "Days. One Citywide Stage."],
          ].map(([k, v]) => (
            <div key={v}>
              <div className="font-display text-3xl text-gold">{k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
