"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Closes the CSS-only mobile menu after a link is tapped or the route changes. */
export function NavCloser() {
  const pathname = usePathname();
  useEffect(() => {
    const check = document.getElementById("nav-check") as HTMLInputElement | null;
    if (check) check.checked = false;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest(".nav-links a") && check) check.checked = false;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return null;
}
