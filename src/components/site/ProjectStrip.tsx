"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/types";

/** Image cards for projects linked to an experience; click opens a details modal. */
export function ProjectStrip({ projects, label }: { projects: Project[]; label: string }) {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <div className="exp-projects">
      <div className="exp-projects-label">{label}</div>
      <div className="exp-projects-grid">
        {projects.map((p) => (
          <button key={p.id} type="button" className="client-card" onClick={() => setOpen(p)}>
            <div className="client-thumb">
              {p.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element -- images may live on Supabase Storage
                <img src={p.cover_image} alt={`${p.title} screenshot`} loading="lazy" />
              ) : (
                <span aria-hidden>{p.icon || "◆"}</span>
              )}
            </div>
            <div className="client-body">
              <div className="client-title">{p.title}</div>
              {p.role && <div className="client-role">{p.role}</div>}
            </div>
          </button>
        ))}
      </div>
      {/* Portal: .exp-item has a transform, which would trap a position:fixed modal inside the card. */}
      {open && createPortal(<ProjectModal project={open} onClose={() => setOpen(null)} />, document.body)}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const images = [project.cover_image, ...project.gallery].filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const meta = [project.year, project.country].filter(Boolean).join(" · ");

  return (
    <div className="pmodal-backdrop" onClick={onClose}>
      <div
        className="pmodal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pmodal-close" onClick={onClose} aria-label="Close" autoFocus>
          ✕
        </button>
        {images[active] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pmodal-img" src={images[active]} alt={`${project.title} screenshot`} />
        )}
        {images.length > 1 && (
          <div className="pmodal-gallery">
            {images.map((src, i) => (
              <button key={src} type="button" aria-current={i === active} onClick={() => setActive(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
        <div className="pmodal-body">
          {meta && <div className="pmodal-meta">{meta}</div>}
          <div className="pmodal-title">{project.title}</div>
          {project.role && <div className="pmodal-role">{`// ${project.role}`}</div>}
          <p className="pmodal-desc">{project.description}</p>
          {project.tags.length > 0 && (
            <div className="project-tags" style={{ marginBottom: project.url ? "1.25rem" : 0 }}>
              {project.tags.map((t) => (
                <span key={t} className="project-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          {project.url && (
            <a className="pmodal-link" href={project.url} target="_blank" rel="noopener noreferrer">
              Visit project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
