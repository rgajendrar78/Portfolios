"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/config/portfolio";
import type { Portfolio, Tone } from "@/types/portfolio";
import { Icon } from "@/components/ui/icon";
import { toneColor } from "@/components/ui/tones";

type Group = Portfolio["stack"]["groups"][number];

const { groups } = portfolio.stack;
const HOLD_MS = 4200;

const tools = groups.flatMap((group) => group.tools.map((tool) => ({ ...tool, group })));
const firstDaily = Math.max(
  0,
  tools.findIndex((tool) => tool.daily),
);

const IDLE: Record<Tone, string> = {
  accent: "border-accent/30 text-accent",
  ok: "border-ok/30 text-ok",
  sky: "border-sky/30 text-sky",
  violet: "border-violet/30 text-violet",
  neutral: "border-line-strong text-body",
};
const PICKED: Record<Tone, string> = {
  accent: "border-accent bg-accent text-bg",
  ok: "border-ok bg-ok text-bg",
  sky: "border-sky bg-sky text-bg",
  violet: "border-violet bg-violet text-bg",
  neutral: "border-ink bg-ink text-bg",
};

const tint = (tone: Tone, percent: number) => `color-mix(in oklab, ${toneColor(tone)} ${percent}%, transparent)`;

interface Wire {
  path: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

// How far outside the showcase a wire lands: on the dashed orbit around it.
const ORBIT_GAP = 14;

/** Where each group's card joins the showcase, measured from the layout so the wires follow any resize. */
function useWires() {
  const root = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState<Record<string, Wire>>({});

  useEffect(() => {
    const host = root.current;
    const hub = host?.querySelector<HTMLElement>("[data-hub]");
    if (!host || !hub) return;
    const measure = () => {
      const frame = host.getBoundingClientRect();
      const ring = hub.getBoundingClientRect();
      const centre = { x: ring.left + ring.width / 2 - frame.left, y: ring.top + ring.height / 2 - frame.top };
      const radius = ring.width / 2 + ORBIT_GAP;
      const next: Record<string, Wire> = {};
      for (const card of host.querySelectorAll<HTMLElement>("[data-group]")) {
        const box = card.getBoundingClientRect();
        // The wire leaves the card's inner edge at the height of its title.
        const x = (box.left < ring.left ? box.right : box.left) - frame.left;
        const y = box.top - frame.top + Math.min(34, box.height / 2);
        const angle = Math.atan2(y - centre.y, x - centre.x);
        const endX = centre.x + Math.cos(angle) * radius;
        const endY = centre.y + Math.sin(angle) * radius;
        const bend = (x + endX) / 2;
        next[card.dataset.group ?? ""] = {
          path: `M${x.toFixed(1)} ${y.toFixed(1)}C${bend.toFixed(1)} ${y.toFixed(1)} ${bend.toFixed(1)} ${endY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`,
          from: { x, y },
          to: { x: endX, y: endY },
        };
      }
      setWires(next);
    };
    const resized = new ResizeObserver(measure);
    resized.observe(host);
    return () => resized.disconnect();
  }, []);

  return { root, wires };
}

/** Skill groups either side of a showcase: it plays through the tools until you pick one. */
export function Stack() {
  const [active, setActive] = useState(firstDaily);
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState<Group | null>(null);
  const { root, wires } = useWires();
  const current = tools[active];
  // The group under the pointer borrows the highlight from the one being shown.
  const lit = hovered ?? current.group;

  const column = (side: Group["side"]) =>
    groups
      .filter((group) => group.side === side)
      .map((group) => {
        const on = group === lit;
        return (
          <div
            key={group.category}
            data-group={group.category}
            onMouseEnter={() => setHovered(group)}
            onMouseLeave={() => setHovered(null)}
            className={`relative rounded-lg border bg-raised p-4 transition-all duration-300 group-data-in/stack:anim-in ${
              on ? "border-line-strong shadow-[0_10px_30px_-15px_var(--shadow)]" : "border-line"
            }`}
            style={{ "--d": `${200 + groups.indexOf(group) * 110}ms` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-md border transition-colors duration-300"
                style={{ borderColor: tint(group.tone, on ? 60 : 30), background: tint(group.tone, on ? 16 : 7) }}
              >
                <Icon name={group.icon} className="size-6" />
              </span>
              <p className="text-xs tracking-wider text-ink uppercase">{group.category}</p>
              <span className="ml-auto text-2xs text-faint tabular-nums">{group.tools.length}</span>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {group.tools.map((tool) => {
                const index = tools.findIndex((item) => item.name === tool.name && item.group === group);
                const picked = index === active;
                return (
                  <button
                    key={tool.name}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => {
                      setActive(index);
                      setAuto(false);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.71875rem] transition-all duration-200 hover:-translate-y-px ${
                      picked ? PICKED[group.tone] : `${IDLE[group.tone]} hover:bg-ink/[0.05]`
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full border border-current ${tool.daily ? "bg-current" : ""}`}
                    />
                    {tool.daily && <span className="sr-only">Daily driver: </span>}
                    {tool.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      });

  // Tablets show the groups two abreast; laptops put them either side of the showcase.
  const stacked = "grid content-start gap-4 sm:max-lg:grid-cols-2";

  return (
    <div
      ref={root}
      className="reveal autoplay group/stack relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_18.75rem_minmax(0,1fr)] lg:items-center lg:gap-x-12 xl:gap-x-20"
    >
      {/* Wires only make sense once the groups sit either side of the showcase. */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible max-lg:hidden">
        {groups.map((group, index) => {
          const wire = wires[group.category];
          if (!wire) return null;
          const on = group === lit;
          const color = on ? toneColor(group.tone) : "var(--line-strong)";
          return (
            <g
              key={group.category}
              className="transition-[stroke,opacity] duration-300"
              style={{ stroke: color, opacity: on ? 1 : 0.45 }}
            >
              {/* Drawn from the card to the showcase when the section scrolls into view. */}
              <path
                d={wire.path}
                pathLength={1}
                fill="none"
                strokeWidth={on ? 1.6 : 1}
                className="transition-[stroke-dashoffset] duration-1200 ease-[cubic-bezier(0.5,0,0.2,1)] [stroke-dasharray:1] [stroke-dashoffset:1] group-data-in/stack:[stroke-dashoffset:0]"
                style={{ transitionDelay: `${300 + index * 110}ms` }}
              />
              {/* A socket on the card and a plug on the orbit. */}
              <circle
                cx={wire.from.x}
                cy={wire.from.y}
                r="4"
                strokeWidth="1.5"
                className="fill-bg"
                style={{ stroke: toneColor(group.tone) }}
              />
              <circle cx={wire.to.x} cy={wire.to.y} r="3" stroke="none" style={{ fill: toneColor(group.tone) }} />
              {/* Every wire carries a dot to the showcase; the current group's is larger and quicker. */}
              <circle
                key={String(on)}
                r={on ? 3.5 : 2}
                stroke="none"
                className="motion-reduce:hidden"
                style={{ fill: toneColor(group.tone) }}
              >
                <animateMotion
                  dur={on ? "1.8s" : "4.2s"}
                  begin={`-${index * 0.6}s`}
                  repeatCount="indefinite"
                  path={wire.path}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      <div className={`${stacked} max-lg:order-2`}>{column("build")}</div>

      <div className="flex flex-col items-center py-4 max-lg:order-1 lg:py-0">
        <div className="relative size-[15.625rem] sm:size-[16.875rem]">
          <div
            aria-hidden
            className="absolute -inset-3.5 animate-orbit rounded-full border border-dashed border-line-strong"
          >
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent" />
            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-violet" />
          </div>
          <div
            data-hub
            className="relative size-full overflow-hidden rounded-full border border-line-strong transition-shadow duration-500"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--accent) 9%, var(--raised)) 50%, color-mix(in oklab, var(--violet) 9%, var(--raised)) 50%)",
              boxShadow: `0 0 0 1px ${tint(current.group.tone, 25)}, 0 20px 60px -25px ${toneColor(current.group.tone)}`,
            }}
          >
            <span className="absolute top-6 left-[20%] text-[0.59375rem] tracking-widest text-accent/80 uppercase">
              build
            </span>
            <span className="absolute top-6 right-[22%] text-[0.59375rem] tracking-widest text-violet/80 uppercase">
              run
            </span>
            {/* The other groups drift around the one in focus. */}
            {groups
              .filter((group) => group !== current.group)
              .slice(0, 4)
              .map((group, index) => (
                <Icon
                  key={group.category}
                  name={group.icon}
                  className={`absolute size-8 animate-float opacity-70 ${
                    ["top-[24%] left-[14%]", "top-[26%] right-[13%]", "bottom-[20%] left-[17%]", "right-[16%] bottom-[22%]"][index]
                  }`}
                />
              ))}
            <div key={current.group.category} className="anim-in absolute inset-0 grid place-items-center">
              <Icon name={current.group.icon} className="size-28 animate-float" />
            </div>
          </div>
        </div>

        <div
          aria-live="polite"
          className="card relative mt-8 flex min-h-[12.5rem] w-full max-w-[18.75rem] flex-col justify-center rounded-lg p-4 text-center"
        >
          <span
            aria-hidden
            className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-t border-l border-(--card-border) bg-raised"
          />
          <div key={current.name} className="anim-in">
            <p className="text-3xs tracking-wider uppercase" style={{ color: toneColor(current.group.tone) }}>
              {current.group.category} · {current.daily ? "daily driver" : "shipped in production"}
            </p>
            <h3 className="mt-1 text-[1.75rem] leading-tight text-ink">{current.name}</h3>
            <p className="mt-1.5 text-md leading-relaxed text-body">{current.note}</p>
          </div>
          <p className="mt-3 text-[0.59375rem] text-faint">
            {auto ? "auto-playing · pick a tool to stop" : "pick any tool to read it"}
          </p>
        </div>
      </div>

      <div className={`${stacked} max-lg:order-3`}>{column("run")}</div>

      {auto && (
        <span
          key={active}
          className="clock"
          style={{ animationDuration: `${HOLD_MS}ms` }}
          onAnimationEnd={() => setActive((index) => (index + 1) % tools.length)}
        />
      )}
    </div>
  );
}
