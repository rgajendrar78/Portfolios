import { portfolio } from "@/config/portfolio";
import { CountUp, Phrase, Spotlight } from "./hero-effects";
import { Icon } from "@/components/ui/icon";
import { Trace } from "./trace";
import { CTA } from "@/components/ui/button";
import { TONE_TEXT } from "@/components/ui/tones";

const { person, hero, experience, stack } = portfolio;

const dailyTools = stack.groups.flatMap((group) =>
  group.tools.filter((tool) => tool.daily).map((tool) => ({ name: tool.name, icon: group.icon })),
);

/** A measuring mark in the page margin, like the rulers of a design file. */
function Ruler({ side }: { side: "left-0" | "right-0" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-40 hidden w-[calc((100%-70rem)/2)] items-center xl:flex ${side}`}
    >
      <span className="h-px flex-1 bg-violet/40" />
      <span className="absolute top-2 left-1/2 -translate-x-1/2 rounded border border-violet/40 bg-bg px-1 text-[0.5625rem] text-violet">
        160
      </span>
    </div>
  );
}

export function Hero({ years }: { years: string }) {
  const firstName = person.name.split(" ")[0];
  const timeline = [...experience.roles].reverse();

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_70%_at_50%_30%,black_20%,transparent_75%)]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--line-strong) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <Spotlight />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[70rem] -translate-x-1/2 border-x border-dashed border-line xl:block"
      />
      <Ruler side="left-0" />
      <Ruler side="right-0" />

      <div className="shell relative">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="min-w-0 lg:col-span-8">
            <p className="anim-in flex flex-col gap-1.5 text-xs text-muted sm:flex-row sm:items-center sm:gap-3">
              <span className="inline-flex items-center gap-2 text-ok">
                <span className="relative flex size-1.5" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
                  <span className="relative size-1.5 rounded-full bg-ok" />
                </span>
                {person.status}
              </span>
              <span className="text-faint max-sm:hidden" aria-hidden>
                ·
              </span>
              <span>
                {person.relocation} · {person.workMode.replaceAll(", ", " / ")}
              </span>
            </p>

            <h1
              className="anim-in mt-6 text-5xl leading-[0.98] tracking-[-0.02em] wrap-anywhere text-ink sm:text-7xl lg:text-[5.25rem]"
              style={{ "--d": "100ms" }}
            >
              Hi, I&rsquo;m {firstName}
              <span className="text-accent">.</span>
            </h1>

            <p
              className="anim-in mt-8 max-w-2xl text-xl leading-[2.2rem] text-body sm:text-[1.625rem] sm:leading-[2.6rem]"
              style={{ "--d": "220ms" }}
            >
              {hero.intro.split("*").map((part, index) => {
                if (index % 2 === 0) return part;
                const order = (index - 1) / 2;
                const tone = hero.footnotes[order]?.tone ?? "accent";
                return (
                  <span key={part}>
                    <Phrase options={part.split("|")} tone={tone} order={order} />
                    <sup className={`ml-0.5 text-2xs font-medium tabular-nums ${TONE_TEXT[tone]}`}>{order + 1}</sup>
                  </span>
                );
              })}
            </p>

            <ol className="anim-in mt-6 flex flex-wrap gap-2" style={{ "--d": "340ms" }}>
              {hero.footnotes.map((note, index) => (
                <li
                  key={note.text}
                  className="group card card-hover inline-flex items-center gap-2 rounded-full bg-raised/70 py-1 pr-3 pl-1 text-2xs text-muted backdrop-blur-sm hover:text-ink"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-bg">
                    <Icon
                      name={note.icon}
                      className="size-5 transition-transform duration-300 group-hover:-translate-y-px"
                    />
                  </span>
                  <span className={`tabular-nums ${TONE_TEXT[note.tone]}`}>{index + 1}</span>
                  {note.text}
                </li>
              ))}
            </ol>

            <div
              className="anim-in mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm"
              style={{ "--d": "440ms" }}
            >
              <a href="#work" className={CTA}>
                See the work
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a href={person.resumeUrl} target="_blank" rel="noreferrer" className="link">
                Resume (PDF) ↗
              </a>
              <a href={`mailto:${person.email}`} className="link">
                Email me
              </a>
            </div>
          </div>

          <aside className="anim-in lg:col-span-4 lg:self-end" style={{ "--d": "500ms" }}>
            <div className="group card card-hover rounded-xl bg-raised/90 p-5 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-3 border-b border-line pb-4">
                <span className="grid size-12 shrink-0 place-items-center self-center rounded-xl border border-line-strong bg-bg">
                  <Icon
                    name="user"
                    className="size-9 transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label-sm text-muted">At {person.company}</p>
                  <p className="mt-1 text-[0.9375rem] text-ink">{person.role}</p>
                </div>
                <p className="shrink-0 text-[2.625rem] leading-none whitespace-nowrap text-accent tabular-nums">
                  <CountUp value={years} delay={500} />
                  <span className="ml-1 text-2xs text-muted">yrs</span>
                </p>
              </div>

              <ol className="relative mt-4 space-y-2 pl-5 before:absolute before:top-1.5 before:bottom-1.5 before:left-[3px] before:w-px before:bg-line-strong">
                {timeline.map((role, index) => {
                  const current = index === timeline.length - 1;
                  return (
                    <li
                      key={`${role.title}-${role.period}`}
                      className="anim-in relative flex items-center justify-between gap-3"
                      style={{ "--d": `${600 + index * 110}ms` }}
                    >
                      <span
                        aria-hidden
                        className={`absolute top-1/2 -left-5 size-[7px] -translate-y-1/2 rounded-full border ${
                          current ? "border-ok bg-ok ring-4 ring-ok/20" : "border-line-strong bg-bg"
                        }`}
                      />
                      <span className="inline-flex min-w-0 items-center gap-2 text-[0.84375rem] text-body">
                        <Icon name={role.icon} className="size-5" />
                        <span className="truncate">{role.title}</span>
                      </span>
                      <span
                        className={`shrink-0 text-[0.65625rem] tabular-nums ${current ? "text-ok" : "text-faint"}`}
                      >
                        {role.period}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3 text-[0.78125rem] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="pin" className="size-4" />
                  {person.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="send" className="size-4" />
                  {person.workMode.replaceAll(", ", " · ")}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* The list is rendered twice so the scroll can loop without a gap. */}
        <div
          className="anim-in -my-3 mt-9 overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
          style={{ "--d": "700ms" }}
        >
          <ul className="flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused]">
            {[...dailyTools, ...dailyTools].map((tool, index) => (
              <li
                key={index}
                aria-hidden={index >= dailyTools.length}
                className="group card card-hover mr-2.5 flex shrink-0 items-center gap-2.5 rounded-xl bg-raised/80 py-1.5 pr-4 pl-1.5 hover:border-accent/50"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-bg">
                  <Icon
                    name={tool.icon}
                    className="size-7 transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                </span>
                <span className="text-md whitespace-nowrap text-body group-hover:text-ink">{tool.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="anim-in mt-6" style={{ "--d": "820ms" }}>
          <Trace />
        </div>
      </div>
    </section>
  );
}
