import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getPublishedPost, getPublishedPosts } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import "katex/dist/katex.min.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  const images = post.cover_image ? [{ url: post.cover_image }] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: post.tags,
      images,
    },
    twitter: { card: post.cover_image ? "summary_large_image" : "summary", title: post.title, description: post.excerpt, images },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all, profile] = await Promise.all([getPublishedPost(slug), getPublishedPosts(), getProfile()]);
  if (!post) notFound();

  const html = await renderMarkdown(post.content_md);
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: `${profile.name_first} ${profile.name_last}` },
    image: post.cover_image ?? undefined,
    keywords: post.tags.join(", "),
  };

  return (
    <main className="blog-page">
      <article className="article">
        <Link href="/blog" className="article-back">
          ← All articles
        </Link>
        <h1 className="article-title">{post.title}</h1>
        <div className="post-meta">
          {formatDate(post.published_at)} · {post.reading_minutes} min read
          {post.tags.length > 0 && <> · {post.tags.map((t) => `#${t}`).join(" ")}</>}
        </div>
        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="article-cover" src={post.cover_image} alt="" />
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        {(newer || older) && (
          <div className="article-nav" role="navigation" aria-label="More articles">
            {older && (
              <Link href={`/blog/${older.slug}`}>
                <small>← Older</small>
                {older.title}
              </Link>
            )}
            {newer && (
              <Link href={`/blog/${newer.slug}`} className="next">
                <small>Newer →</small>
                {newer.title}
              </Link>
            )}
          </div>
        )}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
