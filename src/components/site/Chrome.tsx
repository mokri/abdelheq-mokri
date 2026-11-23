import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Cursor } from "./Cursor";
import { NavCloser } from "./NavCloser";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["research", "Research"],
  ["startups", "Startups"],
  ["skills", "Skills"],
  ["certifications", "Certs"],
  ["older-projects", "Archive"],
  ["contact", "Contact"],
] as const;

export function SiteHeader({ profile }: { profile: Profile }) {
  return (
    <>
      <Cursor />
      <input type="checkbox" id="nav-check" />
      <nav>
        <Link href="/#hero" className="nav-logo">
          {profile.initials}
          <span>.ai</span>
        </Link>
        <ul className="nav-links">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <Link href={`/#${id}`}>{label}</Link>
            </li>
          ))}
          <li>
            <Link href="/blog" className="nav-blog">
              Blog
            </Link>
          </li>
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <label htmlFor="nav-check" className="nav-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
      </nav>
      <NavCloser />
    </>
  );
}

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer>
      <div className="footer-copy">
        © {new Date().getFullYear()}{" "}
        <span>
          {profile.name_first} {profile.name_last}
        </span>{" "}
        · Built with curiosity, shipped with conviction.
      </div>
      <a href="#" className="footer-back-top">
        ↑ Back to top
      </a>
    </footer>
  );
}
