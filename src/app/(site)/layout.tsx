import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";
import { themeInitScript } from "@/components/site/ThemeToggle";
import { getProfile } from "@/lib/queries";
import { SITE_URL } from "@/lib/utils";
import "./site.css";
import "./site-extra.css";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: profile.seo_title, template: `%s — ${profile.name_first} ${profile.name_last}` },
    description: profile.seo_description,
    openGraph: { type: "website", title: profile.seo_title, description: profile.seo_description, url: "/" },
    twitter: { card: "summary_large_image", title: profile.seo_title, description: profile.seo_description },
    alternates: { types: { "application/rss+xml": "/rss.xml" } },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    // suppressHydrationWarning: data-theme is set on <html> by the inline script before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- one font stylesheet per root layout */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
        />
        {/* Cabinet Grotesk is not on Google Fonts; it is served by Fontshare. */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap" />
      </head>
      <body>
        <SiteHeader profile={profile} />
        {children}
        <SiteFooter profile={profile} />
      </body>
    </html>
  );
}
