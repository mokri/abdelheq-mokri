export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Link props for downloading the resume. Supabase Storage URLs get `?download=` so the
 * browser saves the file (the `download` attribute is ignored cross-origin); other
 * external links open in a new tab; same-origin paths use the `download` attribute.
 */
export function resumeLinkProps(url: string, fullName: string) {
  const filename = `${fullName.trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "Resume"}-Resume.pdf`;
  if (url.includes("/storage/v1/object/public/")) {
    return { href: `${url}${url.includes("?") ? "&" : "?"}download=${encodeURIComponent(filename)}`, download: filename };
  }
  if (/^https?:\/\//.test(url)) return { href: url, target: "_blank", rel: "noopener noreferrer" };
  return { href: url, download: filename };
}
