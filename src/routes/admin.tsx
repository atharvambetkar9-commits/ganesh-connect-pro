import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  LogOut,
  RefreshCcw,
  Search,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Landmark,
  Download,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  adminListRegistrations,
  adminUpdateRegistration,
  adminDeleteRegistration,
  checkIsAdmin,
} from "@/lib/registrations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Shri Gauri Ganesh Branding Mandal Sponsorship Network" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Status = "new" | "contacted" | "closed";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authReady, setAuthReady] = useState(false);
  const list = useServerFn(adminListRegistrations);
  const check = useServerFn(checkIsAdmin);
  const update = useServerFn(adminUpdateRegistration);
  const del = useServerFn(adminDeleteRegistration);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const adminCheck = useQuery({
    queryKey: ["isAdmin"],
    enabled: authReady,
    queryFn: () => check(),
  });

  const data = useQuery({
    queryKey: ["registrations"],
    enabled: authReady && adminCheck.data?.isAdmin === true,
    queryFn: () => list(),
  });

  const updateMut = useMutation({
    mutationFn: (input: any) => update({ data: input }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["registrations"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (input: any) => del({ data: input }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["registrations"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Delete failed"),
  });

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const filterList = <T extends Record<string, any>>(rows: T[], fields: string[]) =>
    rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const blob = fields.map((f) => String(r[f] ?? "")).join(" ").toLowerCase();
      return blob.includes(q.toLowerCase());
    });

  const sponsors = useMemo(
    () =>
      filterList(data.data?.sponsors ?? [], [
        "company_name",
        "rep_name",
        "email",
        "phone",
        "budget",
        "notes",
      ]),
    [data.data, q, statusFilter],
  );
  const mandals = useMemo(
    () =>
      filterList(data.data?.mandals ?? [], [
        "mandal_name",
        "area",
        "footfall",
        "contact_name",
        "contact_email",
        "contact_phone",
        "past_sponsors",
      ]),
    [data.data, q, statusFilter],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const exportCsv = (kind: "sponsor" | "mandal") => {
    const rows = kind === "sponsor" ? sponsors : mandals;
    if (!rows.length) return toast.info("Nothing to export");
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = (r as any)[h];
            const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind}-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground/60">
        Loading…
      </div>
    );
  }

  if (adminCheck.data && !adminCheck.data.isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl text-ivory">Access denied</h1>
          <p className="mt-3 text-foreground/70">
            This account does not have admin privileges. Sign in with the master admin
            email address.
          </p>
          <Button onClick={signOut} variant="outline" className="mt-6 border-gold/40 text-gold">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-gold/20 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Master Admin
            </div>
            <h1 className="font-display text-xl text-ivory sm:text-2xl">
              Registrations Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => qc.invalidateQueries({ queryKey: ["registrations"] })}
              className="border-gold/30 text-gold"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="border-gold/30 text-gold">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Sponsors" value={data.data?.sponsors?.length ?? 0} />
          <StatCard label="Mandals" value={data.data?.mandals?.length ?? 0} />
          <StatCard
            label="New (24h)"
            value={
              [...(data.data?.sponsors ?? []), ...(data.data?.mandals ?? [])].filter(
                (r: any) => Date.now() - new Date(r.created_at).getTime() < 86_400_000,
              ).length
            }
          />
          <StatCard
            label="Total"
            value={(data.data?.sponsors?.length ?? 0) + (data.data?.mandals?.length ?? 0)}
          />
        </div>

        <ChangePasswordPanel />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, area…"
              className="h-11 border-gold/25 bg-card/40 pl-10 text-ivory"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="h-11 w-full border-gold/25 bg-card/40 sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="sponsor">
          <TabsList className="grid w-full grid-cols-2 bg-card/40">
            <TabsTrigger value="sponsor" className="gap-2">
              <Building2 className="h-4 w-4" />
              Sponsors
              <Badge variant="secondary" className="ml-1">{sponsors.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="mandal" className="gap-2">
              <Landmark className="h-4 w-4" />
              Mandals
              <Badge variant="secondary" className="ml-1">{mandals.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sponsor" className="mt-6">
            <div className="mb-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => exportCsv("sponsor")} className="border-gold/30 text-gold">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
            {data.isLoading ? (
              <div className="rounded-lg border border-gold/20 p-12 text-center text-foreground/60">Loading…</div>
            ) : sponsors.length === 0 ? (
              <div className="rounded-lg border border-gold/20 p-12 text-center text-foreground/60">
                No sponsor registrations yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sponsors.map((r: any) => (
                  <RegRow
                    key={r.id}
                    kind="sponsor"
                    row={r}
                    onUpdate={(patch) => updateMut.mutate({ kind: "sponsor", id: r.id, ...patch })}
                    onDelete={() => {
                      if (confirm("Delete this registration permanently?"))
                        deleteMut.mutate({ kind: "sponsor", id: r.id });
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mandal" className="mt-6">
            <div className="mb-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => exportCsv("mandal")} className="border-gold/30 text-gold">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
            {data.isLoading ? (
              <div className="rounded-lg border border-gold/20 p-12 text-center text-foreground/60">Loading…</div>
            ) : mandals.length === 0 ? (
              <div className="rounded-lg border border-gold/20 p-12 text-center text-foreground/60">
                No mandal registrations yet.
              </div>
            ) : (
              <div className="space-y-4">
                {mandals.map((r: any) => (
                  <RegRow
                    key={r.id}
                    kind="mandal"
                    row={r}
                    onUpdate={(patch) => updateMut.mutate({ kind: "mandal", id: r.id, ...patch })}
                    onDelete={() => {
                      if (confirm("Delete this registration permanently?"))
                        deleteMut.mutate({ kind: "mandal", id: r.id });
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function statusColor(s: Status) {
  if (s === "new") return "bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40";
  if (s === "contacted") return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  return "bg-green-500/20 text-green-300 border-green-500/40";
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80">
        {label}
      </div>
      <div className="mt-1 font-display text-3xl text-ivory">{value}</div>
    </div>
  );
}

function ChangePasswordPanel() {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-gold/20 bg-card/40 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold text-gold hover:opacity-80"
      >
        {open ? "− Hide" : "+ Change admin password"}
      </button>
      {open && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="h-11 flex-1 border-gold/25 bg-background/40 text-ivory"
          />
          <Button
            disabled={busy || pw.length < 8}
            onClick={async () => {
              setBusy(true);
              try {
                const { error } = await supabase.auth.updateUser({ password: pw });
                if (error) throw error;
                toast.success("Password updated");
                setPw("");
                setOpen(false);
              } catch (e: any) {
                toast.error(e?.message ?? "Update failed");
              } finally {
                setBusy(false);
              }
            }}
            className="h-11 bg-gradient-to-r from-[var(--crimson)] to-[var(--accent)] font-semibold text-ivory shadow-royal"
          >
            {busy ? "Saving…" : "Update password"}
          </Button>
        </div>
      )}
    </div>
  );
}

function RegRow({
  kind,
  row,
  onUpdate,
  onDelete,
}: {
  kind: "sponsor" | "mandal";
  row: any;
  onUpdate: (patch: { status?: Status; admin_notes?: string | null }) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState<string>(row.admin_notes ?? "");
  const title = kind === "sponsor" ? row.company_name : row.mandal_name;
  const subtitle = kind === "sponsor" ? row.rep_name : row.area;
  const email = kind === "sponsor" ? row.email : row.contact_email;
  const phone = kind === "sponsor" ? row.phone : row.contact_phone;

  return (
    <div className="rounded-xl border border-gold/20 bg-card/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg text-ivory">{title}</h3>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColor(row.status)}`}>
              {row.status}
            </span>
          </div>
          <div className="mt-1 text-sm text-foreground/70">{subtitle}</div>
        </div>
        <div className="text-right text-xs text-foreground/50">
          {new Date(row.created_at).toLocaleString()}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold" /><a href={`mailto:${email}`} className="hover:text-gold">{email}</a></div>
        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold" /><a href={`tel:${phone}`} className="hover:text-gold">{phone}</a></div>
        {kind === "sponsor" ? (
          <>
            <div className="flex items-center gap-2"><span className="text-xs uppercase tracking-wider text-foreground/50">Budget:</span> {row.budget}</div>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> {row.zones?.map((z: string) => (<span key={z} className="rounded-full border border-gold/30 px-2 py-0.5 text-xs">{z}</span>))}</div>
            {row.notes && <div className="sm:col-span-2 lg:col-span-3 rounded-md border border-gold/15 bg-background/40 p-3 text-xs italic text-foreground/70">"{row.notes}"</div>}
          </>
        ) : (
          <>
            <div><span className="text-xs uppercase tracking-wider text-foreground/50">Footfall:</span> {row.footfall}</div>
            {row.past_sponsors && <div className="sm:col-span-2 lg:col-span-3 rounded-md border border-gold/15 bg-background/40 p-3 text-xs italic text-foreground/70"><div className="text-foreground/50 not-italic mb-1">Past sponsors:</div>"{row.past_sponsors}"</div>}
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-gold/15 pt-4 sm:flex-row">
        <Select value={row.status} onValueChange={(v) => onUpdate({ status: v as Status })}>
          <SelectTrigger className="h-9 w-full border-gold/25 bg-background/40 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if ((row.admin_notes ?? "") !== notes) onUpdate({ admin_notes: notes });
          }}
          placeholder="Private admin notes (saved on blur)…"
          className="min-h-9 flex-1 border-gold/25 bg-background/40 text-sm"
          rows={1}
        />
        <Button variant="outline" size="sm" onClick={onDelete} className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
