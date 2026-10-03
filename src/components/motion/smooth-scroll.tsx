"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Eases wheel scrolling and in-page links. Touch scrolling stays native, and reduced motion turns it off. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      // Stops with the page when a case study locks scrolling.
      autoToggle: true,
      // In-page links ease too; the gap for the floating header is `scroll-padding-top` in globals.css.
      anchors: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
