import Link from "next/link";
import { Fragment } from "react";
import { renderInlineMarkdown, renderMarkdown } from "@/lib/markdown";
import type { HomeData, Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ProjectStrip } from "./ProjectStrip";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Skill bar animation delays in site.css are keyed on data-w = 70…95. */
const barKey = (pct: number) => String(Math.min(95, Math.max(70, Math.round(pct / 5) * 5)));

export function Hero({ profile }: Pick<HomeData, "profile">) {
  const lines = profile.typewriter_lines.slice(0, 4);
  return (
    <section id="hero">
      <div className="hero-inner">
        <div className="hero-label">{profile.hero_label}</div>
        <h1 className="hero-name">
          <span className="line1">{profile.name_first}</span>
          <span className="line2">{profile.name_last}</span>
        </h1>
        <div className="typewriter-wrap" aria-label={lines.join(" · ")}>
          {lines.map((l) => (
            <span key={l} className="tw">
              {l}
            </span>
          ))}
        </div>
        <div className="hero-ctas">
          <a href="#projects" className="btn btn-primary">
            View Projects →
          </a>
          <a href="#contact" className="btn btn-secondary">
            Get in Touch
          </a>
        </div>
        <div className="hero-stats">
          {profile.hero_stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

export async function About({ profile }: Pick<HomeData, "profile">) {
  const bio = await renderMarkdown(profile.bio_md);
  return (
    <section id="about">
      <div className="section-tag">Background</div>
      <h2 className="section-title">About Me</h2>
      <div className="about-grid">
        <div>
          <div className="about-card">
            <div className="about-avatar">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={`${profile.name_first} ${profile.name_last}`}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                profile.initials
              )}
            </div>
            <div className="about-card-name">
              {profile.name_first} {profile.name_last}
            </div>
            <div className="about-card-role">{profile.about_role}</div>
            <div>
              {profile.about_tags.map((t) => (
                <span key={t} className="about-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="about-card-stats">
              {profile.about_stats.map((s) => (
                <div key={s.label}>
                  <div className="about-stat-num">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="about-bio">
          <div dangerouslySetInnerHTML={{ __html: bio }} />
          <div className="timeline">
            {profile.timeline.map((t) => (
              <div key={t.date + t.role} className="tl-item">
                <div className="tl-dot"></div>
                <div>
                  <div className="tl-date">{t.date}</div>
                  <div className="tl-role">{t.role}</div>
                  <div className="tl-org">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection({ experiences }: Pick<HomeData, "experiences">) {
  return (
    <section id="experience">
      <div className="section-tag">Career</div>
      <h2 className="section-title">Experience</h2>
      <div className="exp-list">
        {experiences.map((e) => (
          <div key={e.id} className="exp-item">
            <div className="exp-meta">
              <div className="exp-company">{e.company}</div>
              <div className="exp-dates">{e.dates}</div>
              <div className="exp-type">{e.employment_type}</div>
            </div>
            <div>
              <div className="exp-role">{e.role}</div>
              <div className="exp-desc">{e.description}</div>
              <div className="exp-tags">
                {e.tags.map((t) => (
                  <span key={t} className="exp-tag">
                    {t}
                  </span>
                ))}
              </div>
              {e.projects.length > 0 && (
                <ProjectStrip projects={e.projects} label={`Projects at ${e.company} · ${e.projects.length}`} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Flagship({ flagship }: Pick<HomeData, "flagship">) {
  return (
    <section id="projects">
      <div className="section-tag">Work</div>
      <h2 className="section-title">Flagship Projects</h2>
      <div className="projects-grid">
        {flagship.map((p, i) => {
          const card = (
            <>
              <div className="project-num">
                {pad2(i + 1)}
                {p.label && ` — ${p.label}`}
              </div>
              <span className="project-icon">{p.icon}</span>
              <div className="project-title">{p.title}</div>
              <div className="project-desc">{p.description}</div>
              {p.highlight && <div className="project-highlight">{p.highlight}</div>}
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span key={t} className="project-tag">
                    {t}
                  </span>
                ))}
              </div>
            </>
          );
          return p.url ? (
            <a key={p.id} className="project-card" href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}>
              {card}
            </a>
          ) : (
            <div key={p.id} className="project-card">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Research({ publications, profile }: Pick<HomeData, "publications" | "profile">) {
  return (
    <section id="research">
      <div className="section-tag">Academia</div>
      <h2 className="section-title">Research &amp; Publications</h2>
      <div className="research-grid">
        {publications.map((p) => (
          <div key={p.id} className="pub-card">
            <div className="pub-venue">{p.venue}</div>
            <div className="pub-title">{p.title}</div>
            <div className="pub-abstract">{p.abstract}</div>
            <span className="pub-author">{p.authors}</span>
            {(p.pdf_url || p.doi_url) && (
              <div className="pub-links">
                {p.pdf_url && (
                  <a href={p.pdf_url} target="_blank" rel="noopener noreferrer">
                    PDF →
                  </a>
                )}
                {p.doi_url && (
                  <a href={p.doi_url} target="_blank" rel="noopener noreferrer">
                    DOI →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="keyword-cloud">
        {profile.research_keywords.map((k) => (
          <span key={k} className="keyword">
            {k}
          </span>
        ))}
      </div>
    </section>
  );
}

export async function Startups({ startups, profile }: Pick<HomeData, "startups" | "profile">) {
  const footnote = profile.startups_footnote ? await renderInlineMarkdown(profile.startups_footnote) : "";
  return (
    <section id="startups">
      <div className="section-tag">Builder Mindset</div>
      <h2 className="section-title">{startups.length} Bets on Myself</h2>
      <div className="startups-scroll-wrap">
        <div className="startups-track">
          {startups.map((s) => (
            <div key={s.id} className="startup-card">
              <div className="card-flipper">
                <div className="card-front">
                  <div className="startup-year">{s.year}</div>
                  <div className="startup-emoji">{s.emoji}</div>
                  <div className="startup-name">{s.name}</div>
                  <div className="startup-domain">{s.domain}</div>
                </div>
                <div className="card-back">
                  <div className="back-name">{s.name}</div>
                  <div className="back-desc">{s.description}</div>
                  <div className="back-year">{[s.year, s.note].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="startup-card startup-card-special">
            <div className="card-flipper">
              <div className="card-front">
                <div className="startup-emoji">⚡</div>
                <div className="loading-text">
                  Next bet <span className="loading-dots"></span>
                </div>
              </div>
              <div
                className="card-back"
                style={{ background: "var(--surface2)", border: "1px solid rgba(245,166,35,0.3)" }}
              >
                <div className="back-name" style={{ color: "var(--amber)" }}>
                  Still building.
                </div>
                <div className="back-desc" style={{ color: "var(--text-2)" }}>
                  {startups.length} attempts. 0 regrets. The next one is loading.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {footnote && (
        <div className="startup-footnote">
          <p dangerouslySetInnerHTML={{ __html: footnote }} />
        </div>
      )}
    </section>
  );
}

export function Skills({ skillGroups }: Pick<HomeData, "skillGroups">) {
  return (
    <section id="skills">
      <div className="section-tag">Capabilities</div>
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {skillGroups.map((g) => (
          <div key={g.id} className="skill-group">
            <div className="skill-group-title">{g.title}</div>
            {g.skills.map((s) => (
              <div key={s.id} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level">{s.level_label}</span>
                </div>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar"
                    data-w={barKey(s.percent)}
                    style={{ "--target": `${s.percent}%` } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Certifications({ certifications }: Pick<HomeData, "certifications">) {
  return (
    <section id="certifications">
      <div className="section-tag">Credentials</div>
      <h2 className="section-title">Certifications</h2>
      <div className="cert-grid">
        {certifications.map((c) => (
          <div key={c.id} className="cert-card">
            <div className="cert-issuer">{c.issuer}</div>
            <div className="cert-title">{c.title}</div>
            <div className="cert-desc">{c.description}</div>
            <div className="cert-footer">
              <span className="cert-date">{c.date_label}</span>
              {c.pdf_url ? (
                <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="cert-link">
                  View PDF →
                </a>
              ) : (
                <span className="cert-link" style={{ color: "var(--text-3)", cursor: "default" }}>
                  {c.issuer.split(" / ")[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Archive({ archive }: Pick<HomeData, "archive">) {
  return (
    <section id="older-projects">
      <div className="section-tag">Archive</div>
      <h2 className="section-title">Earlier Work</h2>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--text-3)",
          marginBottom: "2.5rem",
          letterSpacing: "0.04em",
        }}
      >
        Projects from the early years — when every build was a lesson in disguise.
      </p>
      <div className="archive-grid">
        {archive.map((p) => (
          <div key={p.id} className="archive-card">
            <div className="archive-year">{p.year}</div>
            <span className="archive-icon">{p.icon}</span>
            <div className="archive-title">{p.title}</div>
            <div className="archive-desc">{p.description}</div>
            <div className="archive-tags">
              {p.tags.map((t) => (
                <span key={t} className="archive-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LatestPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section id="latest-posts">
      <div className="section-tag">Writing</div>
      <h2 className="section-title">Latest from the Blog</h2>
      <PostGrid posts={posts} />
      <Link href="/blog" className="latest-more">
        All articles →
      </Link>
    </section>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="blog-grid">
      {posts.map((p, i) => (
        <Link key={p.id} href={`/blog/${p.slug}`} className="post-card" style={{ animationDelay: `${0.05 * i}s` }}>
          <div className="post-cover">
            {p.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover_image} alt="" loading="lazy" />
            )}
          </div>
          <div className="post-card-body">
            <div className="post-meta">
              {formatDate(p.published_at)} · {p.reading_minutes} min read
            </div>
            <div className="post-card-title">{p.title}</div>
            {p.excerpt && <div className="post-excerpt">{p.excerpt}</div>}
            {p.tags.length > 0 && (
              <div className="post-card-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Contact({ profile }: Pick<HomeData, "profile">) {
  const heading = profile.contact_heading.split("\n");
  return (
    <section id="contact">
      <div className="contact-heading">
        {heading.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </div>
      <div className="contact-sub">{profile.contact_sub}</div>
      <div className="contact-cards">
        {profile.contact_links.map((c) => {
          const external = !c.href.startsWith("mailto:");
          return (
            <a
              key={c.label}
              href={c.href}
              className="contact-card"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <div className="contact-icon">{c.icon}</div>
              <div className="contact-label">{c.label}</div>
              <div className="contact-value">
                {c.value.split("\n").map((v, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {v}
                  </Fragment>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
