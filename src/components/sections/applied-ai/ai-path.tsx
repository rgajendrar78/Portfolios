"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import { Icon } from "@/components/ui/icon";
import { pad } from "@/lib/format";

const { path } = portfolio.ai;
const HOLD_MS = 4200;

const ZONES = [
  {
    zone: "model",
    label: "probabilistic · may be wrong",
    verdict: "model suggests",
    box: "border-dashed border-violet/30 bg-violet/[0.04] md:rounded-r-none md:border-r-0",
    text: "text-violet",
    chip: "border-violet/30 bg-violet/10 text-violet",
  },
  {
    zone: "backend",
    label: "deterministic · validated",
    verdict: "backend decides",
    box: "border-ok/30 bg-ok/[0.05] md:rounded-l-none",
    text: "text-ok",
    chip: "border-ok/30 bg-ok/10 text-ok",
  },
] as const;

const counts = ZONES.map(({ zone }) => path.filter((step) => step.zone === zone).length);
// Half a step: the progress line starts and ends at the centre of the first and last tile.
const EDGE = `${50 / path.length}%`;

/** The steps of an AI request; the highlight walks along them and explains each one. */
export function AiPath() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const current = path[active];
  const zone = ZONES.find((item) => item.zone === current.zone) ?? ZONES[0];
  const progress = path.length > 1 ? active / (path.length - 1) : 1;

  return (
    <div className="reveal autoplay group">
      <div
        className="relative grid gap-3 md:grid-cols-(--zones) md:gap-0"
        style={{ "--zones": counts.map((count) => `${count}fr`).join(" ") }}
      >
        {/* The line fills up to the current step and the dot rides its tip. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[4.9375rem] z-[5] h-0.5 bg-line max-md:hidden"
          style={{ left: EDGE, right: EDGE }}
        >
          <span
            className="absolute inset-0 origin-left bg-gradient-to-r from-violet via-accent to-ok transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{ transform: `scaleX(${progress})` }}
          />
          {/* As wide as the line, so moving it by a share of itself moves the dot by that share. */}
          <span
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{ transform: `translateX(${progress * 100}%)` }}
          >
            <span className="absolute top-1/2 left-0 size-3 -translate-1/2 rounded-full bg-ink shadow-[0_0_12px_2px_var(--accent)]" />
          </span>
        </div>

        {ZONES.map((item, zoneIndex) => (
          <div key={item.zone} className={`rounded-xl border px-2 pt-3 pb-5 md:px-0 ${item.box}`}>
            <p className={`mb-5 px-3 text-3xs tracking-wider uppercase ${item.text}`}>{item.label}</p>
            <ol
              className="grid grid-cols-3 gap-y-6 md:grid-cols-(--steps)"
              style={{ "--steps": `repeat(${counts[zoneIndex]}, minmax(0, 1fr))` }}
            >
              {path.map((step, index) => {
                if (step.zone !== item.zone) return null;
                const on = index === active;
                return (
                  <li key={step.step} className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={step.step}
                      onClick={() => {
                        setActive(index);
                        setAuto(false);
                      }}
                      className={`group/step relative z-10 grid size-14 place-items-center rounded-2xl border transition-all duration-300 sm:size-16 ${
                        on
                          ? "scale-110 border-accent bg-tint shadow-[0_0_0_5px_color-mix(in_oklab,var(--accent)_16%,transparent),0_10px_28px_-10px_var(--accent)]"
                          : "border-line bg-raised hover:border-line-strong"
                      }`}
                    >
                      <Icon
                        name={step.icon}
                        className={`size-10 transition-all duration-300 group-hover/step:-translate-y-0.5 sm:size-11 ${on ? "" : "opacity-70"}`}
                      />
                      <span
                        className={`absolute -top-1.5 -right-1.5 rounded-full border bg-bg px-1 text-[0.5625rem] leading-4 tabular-nums transition-colors duration-300 ${
                          on ? "border-accent text-accent" : "border-line-strong text-faint"
                        }`}
                      >
                        {pad(index + 1)}
                      </span>
                    </button>
                    <span
                      className={`mt-3 text-md leading-tight transition-colors duration-300 ${on ? "text-accent" : "text-ink"}`}
                    >
                      {step.step}
                    </span>
                    <span className="mt-0.5 text-3xs text-faint">{step.note}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      <div className="card mt-4 flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <Icon name={current.icon} className="size-12" />
        <div key={active} className="anim-in min-w-0 flex-1">
          <p className="text-[0.65625rem] tracking-wider text-faint uppercase">
            step {pad(active + 1)} · {current.step}
          </p>
          <p className="mt-1 text-[0.90625rem] leading-snug text-ink">{current.detail}</p>
          <code
            className={`mt-2 inline-block max-w-full rounded-md border px-2 py-1 font-sans text-[0.71875rem] wrap-anywhere ${zone.chip}`}
          >
            {current.example}
          </code>
        </div>
        <span
          className={`self-start rounded-full border px-2.5 py-1 text-3xs whitespace-nowrap transition-colors duration-300 sm:self-center ${zone.chip} bg-transparent`}
        >
          {zone.verdict}
        </span>
      </div>
      <p className="mt-2 text-3xs text-faint">
        {auto ? "playing one request · pick a step to stop" : "pick any step to read it"}
      </p>

      {auto && (
        <span
          key={active}
          className="clock"
          style={{ animationDuration: `${HOLD_MS}ms` }}
          onAnimationEnd={() => setActive((step) => (step + 1) % path.length)}
        />
      )}
    </div>
  );
}
