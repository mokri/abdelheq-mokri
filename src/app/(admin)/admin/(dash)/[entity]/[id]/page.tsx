import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { getEntity, loadRelationOptions } from "@/lib/admin/load";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** /admin/<entity>/new and /admin/<entity>/<uuid> */
export default async function EntityEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string; id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { entity, id } = await params;
  const prefill = await searchParams;
  const config = getEntity(entity);
  if (!config) notFound();

  const isNew = id === "new";
  let values: Record<string, unknown> = { ...config.defaults };
  if (isNew) {
    // Allow ?kind=client or ?group_id=… to prefill from a filtered list.
    for (const f of config.fields) if (prefill[f.name]) values[f.name] = prefill[f.name];
  } else {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from(config.key).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    values = data;
  }

  const options = await loadRelationOptions(config.fields);

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${config.key}`} className="text-sm text-zinc-400 hover:text-zinc-200">
        ← {config.label}
      </Link>
      <h1 className="mt-3 mb-8 text-2xl font-semibold">
        {isNew ? `New ${config.singular.toLowerCase()}` : String(values[config.titleField] ?? config.singular)}
      </h1>
      <EntityForm mode="entity" entity={config.key} id={isNew ? null : id} fields={config.fields} initial={values} options={options} />
    </div>
  );
}
