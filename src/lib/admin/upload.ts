"use client";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 15 * 1024 * 1024;

/** Upload a file to the public "media" bucket (admin-only via RLS) and return its public URL. */
export async function uploadToMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 15 MB.`);
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  const base = slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || "file";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
