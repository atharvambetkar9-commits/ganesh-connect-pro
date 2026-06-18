import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ganapatiHero from "@/assets/ganapati-hero.png";

function openRegister(role: "sponsor" | "mandal") {
  window.dispatchEvent(new CustomEvent("open-register", { detail: role }));
  document.getElementById(role === "sponsor" ? "sponsors" : "mandals")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-hero pt-28 pb-20 lg:pt-36 lg:pb-32"
    >
      {/* decorative glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--crimson)] opacity-30 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Shri Gauri Ganesh · Mumbai · Ganesh Utsav 2026
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl xl:text-7xl">
            Mumbai&rsquo;s Most Trusted{" "}
            <span className="text-gradient-gold">Ganesh Utsav</span>
            <br className="hidden sm:block" /> Sponsorship{" "}
            <em className="font-serif italic text-[var(--accent)]">Network</em>.
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-foreground/75 sm:text-lg">
            Shri Gauri Ganesh Branding Mandal Sponsorship Network is your direct,
            mediated gateway to every major Sarvajanik Ganesh Utsav Mandal across
            Mumbai. Built by Mumbaikars who know the city&rsquo;s markets, festivals,
            and faith — inside out.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={() => openRegister("sponsor")}
              size="lg"
              className="group h-14 bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] px-7 text-base font-semibold text-ivory shadow-royal hover:opacity-95"
            >
              I am a Corporate Sponsor
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={() => openRegister("mandal")}
              size="lg"
              variant="outline"
              className="group h-14 border-gold/60 bg-transparent px-7 text-base font-semibold text-gold backdrop-blur hover:bg-gold/10 hover:text-gold"
            >
              I am a Mandal Representative
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-gold/15 pt-8">
            {[
              { k: "120+", v: "Mandals Vetted" },
              { k: "25M+", v: "Daily Footfall" },
              { k: "₹ End-to-End", v: "Compliance" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl text-gold sm:text-3xl">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full max-w-md rounded-full bg-[var(--accent)] opacity-25 blur-3xl" />
          <img
            src={ganapatiHero}
            alt="Ornate golden Ganapati idol adorned with marigold garlands"
            width={1024}
            height={1024}
            className="relative mx-auto w-full max-w-md drop-shadow-[0_25px_60px_rgba(128,0,32,0.55)]"
          />
          <div className="pointer-events-none absolute inset-x-8 -bottom-2 h-12 rounded-[100%] bg-[var(--accent)] opacity-30 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
