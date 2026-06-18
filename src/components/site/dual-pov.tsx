import { Check, Briefcase, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import watermark from "@/assets/ganapati-watermark.png";

function openRegister(role: "sponsor" | "mandal") {
  window.dispatchEvent(new CustomEvent("open-register", { detail: role }));
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
}

const sponsorPoints = [
  {
    title: "Zero Ground-Level Roaming",
    body: "No physical scouting needed. Finalize prime mandal partnerships right from your headquarters.",
  },
  {
    title: "No Manpower Wasted",
    body: "Eliminate cold outreach and physical tracking. We handle the administrative pipeline end-to-end.",
  },
  {
    title: "Verified Network Reach",
    body: "Gain instantly audited access to millions of daily footfalls via hyper-vetted, high-visibility Mumbai mandals.",
  },
];

const mandalPoints = [
  {
    title: "Premium Corporate Alliances",
    body: "Bypass local bottlenecks and secure official, structured corporate brand funding.",
  },
  {
    title: "Streamlined Processing",
    body: "Legal, compliance, and payment clearances managed cleanly via our central mediation pipeline.",
  },
];

function PovCard({
  eyebrow,
  title,
  message,
  points,
  icon,
  cta,
  onClick,
  anchorId,
}: {
  eyebrow: string;
  title: string;
  message: string;
  points: { title: string; body: string }[];
  icon: React.ReactNode;
  cta: string;
  onClick: () => void;
  anchorId: string;
}) {
  return (
    <article
      id={anchorId}
      className="group relative overflow-hidden rounded-2xl border border-gold/25 bg-card/60 p-8 backdrop-blur-sm transition-all hover:border-gold/60 hover:shadow-royal sm:p-10"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--crimson)] opacity-10 blur-3xl transition-opacity group-hover:opacity-20" />
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-gold shadow-gold">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-6 font-display text-3xl text-ivory sm:text-4xl">{title}</h3>
      <p className="mt-3 font-serif text-base italic text-foreground/75">{message}</p>

      <ul className="mt-8 space-y-5">
        {points.map((p) => (
          <li key={p.title} className="flex gap-4">
            <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/60 bg-gold/10 text-gold">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div>
              <div className="font-display text-base text-ivory">{p.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Button
        onClick={onClick}
        className="group/btn mt-10 h-12 w-full bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal hover:opacity-95"
      >
        {cta}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </article>
  );
}

export function DualPov() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <img
        src={watermark}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Two Doorways · One Sanctum
          </span>
          <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="text-gradient-gold">both sides of the alliance</span>
          </h2>
          <p className="mt-4 text-base text-foreground/70">
            Whether you bring the budget or the blessings, our mediation pipeline
            removes every friction between brand and mandal.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PovCard
            anchorId="sponsors"
            eyebrow="For Corporate Sponsors"
            title="Eliminate field-level logistics. Completely."
            message="Your boardroom is the new ground."
            points={sponsorPoints}
            icon={<Briefcase className="h-5 w-5" />}
            cta="Register as Sponsor"
            onClick={() => openRegister("sponsor")}
          />
          <PovCard
            anchorId="mandals"
            eyebrow="For Sarvajanik Mandals"
            title="Monetize and secure massive brand backing."
            message="Effortlessly. With dignity."
            points={mandalPoints}
            icon={<Landmark className="h-5 w-5" />}
            cta="Register as Mandal"
            onClick={() => openRegister("mandal")}
          />
        </div>
      </div>
    </section>
  );
}
