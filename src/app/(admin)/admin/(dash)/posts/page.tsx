import Link from "next/link";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id,title,slug,status,published_at,updated_at,tags")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Blog posts</h1>
          <p className="mt-1 text-sm text-zinc-400">Write in Markdown. Drafts are only visible here.</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">New post</Link>
      </div>
      <div className="card mt-6 divide-y divide-zinc-800/80">
        {posts?.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/posts/${p.id}`} className="block truncate font-medium hover:text-accent">{p.title}</Link>
              <div className="truncate text-xs text-zinc-500">
                <span className={p.status === "published" ? "text-emerald-400" : "text-amber-400"}>{p.status}</span>
                {p.published_at && ` · ${formatDate(p.published_at)}`} · /blog/{p.slug}
                {p.tags?.length ? ` · ${p.tags.map((t: string) => `#${t}`).join(" ")}` : ""}
              </div>
            </div>
            <PostRowActions id={p.id} slug={p.slug} title={p.title} published={p.status === "published"} />
          </div>
        ))}
        {!posts?.length && <p className="px-4 py-8 text-center text-sm text-zinc-500">No posts yet — write your first one.</p>}
      </div>
    </div>
  );
}
