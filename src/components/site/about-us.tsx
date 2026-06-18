import { Heart, MapPin, Sparkles, Users } from "lucide-react";

const pillars = [
  {
    icon: MapPin,
    title: "Mumbai's Market, Mapped Mandal by Mandal",
    body:
      "We've grown up inside Mumbai's commercial pulse — Lalbaug, Parel, Girgaon, Andheri, Borivali, Thane. We know which streets convert footfall into brand recall and which mandals carry the cultural weight of an entire pin code.",
  },
  {
    icon: Sparkles,
    title: "Festivals Are Our Native Tongue",
    body:
      "From Gauri Pujan to Anant Chaturdashi visarjan, from the silent first aarti to the 1.5-lakh-strong final procession — we understand the rhythm of every one of the 11 days and where a sponsor's brand belongs in it.",
  },
  {
    icon: Users,
    title: "Mumbai's People, Mumbai's Trust",
    body:
      "Bappa is family here, not a campaign. The people, the volunteers, the mandal trustees — their faith is generational. We protect that trust and translate it into clean, dignified corporate partnerships.",
  },
  {
    icon: Heart,
    title: "Faith, Devotion, Discipline",
    body:
      "Our work begins with respect — for the deity, for the ritual, for the crores of devotees. Every sponsorship we mediate is structured to honour the sanctity of the celebration first, and commercial value second.",
  },
];

export function AboutUs() {
  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--crimson)/0.12,_transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            About Us
          </span>
          <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
            Born in Mumbai. <span className="text-gradient-gold">Built on Bappa's blessings.</span>
          </h2>
          <p className="mt-6 font-serif text-lg italic leading-relaxed text-foreground/80">
            We are a homegrown mediation network — deeply rooted in Mumbai's markets,
            its festivals, its people, and the unshakeable faith and trust this city
            places in Lord Ganesha. Our purpose is single: to be the trusted bridge
            between India's most ambitious brands and Mumbai's most revered Sarvajanik
            Ganesh Utsav Mandals.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/65">
            We don't sell sponsorships. We curate alliances — between commerce and
            culture, between corporate intent and community devotion — and we do it
            with the discipline of a boardroom and the reverence of a temple.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-gold/25 bg-card/50 p-7 backdrop-blur-sm transition-all hover:border-gold/55 hover:shadow-royal"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)] opacity-[0.07] blur-3xl transition-opacity group-hover:opacity-[0.15]" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--crimson)] to-[var(--accent)] text-ivory shadow-royal">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl text-ivory">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-gold/30 bg-gradient-to-br from-[var(--crimson)]/15 to-[var(--accent)]/10 p-8 text-center shadow-royal">
          <p className="font-serif text-lg italic text-ivory sm:text-xl">
            "Mumbai doesn't celebrate Ganesh Utsav — Mumbai <em>becomes</em> Ganesh
            Utsav. For eleven days, the city is one continuous prayer. We are simply
            the network that makes sure your brand can stand beside that prayer,
            with grace."
          </p>
          <div className="mt-5 font-display text-sm tracking-[0.3em] text-gold">
            — THE FOUNDING TEAM
          </div>
        </div>
      </div>
    </section>
  );
}
