"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import { TONE_TEXT } from "@/components/ui/tones";

const { label, requests } = portfolio.hero.trace;
const HOLD_MS = 7000;

interface Point {
  x: number;
  y: number;
}

// The diagram is drawn on a 516 × 236 canvas: source → gateway → services → stores.
const CANVAS = { w: 516, h: 236, inset: 24 };
const BOX = { w: 84, h: 36 };
const MIDDLE = (CANVAS.h - BOX.h) / 2;
const SOURCE: Point = { x: 8, y: MIDDLE };
const GATEWAY: Point = { x: 136, y: MIDDLE };

/** Spreads `count` boxes down a column, centred, and closer together when there are many. */
const column = (x: number, count: number, gap: number): Point[] => {
  const room = CANVAS.h - CANVAS.inset * 2 - BOX.h;
  const step = count > 1 ? Math.min(gap, room / (count - 1)) : 0;
  return Array.from({ length: count }, (_, index) => ({
    x,
    y: MIDDLE - (step * (count - 1)) / 2 + step * index,
  }));
};

const curve = (from: Point, to: Point) => {
  const startX = from.x + BOX.w;
  const startY = from.y + BOX.h / 2;
  const endY = to.y + BOX.h / 2;
  const middle = (startX + to.x) / 2;
  return `M${startX} ${startY}C${middle} ${startY} ${middle} ${endY} ${to.x} ${endY}`;
};

/** Each service writes to the store(s) level with it. */
const writes = (services: number, stores: number) =>
  Array.from({ length: services }, (_, service) => {
    const first = Math.floor((service * stores) / services);
    const last = Math.ceil(((service + 1) * stores) / services) - 1;
    return first === last ? [[service, first]] : [[service, first], [service, last]];
  }).flat();

function Node({ at, text, className }: { at: Point; text: string; className: string }) {
  return (
    <g>
      <rect
        x={at.x}
        y={at.y}
        width={BOX.w}
        height={BOX.h}
        rx="9"
        strokeWidth="1.5"
        className={`fill-raised ${className}`}
      />
      <text
        x={at.x + BOX.w / 2}
        y={at.y + BOX.h / 2}
        dy="0.35em"
        textAnchor="middle"
        className="fill-ink text-[13px]"
      >
        {text}
      </text>
    </g>
  );
}

/** One request followed through a project: the services it touches and how long each step takes. */
export function Trace() {
  const [active, setActive] = useState(0);
  const request = requests[active];
  const services = column(280, request.services.length, 76);
  const stores = column(424, request.stores.length, 84);
  const edges = [
    curve(SOURCE, GATEWAY),
    ...services.map((service) => curve(GATEWAY, service)),
    ...writes(services.length, stores.length).map(([service, store]) => curve(services[service], stores[store])),
  ];

  return (
    <div className="autoplay group card card-hover overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <p className="label flex items-center gap-2 tracking-wider">
          <span aria-hidden className="text-ok">
            ●
          </span>
          {label}
        </p>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-bg p-0.5">
          {requests.map((item, index) => (
            <button
              key={item.project}
              type="button"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              className={`rounded-full px-3 py-1 text-2xs whitespace-nowrap transition-colors duration-300 ${
                index === active ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {item.project}
            </button>
          ))}
        </div>
      </div>

      {/* Fills while a project is shown, then moves on; hovering the card holds it. */}
      <div className="h-px bg-line">
        <span
          key={active}
          aria-hidden
          onAnimationEnd={() => setActive((current) => (current + 1) % requests.length)}
          className="block h-full origin-left animate-[grow-x_linear_both] bg-accent group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${HOLD_MS}ms` }}
        />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="dots flex flex-col justify-center border-line p-3 max-lg:border-b lg:border-r">
          <svg
            key={request.project}
            viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
            role="img"
            aria-label={request.caption}
            className="anim-in w-full"
          >
            {edges.map((path, index) => (
              <g key={path}>
                <path
                  d={path}
                  fill="none"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="animate-flow stroke-accent"
                />
                <circle r="3" className="fill-ink motion-reduce:hidden">
                  <animateMotion dur="2.8s" begin={`-${index * 0.4}s`} repeatCount="indefinite" path={path} />
                </circle>
              </g>
            ))}
            <Node at={SOURCE} text={request.source} className="stroke-sky" />
            <Node at={GATEWAY} text={request.gateway} className="stroke-violet" />
            {services.map((at, index) => (
              <Node key={at.y} at={at} text={request.services[index]} className="stroke-accent" />
            ))}
            {stores.map((at, index) => (
              <Node key={at.y} at={at} text={request.stores[index]} className="stroke-ok" />
            ))}
          </svg>
          <p className="px-1 pb-1 text-[0.65625rem] text-muted">{request.caption}</p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="label-sm mb-3 flex justify-between tracking-wider">
            <span>Span</span>
            <span>Relative time →</span>
          </p>
          <ol key={request.project} className="space-y-2.5">
            {request.spans.map((span, index) => (
              <li
                key={span.label}
                className="grid items-center gap-1 sm:grid-cols-[minmax(0,8.5rem)_1fr] sm:gap-3"
              >
                <span className="truncate text-2xs text-body">{span.label}</span>
                <span className="relative h-2.5 rounded-full bg-line/60">
                  <span
                    className={`grow-x absolute inset-y-0 rounded-full bg-current opacity-85 ${TONE_TEXT[span.tone]}`}
                    style={{
                      left: `${span.from}%`,
                      width: `${span.to - span.from}%`,
                      "--d": `${index * 110}ms`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ol>
          <p
            key={request.result}
            className="anim-in mt-5 flex items-center gap-2 border-t border-line pt-4 text-2xs text-ok"
            style={{ "--d": "500ms" }}
          >
            <span aria-hidden>✓</span>
            {request.result}
          </p>
        </div>
      </div>
    </div>
  );
}
