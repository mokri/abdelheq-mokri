import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-color-mode="dark">
      <body>{children}</body>
    </html>
  );
}
