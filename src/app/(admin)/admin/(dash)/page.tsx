import Link from "next/link";
import { ENTITIES } from "@/lib/admin/entities";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const tables = ["posts", ...Object.keys(ENTITIES)] as const;
  const counts = await Promise.all(
    tables.map(async (t) => {
      const { count } = await supabase.from(t).select("id", { count: "exact", head: true });
      return [t, count ?? 0] as const;
    }),
  );
  const { data: recent } = await supabase
    .from("posts")
    .select("id,title,status,updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  const labels: Record<string, string> = { posts: "Blog posts", ...Object.fromEntries(Object.values(ENTITIES).map((e) => [e.key, e.label])) };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-400">Everything on your portfolio, editable here. Changes go live as soon as you save.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(([t, n]) => (
          <Link key={t} href={`/admin/${t}`} className="card p-4 transition hover:border-zinc-700">
            <div className="text-2xl font-semibold text-accent">{n}</div>
            <div className="mt-1 text-xs tracking-wide text-zinc-400 uppercase">{labels[t]}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent posts</h2>
        <Link href="/admin/posts/new" className="btn-primary">New post</Link>
      </div>
      <div className="card mt-3 divide-y divide-zinc-800/80">
        {(recent ?? []).map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900">
            <span className="truncate">{p.title}</span>
            <span className="ml-4 shrink-0 text-xs text-zinc-500">
              <StatusPill status={p.status} /> · {formatDate(p.updated_at)}
            </span>
          </Link>
        ))}
        {!recent?.length && <p className="px-4 py-6 text-sm text-zinc-500">No posts yet.</p>}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={status === "published" ? "text-emerald-400" : "text-amber-400"}>{status}</span>
  );
}
