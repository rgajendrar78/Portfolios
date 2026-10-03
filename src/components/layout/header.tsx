"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { portfolio } from "@/config/portfolio";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "ai", label: "AI" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
// The hero is watched too, so no link stays lit once you are back at the top.
const WATCHED = ["top", ...NAV.map((item) => item.id)];
const EASE = "duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]";

const onScroll = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
};

interface Marker {
  id: string;
  left: number;
  width: number;
}

export function Header() {
  const { person } = portfolio;
  const scrolled = useSyncExternalStore(
    onScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const [marker, setMarker] = useState<Marker | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = WATCHED.map((id) => document.getElementById(id)).filter((node) => node !== null);
    let current = "";
    let frame = 0;
    // The pill takes its place from the link itself, so it always sits exactly behind it.
    const place = () => {
      const link = nav.current?.querySelector<HTMLElement>(`a[href="#${current}"]`);
      setMarker(link ? { id: current, left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    // The current section is the last one whose top has passed the middle of the screen.
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      const passed = sections.filter((section) => section.getBoundingClientRect().top <= middle);
      const id = passed.at(-1)?.id ?? "";
      if (id === current) return;
      current = id;
      place();
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    // Link widths change when the web font arrives or the window is resized.
    window.addEventListener("resize", place);
    void document.fonts.ready.then(place);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <header className="anim-in fixed inset-x-0 top-0 z-50">
      <div className={`mx-auto transition-all ${EASE} ${scrolled ? "mt-3 max-w-[65rem] px-3 sm:px-4" : "max-w-[70rem]"}`}>
        <div
          className={`relative overflow-hidden border transition-all ${EASE} ${
            scrolled || menuOpen
              ? "rounded-[1.75rem] border-line-strong/70 bg-raised/75 shadow-[0_12px_40px_-12px_var(--shadow)] backdrop-blur-md"
              : "rounded-[1.75rem] border-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-4 transition-all ${EASE} ${
              scrolled ? "h-14 px-5" : "h-16 px-5 sm:px-8"
            }`}
          >
            <a href="#top" className="flex min-w-0 items-baseline gap-2.5 text-ink">
              <span className="truncate text-[1.3125rem] leading-none">{person.name}</span>
              <span
                className={`text-2xs whitespace-nowrap text-faint transition-all duration-300 max-xl:hidden ${
                  scrolled ? "w-0 overflow-hidden opacity-0" : "opacity-100"
                }`}
              >
                {person.tagline}
              </span>
            </a>

            <nav ref={nav} aria-label="Sections" className="relative hidden items-center text-sm lg:flex">
              {/* The pill that slides to the current section. */}
              <span
                aria-hidden
                className={`absolute top-1/2 h-8 -translate-y-1/2 rounded-full border border-line-strong bg-ink/[0.06] transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                  marker ? "opacity-100" : "opacity-0"
                }`}
                style={{ left: marker?.left ?? 0, width: marker?.width ?? 0 }}
              />
              {NAV.map(({ id, label }) => {
                const current = marker?.id === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={current ? "location" : undefined}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 transition-colors duration-300 ${
                      current ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {/* Always in the layout, so a link keeps its width when it becomes current. */}
                    <span
                      aria-hidden
                      className={`size-1 rounded-full bg-accent transition-transform duration-300 ${current ? "" : "scale-0"}`}
                    />
                    {label}
                  </a>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <a
                href={person.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-full bg-ink px-4 py-1.5 text-sm font-medium whitespace-nowrap text-bg transition-transform duration-200 hover:-translate-y-px max-lg:hidden"
              >
                {/* A band of light that sweeps across on hover. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]"
                />
                <span className="relative">Resume ↗</span>
              </a>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="-mr-2 flex items-center gap-2 p-2 text-xs tracking-wider text-ink uppercase lg:hidden"
              >
                Menu
                <span aria-hidden className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${
                      menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${
                      menuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          <nav
            id="site-menu"
            aria-label="Sections"
            className={`grid transition-[grid-template-rows] ${EASE} lg:hidden ${
              menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <ul className="overflow-hidden px-5">
              {[...NAV, { id: "resume", label: "Resume" }].map(({ id, label }) => (
                <li key={id} className="border-t border-line">
                  <a
                    href={`#${id}`}
                    tabIndex={menuOpen ? undefined : -1}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-[0.9375rem] text-ink"
                  >
                    {label}
                    <span aria-hidden className="text-faint">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span
            aria-hidden
            className={`scroll-progress absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent via-accent to-ok transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </header>
  );
}
