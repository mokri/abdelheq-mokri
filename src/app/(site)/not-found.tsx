import Link from "next/link";

export default function NotFound() {
  return (
    <main className="blog-page">
      <div className="section-tag">404</div>
      <h1 className="section-title">Nothing here.</h1>
      <Link href="/" className="latest-more">← Back home</Link>
    </main>
  );
}
