"use client";

import { useEffect, useRef, useState } from "react";
import type { Tone } from "@/types/portfolio";
import { toneColor } from "@/components/ui/tones";

/** A soft light that follows the pointer across the section it sits in. */
export function Spotlight() {
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = light.current;
    const host = node?.parentElement?.parentElement;
    if (!node || !host) return;
    let frame = 0;
    // Only `transform` changes, once per frame, so following the pointer never repaints the page.
    const follow = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = host.getBoundingClientRect();
        node.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0)`;
      });
    };
    host.addEventListener("pointermove", follow, { passive: true });
    return () => {
      host.removeEventListener("pointermove", follow);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={light}
        className="absolute -top-[26.25rem] -left-[26.25rem] size-[52.5rem] translate-x-[72vw] translate-y-48 rounded-full transition-transform duration-300 ease-out will-change-transform"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}

const ROTATE_MS = 3600;

/** A highlighted phrase; with several options it swaps between them, resizing to fit. */
export function Phrase({ options, tone, order }: { options: string[]; tone: Tone; order: number }) {
  const [current, setCurrent] = useState(0);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = box.current;
    const sized = node?.querySelector<HTMLElement>("[data-current]");
    if (node && sized) node.style.width = `${sized.offsetWidth}px`;
  }, [current]);

  return (
    <span className="group whitespace-nowrap">
      <span className="sr-only">{options[0]}</span>
      <span
        ref={box}
        aria-hidden
        className="relative inline-block h-[1.25em] overflow-hidden align-[-0.3em] transition-[width] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] [clip-path:inset(-2px_-4px)]"
      >
        {/* In the flow but unseen: it gives the box its width before any script runs. */}
        <span className="invisible px-0.5">{options[current]}</span>
        {options.map((option, index) => (
          <span
            key={option}
            data-current={index === current ? "" : undefined}
            className={`mark-draw absolute top-0 left-0 px-0.5 leading-[1.25em] whitespace-nowrap text-ink transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:brightness-125 ${
              index === current ? "opacity-100" : "translate-y-[70%] opacity-0 blur-[3px]"
            }`}
            style={{
              backgroundImage: `linear-gradient(transparent 58%, color-mix(in oklab, ${toneColor(tone)} 30%, transparent) 58%)`,
              "--d": `${600 + order * 220}ms`,
            }}
          >
            {option}
          </span>
        ))}
        {options.length > 1 && (
          <span
            key={current}
            className="clock"
            style={{ animationDuration: `${ROTATE_MS}ms`, animationDelay: `${order * 1200}ms` }}
            onAnimationEnd={() => setCurrent((index) => (index + 1) % options.length)}
          />
        )}
      </span>
    </span>
  );
}

const COUNT_MS = 1400;

/** Counts up to a figure such as "3.5+" once, on load; the final text is what the server sent. */
export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = text.current;
    const target = Number.parseFloat(value);
    if (!node || Number.isNaN(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const suffix = value.replace(/^[\d.]+/, "");
    const decimals = value.match(/\.(\d+)/)?.[1].length ?? 0;
    let frame = 0;
    const start = performance.now() + delay;
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / COUNT_MS));
      // Ease-out: fast at first, settling on the figure.
      node.textContent = (target * (1 - (1 - progress) ** 3)).toFixed(decimals) + suffix;
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, delay]);

  return <span ref={text}>{value}</span>;
}
