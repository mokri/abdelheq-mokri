"use client";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePost } from "@/lib/admin/actions";

export function PostRowActions({ id, slug, title, published }: { id: string; slug: string; title: string; published: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className={`flex shrink-0 items-center gap-1 ${pending ? "opacity-50" : ""}`}>
      {published && (
        <a href={`/blog/${slug}`} target="_blank" rel="noreferrer" aria-label="View live" className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
          <ExternalLink size={16} />
        </a>
      )}
      <Link href={`/admin/posts/${id}`} aria-label="Edit" className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
        <Pencil size={16} />
      </Link>
      <button
        type="button"
        aria-label="Delete"
        className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400"
        onClick={() => {
          if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
          start(async () => {
            const res = await deletePost(id);
            if (!res.ok) alert(res.error);
            router.refresh();
          });
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
