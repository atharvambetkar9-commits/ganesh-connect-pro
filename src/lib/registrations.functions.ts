import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_NOTIFICATION_EMAIL = "gauriganesh.branding@gmail.com";

const sponsorInput = z.object({
  companyName: z.string().trim().min(2).max(120),
  repName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{10,15}$/),
  budget: z.string().min(1).max(60),
  zones: z.array(z.string().min(1).max(60)).min(1).max(15),
  notes: z.string().max(500).optional().default(""),
});

const mandalInput = z.object({
  mandalName: z.string().trim().min(2).max(120),
  area: z.string().trim().min(2).max(120),
  footfall: z.string().min(1).max(60),
  pastSponsors: z.string().max(500).optional().default(""),
  contactName: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email().max(255),
  contactPhone: z.string().trim().regex(/^[0-9+\-\s()]{10,15}$/),
});

function publicClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function tryNotifyAdmin(
  kind: "sponsor" | "mandal",
  payload: Record<string, unknown>,
) {
  // Best-effort: log to server console for now (visible in server logs).
  // Once an email sender domain is verified, this can be wired to the
  // transactional email route — admin email is fixed below.
  console.log(
    `[ADMIN-NOTIFY → ${ADMIN_NOTIFICATION_EMAIL}] New ${kind} registration`,
    JSON.stringify(payload, null, 2),
  );
}

export const submitSponsorRegistration = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => sponsorInput.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { error, data: row } = await sb
      .from("sponsor_registrations")
      .insert({
        company_name: data.companyName,
        rep_name: data.repName,
        email: data.email,
        phone: data.phone,
        budget: data.budget,
        zones: data.zones,
        notes: data.notes || null,
      })
      .select("id, created_at")
      .single();
    if (error) {
      console.error("[submitSponsorRegistration]", error);
      throw new Error("Could not save your registration. Please try again.");
    }
    await tryNotifyAdmin("sponsor", { id: row.id, ...data });
    return { ok: true, id: row.id };
  });

export const submitMandalRegistration = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => mandalInput.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { error, data: row } = await sb
      .from("mandal_registrations")
      .insert({
        mandal_name: data.mandalName,
        area: data.area,
        footfall: data.footfall,
        past_sponsors: data.pastSponsors || null,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
      })
      .select("id, created_at")
      .single();
    if (error) {
      console.error("[submitMandalRegistration]", error);
      throw new Error("Could not save your registration. Please try again.");
    }
    await tryNotifyAdmin("mandal", { id: row.id, ...data });
    return { ok: true, id: row.id };
  });

// ───── Admin server functions ─────

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden: admin access required");
}

export const adminListRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [sponsors, mandals] = await Promise.all([
      context.supabase
        .from("sponsor_registrations")
        .select("*")
        .order("created_at", { ascending: false }),
      context.supabase
        .from("mandal_registrations")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (sponsors.error || mandals.error) {
      throw new Error("Could not load registrations");
    }
    return {
      sponsors: sponsors.data ?? [],
      mandals: mandals.data ?? [],
    };
  });

const updateInput = z.object({
  kind: z.enum(["sponsor", "mandal"]),
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed"]).optional(),
  admin_notes: z.string().max(2000).nullable().optional(),
});

export const adminUpdateRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const table =
      data.kind === "sponsor"
        ? "sponsor_registrations"
        : "mandal_registrations";
    const patch: { status?: "new" | "contacted" | "closed"; admin_notes?: string | null } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    const { error } = await (context.supabase.from(table) as any).update(patch).eq("id", data.id);
    if (error) throw new Error("Update failed");
    return { ok: true };
  });

const deleteInput = z.object({
  kind: z.enum(["sponsor", "mandal"]),
  id: z.string().uuid(),
});

export const adminDeleteRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const table =
      data.kind === "sponsor"
        ? "sponsor_registrations"
        : "mandal_registrations";
    const { error } = await context.supabase.from(table).delete().eq("id", data.id);
    if (error) throw new Error("Delete failed");
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!data };
  });
