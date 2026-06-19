import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · Shri Gauri Ganesh Branding" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts a recovery session in the URL hash; the client picks it up.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    if (password.length < 8) return toast.error("Use at least 8 characters");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero px-4 py-16 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-gold/30 bg-card/70 p-8 shadow-royal backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-gold shadow-gold">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Master Admin
              </div>
              <h1 className="font-display text-2xl text-ivory">Set new password</h1>
            </div>
          </div>

          {!ready ? (
            <p className="mt-8 rounded-md border border-gold/15 bg-background/40 p-4 text-sm text-foreground/70">
              Open this page from the password-reset link in your email. The link
              authenticates you securely before you can set a new password.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-foreground/70">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gold/25 bg-background/60 pl-10 text-ivory"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-foreground/70">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="h-12 border-gold/25 bg-background/60 pl-10 text-ivory"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="h-12 w-full bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal hover:opacity-95"
              >
                {busy ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
