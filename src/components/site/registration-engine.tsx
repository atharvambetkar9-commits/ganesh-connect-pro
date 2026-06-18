import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, Landmark, Send, CheckCircle2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ZONES = [
  "South Mumbai",
  "Central Mumbai",
  "Western Suburbs",
  "Eastern Suburbs",
  "Navi Mumbai",
  "Thane",
];

const BUDGETS = [
  "Under ₹5 Lakhs",
  "₹5L – ₹15L",
  "₹15L – ₹50L",
  "₹50L – ₹1 Crore",
  "Above ₹1 Crore",
];

const FOOTFALL = [
  "Up to 10,000",
  "10,000 – 50,000",
  "50,000 – 1,00,000",
  "1,00,000 – 5,00,000",
  "Above 5,00,000",
];

const sponsorSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(120),
  repName: z.string().trim().min(2, "Representative name is required").max(80),
  email: z.string().trim().email("Enter a valid corporate email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,15}$/, "Enter a valid phone number"),
  budget: z.string().min(1, "Please select a budget range"),
  zones: z.array(z.string()).min(1, "Select at least one target zone"),
  notes: z.string().max(500).optional(),
});

const mandalSchema = z.object({
  mandalName: z.string().trim().min(2, "Mandal name is required").max(120),
  area: z.string().trim().min(2, "Location is required").max(120),
  footfall: z.string().min(1, "Select estimated daily footfall"),
  pastSponsors: z.string().max(500).optional(),
  contactName: z.string().trim().min(2, "Contact name is required").max(80),
  contactEmail: z.string().trim().email("Enter a valid email").max(255),
  contactPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,15}$/, "Enter a valid phone number"),
});

type SponsorValues = z.infer<typeof sponsorSchema>;
type MandalValues = z.infer<typeof mandalSchema>;

const SUCCESS_MSG =
  "Thank you for registering. Our festival management team will contact you within 24 hours.";

function ZoneChips({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (z: string) =>
    onChange(value.includes(z) ? value.filter((x) => x !== z) : [...value, z]);
  return (
    <div className="flex flex-wrap gap-2">
      {ZONES.map((z) => {
        const active = value.includes(z);
        return (
          <button
            type="button"
            key={z}
            onClick={() => toggle(z)}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              active
                ? "border-gold bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] text-ivory shadow-gold"
                : "border-gold/30 bg-card text-foreground/80 hover:border-gold/60 hover:text-gold"
            }`}
          >
            {z}
          </button>
        );
      })}
    </div>
  );
}

function FieldShell({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <FormItem className="space-y-2">
      <FormLabel className="font-display text-[13px] uppercase tracking-wider text-foreground/80">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      {hint && <p className="text-xs text-foreground/50">{hint}</p>}
      <FormMessage className="text-xs" />
    </FormItem>
  );
}

const inputCls =
  "h-12 rounded-md border-gold/25 bg-background/50 text-ivory placeholder:text-foreground/35 focus-visible:border-gold/70 focus-visible:ring-gold/30";

function SponsorForm({ onDone }: { onDone: () => void }) {
  const form = useForm<SponsorValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      companyName: "",
      repName: "",
      email: "",
      phone: "",
      budget: "",
      zones: [],
      notes: "",
    },
  });

  const submit = (values: SponsorValues) => {
    void values;
    toast.success("Sponsor registration received", { description: SUCCESS_MSG });
    form.reset();
    onDone();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FieldShell label="Company Name" required>
                <Input placeholder="Acme Industries Ltd." className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="repName"
            render={({ field }) => (
              <FieldShell label="Representative Name" required>
                <Input placeholder="Full name" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FieldShell label="Corporate Email" required>
                <Input type="email" placeholder="name@company.com" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FieldShell label="Phone" required>
                <Input placeholder="+91 98XXXXXXXX" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FieldShell label="Budget Range" required>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Select your sponsorship budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGETS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
            )}
          />
          <div className="sm:col-span-1" />
        </div>

        <FormField
          control={form.control}
          name="zones"
          render={({ field }) => (
            <FieldShell
              label="Target Location / Zones in Mumbai"
              required
              hint="Select all the zones you want brand visibility in."
            >
              <div>
                <ZoneChips value={field.value} onChange={field.onChange} />
              </div>
            </FieldShell>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FieldShell label="Notes (optional)">
              <Textarea
                placeholder="Tell us about activation goals, brand category, on-ground asset needs…"
                className="min-h-28 rounded-md border-gold/25 bg-background/50 text-ivory placeholder:text-foreground/35 focus-visible:border-gold/70 focus-visible:ring-gold/30"
                {...field}
              />
            </FieldShell>
          )}
        />

        <Button
          type="submit"
          className="h-13 w-full bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] py-3.5 text-base font-semibold text-ivory shadow-royal hover:opacity-95"
          disabled={form.formState.isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit Sponsor Registration
        </Button>
      </form>
    </Form>
  );
}

function MandalForm({ onDone }: { onDone: () => void }) {
  const form = useForm<MandalValues>({
    resolver: zodResolver(mandalSchema),
    defaultValues: {
      mandalName: "",
      area: "",
      footfall: "",
      pastSponsors: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const submit = (values: MandalValues) => {
    void values;
    toast.success("Mandal registration received", { description: SUCCESS_MSG });
    form.reset();
    onDone();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="mandalName"
            render={({ field }) => (
              <FieldShell label="Mandal Name" required>
                <Input placeholder="Shree Sarvajanik Ganeshotsav Mandal" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FieldShell label="Location / Area" required>
                <Input placeholder="Lalbaug, Parel, Andheri…" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="footfall"
            render={({ field }) => (
              <FieldShell label="Estimated Daily Footfall" required>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Select footfall range" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOOTFALL.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FieldShell label="Primary Contact Name" required>
                <Input placeholder="Full name" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FieldShell label="Contact Email" required>
                <Input type="email" placeholder="contact@mandal.org" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FieldShell label="Contact Phone" required>
                <Input placeholder="+91 98XXXXXXXX" className={inputCls} {...field} />
              </FieldShell>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pastSponsors"
          render={({ field }) => (
            <FieldShell
              label="Past Sponsor Details"
              hint="List any previous corporate sponsors and the year of association."
            >
              <Textarea
                placeholder="e.g. Brand A (2024), Brand B (2023)…"
                className="min-h-28 rounded-md border-gold/25 bg-background/50 text-ivory placeholder:text-foreground/35 focus-visible:border-gold/70 focus-visible:ring-gold/30"
                {...field}
              />
            </FieldShell>
          )}
        />

        <Button
          type="submit"
          className="h-13 w-full bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] py-3.5 text-base font-semibold text-ivory shadow-royal hover:opacity-95"
          disabled={form.formState.isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit Mandal Registration
        </Button>
      </form>
    </Form>
  );
}

export function RegistrationEngine() {
  const [tab, setTab] = useState<"sponsor" | "mandal">("sponsor");
  const [justSubmitted, setJustSubmitted] = useState<null | "sponsor" | "mandal">(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<"sponsor" | "mandal">).detail;
      if (detail === "sponsor" || detail === "mandal") {
        setTab(detail);
        requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    window.addEventListener("open-register", onOpen);
    return () => window.removeEventListener("open-register", onOpen);
  }, []);

  return (
    <section id="register" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--crimson)/_0.15,_transparent_60%)]" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Registration
          </span>
          <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
            Begin your <span className="text-gradient-gold">2026 Utsav</span> alliance
          </h2>
          <p className="mt-4 text-base text-foreground/70">
            Fill in the form below. A dedicated festival manager will reach out within
            one business day.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-gold/25 bg-card/70 shadow-royal backdrop-blur">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "sponsor" | "mandal")}>
            <div className="border-b border-gold/20 bg-background/40 p-2">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="sponsor"
                  className="h-12 gap-2 rounded-lg font-display tracking-wide text-foreground/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--crimson)] data-[state=active]:to-[var(--accent)] data-[state=active]:text-ivory data-[state=active]:shadow-royal"
                >
                  <Briefcase className="h-4 w-4" /> Sponsor Registration
                </TabsTrigger>
                <TabsTrigger
                  value="mandal"
                  className="h-12 gap-2 rounded-lg font-display tracking-wide text-foreground/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--crimson)] data-[state=active]:to-[var(--accent)] data-[state=active]:text-ivory data-[state=active]:shadow-royal"
                >
                  <Landmark className="h-4 w-4" /> Mandal Registration
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 sm:p-10">
              {justSubmitted && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-ivory">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <div className="font-display text-base text-gold">
                      Registration received
                    </div>
                    <div className="mt-1 text-foreground/80">{SUCCESS_MSG}</div>
                  </div>
                </div>
              )}

              <TabsContent value="sponsor" className="mt-0">
                <SponsorForm onDone={() => setJustSubmitted("sponsor")} />
              </TabsContent>
              <TabsContent value="mandal" className="mt-0">
                <MandalForm onDone={() => setJustSubmitted("mandal")} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
