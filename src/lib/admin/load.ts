import "server-only";
import { ENTITIES, type EntityKey, type Field } from "@/lib/admin/entities";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Options = Record<string, { value: string; label: string }[]>;

/** Load select options for every relation field (e.g. projects → experiences). */
export async function loadRelationOptions(fields: (Field | undefined)[]): Promise<Options> {
  const supabase = await createSupabaseServerClient();
  const out: Options = {};
  for (const f of fields) {
    if (!f?.relation) continue;
    const { table, labelField } = f.relation;
    const { data } = await supabase.from(table).select(`id,${labelField}`).order("sort_order");
    out[f.name] = ((data ?? []) as unknown as Record<string, string>[]).map((r) => ({ value: r.id, label: r[labelField] }));
  }
  return out;
}

export function getEntity(key: string) {
  return key in ENTITIES ? ENTITIES[key as EntityKey] : null;
}
