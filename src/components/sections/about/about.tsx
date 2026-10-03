import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { portfolio } from "@/config/portfolio";
import { toneOf } from "@/lib/derive";
import { pad } from "@/lib/format";
import { stagger } from "@/lib/motion";
import type { Sketch } from "@/types/portfolio";
import { RequestExplorer } from "./request-explorer";

const bar = "block h-1 rounded-full bg-line-strong";

// Tiny wireframes for the About cards: a screen, a module tree, a table, a cluster and a chat.
const SKETCHES: Record<Sketch, ReactNode> = {
  ui: (
    <div className="flex h-full gap-1.5">
      <div className="flex w-1/4 flex-col gap-1 rounded bg-raised p-1.5">
        <span className="size-3 rounded-full bg-line-strong" />
        <span className={`${bar} mt-1 w-full`} />
        <span className={`${bar} w-3/4`} />
        <span className={`${bar} w-full`} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex h-4 items-center justify-between rounded bg-raised px-1.5">
          <span className={`${bar} w-1/3`} />
          <span className="size-2 rounded-full border border-ok/60 bg-ok/30" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <span className="grid place-items-center rounded border border-dashed border-line-strong">
            <span className="size-4 rounded-sm bg-sky/40" />
          </span>
          <span className="rounded border border-dashed border-line-strong" />
        </div>
      </div>
    </div>
  ),
  tree: (
    <svg viewBox="0 0 120 60" className="size-full" fill="none">
      <path d="M60 12 36 32M60 12l24 20M36 32 26 50M36 32l10 18M84 32l10 18" className="stroke-line-strong" />
      <circle cx="60" cy="12" r="4.5" className="fill-raised stroke-accent" strokeWidth="1.5" />
      <circle cx="36" cy="32" r="3.5" className="fill-raised stroke-ink" />
      <circle cx="84" cy="32" r="3.5" className="fill-raised stroke-ink" />
      <circle cx="26" cy="50" r="3" className="fill-raised stroke-ink" />
      <circle cx="46" cy="50" r="3" className="fill-raised stroke-ink" />
      <circle cx="94" cy="50" r="3" className="fill-raised stroke-ink" />
    </svg>
  ),
  table: (
    <div className="flex h-full flex-col justify-center gap-1.5 text-[0.4375rem] text-muted">
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2 border-b border-line-strong pb-1">
        <span>id</span>
        <span>status</span>
        <span>lock</span>
      </div>
      {[
        ["01", "COMPLETED", ""],
        ["02", "PENDING", "row"],
        ["03", "COMPLETED", ""],
      ].map(([id, status, lock]) => (
        <div key={id} className="grid grid-cols-[1fr_3fr_1fr] gap-2">
          <span className="text-accent">{id}</span>
          <span className={lock ? "text-accent" : "text-ink"}>{status}</span>
          <span className="text-accent">{lock}</span>
        </div>
      ))}
    </div>
  ),
  grid: (
    <div className="grid h-full grid-cols-4 content-center gap-1.5">
      {[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((lit, index) => (
        <span
          key={index}
          className={`h-3 rounded-sm border ${lit ? "border-violet bg-violet/40" : "border-line-strong bg-violet/10"} ${index === 1 || index === 3 ? "invisible" : ""}`}
        />
      ))}
    </div>
  ),
  chat: (
    <div className="flex h-full flex-col justify-between">
      <span className="ml-auto h-3 w-1/2 rounded-full rounded-tr-sm bg-sky/30" />
      <span className="mx-auto rounded border border-dashed border-accent/60 px-1.5 text-[0.4375rem] text-accent">
        {'{ tool: "book" }'}
      </span>
      <span className="h-3 w-3/5 rounded-full rounded-bl-sm border border-ok/50 bg-ok/20" />
    </div>
  ),
};

export function About() {
  const { layers, request } = portfolio.about;

  return (
    <>
      {/* The cards share each row equally, however many layers there are. */}
      <ol className="flex flex-wrap gap-3">
        {layers.map((layer, index) => (
          <li
            key={layer.name}
            className="reveal group card card-hover flex min-w-0 flex-1 basis-[11.5rem] flex-col rounded-lg p-4"
            style={stagger(index, 5)}
          >
            <div aria-hidden className="h-24 overflow-hidden rounded-md border border-line bg-bg p-2.5">
              {SKETCHES[layer.sketch]}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Icon
                name={layer.icon}
                className="size-9 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="text-2xs text-faint tabular-nums">{pad(index + 1)}</span>
            </div>
            <p className="mt-2 text-ink">{layer.name}</p>
            <p className="mt-1.5 text-md leading-relaxed text-muted">{layer.text}</p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {layer.tools.map((tool) => (
                <li key={tool}>
                  <Pill tone={toneOf(tool) === "neutral" ? layer.tone : toneOf(tool)}>{tool}</Pill>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="reveal mt-16 grid gap-y-8 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-3">
          <h3 className="label">{request.label}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{request.text}</p>
        </div>
        <div className="md:col-span-9">
          <RequestExplorer />
        </div>
      </div>
    </>
  );
}
