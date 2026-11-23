"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "katex/dist/katex.min.css";
import { ImagePlus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { savePost, type PostInput } from "@/lib/admin/actions";
import { uploadToMedia } from "@/lib/admin/upload";
import type { Post } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { ImageInput, TagInput } from "./inputs";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-[560px] animate-pulse rounded-lg bg-zinc-900" />,
});

/** <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm". */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content_md: post?.content_md ?? "",
    cover_image: post?.cover_image ?? null,
    tags: post?.tags ?? [],
    status: post?.status ?? "draft",
    published_at: post?.published_at ?? null,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function insertImages(files: FileList | File[]) {
    const images = [...files].filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(images.map((f) => uploadToMedia(f, "blog")));
      const snippet = urls.map((u, i) => `![${images[i].name.replace(/\.[^.]+$/, "")}](${u})`).join("\n\n");
      setForm((f) => {
        const at = caret.current ?? f.content_md.length;
        return { ...f, content_md: `${f.content_md.slice(0, at)}\n\n${snippet}\n\n${f.content_md.slice(at)}` };
      });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  function save(status: PostInput["status"]) {
    startTransition(async () => {
      setMessage(null);
      const res = await savePost(post?.id ?? null, { ...form, status });
      if (!res.ok) {
        setMessage({ ok: false, text: res.error });
        return;
      }
      set("status", status);
      setMessage({ ok: true, text: status === "published" ? "Published — live on /blog." : "Draft saved." });
      if (!post && res.id) router.replace(`/admin/posts/${res.id}`);
      router.refresh();
    });
  }

  const liveSlug = slugify(form.slug || form.title);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-4">
        <input
          className="input py-3 text-xl font-semibold"
          placeholder="Post title"
          aria-label="Title"
          value={form.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
        />
        <textarea
          className="input min-h-20"
          placeholder="Short excerpt — shown on cards, RSS and link previews"
          aria-label="Excerpt"
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="label mb-0">Content (Markdown · GFM · $math$)</span>
          <button type="button" className="btn-ghost" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Insert image
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { insertImages(e.target.files ?? []); e.target.value = ""; }} />
        </div>
        <div data-color-mode="dark">
          <MDEditor
            value={form.content_md}
            onChange={(v) => set("content_md", v ?? "")}
            height={560}
            preview="live"
            visibleDragbar={false}
            previewOptions={{ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }}
            textareaProps={{
              placeholder: "Write your article… paste or drop images to upload them.",
              onSelect: (e) => (caret.current = (e.target as HTMLTextAreaElement).selectionStart),
              onPaste: (e) => {
                if (e.clipboardData.files.length) {
                  e.preventDefault();
                  caret.current = (e.target as HTMLTextAreaElement).selectionStart;
                  insertImages(e.clipboardData.files);
                }
              },
              onDrop: (e) => {
                if (e.dataTransfer.files.length) {
                  e.preventDefault();
                  insertImages(e.dataTransfer.files);
                }
              },
            }}
          />
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <div className="card space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Status</span>
            <span className={form.status === "published" ? "text-emerald-400" : "text-amber-400"}>{form.status}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost flex-1" disabled={pending} onClick={() => save("draft")}>
              {form.status === "published" ? "Unpublish" : "Save draft"}
            </button>
            <button type="button" className="btn-primary flex-1" disabled={pending} onClick={() => save("published")}>
              {pending && <Loader2 size={14} className="animate-spin" />}
              {form.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
          {message && <p className={`text-sm ${message.ok ? "text-emerald-400" : "text-red-400"}`} role="status">{message.text}</p>}
          {form.status === "published" && post && (
            <a href={`/blog/${liveSlug}`} target="_blank" rel="noreferrer" className="block text-xs text-accent-2 hover:underline">
              View live ↗
            </a>
          )}
        </div>

        <div>
          <label className="label" htmlFor="slug">Slug</label>
          <input
            id="slug"
            className="input font-mono text-xs"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
          <p className="mt-1 truncate text-xs text-zinc-500">/blog/{liveSlug || "…"}</p>
        </div>
        <div>
          <label className="label" htmlFor="published_at">Publish date</label>
          <input
            id="published_at"
            type="datetime-local"
            className="input"
            value={toLocalInput(form.published_at)}
            onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
          />
          <p className="mt-1 text-xs text-zinc-500">Defaults to now when you publish.</p>
        </div>
        <div>
          <span className="label">Tags</span>
          <TagInput value={form.tags} onChange={(v) => set("tags", v)} />
        </div>
        <div>
          <span className="label">Cover image</span>
          <ImageInput value={form.cover_image} onChange={(v) => set("cover_image", v)} folder="blog" />
        </div>
      </aside>
    </div>
  );
}
