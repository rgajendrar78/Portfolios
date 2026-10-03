"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Icon } from "@/components/ui/icon";

const { replay } = portfolio.ai;
const STEP_MS = 1300;
const REST_MS = 3200;

/** One request replayed step by step: each step runs, completes, and the result lands at the end. */
export function AiReplay() {
  const [scene, setScene] = useState(0);
  const [tick, setTick] = useState(0);
  const calm = useReducedMotion();
  const current = replay[scene];
  // With reduced motion nothing plays, so the finished request is shown straight away.
  const done = calm ? current.steps.length : tick;
  const finished = done >= current.steps.length;

  const show = (index: number) => {
    setScene(index);
    setTick(0);
  };

  return (
    <div className="reveal autoplay group card overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-2xs text-muted">replay · how the request is routed</p>
        <div className="flex flex-wrap gap-1 rounded-full border border-line bg-bg p-0.5">
          {replay.map((item, index) => (
            <button
              key={item.project}
              type="button"
              aria-pressed={index === scene}
              onClick={() => show(index)}
              className={`rounded-full px-3 py-1 text-2xs whitespace-nowrap transition-colors duration-300 ${
                index === scene ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {item.project}
            </button>
          ))}
        </div>
      </div>

      <div className="relative p-5 sm:p-6">
        <div key={current.project} className="anim-in flex items-start gap-3">
          <Icon name="user" className="size-10" />
          <p className="rounded-2xl rounded-tl-sm border border-sky/30 bg-sky/10 px-3.5 py-2 text-sm leading-snug text-ink">
            {current.ask}
          </p>
        </div>

        <ol className="relative mt-5 space-y-3 pl-1">
          <span aria-hidden className="absolute top-5 bottom-5 left-[25px] w-0.5 bg-line">
            <span
              className="absolute inset-0 origin-top bg-gradient-to-b from-violet via-accent to-ok transition-transform duration-500 ease-out"
              style={{
                transform: `scaleY(${Math.min(done, current.steps.length - 1) / Math.max(1, current.steps.length - 1)})`,
              }}
            />
          </span>
          {current.steps.map((step, index) => {
            const complete = index < done;
            const running = index === done;
            return (
              <li key={step.label} className="relative flex items-center gap-4">
                <span
                  className={`relative z-10 grid size-12 shrink-0 place-items-center rounded-xl border bg-bg transition-all duration-300 ${
                    running
                      ? "scale-105 border-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_16%,transparent)]"
                      : complete
                        ? "border-line-strong"
                        : "border-line opacity-50"
                  }`}
                >
                  <Icon name={step.icon} className="size-8" />
                </span>
                <div
                  className={`min-w-0 flex-1 rounded-lg border px-3 py-2 transition-all duration-300 ${
                    complete ? "border-line bg-bg/60" : "border-transparent"
                  }`}
                >
                  <p className="flex items-center gap-2 text-[0.65625rem] tracking-wider text-faint uppercase">
                    {step.label}
                    {complete && <span className="text-ok">✓</span>}
                    {running && <span className="animate-pulse text-accent normal-case">running…</span>}
                  </p>
                  {complete ? (
                    <p className="anim-in mt-0.5 text-md leading-snug text-body">{step.text}</p>
                  ) : (
                    <span aria-hidden className="mt-2 block h-1.5 max-w-xs rounded-full bg-line/70" />
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div
          className={`mt-5 flex items-start gap-3 rounded-xl border border-ok/30 bg-ok/[0.07] p-3.5 transition-all duration-500 ${
            finished ? "opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <Icon name="check" className="size-8" />
          <div className="min-w-0">
            <p className="text-sm leading-snug text-ink">{current.result}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {current.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-ok/30 px-2 py-0.5 text-[0.65625rem] text-ok">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span
          key={`${scene}-${tick}`}
          className="clock"
          style={{ animationDuration: `${finished ? REST_MS : STEP_MS}ms` }}
          onAnimationEnd={() => (finished ? show((scene + 1) % replay.length) : setTick((step) => step + 1))}
        />
      </div>
    </div>
  );
}
