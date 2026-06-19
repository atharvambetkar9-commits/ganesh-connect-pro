import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In · Shri Gauri Ganesh Branding Mandal Sponsorship Network" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — signing you in…");
        const { error: e2 } = await supabase.auth.signInWithPassword({ email, password });
        if (e2) throw e2;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero px-4 py-16 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="mb-8 flex items-center justify-center gap-2 text-sm text-foreground/70 hover:text-gold">
          ← Back to site
        </a>
        <div className="rounded-2xl border border-gold/30 bg-card/70 p-8 shadow-royal backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-gold shadow-gold">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Master Admin</div>
              <h1 className="font-display text-2xl text-ivory">
                {mode === "signin" ? "Sign in" : "Create admin account"}
              </h1>
            </div>
          </div>

          <form onSubmit={handle} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-foreground/70">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 border-gold/25 bg-background/60 pl-10 text-ivory"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-foreground/70">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-12 border-gold/25 bg-background/60 pl-10 text-ivory"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="h-12 w-full bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal hover:opacity-95"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-sm text-foreground/60 hover:text-gold"
          >
            {mode === "signin"
              ? "First-time setup? Create the admin account →"
              : "Already have an account? Sign in →"}
          </button>

          <p className="mt-6 rounded-md border border-gold/15 bg-background/40 p-3 text-xs leading-relaxed text-foreground/60">
            Admin access is restricted to the registered master email. Only that account
            can view, edit, or delete registration entries.
          </p>
        </div>
      </div>
    </div>
  );
}
