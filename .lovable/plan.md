
## Goal

A single-page, premium B2B landing page bridging Mumbai Ganesh Utsav Mandals with corporate sponsors. Deep maroon + saffron + charcoal palette, Cinzel/Playfair serif headings, Inter body, AI-generated Ganapati hero artwork, and a working tabbed registration form (frontend-only, toast confirmation).

## Scope

Frontend only. No backend / Lovable Cloud. Form submissions show a success toast — no persistence (the brief asks only for a confirmation message). I'll flag at the end how to wire it to Cloud later if desired.

## Page structure (single route: `/`)

```
SiteHeader (sticky)
  Logo · Home · For Sponsors · For Mandals · Benefits · Register · [Get Started]

Hero
  Ganapati hero illustration (generated), gold-gradient overlay on charcoal
  Headline + subheadline
  Toggle CTAs: [I am a Corporate Sponsor] [I am a Mandal Representative]
    → smooth-scroll to respective POV section and preselect the right form tab

DualPOV (#sponsors, #mandals)
  Two side-by-side cards (stack on mobile)
  A. Corporate Sponsor POV — 3 value points
  B. Sarvajanik Mandal POV — 2 value points
  Subtle Ganapati watermark behind the section

Benefits (#benefits)
  Compact 3-up grid reinforcing trust: Verified Network, End-to-End Compliance,
  Hyper-local Reach. Numbers/stat strip (mandals onboarded, footfalls, brands).

RegistrationEngine (#register)
  Tabs: [Sponsor Registration] [Mandal Registration]
  Google-Form-style stacked fields, royal styling
  Submit → sonner toast: "Thank you for registering. Our festival management
  team will contact you within 24 hours." + reset form

Footer
  Brand mark, short tagline, nav repeat, copyright
```

## Visual system

Tokens added to `src/styles.css` (oklch), mapped via `@theme inline`:

- `--background` charcoal near-black, `--foreground` warm ivory
- `--primary` deep royal crimson (#800020 → oklch)
- `--accent` saffron/marigold (#FF9933 → oklch)
- `--gold` soft antique gold for hairlines/dividers
- `--gradient-royal` maroon→charcoal, `--gradient-gold` subtle gold sheen
- `--shadow-royal` warm crimson glow shadow
- Radii: `--radius: 0.5rem` for crisp regal feel

Fonts loaded via `<link>` in `src/routes/__root.tsx` head (Google Fonts: Cinzel for display, Playfair Display for serif accents, Inter for body). Registered as `--font-display`, `--font-serif`, `--font-sans` in `@theme`.

All component styling uses semantic tokens — no hardcoded hex in components.

## Components (new files)

- `src/components/site/site-header.tsx` — sticky header with mobile sheet menu
- `src/components/site/hero.tsx` — hero with Ganapati image + dual CTAs
- `src/components/site/dual-pov.tsx` — Sponsor + Mandal cards with check-marked value points
- `src/components/site/benefits.tsx` — trust grid + stat strip
- `src/components/site/registration-engine.tsx` — tabbed form (uses shadcn Tabs, Form, Input, Select, Textarea, Button; zod + react-hook-form validation)
- `src/components/site/site-footer.tsx`
- `src/components/site/ganapati-watermark.tsx` — decorative bg layer

Page wiring in `src/routes/index.tsx` (replaces placeholder). Route `head()` updated: title "Mandal Mediators — Ganesh Utsav Sponsorship, Streamlined", meta description, og tags.

A small client store (zustand-free, just a `useRef` + custom event or simple context) lets the hero CTAs tell the registration section which tab to open. Simplest: dispatch a `CustomEvent('open-register', { detail: 'sponsor' | 'mandal' })` and have RegistrationEngine listen + scroll into view.

## Forms

`react-hook-form` + `zod` (both already common in shadcn template; install if missing).

Sponsor schema:
- companyName (1–120), repName (1–80), email (email, ≤255), phone (10–15 digits), budgetRange (enum: <5L, 5–15L, 15–50L, 50L–1Cr, 1Cr+), targetZones (multi-select chips: South / Central / Western Suburbs / Eastern Suburbs / Navi Mumbai / Thane), notes (optional, ≤500)

Mandal schema:
- mandalName, area (free text), estimatedDailyFootfall (enum buckets), pastSponsors (textarea ≤500), contactName, contactEmail, contactPhone

On submit: `toast.success(...)` from sonner, then `form.reset()`. No network call.

## Assets

Generate two images via `imagegen--generate_image` (standard quality):

1. `src/assets/ganapati-hero.png` — ornate golden Ganapati idol on deep maroon/charcoal background, dramatic divine lighting, marigold garlands, ample negative space on the right for headline. Transparent background, PNG.
2. `src/assets/ganapati-watermark.png` — subtle line-art Ganapati silhouette in gold, transparent, for section backgrounds at low opacity.

## Packages

Verify and install only if missing: `react-hook-form`, `zod`, `@hookform/resolvers`. `sonner`, `lucide-react`, and shadcn primitives (tabs, form, input, select, button, sheet, card) are already present.

`<Toaster />` from sonner: add once in `src/routes/__root.tsx` inside `RootComponent` if not already mounted.

## Out of scope

- Backend persistence of form submissions (frontend toast only, per brief)
- Auth, payments, admin dashboard
- Additional routes (Benefits / Sponsors / Mandals are in-page anchors here because the brief explicitly describes one cohesive single-page app; if you want them as standalone routes later, easy to split)

## Verification

After build: load `/`, confirm hero renders with image, click each CTA → smooth scroll + correct tab active, submit each form with valid + invalid data → see validation errors and success toast. Check mobile width (375px) for header sheet menu and stacked POV cards.
