import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { AboutUs } from "@/components/site/about-us";
import { DualPov } from "@/components/site/dual-pov";
import { Benefits } from "@/components/site/benefits";
import { RegistrationEngine } from "@/components/site/registration-engine";
import { ContactUs } from "@/components/site/contact-us";
import { SiteFooter } from "@/components/site/site-footer";

const SITE_TITLE =
  "Shri Gauri Ganesh Branding — Mumbai Ganesh Utsav Sponsorship Network";
const SITE_DESC =
  "Mumbai's most trusted mediation network between corporate sponsors and Sarvajanik Ganesh Utsav Mandals. Deep knowledge of Mumbai's markets, festivals, people, and faith.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
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
        <AboutUs />
        <DualPov />
        <Benefits />
        <RegistrationEngine />
        <ContactUs />
      </main>
      <SiteFooter />
    </div>
  );
}
