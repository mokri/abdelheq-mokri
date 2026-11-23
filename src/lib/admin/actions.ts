"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENTITIES, PROFILE_FIELDS, type EntityKey, type Field } from "@/lib/admin/entities";
import { readingMinutes } from "@/lib/markdown";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) throw new Error("This account is not an admin.");
  return supabase;
}

/** Purge every cached public page (home, blog, RSS, sitemap) after a content change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

const fail = (e: unknown): ActionResult => ({ ok: false, error: e instanceof Error ? e.message : String(e) });

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/i;

/** Coerce + validate raw form values according to the field definitions. */
function normalize(fields: Field[], raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = raw[f.name];
    switch (f.type) {
      case "checkbox":
        out[f.name] = Boolean(v);
        break;
      case "number": {
        const n = Number(v);
        if (!Number.isFinite(n)) throw new Error(`${f.label} must be a number.`);
        out[f.name] = Math.min(f.max ?? Infinity, Math.max(f.min ?? -Infinity, Math.round(n)));
        break;
      }
      case "tags":
      case "images":
        out[f.name] = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
        break;
      case "list":
        out[f.name] = Array.isArray(v)
          ? v
              .map((row) =>
                Object.fromEntries((f.itemFields ?? []).map((sf) => [sf.name, String((row as Record<string, unknown>)?.[sf.name] ?? "")])),
              )
              .filter((row) => Object.values(row).some((x) => x.trim()))
          : [];
        break;
      case "relation":
      case "image":
      case "file":
      case "url": {
        const s = typeof v === "string" ? v.trim() : "";
        if (s && (f.type === "url" || f.type === "image" || f.type === "file") && !SAFE_URL.test(s)) {
          throw new Error(`${f.label} must start with https://, http://, mailto: or /.`);
        }
        out[f.name] = s || null;
        break;
      }
      default:
        out[f.name] = typeof v === "string" ? v : v == null ? "" : String(v);
    }
    const val = out[f.name];
    if (f.required && (val === null || val === "" || (Array.isArray(val) && val.length === 0))) {
      throw new Error(`${f.label} is required.`);
    }
  }
  return out;
}

function assertEntity(key: string): asserts key is EntityKey {
  if (!(key in ENTITIES)) throw new Error(`Unknown content type: ${key}`);
}

export async function saveEntity(key: string, id: string | null, raw: Record<string, unknown>): Promise<ActionResult> {
  try {
    assertEntity(key);
    const supabase = await requireAdmin();
    const values = normalize(ENTITIES[key].fields, raw);

    if (key === "projects") {
      values.slug = slugify(String(values.slug || values.title));
      if (!values.slug) throw new Error("Slug could not be generated from the title.");
    }

    if (id) {
      const { error } = await supabase.from(key).update(values).eq("id", id);
      if (error) throw error;
    } else {
      // New rows go to the end of the list.
      const { data: last } = await supabase
        .from(key)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      values.sort_order = ((last?.sort_order as number | undefined) ?? 0) + 1;
      const { data, error } = await supabase.from(key).insert(values).select("id").single();
      if (error) throw error;
      id = data.id as string;
    }
    refreshSite();
    return { ok: true, id: id! };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteEntity(key: string, id: string): Promise<ActionResult> {
  try {
    assertEntity(key);
    const supabase = await requireAdmin();
    const { error } = await supabase.from(key).delete().eq("id", id);
    if (error) throw error;
    refreshSite();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setPublished(key: string, id: string, published: boolean): Promise<ActionResult> {
  try {
    assertEntity(key);
    const supabase = await requireAdmin();
    const { error } = await supabase.from(key).update({ published }).eq("id", id);
    if (error) throw error;
    refreshSite();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Persist a drag-and-drop order. `ids` is the visible list in its new order. */
export async function reorderEntity(key: string, ids: string[]): Promise<ActionResult> {
  try {
    assertEntity(key);
    const supabase = await requireAdmin();
    const results = await Promise.all(
      ids.map((id, i) => supabase.from(key).update({ sort_order: i + 1 }).eq("id", id)),
    );
    const err = results.find((r) => r.error)?.error;
    if (err) throw err;
    refreshSite();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveProfile(raw: Record<string, unknown>): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const values = normalize(PROFILE_FIELDS, raw);
    values.typewriter_lines = (values.typewriter_lines as string[]).slice(0, 4);
    const { error } = await supabase.from("profile").upsert({ id: 1, ...values });
    if (error) throw error;
    refreshSite();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
};

export async function savePost(id: string | null, input: PostInput): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const title = input.title.trim();
    if (!title) throw new Error("Title is required.");
    const slug = slugify(input.slug || title);
    if (!slug) throw new Error("Slug could not be generated from the title.");
    if (input.cover_image && !SAFE_URL.test(input.cover_image)) throw new Error("Cover image URL is invalid.");
    if (input.status !== "draft" && input.status !== "published") throw new Error("Invalid status.");

    let publishedAt = input.published_at ? new Date(input.published_at) : null;
    if (publishedAt && Number.isNaN(publishedAt.getTime())) throw new Error("Publish date is invalid.");
    if (input.status === "published" && !publishedAt) publishedAt = new Date();

    const values = {
      title,
      slug,
      excerpt: input.excerpt.trim(),
      content_md: input.content_md,
      cover_image: input.cover_image || null,
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      status: input.status,
      published_at: publishedAt?.toISOString() ?? null,
      reading_minutes: readingMinutes(input.content_md),
    };

    let clashQuery = supabase.from("posts").select("id").eq("slug", slug);
    if (id) clashQuery = clashQuery.neq("id", id);
    const clash = await clashQuery.maybeSingle();
    if (clash.data) throw new Error(`Another post already uses the slug “${slug}”.`);

    if (id) {
      const { error } = await supabase.from("posts").update(values).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("posts").insert(values).select("id").single();
      if (error) throw error;
      id = data.id as string;
    }
    refreshSite();
    return { ok: true, id: id! };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    refreshSite();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
