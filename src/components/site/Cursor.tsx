"use client";
import { useEffect, useRef } from "react";

const HOVER_TARGETS = "a, button, .project-card, .startup-card, .pub-card, .client-card, .post-card";

/** Amber dot + trailing ring cursor (ported from the legacy inline script). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = dot.current!;
    const r = ring.current!;
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const setHover = (on: boolean) => {
      cursor.style.width = cursor.style.height = on ? "18px" : "10px";
      r.style.width = r.style.height = on ? "52px" : "36px";
      r.style.borderColor = on ? "rgba(245,166,35,0.7)" : "rgba(245,166,35,0.4)";
    };
    const onOver = (e: MouseEvent) => setHover(!!(e.target as Element).closest?.(HOVER_TARGETS));
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
      r.style.left = `${rx}px`;
      r.style.top = `${ry}px`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
