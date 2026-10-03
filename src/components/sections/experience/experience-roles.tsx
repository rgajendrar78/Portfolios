"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import { toneOf } from "@/lib/derive";
import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";

const { roles, layers } = portfolio.experience;
// Oldest first, so the chart reads left to right like a timeline.
const timeline = [...roles].reverse();
const columns = { "--roles": `repeat(${timeline.length}, minmax(4.5rem, 1fr))` };

// One colour per entry of `experience.layers`; longer lists start over.
const LAYER_COLORS = [
  "var(--sky)",
  "color-mix(in oklab, var(--sky) 55%, var(--violet))",
  "var(--accent)",
  "var(--ok)",
  "var(--muted)",
  "var(--violet)",
];
const layerColor = (index: number) => LAYER_COLORS[index % LAYER_COLORS.length];

/** The roles as a chart of what each one owned; picking a column shows that role. */
export function ExperienceRoles() {
  const [active, setActive] = useState(timeline.length - 1);
  const role = timeline[active];
  const latest = timeline.length - 1;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-12">
      <div className="reveal group card min-w-0 rounded-xl p-4 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="label">What each role owned</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {layers.map((layer, index) => (
              <li key={layer} className="flex items-center gap-1.5 text-3xs text-muted">
                <span aria-hidden className="size-2 rounded-sm" style={{ background: layerColor(index) }} />
                {layer}
              </li>
            ))}
          </ul>
        </div>

        {/* Many roles scroll sideways instead of squeezing. */}
        <div className="-mx-1 overflow-x-auto px-1 pt-2">
          <div
            role="tablist"
            aria-label="Roles"
            className="relative mt-4 grid grid-cols-(--roles) items-end gap-2 sm:gap-4"
            style={{
              ...columns,
              backgroundImage: "linear-gradient(to top, var(--line) 1px, transparent 1px)",
              backgroundSize: "100% 34px",
              backgroundPosition: "center bottom",
            }}
          >
            {timeline.map((item, index) => {
              const on = index === active;
              return (
                <button
                  key={`${item.title}-${item.period}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={item.title}
                  onClick={() => setActive(index)}
                  className="group/col flex flex-col items-center"
                >
                  {index === latest && (
                    <span className="mb-1 rounded-full border border-ok/40 bg-ok/10 px-1.5 text-[0.5625rem] text-ok">
                      now
                    </span>
                  )}
                  <span
                    className={`grid size-11 place-items-center rounded-xl border bg-bg transition-all duration-300 sm:size-12 ${
                      on
                        ? "scale-110 border-accent shadow-[0_8px_24px_-10px_var(--accent)]"
                        : "border-line group-hover/col:border-line-strong"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className="size-8 transition-transform duration-300 group-hover/col:-translate-y-0.5"
                    />
                  </span>
                  <span
                    className={`mt-2 flex w-full flex-col-reverse gap-0.5 transition-opacity duration-500 ${on ? "" : "opacity-55 group-hover/col:opacity-80"}`}
                  >
                    {layers.map((layer, layerIndex) =>
                      item.owns.includes(layer) ? (
                        <span
                          key={layer}
                          // Bars rise one after another when the chart scrolls into view.
                          className="grid h-8 translate-y-3 place-items-center rounded-[5px] text-3xs text-bg opacity-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-data-[in]:translate-y-0 group-data-[in]:opacity-100 sm:text-2xs"
                          style={{
                            background: layerColor(layerIndex),
                            transitionDelay: `${(index * 2 + item.owns.indexOf(layer)) * 80}ms`,
                          }}
                        >
                          {layer}
                        </span>
                      ) : null,
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className="mt-2 grid grid-cols-(--roles) gap-2 border-t border-line-strong pt-2 sm:gap-4"
            style={columns}
          >
            {timeline.map((item, index) => (
              <button
                key={`${item.title}-${item.period}`}
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={() => setActive(index)}
                className={`text-center leading-tight transition-colors duration-300 ${
                  index === active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span className="block text-xs sm:text-md">{item.short ?? item.title}</span>
                <span
                  className={`mt-0.5 block text-3xs tabular-nums ${index === active ? "text-accent" : "text-faint"}`}
                >
                  {item.period}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div role="tabpanel" className="reveal card relative min-w-0 overflow-hidden rounded-xl p-6 lg:col-span-5" style={{ "--d": "120ms" }}>
        <div key={role.title} className="anim-in">
          <div className="flex items-center gap-4">
            <Icon name={role.icon} className="size-14" />
            <div className="min-w-0">
              <p className="text-xs text-accent">
                {role.period}
                {active === latest && <span className="ml-2 text-ok">current</span>}
              </p>
              <h3 className="mt-1 text-3xl leading-tight text-ink">{role.title}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{role.focus}</p>
          <p className="mt-4 text-[0.90625rem] leading-relaxed text-body">{role.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {role.stack.map((tool) => (
              <li key={tool}>
                <Pill tone={toneOf(tool)}>{tool}</Pill>
              </li>
            ))}
          </ul>
          <details className="group/more mt-5 border-t border-line pt-4">
            <summary className="cursor-pointer text-xs text-muted transition-colors duration-200 hover:text-ink">
              <span className="group-open/more:hidden">+ responsibilities ({role.responsibilities.length})</span>
              <span className="hidden group-open/more:inline">− responsibilities</span>
            </summary>
            <ul className="space-y-2 pt-3 text-sm leading-relaxed text-body">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-faint">
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          {timeline.map((item, index) => (
            <button
              key={`${item.title}-${item.period}`}
              type="button"
              aria-label={item.title}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active ? "w-6 bg-accent" : "w-1.5 bg-line-strong hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
