import { CTA } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { portfolio } from "@/config/portfolio";
import { initials } from "@/lib/derive";

const PAPER_LINES = ["Experience", "Projects", "Skills"];

export function ResumeBand() {
  const { person, resume } = portfolio;

  return (
    <section id="resume" className="relative overflow-hidden border-t border-line bg-raised py-14 sm:py-16">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[18%] size-72 -translate-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="reveal shell relative grid items-center gap-y-10 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          {/* A sheet of paper standing in for the PDF; it straightens and lifts under the pointer. */}
          <a
            href={person.resumeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="View resume"
            className="group relative mx-auto block h-[13.125rem] w-[11.875rem] sm:h-[14.375rem] sm:w-[12.8125rem]"
          >
            <span className="absolute inset-0 translate-x-3 translate-y-2 rotate-6 rounded-lg border border-line-strong bg-[#2a2724] transition-transform duration-500 group-hover:translate-x-5 group-hover:rotate-[9deg]" />
            <span className="absolute inset-0 -rotate-3 overflow-hidden rounded-lg bg-[#efeae0] p-4 text-left shadow-[0_24px_50px_-20px_var(--shadow)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:-translate-y-2 group-hover:rotate-0">
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-md bg-accent text-xs text-bg">
                  {initials(person.name)}
                </span>
                <span>
                  <span className="block text-md leading-none text-[#1b1a18]">{person.name}</span>
                  <span className="mt-1 block text-[0.4375rem] tracking-wider text-[#8d8c85] uppercase">
                    {person.role}
                  </span>
                </span>
              </span>
              {PAPER_LINES.map((line, index) => (
                <span key={line} className="mt-3 block">
                  <span className="block text-[0.4375rem] tracking-wider text-[#b86a2c] uppercase">{line}</span>
                  <span className="mt-1 block h-px bg-[#d6cfc2]" />
                  {index < 2 ? (
                    <>
                      <span className="mt-1 block h-1 rounded-full bg-[#cfc8bb]" />
                      <span className="mt-1 block h-1 w-4/5 rounded-full bg-[#cfc8bb]" />
                      <span className="mt-1 block h-1 w-3/5 rounded-full bg-[#cfc8bb]" />
                    </>
                  ) : (
                    <span className="mt-1.5 flex gap-1.5">
                      {["#f0a35e", "#7fb77e", "#5b9bd5", "#9282cc", "#f0a35e"].map((color, pill) => (
                        <span key={pill} className="h-1.5 w-6 rounded-full" style={{ background: color }} />
                      ))}
                    </span>
                  )}
                </span>
              ))}
              <span className="absolute right-3 bottom-3 rounded-md bg-[#d55f3c] px-1.5 py-0.5 text-[0.5rem] font-bold text-white">
                PDF
              </span>
            </span>
            <span className="absolute -top-2 -left-3 rounded-full border border-accent/40 bg-bg px-2 py-0.5 text-3xs text-accent shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
              1 page
            </span>
          </a>
        </div>

        <div className="md:col-span-5">
          <p className="label">Resume</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{resume.title}</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {resume.facts.map((fact) => (
              <li key={fact.text} className="group flex items-center gap-2.5 rounded-lg border border-line bg-bg/50 p-2 pr-3">
                <Icon
                  name={fact.icon}
                  className="size-8 transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <span className="text-md leading-snug text-body">{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:col-span-3 md:flex-col md:items-start">
          <a href={person.resumeUrl} target="_blank" rel="noreferrer" className={CTA}>
            View resume ↗
          </a>
          <a href={person.resumeUrl} download className="link">
            Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}
