"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import type { RequestLayer } from "@/types/portfolio";
import { Icon } from "@/components/ui/icon";
import { toneColor } from "@/components/ui/tones";
import { pad } from "@/lib/format";

const { layers, aside } = portfolio.about.request;
const stops: RequestLayer[] = [...layers, aside];
const HOLD_MS = 3200;

function Row({ layer, on, onPick }: { layer: RequestLayer; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onPick}
      className={`group/row relative z-10 flex w-full items-center gap-3 rounded-xl border p-2 pr-3 text-left transition-all duration-300 ${
        on
          ? "border-accent/60 bg-tint shadow-[0_8px_24px_-12px_var(--accent)]"
          : "border-line bg-raised hover:border-line-strong"
      }`}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-bg">
        <Icon
          name={layer.icon}
          className="size-8 transition-transform duration-300 group-hover/row:-translate-y-0.5"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm leading-tight ${on ? "text-ink" : "text-body"}`}>{layer.name}</span>
        <span className="mt-0.5 block truncate text-[0.65625rem] text-faint">{layer.detail}</span>
      </span>
      <span
        aria-hidden
        className={`size-2 shrink-0 rounded-full transition-opacity duration-300 ${on ? "opacity-100" : "opacity-35"}`}
        style={{ background: toneColor(layer.tone) }}
      />
    </button>
  );
}

/** The layers of a request: it walks through them on its own until you pick one. */
export function RequestExplorer() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const current = stops[active];
  const depth = layers.length > 1 ? Math.min(active, layers.length - 1) / (layers.length - 1) : 1;

  const pick = (index: number) => {
    setActive(index);
    setAuto(false);
  };

  return (
    <div className="autoplay group grid gap-6 lg:grid-cols-[minmax(0,19rem)_1fr]">
      <div>
        <div className="relative space-y-2.5 pl-7">
          {/* The rail fills down to the current layer; the dot is the request passing through. */}
          <span aria-hidden className="absolute top-6 bottom-6 left-2.5 w-0.5 bg-line">
            <span
              className="absolute inset-0 origin-top bg-gradient-to-b from-sky via-accent to-ok transition-transform duration-500"
              style={{ transform: `scaleY(${depth})` }}
            />
            <span className="absolute inset-0 animate-rail">
              <span className="absolute left-1/2 size-2.5 -translate-1/2 rounded-full bg-ink shadow-[0_0_10px_2px_var(--accent)]" />
            </span>
          </span>
          {layers.map((layer, index) => (
            <div key={layer.name} className="relative">
              <span
                aria-hidden
                className="absolute top-1/2 -left-[22px] size-2 -translate-y-1/2 rounded-full border-2 border-bg transition-colors duration-300"
                style={{ background: index <= active ? toneColor(layer.tone) : "var(--line-strong)" }}
              />
              <Row layer={layer} on={index === active} onPick={() => pick(index)} />
            </div>
          ))}
        </div>
        <div className="relative mt-4 border-t border-dashed border-line-strong pt-4 pl-7">
          <span aria-hidden className="absolute top-4 left-1 text-3xs text-faint">
            ++
          </span>
          <Row layer={aside} on={active === layers.length} onPick={() => pick(layers.length)} />
          <p className="mt-1.5 pl-1 text-3xs text-faint">{aside.note}</p>
        </div>
      </div>

      <div className="card relative self-start overflow-hidden rounded-xl p-6 sm:p-7">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-20 blur-3xl transition-colors duration-500"
          style={{ background: toneColor(current.tone) }}
        />
        <div key={current.name} className="anim-in relative">
          <div className="flex items-center gap-4">
            <Icon name={current.icon} className="size-14" />
            <div className="min-w-0">
              <p className="text-2xs text-muted">
                {pad(active + 1)} · {current.detail}
              </p>
              <h4 className="mt-1 text-3xl leading-tight text-ink">{current.title}</h4>
            </div>
          </div>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-body">{current.text}</p>
          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {current.tools.map((tool, index) => (
              <span
                key={tool}
                className="anim-in rounded-full border border-line-strong bg-bg px-2.5 py-1 text-2xs text-body"
                style={{ "--d": `${150 + index * 70}ms` }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {auto && (
        <span
          key={active}
          className="clock"
          style={{ animationDuration: `${HOLD_MS}ms` }}
          onAnimationEnd={() => setActive((index) => (index + 1) % stops.length)}
        />
      )}
    </div>
  );
}
