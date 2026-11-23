import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityList } from "@/components/admin/EntityList";
import { getEntity, loadRelationOptions } from "@/lib/admin/load";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ f?: string }>;
}) {
  const { entity } = await params;
  const { f: filterValue } = await searchParams;
  const config = getEntity(entity);
  if (!config) notFound();

  const supabase = await createSupabaseServerClient();
  let query = supabase.from(config.key).select("*").order("sort_order");
  if (config.filter && filterValue) query = query.eq(config.filter.field, filterValue);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const filterOptions = config.filter
    ? config.filter.options ??
      (await loadRelationOptions([{ name: "filter", label: "", type: "relation", relation: config.filter.relation }])).filter
    : [];

  const relationOptions = await loadRelationOptions(config.fields);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{config.label}</h1>
          <p className="mt-1 text-sm text-zinc-400">{config.description} Drag rows to reorder.</p>
        </div>
        <Link
          href={`/admin/${config.key}/new${config.filter && filterValue ? `?${config.filter.field}=${filterValue}` : ""}`}
          className="btn-primary"
        >
          Add {config.singular.toLowerCase()}
        </Link>
      </div>

      {config.filter && (
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterTab href={`/admin/${config.key}`} active={!filterValue} label="All" />
          {filterOptions.map((o) => (
            <FilterTab key={o.value} href={`/admin/${config.key}?f=${o.value}`} active={filterValue === o.value} label={o.label} />
          ))}
        </div>
      )}

      <EntityList
        entity={config.key}
        rows={(data ?? []) as Record<string, unknown>[]}
        titleField={config.titleField}
        subtitleFields={config.subtitleFields}
        relationOptions={relationOptions}
      />
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active ? "border-accent/60 bg-accent/10 text-accent" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </Link>
  );
}
