import "server-only";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Markdown → HTML for blog posts and bio text. Raw HTML in the source is NOT
 * passed through (remark-rehype drops it), so only Markdown syntax renders.
 */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true })
    .use(rehypeStringify)
    .process(md);
  return String(file);
}

/** Small inline renderer (bold/italic/links only) for short one-paragraph strings. */
export async function renderInlineMarkdown(md: string): Promise<string> {
  const html = await renderMarkdown(md);
  return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
}

export function readingMinutes(md: string): number {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
