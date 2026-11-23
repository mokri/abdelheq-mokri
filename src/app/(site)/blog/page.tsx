import type { Metadata } from "next";
import Link from "next/link";
import { PostGrid } from "@/components/site/Sections";
import { getPublishedPosts } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on agentic AI systems, privacy-preserving deep learning, research and building startups.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const posts = await getPublishedPosts();
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <main className="blog-page">
      <div className="section-tag">Writing</div>
      <h1 className="section-title">Blog</h1>
      <p className="blog-intro">
        Field notes on agentic AI in production, research on privacy-preserving deep learning, and lessons from a
        decade of building.
      </p>
      {tags.length > 0 && (
        <div className="blog-tags">
          <Link href="/blog" className="blog-tag" aria-current={!tag ? "page" : undefined}>
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className="blog-tag"
              aria-current={t === tag ? "page" : undefined}
            >
              #{t}
            </Link>
          ))}
        </div>
      )}
      {shown.length ? <PostGrid posts={shown} /> : <p className="blog-empty">{"// no articles yet"}</p>}
    </main>
  );
}
