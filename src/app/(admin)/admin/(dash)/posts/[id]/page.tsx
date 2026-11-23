import Link from "next/link";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: Post | null = null;
  if (id !== "new") {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    post = data as Post;
  }
  return (
    <div className="max-w-6xl">
      <Link href="/admin/posts" className="text-sm text-zinc-400 hover:text-zinc-200">← Blog posts</Link>
      <h1 className="mt-3 mb-6 text-2xl font-semibold">{post ? "Edit post" : "New post"}</h1>
      <PostEditor post={post} />
    </div>
  );
}
