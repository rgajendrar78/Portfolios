"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import { Icon } from "@/components/ui/icon";
import { pad } from "@/lib/format";
import { stagger } from "@/lib/motion";

const { steps, quote } = portfolio.principles;
const HOLD_MS = 5200;
// Degrees between two steps: the loop divides itself by however many steps there are.
const TURN = 360 / steps.length;
const RING = "absolute top-1/2 left-1/2 size-[calc(var(--r)*2)] -translate-1/2 -rotate-90 overflow-visible";
const HOLD = "group-focus-within:[animation-play-state:paused]";

const onRing = (degrees: number) => {
  const angle = ((degrees - 90) * Math.PI) / 180;
  return { x: Math.cos(angle), y: Math.sin(angle) };
};

/** Where a step's caption sits relative to its node, from the node's position on the ring. */
const captionSide = (x: number, y: number) => {
  if (x > 0.1) return "top-1/2 left-[calc(100%+1rem)] -translate-y-1/2 text-left";
  if (x < -0.1) return "top-1/2 right-[calc(100%+1rem)] -translate-y-1/2 text-right";
  return `left-1/2 -translate-x-1/2 text-center ${y < 0 ? "bottom-[calc(100%+0.875rem)]" : "top-[calc(100%+0.875rem)]"}`;
};

const place = (radius: string, x: number, y: number) => ({
  left: `calc(50% + ${radius} * ${x.toFixed(4)})`,
  top: `calc(50% + ${radius} * ${y.toFixed(4)})`,
});

export function Principles() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const current = steps[active];
  const pick = (index: number) => {
    setActive(index);
    setAuto(false);
  };

  return (
    <div className="reveal autoplay group">
      {/* `--r` is the ring's radius; everything on the loop is placed from it. */}
      <div className="relative mx-auto h-[20.5rem] w-full max-w-[62.5rem] [--r:7.375rem] sm:h-[25rem] sm:[--r:9.375rem] lg:h-[43.75rem] lg:[--r:12.5rem]">
        {/* The inner band turns in the direction of travel; it is its own layer so only a transform moves. */}
        <svg viewBox="-100 -100 200 200" aria-hidden className={`${RING} animate-[orbit_60s_linear_infinite]`}>
          <circle
            r="70"
            fill="none"
            strokeWidth="11"
            className="stroke-[color-mix(in_oklab,var(--accent)_22%,var(--raised))]"
          />
          {steps.map((step, index) => (
            <path
              key={step.title}
              d="M-2.5 -3 1.5 0-2.5 3"
              fill="none"
              strokeWidth="1.3"
              strokeLinecap="round"
              className="stroke-accent"
              transform={`rotate(${TURN * (index + 0.5)}) translate(70 0) rotate(90)`}
            />
          ))}
        </svg>
        <svg viewBox="-100 -100 200 200" aria-hidden className={RING}>
          <circle r="100" fill="none" strokeWidth="0.8" className="stroke-line-strong" />
          {/* A two-headed spoke joins each step to the band; the current one thickens. */}
          {steps.map((step, index) => (
            <path
              key={step.title}
              d="M78 0 82-2v4zM82 0h6M92 0 88-2v4z"
              strokeLinejoin="round"
              className={`fill-current stroke-current transition-all duration-400 ${index === active ? "text-accent" : "text-faint"}`}
              style={{ strokeWidth: index === active ? 2.2 : 0.8 }}
              transform={`rotate(${TURN * index})`}
            />
          ))}
          {/* The arc runs from the current step to the next, then hands over. */}
          {auto && (
            <g
              key={active}
              style={{ transform: `rotate(${TURN * active}deg)`, "--turn": `${TURN}deg` }}
            >
              <circle
                r="100"
                fill="none"
                pathLength={steps.length}
                strokeWidth="2"
                strokeLinecap="round"
                onAnimationEnd={() => setActive((step) => (step + 1) % steps.length)}
                className={`animate-[wheel-arc_linear_both] stroke-accent ${HOLD}`}
                style={{ animationDuration: `${HOLD_MS}ms` }}
              />
              <g className={`animate-[wheel-head_linear_both] ${HOLD}`} style={{ animationDuration: `${HOLD_MS}ms` }}>
                <circle cx="100" r="5" className="fill-accent/25" />
                <circle cx="100" r="2.2" className="fill-accent" />
              </g>
            </g>
          )}
        </svg>

        <div className="absolute top-1/2 left-1/2 w-[calc(var(--r)*1.12)] -translate-1/2 text-center max-sm:hidden">
          <div key={active} className="anim-in">
            <Icon name={current.icon} className="mx-auto size-14 lg:size-16" />
            <h3 className="mt-2 text-2xl leading-tight text-ink lg:text-[1.75rem]">{current.title}</h3>
            <p className="mt-2 text-[0.78125rem] leading-relaxed text-body max-lg:hidden">{current.detail}</p>
          </div>
        </div>

        {steps.map((step, index) => {
          const { x, y } = onRing(TURN * index);
          const on = index === active;
          return (
            <div
              key={step.title}
              className="reveal absolute -translate-1/2"
              style={{ ...place("var(--r)", x, y), ...stagger(index, steps.length) }}
            >
              <button
                type="button"
                aria-pressed={on}
                aria-label={step.title}
                onClick={() => pick(index)}
                className={`group/node relative grid size-12 place-items-center rounded-full border transition-all duration-300 lg:size-16 ${
                  on
                    ? "scale-110 border-accent bg-tint shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent)_18%,transparent),0_10px_30px_-10px_var(--accent)]"
                    : "border-line-strong bg-raised hover:border-accent/60"
                }`}
              >
                {on && (
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full border border-accent/60 [animation-duration:2.6s]"
                  />
                )}
                <Icon
                  name={step.icon}
                  className={`size-9 transition-all duration-300 group-hover/node:-translate-y-0.5 lg:size-12 ${on ? "" : "opacity-90"}`}
                />
                <span
                  className={`absolute -top-1 -right-1 rounded-full border bg-bg px-1 text-[0.5625rem] leading-4 tabular-nums transition-colors duration-300 ${
                    on ? "border-accent text-accent" : "border-line-strong text-faint"
                  }`}
                >
                  {pad(index + 1)}
                </span>
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={() => pick(index)}
                className={`absolute w-[13.125rem] max-lg:hidden ${captionSide(x, y)}`}
              >
                <span
                  className={`block text-[1.375rem] leading-tight transition-colors duration-300 ${on ? "text-accent" : "text-ink"}`}
                >
                  {step.title}
                </span>
                <span className="mt-1 block text-[0.78125rem] leading-snug text-muted">{step.text}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Below the laptop size the captions do not fit round the ring, so the current step is spelled out here. */}
      <div key={active} className="anim-in mx-auto mt-4 max-w-2xl text-center lg:hidden">
        <p className="text-2xs tracking-wider text-accent uppercase">
          {pad(active + 1)} · {current.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-body">{current.detail}</p>
      </div>

      {quote && (
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-snug text-muted italic sm:text-xl lg:mt-2">
          &ldquo;{quote}&rdquo;
        </p>
      )}
      <p className="mt-4 text-center text-3xs text-faint">
        {auto ? "cycling · pick a step to stop" : "pick any step to read it"}
      </p>
    </div>
  );
}
