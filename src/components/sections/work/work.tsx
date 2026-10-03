"use client";

import { useRef, useState } from "react";
import { portfolio } from "@/config/portfolio";
import { toneOf } from "@/lib/derive";
import type { Project } from "@/types/portfolio";
import { Icon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { TONE_TEXT } from "@/components/ui/tones";
import { pad } from "@/lib/format";

const ALL = "All";
const { projects, alsoBuilt, filters } = portfolio.work;

const tagCounts = projects
  .flatMap((project) => project.tags)
  .reduce<Record<string, number>>((counts, tag) => ({ ...counts, [tag]: (counts[tag] ?? 0) + 1 }), {});

const node = "rounded-md border border-line bg-raised px-2.5 py-1.5 text-3xs text-body shadow-sm";

/** A small request-flow sketch drawn from the project's own stack. */
function ProjectVisual({ project }: { project: Project }) {
  const [main, ...rest] = project.stack;

  return (
    <div
      aria-hidden
      className="dots relative flex h-44 items-center gap-2 overflow-hidden rounded-md border border-line p-4 sm:gap-3"
    >
      {/* The "Client" node is dropped on very narrow phones to leave room. */}
      <span className={`${node} max-[24rem]:hidden`}>Client</span>
      <span className="h-px min-w-3 flex-1 bg-line-strong max-[24rem]:hidden" />
      <span className={`${node} border-current whitespace-nowrap ${TONE_TEXT[project.tone]}`}>{main}</span>
      <span className="h-px min-w-3 flex-1 bg-line-strong" />
      <ul className="min-w-0 space-y-1.5">
        {rest.slice(0, 4).map((tool) => (
          <li key={tool} className={`${node} flex items-center gap-2`}>
            <span className={`size-1.5 shrink-0 rounded-full bg-current ${TONE_TEXT[toneOf(tool)]}`} />
            <span className="truncate">{tool}</span>
          </li>
        ))}
      </ul>
      <span className="absolute bottom-2 left-3 text-3xs text-faint">
        {project.stack.length} tools · {project.category}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  wide,
  onOpen,
}: {
  project: Project;
  index: number;
  wide: boolean;
  onOpen: (project: Project) => void;
}) {
  return (
    <article
      className={`reveal group card card-hover relative flex min-w-0 flex-col rounded-lg p-5 sm:p-7 ${wide ? "md:col-span-2" : ""}`}
      style={{ "--d": `${(index % 2) * 90}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-3 text-xs text-muted">
          <span className="text-faint tabular-nums">{pad(index + 1)}</span>
          <Pill tone={project.tone}>{project.category}</Pill>
          <span>{project.period}</span>
        </p>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name}`}
            className="relative z-10 text-xl leading-none text-faint transition-all duration-300 hover:text-accent"
          >
            ↗
          </a>
        ) : (
          <span
            aria-hidden
            className="text-xl leading-none text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          >
            ↗
          </span>
        )}
      </div>

      <div className={wide ? "mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-10" : "contents"}>
        <div className={wide ? "min-w-0" : "order-2 mt-6 min-w-0"}>
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-bg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[4deg]">
              <Icon name={project.icon} className="size-9" />
            </span>
            <h3 className="min-w-0 text-[min(2.25rem,8vw)] leading-none wrap-anywhere text-ink">
              {/* The whole card is the button: its hit area is stretched over the article. */}
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent"
              >
                {project.name}
              </button>
            </h3>
          </div>
          <p className="mt-3 text-[0.9375rem] text-muted">{project.subtitle}</p>
          <p className="mt-4 line-clamp-3 text-[0.9375rem] leading-relaxed text-body">{project.description}</p>

          <dl className={`mt-5 grid gap-2 ${wide ? "sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))]" : ""}`}>
            {project.facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3 rounded-md border border-line bg-bg px-3 py-2.5">
                <Icon
                  name={fact.icon}
                  className="size-8 transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <div
                  className={`min-w-0 flex-1 ${wide ? "" : "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"}`}
                >
                  <dt className="label-sm tracking-wider">{fact.label}</dt>
                  <dd className={`text-[0.84375rem] leading-snug text-ink ${wide ? "mt-1" : "text-right"}`}>
                    {fact.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className={wide ? "max-lg:order-first" : "order-1 mt-5"}>
          <ProjectVisual project={project} />
        </div>
      </div>

      <div className="order-3 mt-6 flex items-start gap-3 rounded-lg border border-accent/20 bg-tint/60 p-3.5">
        <Icon
          name="gauge"
          className="size-9 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[4deg]"
        />
        <p className="text-sm leading-relaxed text-body">
          <span className="text-ink">Hard part:</span> {project.hardPart}
        </p>
      </div>

      <div className="order-4 mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((tool) => (
            <li key={tool}>
              <Pill tone={toneOf(tool)}>{tool}</Pill>
            </li>
          ))}
        </ul>
        <span className="text-xs text-muted transition-colors duration-300 group-hover:text-ink">
          read case study{" "}
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </article>
  );
}

function CaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h3 className="label">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** The long read for one project, shown in the panel that slides in from the right. */
function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const study = project.caseStudy;
  const body = "text-[0.9375rem] leading-relaxed text-body";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
        <p className="text-xs text-muted">
          {project.category} · {project.period}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs tracking-wider text-ink uppercase transition-colors duration-200 hover:text-accent"
        >
          Close <span className="text-faint">esc</span>
        </button>
      </div>

      <div data-lenis-prevent className="flex-1 space-y-10 overflow-y-auto overscroll-contain px-5 py-8 sm:px-8 sm:py-10">
        <header>
          <h2 className="text-5xl leading-none wrap-anywhere text-ink">{project.name}</h2>
          <p className="mt-3 text-muted">{project.subtitle}</p>
          <div className="mt-6">
            <ProjectVisual project={project} />
          </div>
          <p className="mt-6 leading-relaxed text-body">{project.description}</p>
          <p className="mt-5 text-xs leading-relaxed text-muted">{project.stack.join("  ·  ")}</p>
          <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label">{fact.label}</dt>
                <dd className="mt-1 text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <CaseSection title="The problem">
          <p className={body}>{study.problem}</p>
        </CaseSection>

        <CaseSection title="Architecture">
          <p className={body}>{study.architecture}</p>
          <ol className="relative mt-6 space-y-3.5 before:absolute before:top-3 before:bottom-3 before:left-[0.5625rem] before:w-px before:bg-line-strong">
            {study.flow.map((step, index) => (
              <li key={step} className="relative flex items-baseline gap-6 text-md text-ink">
                <span className="w-5 shrink-0 bg-bg py-0.5 text-xs text-muted tabular-nums">{pad(index + 1)}</span>
                {step}
              </li>
            ))}
          </ol>
        </CaseSection>

        <CaseSection title="Components">
          <dl className="-mt-4 divide-y divide-line">
            {study.components.map((part) => (
              <div key={part.name} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[11rem_1fr]">
                <dt className="text-[0.9375rem] text-ink">{part.name}</dt>
                <dd>
                  <p className="text-[0.9375rem] text-body">{part.role}</p>
                  <p className="mt-1 text-2xs text-muted">{part.tech}</p>
                </dd>
              </div>
            ))}
          </dl>
        </CaseSection>

        <CaseSection title="The hard part">
          <p className={body}>{project.hardPart}</p>
        </CaseSection>

        <CaseSection title="Outcome">
          <p className={body}>{study.outcome}</p>
        </CaseSection>

        <figure className="border-l border-accent pl-5">
          <blockquote className="text-2xl leading-snug text-ink italic">{study.takeaway}</blockquote>
        </figure>
      </div>
    </div>
  );
}

export function Work() {
  const [tag, setTag] = useState(ALL);
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<Project | null>(null);
  const panel = useRef<HTMLDialogElement>(null);

  const needle = query.trim().toLowerCase();
  const visible = projects.filter(
    (project) =>
      (tag === ALL || project.tags.includes(tag)) &&
      (!needle ||
        [project.name, project.subtitle, ...project.stack].some((text) =>
          text.toLowerCase().includes(needle),
        )),
  );

  const chips = [[ALL, projects.length] as const, ...Object.entries(tagCounts)];
  const open = (project: Project) => {
    setOpened(project);
    panel.current?.showModal();
  };

  return (
    <>
      <div className="reveal flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        {/* One scrolling row on phones, wrapping from tablets up. */}
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex gap-2 text-sm whitespace-nowrap sm:flex-wrap">
            {chips.map(([name, count]) => (
              <button
                key={name}
                type="button"
                aria-pressed={tag === name}
                onClick={() => setTag(name)}
                className={`group inline-flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1 transition-all duration-300 ${
                  tag === name
                    ? "border-accent/60 bg-tint text-ink shadow-[0_6px_20px_-12px_var(--accent)]"
                    : "border-line bg-raised/60 text-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                <span className="grid size-6 place-items-center rounded-full bg-bg">
                  <Icon
                    name={filters[name]?.icon ?? "layers"}
                    className="size-5 transition-transform duration-300 group-hover:-translate-y-px"
                  />
                </span>
                {name}
                <span className={`text-3xs tabular-nums ${tag === name ? "text-accent" : "text-faint"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
        <label className="flex shrink-0 items-center gap-3 border-b border-line-strong pb-1.5 transition-colors duration-300 focus-within:border-accent lg:w-72">
          <span className="text-xs text-faint">find</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="gRPC, Next.js, Redis…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-faint">
        {visible.length} of {projects.length} projects
      </p>

      {visible.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              // A lone last card also spans the row, so the grid never ends on a gap.
              wide={index === 0 || (index === visible.length - 1 && index % 2 === 1)}
              onOpen={open}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">No project matches. Clear the search or pick another filter.</p>
      )}

      {alsoBuilt.length > 0 && (
        <div className="reveal mt-16 grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
          <h3 className="label lg:col-span-3 lg:pt-5">Also built</h3>
          <ul className="border-t border-line lg:col-span-9">
            {alsoBuilt.map((item) => (
              <li
                key={item.name}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-line py-5 transition-colors duration-300 hover:border-line-strong sm:grid-cols-[10rem_1fr_auto]"
              >
                <span className="text-2xl text-ink transition-colors duration-300 group-hover:text-accent">
                  {item.name}
                </span>
                <span className="text-sm text-muted max-sm:order-3 max-sm:col-span-2">{item.subtitle}</span>
                <span className="text-xs text-faint tabular-nums">{item.period}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dialog
        ref={panel}
        aria-label={opened ? `${opened.name} case study` : undefined}
        className="drawer"
        // A click on the dimmed page lands on the dialog itself, not on its content.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {opened && <CaseStudy project={opened} onClose={() => panel.current?.close()} />}
      </dialog>
    </>
  );
}
