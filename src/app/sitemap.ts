import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
