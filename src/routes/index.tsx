import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { DualPov } from "@/components/site/dual-pov";
import { Benefits } from "@/components/site/benefits";
import { RegistrationEngine } from "@/components/site/registration-engine";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mandal Mediators — Mumbai Ganesh Utsav Sponsorship, Mediated" },
      {
        name: "description",
        content:
          "Direct, mediated access between India's biggest brands and Mumbai's grandest Sarvajanik Ganesh Utsav Mandals. Zero ground-level hunting, full compliance, verified network reach.",
      },
      { property: "og:title", content: "Mandal Mediators — Ganesh Utsav Sponsorship, Mediated" },
      {
        property: "og:description",
        content:
          "Your exclusive gateway to sponsorship across all major Mumbai Ganesh Utsav Mandals — without field roaming or operational friction.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <DualPov />
        <Benefits />
        <RegistrationEngine />
      </main>
      <SiteFooter />
    </div>
  );
}
