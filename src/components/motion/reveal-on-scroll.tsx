"use client";

import { useEffect } from "react";

/**
 * Marks every `.reveal` element with `data-in` the first time it scrolls into
 * view, and every `.autoplay` block with `data-live` only while it is on screen.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          seen.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const live = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.toggleAttribute("data-live", entry.isIntersecting);
    });

    const watch = () =>
      document.querySelectorAll(".reveal:not([data-in])").forEach((node) => seen.observe(node));
    watch();
    document.querySelectorAll(".autoplay").forEach((node) => live.observe(node));
    // Filtering the project list adds cards after the first pass.
    const added = new MutationObserver(watch);
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      seen.disconnect();
      live.disconnect();
      added.disconnect();
    };
  }, []);

  return null;
}
